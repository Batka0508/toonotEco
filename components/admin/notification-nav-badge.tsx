"use client"

import type { AdminNotification } from "@/lib/admin-notifications"
import { useUnreadNotifications } from "@/hooks/use-seen-admin-notifications"

export function NotificationNavBadge({
  notifications,
  active,
}: {
  notifications: AdminNotification[]
  active: boolean
}) {
  const { unreadCount } = useUnreadNotifications(notifications)

  if (unreadCount <= 0) {
    return null
  }

  return (
    <span className={active ? "rounded-full bg-white/20 px-2 py-0.5 text-xs" : "rounded-full bg-[#5d5fef]/40 px-2 py-0.5 text-xs"}>
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  )
}
