import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createChatbotLead } from "@/lib/chatbot-leads"

function clean(value: unknown) {
  return String(value ?? "").trim()
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const name = clean(body?.name)
  const phone = clean(body?.phone)
  const apartmentType = clean(body?.apartmentType)
  const message = clean(body?.message)

  if (!name || !phone) {
    return NextResponse.json({ error: "name_phone_required" }, { status: 400 })
  }

  const lead = await createChatbotLead({
    name,
    phone,
    apartmentType: apartmentType || "Сонгоогүй",
    message,
  })

  revalidatePath("/admin")

  return NextResponse.json({ lead })
}
