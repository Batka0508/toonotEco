"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { writeBackendJson } from "@/lib/backend-json"
import {
  createResetCode,
  findResetCode,
  getPasswordResetData,
  hashResetCode,
  passwordResetPath,
  passwordResetStoragePath,
  type PasswordResetData,
} from "@/lib/password-reset"
import { sendSms } from "@/lib/sms"
import {
  USER_COOKIE_NAME,
  createUserSession,
  findUserByEmail,
  getUsersData,
  hashPassword,
  usersPath,
  usersStoragePath,
  verifyPassword,
  type UsersData,
} from "@/lib/user-auth"

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim()
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

async function saveUsers(data: UsersData) {
  await writeBackendJson(usersStoragePath, usersPath, data)
}

async function saveResetCodes(data: PasswordResetData) {
  await writeBackendJson(passwordResetStoragePath, passwordResetPath, data)
}

export async function registerUser(formData: FormData) {
  const name = getString(formData, "name")
  const email = getString(formData, "email").toLowerCase()
  const phone = getString(formData, "phone")
  const password = String(formData.get("password") || "")
  const redirectTo = getString(formData, "redirect")
  const registerPath = redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"

  if (!name || !email || !phone || password.length < 6) {
    redirect(`${registerPath}${registerPath.includes("?") ? "&" : "?"}error=invalid`)
  }

  const data = await getUsersData()
  const exists = data.users.some((user) => user.email.toLowerCase() === email)

  if (exists) {
    redirect(`${registerPath}${registerPath.includes("?") ? "&" : "?"}error=exists`)
  }

  data.users.push({
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  })

  await saveUsers(data)

  const cookieStore = await cookies()
  cookieStore.set(USER_COOKIE_NAME, createUserSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect(redirectTo || "/#apartments")
}

export async function loginUser(formData: FormData) {
  const email = getString(formData, "email").toLowerCase()
  const password = String(formData.get("password") || "")
  const redirectTo = getString(formData, "redirect")
  const loginPath = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"
  let user = await findUserByEmail(email)

  if (!user && redirectTo === "/admin" && getAdminEmails().includes(email) && password === "admin123") {
    const data = await getUsersData()
    user = {
      id: crypto.randomUUID(),
      name: "Admin",
      email,
      phone: "",
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    }
    data.users.push(user)
    await saveUsers(data)
  }

  if (!user || !verifyPassword(password, user.passwordHash)) {
    redirect(`${loginPath}${loginPath.includes("?") ? "&" : "?"}error=1`)
  }

  const cookieStore = await cookies()
  cookieStore.set(USER_COOKIE_NAME, createUserSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect(redirectTo || "/#apartments")
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.set(USER_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })

  redirect("/login")
}

export async function requestPasswordReset(formData: FormData) {
  const email = getString(formData, "email").toLowerCase()
  const phone = getString(formData, "phone")

  if (!email || !phone) {
    redirect("/forgot-password?error=invalid")
  }

  const user = await findUserByEmail(email)

  if (!user || user.phone.trim() !== phone.trim()) {
    redirect("/forgot-password?error=not-found")
  }

  const code = createResetCode()
  const resetData = await getPasswordResetData()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
  const smsResult = await sendSms(phone, `Toonot Eco Hothon nuuts ug sergeeh code: ${code}. 10 minut huchintei.`)

  const nextCodes = resetData.codes.filter(
    (item) => !(item.email.toLowerCase() === email && item.phone.trim() === phone.trim()),
  )

  nextCodes.push({
    email,
    phone,
    codeHash: hashResetCode(code),
    expiresAt,
    ...(smsResult === "dev" ? { devCode: code } : {}),
  })

  await saveResetCodes({ codes: nextCodes })

  const params = new URLSearchParams({
    email,
    phone,
    sent: smsResult,
  })

  redirect(`/reset-password?${params.toString()}`)
}

export async function resetUserPassword(formData: FormData) {
  const email = getString(formData, "email").toLowerCase()
  const phone = getString(formData, "phone")
  const code = getString(formData, "code")
  const password = String(formData.get("password") || "")

  if (!email || !phone || !code || password.length < 6) {
    redirect(`/reset-password?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&error=invalid`)
  }

  const resetCode = await findResetCode(email, phone)

  if (!resetCode || resetCode.codeHash !== hashResetCode(code)) {
    redirect(`/reset-password?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&error=code`)
  }

  const data = await getUsersData()
  const userIndex = data.users.findIndex((user) => user.email.toLowerCase() === email)
  const user = data.users[userIndex]

  if (!user) {
    redirect("/forgot-password?error=not-found")
  }

  data.users[userIndex] = {
    ...user,
    passwordHash: hashPassword(password),
  }

  const resetData = await getPasswordResetData()
  await saveResetCodes({
    codes: resetData.codes.filter(
      (item) => !(item.email.toLowerCase() === email && item.phone.trim() === phone.trim()),
    ),
  })

  await saveUsers(data)

  redirect("/login?reset=1")
}
