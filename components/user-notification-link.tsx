"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageSquareText } from "lucide-react"
import { Button } from "@/components/ui/button"

type NotificationState = {
  count: number
}

export function UserNotificationLink() {
  const [notification, setNotification] = useState<NotificationState>({ count: 0 })

  useEffect(() => {
    let isMounted = true

    async function loadNotifications() {
      try {
        const response = await fetch("/api/account-notifications", { cache: "no-store" })

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as NotificationState

        if (isMounted) {
          setNotification({ count: data.count ?? 0 })
        }
      } catch {
        if (isMounted) {
          setNotification({ count: 0 })
        }
      }
    }

    loadNotifications()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Button asChild variant="outline" className="relative hidden h-10 border-primary/25 bg-white text-primary hover:bg-primary/10 lg:flex">
      <Link href="/account">
        <MessageSquareText className="h-4 w-4" />
        Миний хүсэлт
        {notification.count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-xs font-bold text-white">
            {notification.count}
          </span>
        )}
      </Link>
    </Button>
  )
}
