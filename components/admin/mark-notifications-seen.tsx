"use client"

import { useEffect } from "react"
import type { AdminNotification } from "@/lib/admin-notifications"
import { useUnreadNotifications } from "@/hooks/use-seen-admin-notifications"

export function MarkNotificationsSeen({ notifications }: { notifications: AdminNotification[] }) {
  const { markSeen } = useUnreadNotifications(notifications)

  useEffect(() => {
    markSeen()
  }, [markSeen])

  return null
}
