import { getCurrentUser } from "@/lib/user-auth"

function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() ?? ""
}

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean)
}

export async function getCurrentAdmin() {
  const user = await getCurrentUser()
  const email = normalizeEmail(user?.email)

  if (!user || !email) {
    return null
  }

  const adminEmails = getAdminEmails()

  if (!adminEmails.includes(email)) {
    return null
  }

  return {
    id: user.id,
    name: user.name || email,
    email,
  }
}
