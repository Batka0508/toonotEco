"use server"

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { ADMIN_COOKIE_NAME, createAdminSession, getAdminCredentials, isValidAdminSession } from "@/lib/admin-auth"
import { defaultSiteContent, siteContentPath, type SiteContent } from "@/lib/site-content"

export async function loginAdmin(formData: FormData) {
  const username = String(formData.get("username") || "").trim()
  const password = String(formData.get("password") || "")
  const credentials = getAdminCredentials()

  if (username !== credentials.username || password !== credentials.password) {
    redirect("/admin?error=1")
  }

  const cookieStore = await cookies()

  cookieStore.set(ADMIN_COOKIE_NAME, createAdminSession(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  redirect("/admin")
}

export async function logoutAdmin() {
  const cookieStore = await cookies()

  cookieStore.delete(ADMIN_COOKIE_NAME)

  redirect("/admin")
}

async function requireAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!isValidAdminSession(session)) {
    redirect("/admin?error=1")
  }
}

async function readSiteContent(): Promise<SiteContent> {
  try {
    return JSON.parse(await readFile(siteContentPath, "utf8")) as SiteContent
  } catch {
    return defaultSiteContent
  }
}

function cleanImagePath(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ""
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim()
}

function getSafeFileName(id: string, fileName: string) {
  const extension = path.extname(fileName).toLowerCase() || ".jpg"
  const safeId = id.replace(/[^a-z0-9-]/gi, "-").toLowerCase()

  return `apartment-${safeId}-${Date.now()}${extension}`
}

export async function updateApartment(formData: FormData) {
  await requireAdmin()

  const id = getString(formData, "id")
  const content = await readSiteContent()
  const apartment = content.apartments.find((item) => item.id === id)

  if (!apartment) {
    redirect("/admin?error=missing-apartment")
  }

  let image = cleanImagePath(getString(formData, "image")) || apartment.image
  const imageFile = formData.get("imageFile")

  if (imageFile instanceof File && imageFile.size > 0) {
    const bytes = Buffer.from(await imageFile.arrayBuffer())
    const fileName = getSafeFileName(id, imageFile.name)
    const uploadDir = path.join(process.cwd(), "public", "images")

    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, fileName), bytes)

    image = `/images/${fileName}`
  }

  const updatedContent: SiteContent = {
    apartments: content.apartments.map((item) =>
      item.id === id
        ? {
            ...item,
            title: getString(formData, "title") || item.title,
            area: getString(formData, "area") || item.area,
            price: getString(formData, "price") || item.price,
            total: getString(formData, "total") || item.total,
            tag: getString(formData, "tag") || item.tag,
            image,
          }
        : item,
    ),
  }

  await mkdir(path.dirname(siteContentPath), { recursive: true })
  await writeFile(siteContentPath, `${JSON.stringify(updatedContent, null, 2)}\n`, "utf8")

  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/admin?saved=1")
}
