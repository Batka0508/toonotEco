import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createChatbotLead } from "@/lib/chatbot-leads"

type ChatInputMessage = {
  role: "user" | "assistant"
  content: string
}

const fallbackReply = "Энэ мэдээллийг борлуулалтын ажилтнаас тодруулж өгье."

const rules: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["1 өрөө", "1 uruu", "нэг өрөө"],
    reply: "1 өрөө байрны сонголт байгаа. Үнэ, м², давхар болон үлдэгдэл мэдээллийг борлуулалтын ажилтнаас тодруулж өгье.",
  },
  {
    keywords: ["2 өрөө", "2 uruu", "хоёр өрөө"],
    reply: "2 өрөө байрны сонголт байгаа. Таны төсөв, хүсэж буй талбай, холбоо барих дугаарыг үлдээвэл борлуулалтын ажилтан тохирох хувилбар санал болгоно.",
  },
  {
    keywords: ["3 өрөө", "3 uruu", "гурван өрөө"],
    reply: "3 өрөө байрны сонголт байгаа. Том талбай, гэр бүлд тохирох сонголтыг борлуулалтын ажилтнаас тодруулж өгье.",
  },
  {
    keywords: ["үнэ", "une", "төлбөр", "tolbor", "хэд", "сая"],
    reply: "Үнэ болон төлбөрийн нөхцөлийг борлуулалтын ажилтнаас тодруулна. Худлаа үнэ хэлэхгүй тул нэр, утсаа үлдээвэл зөвлөх холбогдоно.",
  },
  {
    keywords: ["зээл", "zeel", "ипотек", "bank"],
    reply: "Зээлийн нөхцөлийг борлуулалтын ажилтнаас тодруулна. Урьдчилгаа, хугацаа, сарын төлөлтийн мэдээллийг зөвлөх нарийвчлан хэлж өгнө.",
  },
  {
    keywords: ["зогсоол", "zogsool", "гарааш", "garage", "parking"],
    reply: "Зогсоол байгаа. Гарааш, зогсоолын үнэ болон үлдэгдлийг борлуулалтын ажилтнаас тодруулж өгье.",
  },
  {
    keywords: ["байршил", "bairshil", "хаана", "hayag", "хаяг"],
    reply: "Байршлын дэлгэрэнгүй мэдээллийг борлуулалтын ажилтнаас тодруулж өгье.",
  },
  {
    keywords: ["фитнес", "fitness", "спорт", "заал"],
    reply: "Тоонот Эко хотхонд фитнес, спорт заал зэрэг амьдрахад хэрэгтэй давуу талууд төлөвлөгдсөн.",
  },
  {
    keywords: ["хүүхэд", "huuh", "тоглоом", "талбай", "цэцэрлэг"],
    reply: "Хотхон хүүхдийн тоглоомын талбайтай, гэр бүлд ээлтэй ногоон орчинтой.",
  },
  {
    keywords: ["давуу", "nogoon", "ногоон", "аюулгүй", "орчин"],
    reply: "Хотхоны давуу тал нь ногоон орчин, хүүхдийн тоглоомын талбай, фитнес, спорт заал, аюулгүй орчин юм.",
  },
  {
    keywords: ["холбог", "holbog", "сонирхож", "авах", "үзэх", "зөвлөх"],
    reply: "Мэдээж. Нэр, утасны дугаар, сонирхож буй байрны төрлөө үлдээнэ үү. Борлуулалтын ажилтан тантай холбогдоно.",
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

function getRuleReply(message: string) {
  const normalized = normalize(message)
  const matched = rules.find((rule) => rule.keywords.some((keyword) => normalized.includes(normalize(keyword))))

  if (matched) {
    return matched.reply
  }

  return fallbackReply
}

function detectApartmentType(text: string) {
  const normalized = normalize(text)

  if (normalized.includes("1 өрөө") || normalized.includes("нэг өрөө")) return "1 өрөө"
  if (normalized.includes("2 өрөө") || normalized.includes("хоёр өрөө")) return "2 өрөө"
  if (normalized.includes("3 өрөө") || normalized.includes("гурван өрөө")) return "3 өрөө"
  if (normalized.includes("зогсоол") || normalized.includes("гарааш")) return "Зогсоол"

  return "Сонгоогүй"
}

async function saveLeadIfPossible(messages: ChatInputMessage[]) {
  const conversation = messages.map((message) => message.content).join("\n")
  const phone = conversation.match(/(?:\+?976[-\s]?)?\d{8}/)?.[0]

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

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const messages = Array.isArray(body?.messages) ? (body.messages as ChatInputMessage[]) : []
  const safeMessages = messages
    .filter((message) => (message.role === "user" || message.role === "assistant") && clean(message.content))
    .slice(-10)
  const lastUserMessage = getLastUserMessage(safeMessages)

  if (!lastUserMessage) {
    return NextResponse.json({
      reply: "Сайн байна уу. Та 1 өрөө, 2 өрөө, 3 өрөө, үнэ, зогсоол, байршил эсвэл зээлийн нөхцөлийн талаар асуугаарай.",
    })
  }

  await saveLeadIfPossible(safeMessages).catch((error) => console.error("Failed to save chatbot lead", error))

  return NextResponse.json({ reply: getRuleReply(lastUserMessage) })
}
