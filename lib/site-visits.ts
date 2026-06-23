import { existsSync, readFileSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { assertWritableBackend, canWriteLocalFiles } from "@/lib/backend-json"
import { getSupabaseAdminClient, isSupabaseNetworkError } from "@/lib/supabase"

const BUCKET_NAME = "site-content"
const STORAGE_PATH = "analytics/site-visits.json"
const MAX_VISITS = 5000
const ACTIVE_WINDOW_MS = 75 * 1000

export type SiteVisit = {
  id: string
  visitorId: string
  path: string
  referrer: string
  userAgent: string
  createdAt: string
}

export type SiteVisitStats = {
  totalVisits: number
  todayVisits: number
  todayUniqueVisitors: number
  activeVisitors: number
  recentVisits: SiteVisit[]
  topPages: { path: string; visits: number }[]
}

type SiteVisitsData = {
  visits: SiteVisit[]
}

const visitsPath = path.join(process.cwd(), "data", "site-visits.json")

function createVisitId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `visit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function emptyData(): SiteVisitsData {
  return { visits: [] }
}

function readLocalVisits(): SiteVisitsData {
  if (!existsSync(visitsPath)) {
    return emptyData()
  }

  try {
    const data = JSON.parse(readFileSync(visitsPath, "utf8")) as SiteVisitsData
    return { visits: Array.isArray(data.visits) ? data.visits : [] }
  } catch {
    return emptyData()
  }
}

async function writeLocalVisits(data: SiteVisitsData) {
  assertWritableBackend()
  await mkdir(path.dirname(visitsPath), { recursive: true })
  await writeFile(visitsPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

async function tryWriteLocalVisits(data: SiteVisitsData) {
  try {
    await writeLocalVisits(data)
    return true
  } catch (error) {
    console.error(
      "Failed to persist site visits locally. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in production.",
      error,
    )
    return false
  }
}

async function readVisitsData(): Promise<SiteVisitsData> {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return readLocalVisits()
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(STORAGE_PATH)

    if (error || !data) {
      return readLocalVisits()
    }

    const parsed = JSON.parse(await data.text()) as SiteVisitsData
    return { visits: Array.isArray(parsed.visits) ? parsed.visits : [] }
  } catch (error) {
    if (!isSupabaseNetworkError(error)) {
      console.error("Failed to load site visits", error)
    }
    return readLocalVisits()
  }
}

async function writeVisitsData(data: SiteVisitsData) {
  const visits = data.visits
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, MAX_VISITS)
  const nextData = { visits }
  const supabase = getSupabaseAdminClient()

  if (!supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await tryWriteLocalVisits(nextData)
    return
  }

  try {
    const { error: bucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
      fileSizeLimit: 1024 * 1024,
      allowedMimeTypes: ["application/json"],
    })

    if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) {
      throw new Error(`Failed to prepare ${BUCKET_NAME}: ${bucketError.message}`)
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(STORAGE_PATH, JSON.stringify(nextData, null, 2), {
      contentType: "application/json",
      upsert: true,
    })

    if (error) {
      throw new Error(`Failed to save site visits: ${error.message}`)
    }

    if (canWriteLocalFiles()) {
      await writeLocalVisits(nextData)
    }
  } catch (error) {
    if (isSupabaseNetworkError(error)) {
      await tryWriteLocalVisits(nextData)
      return
    }

    throw error
  }
}

function cleanPath(value: string) {
  const pathOnly = value.split("?")[0] || "/"
  return pathOnly.startsWith("/") ? pathOnly.slice(0, 120) : "/"
}

function shouldTrackPath(pathValue: string) {
  return (
    pathValue !== "/admin" &&
    !pathValue.startsWith("/admin/") &&
    !pathValue.startsWith("/api/") &&
    !pathValue.startsWith("/_next/") &&
    !pathValue.includes(".")
  )
}

async function updateActiveVisitor(input: { visitorId: string; path: string; referrer?: string; userAgent?: string }) {
  const supabase = getSupabaseAdminClient()

  if (!supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return
  }

  const now = new Date().toISOString()

  try {
    await supabase.from("site_visitors").upsert(
      {
        visitor_id: input.visitorId.slice(0, 80),
        path: input.path,
        referrer: (input.referrer ?? "").slice(0, 180),
        user_agent: (input.userAgent ?? "").slice(0, 220),
        first_seen_at: now,
        last_seen_at: now,
      },
      { onConflict: "visitor_id" },
    )
  } catch (error) {
    if (!isSupabaseNetworkError(error)) {
      console.error("Failed to update active visitor", error)
    }
  }
}

async function getActiveVisitorCountFromSupabase(now: Date) {
  const supabase = getSupabaseAdminClient()

  if (!supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }

  const since = new Date(now.getTime() - ACTIVE_WINDOW_MS).toISOString()

  try {
    const { count, error } = await supabase
      .from("site_visitors")
      .select("visitor_id", { count: "exact", head: true })
      .gte("last_seen_at", since)

    if (error) {
      console.error("Failed to count active visitors", error)
      return null
    }

    return count ?? 0
  } catch (error) {
    if (!isSupabaseNetworkError(error)) {
      console.error("Failed to count active visitors", error)
    }
    return null
  }
}

export async function trackSiteVisit(input: { visitorId: string; path: string; referrer?: string; userAgent?: string; recordVisit?: boolean }) {
  const pathValue = cleanPath(input.path)

  if (!input.visitorId || !shouldTrackPath(pathValue)) {
    return
  }

  await updateActiveVisitor({ ...input, path: pathValue })

  if (input.recordVisit === false) {
    return
  }

  const data = await readVisitsData()
  const now = new Date().toISOString()
  const recentDuplicate = data.visits.find((visit) => {
    if (visit.visitorId !== input.visitorId || visit.path !== pathValue) {
      return false
    }

    return Date.now() - new Date(visit.createdAt).getTime() < 60_000
  })

  if (recentDuplicate) {
    return
  }

  data.visits.unshift({
    id: createVisitId(),
    visitorId: input.visitorId.slice(0, 80),
    path: pathValue,
    referrer: (input.referrer ?? "").slice(0, 180),
    userAgent: (input.userAgent ?? "").slice(0, 220),
    createdAt: now,
  })

  await writeVisitsData(data)
}

function isToday(date: Date, now: Date) {
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export async function getSiteVisitStats(): Promise<SiteVisitStats> {
  const data = await readVisitsData()
  const now = new Date()
  const todayVisitors = new Set<string>()
  const activeVisitorIds = new Set<string>()
  const pageCounts = new Map<string, number>()
  let todayVisits = 0
  const activeVisitorCount = await getActiveVisitorCountFromSupabase(now)

  for (const visit of data.visits) {
    const createdAt = new Date(visit.createdAt)

    if (isToday(createdAt, now)) {
      todayVisits += 1
      todayVisitors.add(visit.visitorId)
    }

    if (now.getTime() - createdAt.getTime() <= ACTIVE_WINDOW_MS) {
      activeVisitorIds.add(visit.visitorId)
    }

    pageCounts.set(visit.path, (pageCounts.get(visit.path) ?? 0) + 1)
  }

  return {
    totalVisits: data.visits.length,
    todayVisits,
    todayUniqueVisitors: todayVisitors.size,
    activeVisitors: activeVisitorCount ?? activeVisitorIds.size,
    recentVisits: data.visits.slice(0, 10),
    topPages: [...pageCounts.entries()]
      .map(([path, visits]) => ({ path, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 6),
  }
}
