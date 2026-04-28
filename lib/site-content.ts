import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

export type Apartment = {
  id: string
  title: string
  area: string
  price: string
  total: string
  image: string
  tag: string
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
      area: "42-55 м²",
      price: "3.2 сая/м²-с",
      total: "134 саяас",
      image: "/images/project-1.jpg",
      tag: "Залуу гэр бүл",
    },
    {
      id: "three-room",
      title: "3 өрөө байр",
      area: "68-86 м²",
      price: "3.1 сая/м²-с",
      total: "210 саяас",
      image: "/images/project-2.jpg",
      tag: "Гэр бүл",
    },
    {
      id: "parking",
      title: "Зогсоол",
      area: "Дулаан зогсоол",
      price: "Тусдаа үнэ",
      total: "Дэлгэрэнгүй лавлах",
      image: "/images/project-3.jpg",
      tag: "Нэмэлт сонголт",
    },
  ],
}

export function getSiteContent(): SiteContent {
  if (!existsSync(siteContentPath)) {
    return defaultSiteContent
  }

  try {
    return JSON.parse(readFileSync(siteContentPath, "utf8")) as SiteContent
  } catch {
    return defaultSiteContent
  }
}
