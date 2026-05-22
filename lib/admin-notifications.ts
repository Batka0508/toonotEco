import type { ChatbotLead } from "@/lib/chatbot-leads"
import type { Inquiry } from "@/lib/inquiries"

export type AdminNotification = {
  id: string
  type: "inquiry" | "chatbot"
  title: string
  message: string
  time: string
  href: string
}

const INQUIRY_TIME_OFFSET_MS = 4 * 60 * 60 * 1000

export function buildAdminNotifications(inquiries: Inquiry[], chatbotLeads: ChatbotLead[]): AdminNotification[] {
  const inquiryNotifications = inquiries
    .filter((inquiry) => inquiry.status === "new")
    .map((inquiry) => ({
      id: `inquiry-${inquiry.id}`,
      type: "inquiry" as const,
      title: `${inquiry.name} — шинэ хүсэлт`,
      message: inquiry.message || inquiry.phone,
      time: formatNotificationTime(inquiry.createdAt),
      href: "/admin?view=requests",
    }))

  const chatbotNotifications = chatbotLeads.slice(0, 5).map((lead) => ({
    id: `chatbot-${lead.id}`,
    type: "chatbot" as const,
    title: `${lead.name} — AI чатбот`,
    message: lead.message || lead.phone,
    time: formatNotificationTime(lead.createdAt),
    href: "/admin?view=chatbot",
  }))

  return [...inquiryNotifications, ...chatbotNotifications]
}

export function getAdminNotificationCount(notifications: AdminNotification[]) {
  return notifications.length
}

function formatNotificationTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const adjusted = new Date(date.getTime() - INQUIRY_TIME_OFFSET_MS)
  const now = new Date()
  const diffMs = now.getTime() - adjusted.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return "Саяхан"
  if (diffHours < 24) return `Өнөөдөр ${adjusted.toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" })}`
  return adjusted.toLocaleDateString("mn-MN")
}
