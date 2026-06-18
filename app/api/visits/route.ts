import { NextResponse } from "next/server"
import { trackSiteVisit } from "@/lib/site-visits"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { visitorId?: string; path?: string; referrer?: string }

    await trackSiteVisit({
      visitorId: body.visitorId ?? "",
      path: body.path ?? "/",
      referrer: body.referrer ?? "",
      userAgent: request.headers.get("user-agent") ?? "",
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to track site visit", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
