"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { AdminNotification } from "@/lib/admin-notifications"

const STORAGE_KEY = "toonoteco-admin-seen-notifications"
export const ADMIN_NOTIFICATIONS_SEEN_EVENT = "admin-notifications-seen"

export function loadSeenNotificationIds() {
  if (typeof window === "undefined") {
    return new Set<string>()
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set<string>()
  }
}

export function markNotificationsSeen(ids: string[]) {
  if (typeof window === "undefined" || ids.length === 0) {
    return
  }

  const seen = loadSeenNotificationIds()
  ids.forEach((id) => seen.add(id))
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]))
  window.dispatchEvent(new CustomEvent(ADMIN_NOTIFICATIONS_SEEN_EVENT))
}

export function useUnreadNotifications(notifications: AdminNotification[]) {
  const [seenIds, setSeenIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setSeenIds(loadSeenNotificationIds())

    const syncSeen = () => setSeenIds(loadSeenNotificationIds())
    window.addEventListener(ADMIN_NOTIFICATIONS_SEEN_EVENT, syncSeen)
    return () => window.removeEventListener(ADMIN_NOTIFICATIONS_SEEN_EVENT, syncSeen)
  }, [])

  const unread = useMemo(
    () => notifications.filter((notification) => !seenIds.has(notification.id)),
    [notifications, seenIds],
  )

  const markSeen = useCallback(
    (ids?: string[]) => {
      markNotificationsSeen(ids ?? notifications.map((notification) => notification.id))
    },
    [notifications],
  )

  return { unread, unreadCount: unread.length, markSeen }
}
