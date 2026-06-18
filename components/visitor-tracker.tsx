"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const VISITOR_KEY = "toonot-visitor-id"

function createVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `visitor-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function getVisitorId() {
  const existing = window.localStorage.getItem(VISITOR_KEY)

  if (existing) {
    return existing
  }

  const id = createVisitorId()
  window.localStorage.setItem(VISITOR_KEY, id)
  return id
}

function shouldTrack(pathname: string) {
  return pathname !== "/admin" && !pathname.startsWith("/admin/") && !pathname.startsWith("/api/")
}

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!shouldTrack(pathname)) {
      return
    }

    const body = JSON.stringify({
      visitorId: getVisitorId(),
      path: pathname,
      referrer: document.referrer,
    })

    navigator.sendBeacon?.("/api/visits", new Blob([body], { type: "application/json" })) ||
      fetch("/api/visits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined)
  }, [pathname])

  return null
}
