import path from "node:path"
import { readBackendJson, writeBackendJson } from "@/lib/backend-json"
import { getSupabaseAdminClient } from "@/lib/supabase"

export type ChatbotLead = {
  id: string
  name: string
  phone: string
  apartmentType: string
  message: string
  createdAt: string
}

type ChatbotLeadRow = {
  id: string
  name: string
  phone: string
  apartment_type: string
  message: string
  created_at: string
}

const chatbotLeadsPath = path.join(process.cwd(), "data", "chatbot-leads.json")
const chatbotLeadsStoragePath = "leads/chatbot-leads.json"

function leadFromRow(row: ChatbotLeadRow): ChatbotLead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    apartmentType: row.apartment_type,
    message: row.message,
    createdAt: row.created_at,
  }
}

function leadToRow(lead: ChatbotLead): ChatbotLeadRow {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    apartment_type: lead.apartmentType,
    message: lead.message,
    created_at: lead.createdAt,
  }
}

async function readLocalLeads() {
  const data = await readBackendJson<{ leads: ChatbotLead[] }>(chatbotLeadsStoragePath, chatbotLeadsPath, { leads: [] })
  return data.leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getChatbotLeads(): Promise<ChatbotLead[]> {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return readLocalLeads()
  }

  const { data, error } = await supabase.from("chatbot_leads").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to load chatbot leads from Supabase", error)
    return readLocalLeads()
  }

  return ((data ?? []) as ChatbotLeadRow[]).map(leadFromRow)
}

export async function createChatbotLead(input: Omit<ChatbotLead, "id" | "createdAt">) {
  const lead: ChatbotLead = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    apartmentType: input.apartmentType.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  }

  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    const leads = await readLocalLeads()
    leads.unshift(lead)
    await writeBackendJson(chatbotLeadsStoragePath, chatbotLeadsPath, { leads })
    return lead
  }

  const { error } = await supabase.from("chatbot_leads").insert(leadToRow(lead))

  if (error) {
    throw new Error(`Failed to create chatbot lead: ${error.message}`)
  }

  return lead
}
