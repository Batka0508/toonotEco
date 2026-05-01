import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

export type Inquiry = {
  id: string
  userId?: string
  name: string
  phone: string
  email: string
  apartment: string
  message: string
  adminReply?: string
  repliedAt?: string
  createdAt: string
  status: "new" | "contacted" | "closed" | "read"
}

export const inquiriesPath = path.join(process.cwd(), "data", "inquiries.json")

export function getInquiries(): Inquiry[] {
  if (!existsSync(inquiriesPath)) {
    return []
  }

  try {
    const data = JSON.parse(readFileSync(inquiriesPath, "utf8")) as Inquiry[]
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return []
  }
}

export function getInquiriesByEmail(email?: string) {
  if (!email) {
    return []
  }

  return getInquiries().filter((inquiry) => inquiry.email.toLowerCase() === email.toLowerCase())
}

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? ""
}

function emailMatches(inquiryEmail: string, userEmail?: string) {
  const inquiryValue = normalize(inquiryEmail)
  const userValue = normalize(userEmail)

  if (!inquiryValue || !userValue) {
    return false
  }

  return inquiryValue === userValue || inquiryValue.startsWith(userValue) || userValue.startsWith(inquiryValue)
}

export function getInquiriesForUser(userId?: string, email?: string) {

  return getInquiries().filter((inquiry) => {
    if (userId && inquiry.userId === userId) {
      return true
    }

    return emailMatches(inquiry.email, email)
  })
}
