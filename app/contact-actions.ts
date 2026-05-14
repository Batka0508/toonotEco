"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createInquiry, type Inquiry } from "@/lib/inquiries"
import { getCurrentUser } from "@/lib/user-auth"

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim()
}

export async function submitInquiry(formData: FormData) {
  const user = await getCurrentUser()
  const userEmail = user?.email ?? ""
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

  await createInquiry(inquiry)

  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/?inquiry=sent#contact")
}
