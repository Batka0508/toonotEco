import { existsSync, readFileSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { getSupabaseAdminClient } from "@/lib/supabase"

export type Apartment = {
  id: string
  title: string
  description?: string
  area: string
  price: string
  total: string
  location?: string
  district?: string
  rooms?: string
  floor?: string
  totalFloors?: string
  status?: "available" | "sold" | "reserved"
  image: string
  images?: string[]
  floorPlanImage?: string
  amenities?: string[]
  tag: string
  createdAt?: string
  updatedAt?: string
}

export type SiteContent = {
  apartments: Apartment[]
}

export const siteContentPath = path.join(process.cwd(), "data", "site-content.json")

type ApartmentRow = {
  id: string
  title: string
  description: string | null
  area: string
  price: string
  total: string
  location: string | null
  district: string | null
  rooms: string | null
  floor: string | null
  total_floors: string | null
  status: Apartment["status"] | null
  image: string
  images: string[] | null
  floor_plan_image: string | null
  amenities: string[] | null
  tag: string
  created_at: string | null
  updated_at: string | null
}

export const defaultSiteContent: SiteContent = {
  apartments: [
    {
      id: "two-room",
      title: "2 өрөө байр",
      area: "42-55 м2",
      price: "3.2 сая/м2-с",
      total: "134 саяас",
      image: "/images/project-1.jpg",
      images: ["/images/project-1.jpg", "/images/project-2.jpg", "/images/project-3.jpg"],
      tag: "Залуу гэр бүл",
    },
    {
      id: "three-room",
      title: "3 өрөө байр",
      area: "68-86 м2",
      price: "3.1 сая/м2-с",
      total: "210 саяас",
      image: "/images/project-2.jpg",
      images: ["/images/project-2.jpg", "/images/project-1.jpg", "/images/project-3.jpg"],
      tag: "Гэр бүл",
    },
    {
      id: "parking",
      title: "Зогсоол",
      area: "Дулаан зогсоол",
      price: "Тусдаа үнэ",
      total: "Дэлгэрэнгүй лавлах",
      image: "/images/project-3.jpg",
      images: ["/images/project-3.jpg", "/images/project-1.jpg"],
      tag: "Нэмэлт сонголт",
    },
  ],
}

export function getApartmentImages(apartment: Apartment) {
  const images = apartment.images?.filter(Boolean)
  return images?.length ? images : [apartment.image]
}

export function normalizeApartment(apartment: Apartment): Apartment {
  const now = new Date().toISOString()
  const images = getApartmentImages(apartment).filter(Boolean)

  return {
    ...apartment,
    description: apartment.description ?? "",
    location: apartment.location ?? "Тоонот Эко Хотхон",
    district: apartment.district ?? "",
    rooms: apartment.rooms ?? "",
    floor: apartment.floor ?? "",
    totalFloors: apartment.totalFloors ?? "",
    status: apartment.status ?? "available",
    images,
    image: images[0] ?? "/placeholder.jpg",
    floorPlanImage: apartment.floorPlanImage ?? "",
    amenities: apartment.amenities ?? [],
    createdAt: apartment.createdAt ?? now,
    updatedAt: apartment.updatedAt ?? now,
  }
}

function readLocalSiteContent(): SiteContent {
  if (!existsSync(siteContentPath)) {
    return defaultSiteContent
  }

  try {
    const content = JSON.parse(readFileSync(siteContentPath, "utf8")) as SiteContent
    return {
      apartments: content.apartments.map(normalizeApartment),
    }
  } catch {
    return {
      apartments: defaultSiteContent.apartments.map(normalizeApartment),
    }
  }
}

function apartmentFromRow(row: ApartmentRow): Apartment {
  return normalizeApartment({
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    area: row.area,
    price: row.price,
    total: row.total,
    location: row.location ?? "",
    district: row.district ?? "",
    rooms: row.rooms ?? "",
    floor: row.floor ?? "",
    totalFloors: row.total_floors ?? "",
    status: row.status ?? "available",
    image: row.image,
    images: row.images ?? [row.image],
    floorPlanImage: row.floor_plan_image ?? "",
    amenities: row.amenities ?? [],
    tag: row.tag,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  })
}

function apartmentToRow(apartment: Apartment): ApartmentRow {
  const normalized = normalizeApartment(apartment)

  return {
    id: normalized.id,
    title: normalized.title,
    description: normalized.description ?? "",
    area: normalized.area,
    price: normalized.price,
    total: normalized.total,
    location: normalized.location ?? "",
    district: normalized.district ?? "",
    rooms: normalized.rooms ?? "",
    floor: normalized.floor ?? "",
    total_floors: normalized.totalFloors ?? "",
    status: normalized.status ?? "available",
    image: normalized.image,
    images: getApartmentImages(normalized),
    floor_plan_image: normalized.floorPlanImage ?? "",
    amenities: normalized.amenities ?? [],
    tag: normalized.tag,
    created_at: normalized.createdAt ?? null,
    updated_at: normalized.updatedAt ?? null,
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return readLocalSiteContent()
  }

  const { data, error } = await supabase.from("apartments").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to load apartments from Supabase", error)
    return readLocalSiteContent()
  }

  return {
    apartments: ((data ?? []) as ApartmentRow[]).map(apartmentFromRow),
  }
}

export async function saveSiteContent(content: SiteContent) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    await mkdir(path.dirname(siteContentPath), { recursive: true })
    await writeFile(siteContentPath, JSON.stringify(content, null, 2), "utf8")
    return
  }

  const rows = content.apartments.map(apartmentToRow)
  const { error } = await supabase.from("apartments").upsert(rows, { onConflict: "id" })

  if (error) {
    throw new Error(`Failed to save apartments: ${error.message}`)
  }
}

export async function deleteApartmentById(id: string) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    const content = readLocalSiteContent()
    content.apartments = content.apartments.filter((item) => item.id !== id)
    await saveSiteContent(content)
    return
  }

  const { error } = await supabase.from("apartments").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete apartment: ${error.message}`)
  }
}
