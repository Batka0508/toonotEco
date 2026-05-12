import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { assertWritableBackend } from "@/lib/backend-json"
import { getSupabaseAdminClient } from "@/lib/supabase"

const BUCKET_NAME = "property-images"

function safeSegment(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function ensureStorageBucket() {
  const supabase = getSupabaseAdminClient()

  if (!supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }

  const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  })

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw new Error(`Failed to prepare image bucket: ${error.message}`)
  }

  return supabase
}

export async function uploadPropertyImages(files: FormDataEntryValue[], prefix: string) {
  const uploadedImages: string[] = []
  const supabase = await ensureStorageBucket()

  for (const imageFile of files) {
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      continue
    }

    const extension = path.extname(imageFile.name) || ".jpg"
    const filename = `${safeSegment(prefix) || "property"}-${Date.now()}-${uploadedImages.length}${extension}`
    const buffer = Buffer.from(await imageFile.arrayBuffer())

    if (supabase) {
      const storagePath = `${safeSegment(prefix) || "property"}/${filename}`
      const { error } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, buffer, {
        contentType: imageFile.type || "image/jpeg",
        upsert: true,
      })

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`)
      }

      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath)
      uploadedImages.push(data.publicUrl)
      continue
    }

    assertWritableBackend()
    const publicPath = path.join(process.cwd(), "public", "images", filename)
    await mkdir(path.dirname(publicPath), { recursive: true })
    await writeFile(publicPath, buffer)
    uploadedImages.push(`/images/${filename}`)
  }

  return uploadedImages
}
