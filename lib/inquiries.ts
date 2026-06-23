import { existsSync, readFileSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { assertWritableBackend, readBackendJson, writeBackendJson } from "@/lib/backend-json"
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
const inquiriesBackupPath = path.join(process.cwd(), "data", "inquiries-backup.json")
const inquiriesStoragePath = "inquiries/inquiries.json"

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

async function writeLocalInquiries(inquiries: Inquiry[]) {
  assertWritableBackend()
  await mkdir(path.dirname(inquiriesPath), { recursive: true })
  await writeFile(inquiriesPath, `${JSON.stringify(inquiries, null, 2)}\n`, "utf8")
}

async function readFallbackInquiries() {
  const data = await readBackendJson<{ inquiries: Inquiry[] }>(inquiriesStoragePath, inquiriesBackupPath, {
    inquiries: readLocalInquiries(),
  })

  return (data.inquiries ?? []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function writeFallbackInquiries(inquiries: Inquiry[]) {
  await writeBackendJson(inquiriesStoragePath, inquiriesBackupPath, { inquiries })

  try {
    await writeLocalInquiries(inquiries)
  } catch {
    // In production local writes may be unavailable; Supabase Storage backup is enough.
  }
}

async function addFallbackInquiry(inquiry: Inquiry) {
  const inquiries = await readFallbackInquiries()
  inquiries.unshift(inquiry)
  await writeFallbackInquiries(inquiries)
}

async function tryAddFallbackInquiry(inquiry: Inquiry) {
  try {
    await addFallbackInquiry(inquiry)
    return true
  } catch (error) {
    console.error(
      "Failed to persist inquiry fallback. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in production.",
      error,
    )
    return false
  }
}

function mergeInquiries(primary: Inquiry[], fallback: Inquiry[]) {
  const byId = new Map<string, Inquiry>()

  for (const inquiry of [...fallback, ...primary]) {
    byId.set(inquiry.id, inquiry)
  }

  return [...byId.values()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

  let result

  try {
    result = await supabase.from("inquiries").select("*").order("created_at", { ascending: false })
  } catch (error) {
    if (!isSupabaseNetworkError(error)) {
      console.error("Failed to load inquiries from Supabase", error)
    }
    return readFallbackInquiries()
  }

  const { data, error } = result

  if (error) {
    if (!isSupabaseNetworkError(error)) {
      console.error("Failed to load inquiries from Supabase", error)
    }
    return readFallbackInquiries()
  }

  const tableInquiries = ((data ?? []) as InquiryRow[]).map(inquiryFromRow)
  const fallbackInquiries = await readFallbackInquiries()

  return mergeInquiries(tableInquiries, fallbackInquiries)
}

export async function saveInquiries(inquiries: Inquiry[]) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    await writeLocalInquiries(inquiries)
    return
  }

  let result

  try {
    result = await supabase.from("inquiries").upsert(inquiries.map(inquiryToRow), { onConflict: "id" })
  } catch (error) {
    if (isSupabaseNetworkError(error)) {
      await writeFallbackInquiries(inquiries)
      return
    }

    throw error
  }

  const { error } = result

  if (error) {
    console.error("Failed to save inquiries in Supabase, using backup storage", error)
    await writeFallbackInquiries(inquiries)
  }
}

export async function createInquiry(inquiry: Inquiry) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    await tryAddFallbackInquiry(inquiry)
    return
  }

  let result

  try {
    result = await supabase.from("inquiries").insert(inquiryToRow(inquiry))
  } catch (error) {
    if (isSupabaseNetworkError(error)) {
      await tryAddFallbackInquiry(inquiry)
      return
    }

    console.error("Failed to create inquiry in Supabase, using backup storage", error)
    await tryAddFallbackInquiry(inquiry)
    return
  }

  const { error } = result

  if (error) {
    console.error("Failed to create inquiry in Supabase, using backup storage", error)
    await tryAddFallbackInquiry(inquiry)
  }
}

export async function deleteInquiryById(id: string) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    const inquiries = readLocalInquiries().filter((inquiry) => inquiry.id !== id)
    await writeLocalInquiries(inquiries)
    return
  }

  let result

  try {
    result = await supabase.from("inquiries").delete().eq("id", id)
  } catch (error) {
    if (isSupabaseNetworkError(error)) {
      const inquiries = readLocalInquiries().filter((inquiry) => inquiry.id !== id)
      await writeFallbackInquiries(inquiries)
      return
    }

    throw error
  }

  const { error } = result

  if (error) {
    console.error("Failed to delete inquiry from Supabase, using backup storage", error)
    const inquiries = (await readFallbackInquiries()).filter((inquiry) => inquiry.id !== id)
    await writeFallbackInquiries(inquiries)
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
