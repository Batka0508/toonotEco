"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BadgeDollarSign, Car, ChevronLeft, ChevronRight, Eye, Layers3, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Garage, GarageStatus } from "@/lib/garages"

type GarageFilter = "all" | "available"

const filters: Array<{ id: GarageFilter; label: string }> = [
  { id: "all", label: "Бүгд" },
  { id: "available", label: "Сул" },
]

const statusLabels: Record<GarageStatus, string> = {
  available: "Сул",
  reserved: "Захиалгатай",
  sold: "Зарагдсан",
}

const statusClasses: Record<GarageStatus, string> = {
  available: "bg-emerald-100 text-emerald-800 ring-emerald-600/15",
  reserved: "bg-amber-100 text-amber-800 ring-amber-600/15",
  sold: "bg-red-100 text-red-800 ring-red-600/15",
}

const garageBlocks: Garage["block"][] = ["A блок", "B блок", "C блок"]

export function GarageSales({ garages }: { garages: Garage[] }) {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [activeFilter, setActiveFilter] = useState<GarageFilter>("all")
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null)
  const [previewGarage, setPreviewGarage] = useState<Garage | null>(null)

  const filteredGarages = useMemo(() => {
    return garages.filter((garage) => {
      if (activeFilter === "available") return garage.status === "available"
      return true
    })
  }, [activeFilter])

  const groupedGarages = garageBlocks
    .map((block) => ({
      block,
      garages: filteredGarages.filter((garage) => garage.block === block),
    }))
    .filter((group) => group.garages.length > 0)

  const scrollCarousel = (direction: "previous" | "next") => {
    const carousel = carouselRef.current
    if (!carousel) return

    carousel.scrollBy({
      left: direction === "next" ? carousel.clientWidth * 0.9 : -carousel.clientWidth * 0.9,
      behavior: "smooth",
    })
  }

  return (
    <section className="mt-14 rounded-[2rem] border border-emerald-900/10 bg-white p-4 shadow-xl shadow-emerald-950/5 sm:mt-16 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-700">Дулаан зогсоол</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 text-balance md:text-4xl">Гарааш худалдаа</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">Таны автомашинд аюулгүй, дулаан, тохилог зогсоол</p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={[
                  "h-10 rounded-xl px-4 text-sm font-bold transition-all hover:-translate-y-0.5",
                  isActive
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                    : "bg-white text-emerald-900 shadow-sm hover:bg-emerald-100",
                ].join(" ")}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative mt-8">
        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {groupedGarages.map((group) => (
            <div
              key={group.block}
              className="w-[86vw] shrink-0 snap-start rounded-2xl border border-emerald-900/10 bg-slate-50/80 p-3 sm:w-[34rem] lg:w-[54rem]"
            >
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Гарааш блок</p>
                  <h3 className="text-xl font-black text-slate-950">{group.block}</h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-800 shadow-sm">
                  {group.garages.length} сонголт
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {group.garages.map((garage) => (
                  <GarageCard key={garage.id} garage={garage} onPreview={setPreviewGarage} onReserve={setSelectedGarage} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
          <button
            type="button"
            onClick={() => scrollCarousel("previous")}
            className="pointer-events-auto -ml-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 text-emerald-900 shadow-xl shadow-emerald-950/20 backdrop-blur transition-all hover:-translate-x-0.5 hover:scale-105 hover:bg-emerald-600 hover:text-white"
            aria-label="Өмнөх блок"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel("next")}
            className="pointer-events-auto -mr-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 text-emerald-900 shadow-xl shadow-emerald-950/20 backdrop-blur transition-all hover:translate-x-0.5 hover:scale-105 hover:bg-emerald-600 hover:text-white"
            aria-label="Дараах блок"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Dialog open={!!selectedGarage} onOpenChange={(open) => !open && setSelectedGarage(null)}>
        <DialogContent className="rounded-2xl border-emerald-900/10 sm:max-w-xl">
          {selectedGarage && (
            <>
              <DialogHeader>
                <p className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">Гарааш захиалга</p>
                <DialogTitle className="text-2xl font-black text-slate-950">{selectedGarage.number} гарааш</DialogTitle>
                <DialogDescription>Борлуулалтын баг таны хүсэлтийг хүлээн авч, дэлгэрэнгүй нөхцөлийг танилцуулна.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 rounded-2xl bg-emerald-50 p-4">
                <GarageFact icon={Layers3} label="Давхар" value={selectedGarage.floor} />
                <GarageFact icon={Ruler} label="Талбай" value={selectedGarage.area} />
                <GarageFact icon={BadgeDollarSign} label="Үнэ" value={selectedGarage.price} />
              </div>

              <DialogFooter>
                <Button asChild className="h-11 rounded-xl bg-emerald-700 px-6 font-bold text-white hover:bg-emerald-800">
                  <Link href="#contact" onClick={() => setSelectedGarage(null)}>
                    Contact form руу очих
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewGarage} onOpenChange={(open) => !open && setPreviewGarage(null)}>
        <DialogContent className="overflow-hidden rounded-2xl border-emerald-900/10 p-0 sm:max-w-3xl">
          {previewGarage && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{previewGarage.number} гараашны зураг</DialogTitle>
                <DialogDescription>{previewGarage.block} гараашны дэлгэрэнгүй зураг</DialogDescription>
              </DialogHeader>
              <div className="relative aspect-[16/10] min-h-[240px] bg-slate-950">
                <Image
                  src={previewGarage.image}
                  alt={`${previewGarage.number} гараашны зураг`}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.86))] p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-300">{previewGarage.block}</p>
                  <h3 className="mt-1 text-2xl font-black">{previewGarage.number} гарааш</h3>
                </div>
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-3">
                <GarageFact icon={Layers3} label="Давхар" value={previewGarage.floor} />
                <GarageFact icon={Ruler} label="Талбай" value={previewGarage.area} />
                <GarageFact icon={BadgeDollarSign} label="Үнэ" value={previewGarage.price} />
              </div>
              <DialogFooter className="px-5 pb-5">
                <Button
                  type="button"
                  disabled={previewGarage.status === "sold"}
                  onClick={() => {
                    setSelectedGarage(previewGarage)
                    setPreviewGarage(null)
                  }}
                  className="h-11 rounded-xl bg-emerald-700 px-6 font-bold text-white hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-500"
                >
                  Захиалах
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function GarageCard({ garage, onPreview, onReserve }: { garage: Garage; onPreview: (garage: Garage) => void; onReserve: (garage: Garage) => void }) {
  return (
    <article className="group flex h-full min-h-[25rem] overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10">
      <div className="flex w-full flex-col">
      <div className="relative min-h-[8.75rem] bg-[linear-gradient(135deg,#064e3b,#059669)] p-4 text-white">
        <div className="grid min-h-14 grid-cols-[1fr_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-100">Гараашны дугаар</p>
            <h3 className="mt-1 truncate text-2xl font-black">{garage.number}</h3>
          </div>
          <span className={`inline-flex h-7 min-w-[5.75rem] shrink-0 items-center justify-center rounded-full px-3 text-center text-xs font-black ring-1 ${statusClasses[garage.status]}`}>
            {statusLabels[garage.status]}
          </span>
        </div>
        <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
          <Car className="h-6 w-6" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="grid gap-2.5">
          <GarageFact icon={Layers3} label="Давхар" value={garage.floor} />
          <GarageFact icon={Ruler} label="Талбай" value={garage.area} />
          <GarageFact icon={BadgeDollarSign} label="Үнэ" value={garage.price} />
        </div>

        <Button
          type="button"
          disabled={garage.status === "sold"}
          onClick={() => onReserve(garage)}
          className="mt-auto h-11 w-full rounded-xl bg-slate-950 font-bold text-white shadow-lg shadow-slate-950/10 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
        >
          Захиалах
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onPreview(garage)}
          className="mt-2 h-11 w-full rounded-xl border-emerald-700/25 bg-white font-bold text-emerald-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900"
        >
          <Eye className="h-4 w-4" />
          Харах
        </Button>
      </div>
      </div>
    </article>
  )
}

function GarageFact({ icon: Icon, label, value }: { icon: typeof Car; label: string; value: string }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2.5">
      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-500">
        <Icon className="h-4 w-4 text-emerald-700" />
        {label}
      </span>
      <span className="text-right text-sm font-black text-slate-950">{value}</span>
    </div>
  )
}
