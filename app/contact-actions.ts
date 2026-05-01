"use server"

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getInquiries, inquiriesPath, type Inquiry } from "@/lib/inquiries"

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim()
}

async function getOptionalCurrentUser() {
  try {
    return await currentUser()
  } catch {
    return null
  }
}

export async function submitInquiry(formData: FormData) {
  const user = await getOptionalCurrentUser()
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? ""
  const submittedEmail = clean(formData.get("email"))

  const inquiry: Inquiry = {
    id: crypto.randomUUID(),
    userId: user?.id,
    name: clean(formData.get("name")),
    phone: clean(formData.get("phone")),
    email: submittedEmail || userEmail,
    apartment: clean(formData.get("apartment")),
    message: clean(formData.get("message")),
    createdAt: new Date().toISOString(),
    status: "new",
  }

  if (!inquiry.name || !inquiry.phone) {
    redirect("/#contact")
  }

  const inquiries = getInquiries()
  inquiries.unshift(inquiry)

  await mkdir(path.dirname(inquiriesPath), { recursive: true })
  await writeFile(inquiriesPath, JSON.stringify(inquiries, null, 2), "utf8")

  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/#contact")
}
