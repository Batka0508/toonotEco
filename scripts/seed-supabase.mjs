import { readFile } from "node:fs/promises"
import { createClient } from "@supabase/supabase-js"

async function readEnv() {
  const raw = await readFile(".env.local", "utf8")
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([^#=]+)=(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1].trim(), match[2].trim()]),
  )
}

function toApartmentRow(apartment) {
  return {
    id: apartment.id,
    title: apartment.title,
    description: apartment.description ?? "",
    area: apartment.area,
    price: apartment.price,
    total: apartment.total,
    location: apartment.location ?? "",
    district: apartment.district ?? "",
    rooms: apartment.rooms ?? "",
    floor: apartment.floor ?? "",
    total_floors: apartment.totalFloors ?? "",
    status: apartment.status ?? "available",
    image: apartment.image,
    images: apartment.images ?? [apartment.image],
    floor_plan_image: apartment.floorPlanImage ?? "",
    amenities: apartment.amenities ?? [],
    tag: apartment.tag ?? "",
    created_at: apartment.createdAt ?? new Date().toISOString(),
    updated_at: apartment.updatedAt ?? new Date().toISOString(),
  }
}

function toInquiryRow(inquiry) {
  return {
    id: inquiry.id,
    user_id: inquiry.userId ?? null,
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email ?? "",
    apartment: inquiry.apartment ?? "",
    message: inquiry.message ?? "",
    admin_reply: inquiry.adminReply ?? null,
    replied_at: inquiry.repliedAt ?? null,
    created_at: inquiry.createdAt ?? new Date().toISOString(),
    status: inquiry.status ?? "new",
  }
}

async function main() {
  const env = await readEnv()
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to seed Supabase.")
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const siteContent = JSON.parse(await readFile("data/site-content.json", "utf8"))
  const inquiries = JSON.parse(await readFile("data/inquiries.json", "utf8"))

  const apartmentRows = siteContent.apartments.map(toApartmentRow)
  const inquiryRows = inquiries.map(toInquiryRow)

  const apartmentsResult = await supabase.from("apartments").upsert(apartmentRows, { onConflict: "id" })
  if (apartmentsResult.error) {
    throw new Error(`Failed to seed apartments: ${apartmentsResult.error.message}`)
  }

  const inquiriesResult = await supabase.from("inquiries").upsert(inquiryRows, { onConflict: "id" })
  if (inquiriesResult.error) {
    throw new Error(`Failed to seed inquiries: ${inquiriesResult.error.message}`)
  }

  console.log(`Seeded ${apartmentRows.length} apartments and ${inquiryRows.length} inquiries.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
