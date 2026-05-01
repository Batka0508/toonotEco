import { createHash, timingSafeEqual } from "node:crypto"

export const ADMIN_COOKIE_NAME = "toonot_admin_session"

const DEFAULT_USERNAME = "admin"
const DEFAULT_PASSWORD = "admin123"
const DEFAULT_SECRET = "toonot-admin-local-secret"

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? DEFAULT_USERNAME,
    password: process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD,
    secret: process.env.ADMIN_SESSION_SECRET ?? DEFAULT_SECRET,
  }
}

export function createAdminSession(username: string) {
  const { secret } = getAdminCredentials()
  const payload = `${username}:${secret}`
  return createHash("sha256").update(payload).digest("hex")
}

export function isValidAdminSession(session?: string) {
  if (!session) {
    return false
  }

  const { username } = getAdminCredentials()
  const expected = createAdminSession(username)

  try {
    return timingSafeEqual(Buffer.from(session), Buffer.from(expected))
  } catch {
    return false
  }
}
