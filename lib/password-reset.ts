import { createHash, randomInt } from "node:crypto"
import path from "node:path"
import { readBackendJson } from "@/lib/backend-json"

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
const passwordResetStoragePath = "auth/password-reset-codes.json"

export function createResetCode() {
  return String(randomInt(100000, 1000000))
}

export function hashResetCode(code: string) {
  return createHash("sha256").update(code.trim()).digest("hex")
}

export async function getPasswordResetData(): Promise<PasswordResetData> {
  return readBackendJson(passwordResetStoragePath, passwordResetPath, { codes: [] })
}

export async function findResetCode(email: string, phone: string) {
  const now = Date.now()
  const data = await getPasswordResetData()

  return (
    data.codes.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.phone.trim() === phone.trim() &&
        new Date(item.expiresAt).getTime() > now,
    ) || null
  )
}

export { passwordResetStoragePath }
