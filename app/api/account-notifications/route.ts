import { NextResponse } from "next/server"
import { getInquiriesForUser } from "@/lib/inquiries"
import { getCurrentUser } from "@/lib/user-auth"

export async function GET() {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ count: 0, latest: null })
  }

  const inquiries = await getInquiriesForUser(user.id, user.email)
  const replies = inquiries
    .filter((inquiry) => inquiry.adminReply)
    .sort((a, b) => new Date(b.repliedAt ?? b.createdAt).getTime() - new Date(a.repliedAt ?? a.createdAt).getTime())

  return NextResponse.json({
    count: replies.length,
    latest: replies[0]
      ? {
          apartment: replies[0].apartment,
          repliedAt: replies[0].repliedAt,
        }
      : null,
  })
}
