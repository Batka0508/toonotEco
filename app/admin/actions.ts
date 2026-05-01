"use server"

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ADMIN_COOKIE_NAME, createAdminSession, getAdminCredentials, isValidAdminSession } from "@/lib/admin-auth"
import { getInquiries, inquiriesPath, type Inquiry } from "@/lib/inquiries"
import { getApartmentImages, getSiteContent, siteContentPath, type Apartment } from "@/lib/site-content"

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim()
}

function parseImagePaths(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseAmenities(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || crypto.randomUUID()
}

function parseStatus(value: string): Apartment["status"] {
  if (value === "sold" || value === "reserved") {
    return value
  }

  return "available"
}

function parseInquiryStatus(value: string): Inquiry["status"] {
  if (value === "contacted" || value === "closed") {
    return value
  }

  return "new"
}

async function saveContent(content: ReturnType<typeof getSiteContent>) {
  await mkdir(path.dirname(siteContentPath), { recursive: true })
  await writeFile(siteContentPath, JSON.stringify(content, null, 2), "utf8")

  revalidatePath("/")
  revalidatePath("/admin")
}

async function uploadImages(files: FormDataEntryValue[], prefix: string) {
  const uploadedImages: string[] = []

  for (const imageFile of files) {
    if (imageFile instanceof File && imageFile.size > 0) {
      const extension = path.extname(imageFile.name) || ".jpg"
      const filename = `${prefix}-${Date.now()}-${uploadedImages.length}${extension}`
      const publicPath = path.join(process.cwd(), "public", "images", filename)
      const buffer = Buffer.from(await imageFile.arrayBuffer())

      await mkdir(path.dirname(publicPath), { recursive: true })
      await writeFile(publicPath, buffer)
      uploadedImages.push(`/images/${filename}`)
    }
  }

  return uploadedImages
}

function readPropertyForm(formData: FormData, current?: Apartment): Apartment {
  const now = new Date().toISOString()
  const title = clean(formData.get("title"))
  const id = current?.id ?? slugify(title)
  const area = clean(formData.get("area"))
  const price = clean(formData.get("price"))
  const total = clean(formData.get("total"))

  if (!title || !price || !area) {
    throw new Error("required")
  }

  const images = parseImagePaths(clean(formData.get("images")))
  const baseImages = images.length > 0 ? images : current ? getApartmentImages(current) : ["/placeholder.jpg"]

  return {
    id,
    title,
    description: clean(formData.get("description")),
    price,
    location: clean(formData.get("location")),
    district: clean(formData.get("district")),
    rooms: clean(formData.get("rooms")),
    area,
    floor: clean(formData.get("floor")),
    totalFloors: clean(formData.get("totalFloors")),
    status: parseStatus(clean(formData.get("status"))),
    images: baseImages,
    image: baseImages[0] ?? "/placeholder.jpg",
    floorPlanImage: clean(formData.get("floorPlanImage")),
    amenities: parseAmenities(clean(formData.get("amenities"))),
    total: total || current?.total || price,
    tag: clean(formData.get("tag")) || current?.tag || "Байр",
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  }
}

async function requireAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!isValidAdminSession(session)) {
    redirect("/admin?error=1")
  }
}

export async function loginAdmin(formData: FormData) {
  const username = clean(formData.get("username"))
  const password = clean(formData.get("password"))
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

export async function updateApartment(formData: FormData) {
  await requireAdmin()

  const id = clean(formData.get("id"))
  const content = getSiteContent()
  const apartment = content.apartments.find((item) => item.id === id)

  if (!apartment) {
    redirect("/admin?error=apartment")
  }

  let nextApartment: Apartment

  try {
    nextApartment = readPropertyForm(formData, apartment)
  } catch {
    redirect("/admin?view=properties&error=validation")
  }

  const uploadedImages = await uploadImages(formData.getAll("imageFiles"), apartment.id)
  if (uploadedImages.length > 0) {
    nextApartment.images = [...getApartmentImages(nextApartment), ...uploadedImages]
    nextApartment.image = nextApartment.images[0]
  }

  content.apartments = content.apartments.map((item) => (item.id === id ? nextApartment : item))

  await saveContent(content)
  redirect("/admin?view=properties&saved=1")
}

export async function createApartment(formData: FormData) {
  await requireAdmin()

  const content = getSiteContent()
  let apartment: Apartment

  try {
    apartment = readPropertyForm(formData)
  } catch {
    redirect("/admin?view=add&error=validation")
  }

  if (content.apartments.some((item) => item.id === apartment.id)) {
    apartment.id = `${apartment.id}-${Date.now()}`
  }

  const uploadedImages = await uploadImages(formData.getAll("imageFiles"), apartment.id)
  if (uploadedImages.length > 0) {
    apartment.images = uploadedImages
    apartment.image = uploadedImages[0]
  }

  content.apartments.unshift(apartment)
  await saveContent(content)
  redirect("/admin?view=properties&saved=1")
}

export async function deleteApartment(formData: FormData) {
  await requireAdmin()

  const id = clean(formData.get("id"))
  const content = getSiteContent()
  content.apartments = content.apartments.filter((item) => item.id !== id)

  await saveContent(content)
  redirect("/admin?view=properties&saved=1")
}

export async function updateInquiryStatus(formData: FormData) {
  await requireAdmin()

  const id = clean(formData.get("id"))
  const status = parseInquiryStatus(clean(formData.get("status")))
  const inquiries = getInquiries().map((inquiry) => (inquiry.id === id ? { ...inquiry, status } : inquiry))

  await mkdir(path.dirname(inquiriesPath), { recursive: true })
  await writeFile(inquiriesPath, JSON.stringify(inquiries, null, 2), "utf8")

  revalidatePath("/admin")
  revalidatePath("/account")
  redirect("/admin?view=requests")
}

export async function replyInquiry(formData: FormData) {
  await requireAdmin()

  const id = clean(formData.get("id"))
  const reply = clean(formData.get("reply"))

  if (!id || !reply) {
    redirect("/admin")
  }

  const inquiries = getInquiries().map((inquiry) =>
    inquiry.id === id
      ? {
          ...inquiry,
          status: "contacted" as const,
          adminReply: reply,
          repliedAt: new Date().toISOString(),
        }
      : inquiry,
  )

  await mkdir(path.dirname(inquiriesPath), { recursive: true })
  await writeFile(inquiriesPath, JSON.stringify(inquiries, null, 2), "utf8")

  revalidatePath("/admin")
  revalidatePath("/account")
  redirect("/admin?view=requests")
}
