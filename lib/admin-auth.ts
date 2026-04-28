import { createHmac, timingSafeEqual } from "node:crypto"

export const ADMIN_COOKIE_NAME = "toonot_admin_session"

const DEFAULT_USERNAME = "admin"
const DEFAULT_PASSWORD = "admin123"
const DEFAULT_SECRET = "toonot-eco-admin-dev-secret"

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || DEFAULT_USERNAME,
    password: process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD,
  }
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex")
}

function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function createAdminSession(username: string) {
  const payload = `${username}:${Date.now()}`
  return `${payload}.${sign(payload)}`
}

export function isValidAdminSession(session?: string) {
  if (!session) {
    return false
  }

  const separatorIndex = session.lastIndexOf(".")

  if (separatorIndex === -1) {
    return false
  }

  const payload = session.slice(0, separatorIndex)
  const signature = session.slice(separatorIndex + 1)

  return secureCompare(signature, sign(payload))
}
