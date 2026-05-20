import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { createChatbotLead } from "@/lib/chatbot-leads"

type ChatInputMessage = {
  role: "user" | "assistant"
  content: string
}

const fallbackReply =
  "Энэ мэдээллийг борлуулалтын ажилтнаас тодруулж өгье. Та нэр, утасны дугаараа үлдээвэл бид тантай холбогдоно."

const systemInstructions = `
Чи Тоонот Эко хотхоны борлуулалтын AI зөвлөх.
Монгол хэлээр эелдэг, товч, ойлгомжтой хариул.

Хотхоны мэдээлэл:
- Нэр: Тоонот Эко хотхон
- Байрны төрөл: 1 өрөө, 2 өрөө, 3 өрөө
- Давуу тал: ногоон орчин, хүүхдийн тоглоомын талбай, спорт заал, зогсоол
- Үнэ болон үлдэгдлийг зохиож хэлж болохгүй
- Үнэ асуувал нэр, утас аваад борлуулалтын ажилтан холбогдоно гэж хэл
- Утас өгвөл талархаад холбогдоно гэж хэл
`

const rules: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["1 өрөө", "1 uruu", "нэг өрөө"],
    reply:
      "1 өрөө байрны талаар мэдээлэл авах боломжтой. Үнэ, м2, давхар, үлдэгдэл зэрэг мэдээллийг баталгаажуулахын тулд нэр, утсаа үлдээнэ үү.",
  },
  {
    keywords: ["2 өрөө", "2 uruu", "хоёр өрөө"],
    reply:
      "2 өрөө байр сонирхож байвал төсөв, хүсэж буй талбай, холбоо барих дугаараа үлдээгээрэй. Борлуулалтын ажилтан тохирох хувилбар санал болгоно.",
  },
  {
    keywords: ["3 өрөө", "3 uruu", "гурван өрөө"],
    reply:
      "3 өрөө байрны сонголтын талаар борлуулалтын ажилтнаас тодруулж өгье. Та нэр, утасны дугаараа үлдээнэ үү.",
  },
  {
    keywords: ["үнэ", "une", "төлбөр", "tolbor", "хэд", "сая"],
    reply:
      "манай тоонот эко хотхоны мк үнэ 4сая200мянга гэж байгаа.",
  },
  {
    keywords: ["зээл", "zeel", "ипотек", "bank"],
    reply:
      "Зээлийн нөхцөлийг банк болон тухайн үеийн борлуулалтын нөхцөлөөс хамаарч тодруулна. Нэр, утсаа үлдээвэл зөвлөх дэлгэрэнгүй мэдээлэл өгнө.",
  },
  {
    keywords: ["зогсоол", "zogsool", "гарааш", "garage", "parking"],
    reply:
      "Зогсоол, гараашийн үнэ болон үлдэгдлийг борлуулалтын ажилтнаас тодруулж өгье. Та холбоо барих дугаараа үлдээнэ үү.",
  },
  {
    keywords: ["байршил","bairshil","haana", "hayg", "хаана", "хаяг"],
    reply:
      "Тоонот Эко хотхоны байршал нь Toonot eco apartment, 106, 106, HUD - 25 khoroo, Ulaanbaatar 17120, Mongolia.",
  },
  {
    keywords: ["спорт","fitness","zaal","sport zaal", "фитнес", "заал"],
    reply: "Хотхонд спорт, фитнес орчин төлөвлөгдсөн. Дэлгэрэнгүй мэдээлэл авах бол утсаа үлдээгээрэй.",
  },
  {
    keywords: ["холбогд", "holbogd", "сонирхож", "авах", "үзэх", "зөвлөх", "утас"],
    reply:
      "Мэдээж. Та нэр, утасны дугаар, сонирхож буй байрны төрлөө үлдээнэ үү. Борлуулалтын ажилтан тантай холбогдоно.",
  },
]

function clean(value: unknown) {
  return String(value ?? "").trim()
}

function normalize(value: string) {
  return value.toLowerCase().replace(/ё/g, "е")
}

function getLastUserMessage(messages: ChatInputMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content ?? ""
}

function getPhoneNumber(text: string) {
  return text.match(/(?:\+?976[-\s]?)?\d{8}/)?.[0]
}

function getRuleReply(message: string) {
  const normalized = normalize(message)
  const matched = rules.find((rule) => rule.keywords.some((keyword) => normalized.includes(normalize(keyword))))

  return matched?.reply ?? fallbackReply
}

function detectApartmentType(text: string) {
  const normalized = normalize(text)

  if (normalized.includes("1 өрөө") || normalized.includes("нэг өрөө")) return "1 өрөө"
  if (normalized.includes("2 өрөө") || normalized.includes("хоёр өрөө")) return "2 өрөө"
  if (normalized.includes("3 өрөө") || normalized.includes("гурван өрөө")) return "3 өрөө"
  if (normalized.includes("зогсоол") || normalized.includes("гарааш")) return "Зогсоол"

  return "Сонгоогүй"
}

function extractResponseText(data: any) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim()
  }

  const output = Array.isArray(data?.output) ? data.output : []
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : []
    for (const contentItem of content) {
      if (typeof contentItem?.text === "string" && contentItem.text.trim()) {
        return contentItem.text.trim()
      }
    }
  }

  return ""
}

async function saveLeadIfPossible(messages: ChatInputMessage[]) {
  const conversation = messages.map((message) => message.content).join("\n")
  const phone = getPhoneNumber(conversation)

  if (!phone) {
    return
  }

  const nameMatch = conversation.match(/(?:нэр\s*(?:бол|:)?\s*)([А-Яа-яA-Za-zӨөҮүЁё-]{2,30})/i)
  const name = nameMatch?.[1] ?? "Чат хэрэглэгч"

  await createChatbotLead({
    name,
    phone,
    apartmentType: detectApartmentType(conversation),
    message: conversation.slice(-900),
  })

  revalidatePath("/admin")
}

async function getAiReply(messages: ChatInputMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return getRuleReply(getLastUserMessage(messages))
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      instructions: systemInstructions,
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      max_output_tokens: 450,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "")
    console.error("OpenAI chatbot request failed", response.status, errorText)
    return getRuleReply(getLastUserMessage(messages))
  }

  const data = await response.json()
  return extractResponseText(data) || getRuleReply(getLastUserMessage(messages))
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const messages = Array.isArray(body?.messages) ? (body.messages as ChatInputMessage[]) : []
  const safeMessages = messages
    .filter((message) => (message.role === "user" || message.role === "assistant") && clean(message.content))
    .map((message) => ({
      role: message.role,
      content: clean(message.content).slice(0, 1200),
    }))
    .slice(-12)
  const lastUserMessage = getLastUserMessage(safeMessages)

  if (!lastUserMessage) {
    return NextResponse.json({
      reply:
        "Сайн байна уу! Би Тоонот Эко хотхоны AI зөвлөх. Та байр, үнэ, зогсоол, зээл, байршлын талаар асуугаарай.",
    })
  }

  await saveLeadIfPossible(safeMessages).catch((error) => console.error("Failed to save chatbot lead", error))

  if (getPhoneNumber(lastUserMessage)) {
    return NextResponse.json({
      reply:
        "Баярлалаа. Таны мэдээллийг борлуулалтын ажилтанд дамжууллаа. Манай ажилтан тантай удахгүй холбогдох болно.",
    })
  }

  try {
    const reply = await getAiReply(safeMessages)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Chatbot route failed", error)
    return NextResponse.json({ reply: getRuleReply(lastUserMessage) })
  }
}
