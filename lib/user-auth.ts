import { existsSync, readFileSync } from "node:fs"
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import path from "node:path"

export const USER_COOKIE_NAME = "toonot_user_session"
export const usersPath = path.join(process.cwd(), "data", "users.json")

export type User = {
  id: string
  name: string
  email: string
  phone: string
  passwordHash: string
  createdAt: string
}

export type UsersData = {
  users: User[]
}

function normalizePassword(password: string) {
  return password.trim()
}

function getUserSessionSecret() {
  return process.env.USER_SESSION_SECRET || "toonot-eco-user-dev-secret"
}

function sign(value: string) {
  return createHmac("sha256", getUserSessionSecret()).update(value).digest("hex")
}

function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = createHash("sha256").update(`${salt}:${normalizePassword(password)}`).digest("hex")

  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":")

  if (!salt || !hash) {
    return false
  }

  const normalizedAttempt = createHash("sha256").update(`${salt}:${normalizePassword(password)}`).digest("hex")

  if (secureCompare(normalizedAttempt, hash)) {
    return true
  }

  const rawAttempt = createHash("sha256").update(`${salt}:${password}`).digest("hex")

  return secureCompare(rawAttempt, hash)
}

export function createUserSession(email: string) {
  const payload = `${email}:${Date.now()}`
  return `${payload}.${sign(payload)}`
}

export function getUserEmailFromSession(session?: string) {
  if (!session) {
    return null
  }

  const separatorIndex = session.lastIndexOf(".")

  if (separatorIndex === -1) {
    return null
  }

  const payload = session.slice(0, separatorIndex)
  const signature = session.slice(separatorIndex + 1)

  if (!secureCompare(signature, sign(payload))) {
    return null
  }

  return payload.split(":")[0] || null
}

export function getUsersData(): UsersData {
  if (!existsSync(usersPath)) {
    return { users: [] }
  }

  try {
    return JSON.parse(readFileSync(usersPath, "utf8")) as UsersData
  } catch {
    return { users: [] }
  }
}

export function findUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  return getUsersData().users.find((user) => user.email.toLowerCase() === normalizedEmail) || null
}
