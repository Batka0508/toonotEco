import { getSupabaseAdminClient } from "@/lib/supabase"

export type ProjectLocation = {
  id: string
  name: string
  address: string
  latitude?: number | null
  longitude?: number | null
  mapEmbedUrl: string
}

type ProjectLocationRow = {
  id: string
  name: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  map_embed_url: string | null
}

export const defaultProjectLocation: ProjectLocation = {
  id: "toonot-eco",
  name: "Тоонот Эко хотхон",
  address: "Энд өөрийн бодит хаягаа оруул",
  latitude: null,
  longitude: null,
  mapEmbedUrl: "https://maps.google.com/maps?q=Ulaanbaatar%20Mongolia&t=&z=13&ie=UTF8&iwloc=&output=embed",
}

function projectLocationFromRow(row: ProjectLocationRow): ProjectLocation {
  return {
    id: row.id,
    name: row.name || defaultProjectLocation.name,
    address: row.address || defaultProjectLocation.address,
    latitude: row.latitude,
    longitude: row.longitude,
    mapEmbedUrl: row.map_embed_url || defaultProjectLocation.mapEmbedUrl,
  }
}

export async function getProjectLocation(): Promise<ProjectLocation> {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return defaultProjectLocation
  }

  const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: true }).limit(1).maybeSingle()

  if (error || !data) {
    return defaultProjectLocation
  }

  return projectLocationFromRow(data as ProjectLocationRow)
}
