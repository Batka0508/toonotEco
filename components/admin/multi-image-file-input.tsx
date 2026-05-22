"use client"

import { useRef, useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type SelectedImage = {
  id: string
  name: string
  size: number
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function MultiImageFileInput() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dataTransferRef = useRef<DataTransfer | null>(null)
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])

  const syncSelectedImages = () => {
    const files = Array.from(dataTransferRef.current?.files ?? [])
    setSelectedImages(
      files.map((file, index) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
        name: file.name,
        size: file.size,
      })),
    )
  }

  const ensureDataTransfer = () => {
    if (!dataTransferRef.current) {
      dataTransferRef.current = new DataTransfer()
    }

    return dataTransferRef.current
  }

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0 || !inputRef.current) {
      return
    }

    const dataTransfer = ensureDataTransfer()

    Array.from(files).forEach((file) => {
      const alreadySelected = Array.from(dataTransfer.files).some(
        (item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified,
      )

      if (!alreadySelected) {
        dataTransfer.items.add(file)
      }
    })

    inputRef.current.files = dataTransfer.files
    syncSelectedImages()
  }

  const removeFile = (removeIndex: number) => {
    if (!inputRef.current) {
      return
    }

    const nextDataTransfer = new DataTransfer()
    Array.from(dataTransferRef.current?.files ?? []).forEach((file, index) => {
      if (index !== removeIndex) {
        nextDataTransfer.items.add(file)
      }
    })

    dataTransferRef.current = nextDataTransfer
    inputRef.current.files = nextDataTransfer.files
    syncSelectedImages()
  }

  return (
    <div className="grid gap-3">
      <input
        ref={inputRef}
        name="imageFiles"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => handleFilesSelected(event.currentTarget.files)}
      />
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full justify-center rounded-lg border-emerald-700/35 bg-white font-bold text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 sm:w-fit"
        onClick={() => inputRef.current?.click()}
      >
        <ImagePlus className="h-4 w-4" />
        Зураг сонгох
      </Button>

      {selectedImages.length > 0 && (
        <div className="grid gap-2 rounded-md border border-emerald-200 bg-white p-3">
          <p className="text-xs font-bold text-emerald-900">{selectedImages.length} зураг сонгогдсон</p>
          <div className="grid gap-2">
            {selectedImages.map((file, index) => (
              <div key={file.id} className="flex min-w-0 items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm">
                <span className="min-w-0 truncate text-slate-700">
                  {file.name} <span className="text-slate-400">({formatFileSize(file.size)})</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  aria-label={`${file.name} хасах`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
