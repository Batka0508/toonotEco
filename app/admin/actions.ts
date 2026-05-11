"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { sendEmail } from "@/lib/email"
import { mergeHomepageContent, saveHomepageContent } from "@/lib/homepage-content"
import { deleteInquiryById, getInquiries, saveInquiries, type Inquiry } from "@/lib/inquiries"
import { uploadPropertyImages } from "@/lib/property-images"
import { deleteApartmentById, getApartmentImages, getSiteContent, saveSiteContent, type Apartment, type SiteContent } from "@/lib/site-content"

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

async function saveContent(content: SiteContent) {
  await saveSiteContent(content)

  revalidatePath("/")
  revalidatePath("/admin")
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
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect("/login?redirect=/admin")
  }
}

export async function updateApartment(formData: FormData) {
  await requireAdmin()

  const id = clean(formData.get("id"))
  const content = await getSiteContent()
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

  const uploadedImages = await uploadPropertyImages(formData.getAll("imageFiles"), apartment.id)
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

  const content = await getSiteContent()
  let apartment: Apartment

  try {
    apartment = readPropertyForm(formData)
  } catch {
    redirect("/admin?view=add&error=validation")
  }

  if (content.apartments.some((item) => item.id === apartment.id)) {
    apartment.id = `${apartment.id}-${Date.now()}`
  }

  const uploadedImages = await uploadPropertyImages(formData.getAll("imageFiles"), apartment.id)
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
  await deleteApartmentById(id)
  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/admin?view=properties&saved=1")
}

export async function updateInquiryStatus(formData: FormData) {
  await requireAdmin()

  const id = clean(formData.get("id"))
  const status = parseInquiryStatus(clean(formData.get("status")))
  const inquiries = (await getInquiries()).map((inquiry) => (inquiry.id === id ? { ...inquiry, status } : inquiry))

  await saveInquiries(inquiries)

  revalidatePath("/admin")
  revalidatePath("/account")
  redirect("/admin?view=requests")
}

export async function deleteInquiry(formData: FormData) {
  await requireAdmin()

  const id = clean(formData.get("id"))

  if (!id) {
    redirect("/admin?view=requests")
  }

  await deleteInquiryById(id)

  revalidatePath("/admin")
  revalidatePath("/account")
  redirect("/admin?view=requests&saved=1")
}

export async function updateHomepageContent(formData: FormData) {
  await requireAdmin()

  const content = clean(formData.get("content"))

  if (!content) {
    redirect("/admin?view=content&error=validation")
  }

  try {
    await saveHomepageContent(mergeHomepageContent(JSON.parse(content)))
  } catch (error) {
    console.error("Failed to update homepage content", error)
    redirect("/admin?view=content&error=validation")
  }

  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/admin?view=content&saved=1")
}

export async function replyInquiry(formData: FormData) {
  await requireAdmin()

  const id = clean(formData.get("id"))
  const reply = clean(formData.get("reply"))

  if (!id || !reply) {
    redirect("/admin")
  }

  const existingInquiries = await getInquiries()
  const targetInquiry = existingInquiries.find((inquiry) => inquiry.id === id)
  const inquiries = existingInquiries.map((inquiry) =>
    inquiry.id === id
      ? {
          ...inquiry,
          status: "contacted" as const,
          adminReply: reply,
          repliedAt: new Date().toISOString(),
        }
      : inquiry,
  )

  await saveInquiries(inquiries)

  if (targetInquiry?.email) {
    await sendEmail({
      to: targetInquiry.email,
      subject: `Тоонот Эко Хотхон - таны хүсэлтийн хариу`,
      text: [
        `Сайн байна уу, ${targetInquiry.name}.`,
        "",
        "Таны илгээсэн хүсэлтэд дараах хариуг өглөө:",
        "",
        reply,
        "",
        targetInquiry.apartment ? `Сонирхсон байр: ${targetInquiry.apartment}` : "",
        "",
        "Баярлалаа.",
      ]
        .filter(Boolean)
        .join("\n"),
    })
  }

  revalidatePath("/admin")
  revalidatePath("/account")
  redirect("/admin?view=requests")
}
