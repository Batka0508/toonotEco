import { existsSync, readFileSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { assertWritableBackend } from "@/lib/backend-json"
import { getSupabaseAdminClient } from "@/lib/supabase"

export type GarageStatus = "available" | "reserved" | "sold"
export type GarageBlock = "A блок" | "B блок" | "C блок"

export type Garage = {
  id: string
  block: GarageBlock
  number: string
  floor: string
  area: string
  price: string
  status: GarageStatus
  image: string
  createdAt?: string
  updatedAt?: string
}

type GarageRow = {
  id: string
  block: GarageBlock
  number: string
  floor: string
  area: string
  price: string
  status: GarageStatus
  image: string
  created_at: string | null
  updated_at: string | null
}

export const garageBlocks: GarageBlock[] = ["A блок", "B блок", "C блок"]
export const garagesPath = path.join(process.cwd(), "data", "garages.json")

function normalizeGarage(garage: Garage): Garage {
  const now = new Date().toISOString()

  return {
    ...garage,
    block: garageBlocks.includes(garage.block) ? garage.block : "A блок",
    status: garage.status === "reserved" || garage.status === "sold" ? garage.status : "available",
    image: garage.image || "/zogsool.jpg",
    createdAt: garage.createdAt ?? now,
    updatedAt: garage.updatedAt ?? now,
  }
}

function garageFromRow(row: GarageRow): Garage {
  return normalizeGarage({
    id: row.id,
    block: row.block,
    number: row.number,
    floor: row.floor,
    area: row.area,
    price: row.price,
    status: row.status,
    image: row.image,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  })
}

function garageToRow(garage: Garage): GarageRow {
  const normalized = normalizeGarage(garage)

  return {
    id: normalized.id,
    block: normalized.block,
    number: normalized.number,
    floor: normalized.floor,
    area: normalized.area,
    price: normalized.price,
    status: normalized.status,
    image: normalized.image,
    created_at: normalized.createdAt ?? null,
    updated_at: normalized.updatedAt ?? null,
  }
}

function readLocalGarages(): Garage[] {
  if (!existsSync(garagesPath)) {
    return []
  }

  try {
    const garages = JSON.parse(readFileSync(garagesPath, "utf8")) as Garage[]
    return garages.map(normalizeGarage)
  } catch {
    return []
  }
}

export async function getGarages(): Promise<Garage[]> {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return readLocalGarages()
  }

  const { data, error } = await supabase.from("garages").select("*").order("created_at", { ascending: true })

  if (error) {
    return readLocalGarages()
  }

  if (!data || data.length === 0) {
    return readLocalGarages()
  }

  return (data as GarageRow[]).map(garageFromRow)
}

export async function saveGarage(garage: Garage) {
  const normalized = normalizeGarage(garage)
  const supabase = getSupabaseAdminClient()

  if (!supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    assertWritableBackend()
    const garages = readLocalGarages()
    const nextGarages = garages.some((item) => item.id === normalized.id)
      ? garages.map((item) => (item.id === normalized.id ? normalized : item))
      : [normalized, ...garages]

    await mkdir(path.dirname(garagesPath), { recursive: true })
    await writeFile(garagesPath, JSON.stringify(nextGarages, null, 2), "utf8")
    return
  }

  const { error } = await supabase.from("garages").upsert(garageToRow(normalized), { onConflict: "id" })

  if (error) {
    throw new Error(`Failed to save garage: ${error.message}`)
  }
}

export async function deleteGarageById(id: string) {
  const supabase = getSupabaseAdminClient()

  if (!supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    assertWritableBackend()
    const garages = readLocalGarages().filter((garage) => garage.id !== id)
    await mkdir(path.dirname(garagesPath), { recursive: true })
    await writeFile(garagesPath, JSON.stringify(garages, null, 2), "utf8")
    return
  }

  const { error } = await supabase.from("garages").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete garage: ${error.message}`)
  }
}
