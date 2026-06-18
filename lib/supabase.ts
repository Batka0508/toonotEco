import { createClient } from "@supabase/supabase-js"

const SUPABASE_FETCH_TIMEOUT_MS = 2000
const SUPABASE_RETRY_AFTER_MS = 60_000
let supabaseUnavailableUntil = 0

function isPlaceholder(value?: string) {
  return !value || value.includes("your-project") || value.startsWith("your-")
}

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), SUPABASE_FETCH_TIMEOUT_MS)

  return fetch(input, {
    ...init,
    signal: controller.signal,
  })
    .catch((error) => {
      if (isSupabaseNetworkError(error)) {
        supabaseUnavailableUntil = Date.now() + SUPABASE_RETRY_AFTER_MS
      }

      throw error
    })
    .finally(() => clearTimeout(timeout))
}

export function isSupabaseNetworkError(error: unknown) {
  const details = typeof (error as { details?: unknown })?.details === "string" ? (error as { details: string }).details : ""
  const message = typeof (error as { message?: unknown })?.message === "string" ? (error as { message: string }).message : ""
  const text = `${message}\n${details}`.toLowerCase()

  return (
    text.includes("fetch failed") ||
    text.includes("eacces") ||
    text.includes("aborterror") ||
    text.includes("the operation was aborted")
  )
}

export function getSupabaseAdminClient() {
  if (Date.now() < supabaseUnavailableUntil) {
    return null
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key || isPlaceholder(url) || isPlaceholder(key)) {
    return null
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: fetchWithTimeout,
    },
  })
}
