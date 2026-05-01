import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

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
    location: apartment.location ?? "Тоонoт Эко Хотхон",
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

export function getSiteContent(): SiteContent {
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
