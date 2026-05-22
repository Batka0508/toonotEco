"use client"

import Link from "next/link"
import { Bell, Bot, ClipboardList } from "lucide-react"
import type { AdminNotification } from "@/lib/admin-notifications"
import { useUnreadNotifications } from "@/hooks/use-seen-admin-notifications"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type AdminNotificationsProps = {
  notifications: AdminNotification[]
}

export function AdminNotifications({ notifications }: AdminNotificationsProps) {
  const { unread, unreadCount, markSeen } = useUnreadNotifications(notifications)

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) {
          markSeen()
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 data-[state=open]:bg-slate-100 data-[state=open]:text-[#5d5fef]"
          aria-label="Мэдэгдэл"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 sm:w-96">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-bold text-slate-900">Мэдэгдэл</p>
          <p className="text-xs text-slate-500">
            {unreadCount > 0 ? `${unreadCount} уншаагүй` : "Бүх мэдэгдлийг үзсэн"}
          </p>
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">Одоогоор мэдэгдэл алга.</div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {unread.map((item) => (
                <li key={item.id}>
                  <NotificationItem item={item} />
                </li>
              ))}
              {unread.length < notifications.length && (
                <>
                  {unread.length > 0 && (
                    <li className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Үзсэн</li>
                  )}
                  {notifications
                    .filter((item) => !unread.some((u) => u.id === item.id))
                    .map((item) => (
                      <li key={item.id} className="opacity-60">
                        <NotificationItem item={item} />
                      </li>
                    ))}
                </>
              )}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-100 p-2">
          <Link
            href="/admin?view=notifications"
            className="block rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#5d5fef] transition-colors hover:bg-violet-50"
          >
            Бүх мэдэгдлийг харах
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationItem({ item }: { item: AdminNotification }) {
  return (
    <Link href={item.href} className="flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50">
      <div
        className={[
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          item.type === "inquiry" ? "bg-amber-100 text-amber-600" : "bg-violet-100 text-violet-600",
        ].join(" ")}
      >
        {item.type === "inquiry" ? <ClipboardList className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.message}</p>
        <p className="mt-1 text-[11px] text-slate-400">{item.time}</p>
      </div>
    </Link>
  )
}
