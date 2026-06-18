import { existsSync, readFileSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { assertWritableBackend } from "@/lib/backend-json"
import { getSupabaseAdminClient, isSupabaseNetworkError } from "@/lib/supabase"

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

type InquiryRow = {
  id: string
  user_id: string | null
  name: string
  phone: string
  email: string
  apartment: string
  message: string
  admin_reply: string | null
  replied_at: string | null
  created_at: string
  status: Inquiry["status"]
}

function readLocalInquiries(): Inquiry[] {
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

function inquiryFromRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    name: row.name,
    phone: row.phone,
    email: row.email,
    apartment: row.apartment,
    message: row.message,
    adminReply: row.admin_reply ?? undefined,
    repliedAt: row.replied_at ?? undefined,
    createdAt: row.created_at,
    status: row.status,
  }
}

function inquiryToRow(inquiry: Inquiry): InquiryRow {
  return {
    id: inquiry.id,
    user_id: inquiry.userId ?? null,
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email,
    apartment: inquiry.apartment,
    message: inquiry.message,
    admin_reply: inquiry.adminReply ?? null,
    replied_at: inquiry.repliedAt ?? null,
    created_at: inquiry.createdAt,
    status: inquiry.status,
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return readLocalInquiries()
  }

  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false })

  if (error) {
    if (!isSupabaseNetworkError(error)) {
      console.error("Failed to load inquiries from Supabase", error)
    }
    return readLocalInquiries()
  }

  return ((data ?? []) as InquiryRow[]).map(inquiryFromRow)
}

export async function saveInquiries(inquiries: Inquiry[]) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    assertWritableBackend()
    await mkdir(path.dirname(inquiriesPath), { recursive: true })
    await writeFile(inquiriesPath, JSON.stringify(inquiries, null, 2), "utf8")
    return
  }

  const { error } = await supabase.from("inquiries").upsert(inquiries.map(inquiryToRow), { onConflict: "id" })

  if (error) {
    throw new Error(`Failed to save inquiries: ${error.message}`)
  }
}

export async function createInquiry(inquiry: Inquiry) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    assertWritableBackend()
    const inquiries = readLocalInquiries()
    inquiries.unshift(inquiry)
    await saveInquiries(inquiries)
    return
  }

  const { error } = await supabase.from("inquiries").insert(inquiryToRow(inquiry))

  if (error) {
    throw new Error(`Failed to create inquiry: ${error.message}`)
  }
}

export async function deleteInquiryById(id: string) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    assertWritableBackend()
    const inquiries = readLocalInquiries().filter((inquiry) => inquiry.id !== id)
    await saveInquiries(inquiries)
    return
  }

  const { error } = await supabase.from("inquiries").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete inquiry: ${error.message}`)
  }
}

export async function getInquiriesByEmail(email?: string) {
  if (!email) {
    return []
  }

  const inquiries = await getInquiries()
  return inquiries.filter((inquiry) => inquiry.email.toLowerCase() === email.toLowerCase())
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

export async function getInquiriesForUser(userId?: string, email?: string) {
  const inquiries = await getInquiries()

  return inquiries.filter((inquiry) => {
    if (userId && inquiry.userId === userId) {
      return true
    }

    return emailMatches(inquiry.email, email)
  })
}
