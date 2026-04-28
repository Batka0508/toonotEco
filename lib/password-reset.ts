import { existsSync, readFileSync } from "node:fs"
import { createHash, randomInt } from "node:crypto"
import path from "node:path"

export type PasswordResetCode = {
  email: string
  phone: string
  codeHash: string
  expiresAt: string
  devCode?: string
}

export type PasswordResetData = {
  codes: PasswordResetCode[]
}

export const passwordResetPath = path.join(process.cwd(), "data", "password-reset-codes.json")

export function createResetCode() {
  return String(randomInt(100000, 1000000))
}

export function hashResetCode(code: string) {
  return createHash("sha256").update(code.trim()).digest("hex")
}

export function getPasswordResetData(): PasswordResetData {
  if (!existsSync(passwordResetPath)) {
    return { codes: [] }
  }

  try {
    return JSON.parse(readFileSync(passwordResetPath, "utf8")) as PasswordResetData
  } catch {
    return { codes: [] }
  }
}

export function findResetCode(email: string, phone: string) {
  const now = Date.now()

  return (
    getPasswordResetData().codes.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.phone.trim() === phone.trim() &&
        new Date(item.expiresAt).getTime() > now,
    ) || null
  )
}
