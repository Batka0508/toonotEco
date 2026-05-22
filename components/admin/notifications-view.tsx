import Link from "next/link"
import { ArrowRight, Bot, ClipboardList } from "lucide-react"
import type { AdminNotification } from "@/lib/admin-notifications"
import { AdminCard } from "@/components/admin/admin-ui"

type NotificationsViewProps = {
  notifications: AdminNotification[]
}

export function NotificationsView({ notifications }: NotificationsViewProps) {
  const inquiries = notifications.filter((n) => n.type === "inquiry")
  const chatbot = notifications.filter((n) => n.type === "chatbot")

  return (
    <div className="grid gap-6">
      <AdminCard className="p-5">
        <h2 className="text-base font-bold text-slate-900">Мэдэгдлийн төв</h2>
        <p className="mt-1 text-sm text-slate-500">
          Шинэ хүсэлт болон AI чатботоор ирсэн мэдээллийг энд харах боломжтой.
        </p>
      </AdminCard>

      {notifications.length === 0 ? (
        <AdminCard className="p-10 text-center">
          <p className="text-sm text-slate-500">Одоогоор шинэ мэдэгдэл байхгүй байна.</p>
        </AdminCard>
      ) : (
        <>
          {inquiries.length > 0 && (
            <NotificationGroup
              title="Шинэ хүсэлтүүд"
              description="Холбогдоогүй шинэ захиалга"
              items={inquiries}
              href="/admin?view=requests"
              linkLabel="Захиалга руу"
              icon={ClipboardList}
              iconClassName="bg-amber-100 text-amber-600"
            />
          )}
          {chatbot.length > 0 && (
            <NotificationGroup
              title="AI чатбот"
              description="Чатботоор ирсэн сүүлийн lead-үүд"
              items={chatbot}
              href="/admin?view=chatbot"
              linkLabel="Харилцагчид руу"
              icon={Bot}
              iconClassName="bg-violet-100 text-violet-600"
            />
          )}
        </>
      )}
    </div>
  )
}

function NotificationGroup({
  title,
  description,
  items,
  href,
  linkLabel,
  icon: Icon,
  iconClassName,
}: {
  title: string
  description: string
  items: AdminNotification[]
  href: string
  linkLabel: string
  icon: typeof Bot
  iconClassName: string
}) {
  return (
    <AdminCard>
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{items.length}</span>
      </div>

      <ul className="divide-y divide-slate-50">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={item.href} className="flex gap-4 px-5 py-4 transition-colors hover:bg-slate-50/80">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClassName}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                <p className="mt-2 text-xs text-slate-400">{item.time}</p>
              </div>
              <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-slate-300" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-100 px-5 py-3">
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-[#5d5fef] hover:text-[#4f51e8]">
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </AdminCard>
  )
}
