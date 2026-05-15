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
  name: "Тоонот Эко apartment",
  address: "Тоонот Эко apartment",
  latitude: null,
  longitude: null,
  mapEmbedUrl: "https://maps.google.com/maps?q=%D0%A2%D0%BE%D0%BE%D0%BD%D0%BE%D1%82%20%D0%AD%D0%BA%D0%BE%20apartment&t=&z=15&ie=UTF8&iwloc=&output=embed",
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
