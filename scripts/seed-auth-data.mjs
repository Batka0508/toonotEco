import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { createClient } from "@supabase/supabase-js"

function parseEnv(content) {
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separator = line.indexOf("=")
        return [line.slice(0, separator), line.slice(separator + 1)]
      }),
  )
}

async function readJsonOrDefault(path, fallback) {
  if (!existsSync(path)) {
    return `${JSON.stringify(fallback, null, 2)}\n`
  }

  return readFile(path, "utf8")
}

const env = parseEnv(await readFile(".env.local", "utf8"))
const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error("Missing Supabase URL or key in .env.local")
}

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

const bucket = "site-content"
const { error: bucketError } = await supabase.storage.createBucket(bucket, {
  public: false,
  fileSizeLimit: 1024 * 1024,
  allowedMimeTypes: ["application/json"],
})

if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) {
  throw new Error(`Failed to prepare ${bucket}: ${bucketError.message}`)
}

const files = [
  ["data/users.json", "auth/users.json", { users: [] }],
  ["data/password-reset-codes.json", "auth/password-reset-codes.json", { codes: [] }],
]

for (const [localPath, storagePath, fallback] of files) {
  const json = await readJsonOrDefault(localPath, fallback)
  const { error } = await supabase.storage.from(bucket).upload(storagePath, json, {
    contentType: "application/json",
    upsert: true,
  })

  if (error) {
    throw new Error(`Failed to upload ${storagePath}: ${error.message}`)
  }

  console.log(`Uploaded ${bucket}/${storagePath}`)
}
