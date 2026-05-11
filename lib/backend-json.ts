import { existsSync, readFileSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { getSupabaseAdminClient } from "@/lib/supabase"

const BUCKET_NAME = "site-content"

export function readLocalJson<T>(localPath: string, fallback: T): T {
  if (!existsSync(localPath)) {
    return fallback
  }

  try {
    return JSON.parse(readFileSync(localPath, "utf8")) as T
  } catch {
    return fallback
  }
}

export async function readBackendJson<T>(storagePath: string, localPath: string, fallback: T): Promise<T> {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return readLocalJson(localPath, fallback)
  }

  const { data, error } = await supabase.storage.from(BUCKET_NAME).download(storagePath)

  if (error || !data) {
    return readLocalJson(localPath, fallback)
  }

  try {
    return JSON.parse(await data.text()) as T
  } catch {
    return readLocalJson(localPath, fallback)
  }
}

export async function writeBackendJson<T>(storagePath: string, localPath: string, data: T) {
  const json = `${JSON.stringify(data, null, 2)}\n`
  const supabase = getSupabaseAdminClient()

  if (!supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await mkdir(path.dirname(localPath), { recursive: true })
    await writeFile(localPath, json, "utf8")
    return
  }

  const { error: bucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: false,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ["application/json"],
  })

  if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) {
    throw new Error(`Failed to prepare ${BUCKET_NAME}: ${bucketError.message}`)
  }

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, json, {
    contentType: "application/json",
    upsert: true,
  })

  if (error) {
    throw new Error(`Failed to save ${storagePath}: ${error.message}`)
  }
}
