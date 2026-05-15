"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
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
  available: "border-emerald-300/35 bg-emerald-400/18 text-emerald-100 shadow-emerald-400/20",
  reserved: "border-amber-300/45 bg-amber-300/18 text-amber-100 shadow-amber-300/20",
  sold: "border-rose-300/35 bg-rose-400/18 text-rose-100 shadow-rose-400/20",
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

  const handleReserveSubmit = () => {
    setSelectedGarage(null)
    window.setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 120)
  }

  return (
    <section className="rounded-[2rem] border border-cyan-100/15 bg-slate-950/30 p-4 shadow-2xl shadow-slate-950/25 backdrop-blur-xl sm:p-6 lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-sky-300">Дулаан зогсоол</p>
          <h2 className="text-3xl font-black tracking-tight text-white text-balance md:text-4xl">Гарааш худалдаа</h2>
          <p className="mt-4 text-base leading-8 text-cyan-50/75">Таны автомашинд аюулгүй, дулаан, тохилог зогсоол</p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-cyan-100/15 bg-white/10 p-2 shadow-sm backdrop-blur">
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
                    ? "bg-[#0ea5e9] text-white shadow-lg shadow-sky-950/25"
                    : "bg-sky-500/20 text-white shadow-sm ring-1 ring-sky-300/20 hover:bg-sky-500/30",
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
              className="w-[86vw] shrink-0 snap-start rounded-2xl border border-white/15 bg-black/45 p-3 shadow-lg shadow-slate-950/15 backdrop-blur sm:w-[34rem] lg:w-[54rem]"
            >
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-sky-200">Гарааш блок</p>
                  <h3 className="text-xl font-black text-white">{group.block}</h3>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white shadow-sm ring-1 ring-white/15 backdrop-blur">
                  {group.garages.length} сонголт
                </span>
              </div>

              <GarageBlockCards garages={group.garages} onPreview={setPreviewGarage} onReserve={setSelectedGarage} />
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
                <Button type="button" onClick={handleReserveSubmit} className="h-11 rounded-xl bg-emerald-700 px-6 font-bold text-white hover:bg-emerald-800">
                  Захиалга өгөх
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

function GarageBlockCards({ garages, onPreview, onReserve }: { garages: Garage[]; onPreview: (garage: Garage) => void; onReserve: (garage: Garage) => void }) {
  const cardsRef = useRef<HTMLDivElement | null>(null)
  const hasCarousel = garages.length > 3

  const scrollCards = (direction: "previous" | "next") => {
    const carousel = cardsRef.current
    if (!carousel) return

    carousel.scrollBy({
      left: direction === "next" ? carousel.clientWidth * 0.92 : -carousel.clientWidth * 0.92,
      behavior: "smooth",
    })
  }

  if (!hasCarousel) {
    return (
      <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3">
        {garages.map((garage) => (
          <GarageCard key={garage.id} garage={garage} onPreview={onPreview} onReserve={onReserve} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={cardsRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {garages.map((garage) => (
          <div key={garage.id} className="w-[68vw] max-w-[16.5rem] shrink-0 snap-start sm:w-[19rem] sm:max-w-none lg:w-[16.25rem]">
            <GarageCard garage={garage} onPreview={onPreview} onReserve={onReserve} />
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollCards("previous")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-100/20 bg-white/10 text-white shadow-sm backdrop-blur transition-all hover:-translate-x-0.5 hover:bg-cyan-400 hover:text-slate-950"
          aria-label="Өмнөх гарааш"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollCards("next")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-100/20 bg-white/10 text-white shadow-sm backdrop-blur transition-all hover:translate-x-0.5 hover:bg-cyan-400 hover:text-slate-950"
          aria-label="Дараах гарааш"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function GarageCard({ garage, onPreview, onReserve }: { garage: Garage; onPreview: (garage: Garage) => void; onReserve: (garage: Garage) => void }) {
  return (
    <article className="group relative flex h-full min-h-[22.5rem] overflow-hidden rounded-2xl border border-cyan-200/18 bg-slate-950/62 shadow-2xl shadow-slate-950/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.012] hover:border-cyan-300/45 hover:shadow-[0_24px_70px_rgba(8,47,73,0.55)] sm:min-h-[27rem] sm:rounded-[28px]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/75 to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/12 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-24 left-6 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="flex w-full flex-col">
        <div className="relative min-h-[9.75rem] overflow-hidden bg-[radial-gradient(circle_at_15%_5%,rgba(255,255,255,0.22),transparent_8rem),linear-gradient(135deg,#05243f_0%,#075569_48%,#04c7b6_100%)] p-4 text-white sm:min-h-[12.75rem] sm:p-5">
          <div className="pointer-events-none absolute -right-16 bottom-0 h-32 w-72 rounded-full bg-cyan-200/16 blur-2xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0_52%,rgba(255,255,255,0.10)_52%_64%,transparent_64%)]" />
          <div className="relative grid min-h-12 grid-cols-[1fr_auto] items-start gap-2 sm:min-h-14 sm:gap-3">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-black uppercase tracking-wide text-cyan-50/82 sm:text-xs">Гараашны дугаар</p>
              <h3 className="mt-1.5 truncate text-2xl font-black tracking-tight text-white drop-shadow-sm sm:mt-2 sm:text-3xl">{garage.number}</h3>
            </div>
            <span className={`inline-flex h-7 min-w-[4.75rem] shrink-0 items-center justify-center rounded-full border px-2 text-center text-[0.65rem] font-black shadow-lg backdrop-blur-md sm:h-9 sm:min-w-[5.75rem] sm:px-3 sm:text-xs ${statusClasses[garage.status]}`}>
              {statusLabels[garage.status]}
            </span>
          </div>
          <div className="relative mt-4 flex h-12 w-16 items-end justify-center text-cyan-200 sm:mt-6 sm:h-16 sm:w-20">
            <div className="absolute left-1/2 top-0 h-9 w-12 -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-cyan-300/90 [clip-path:polygon(50%_0,100%_34%,100%_100%,0_100%,0_34%)] shadow-[0_0_18px_rgba(34,211,238,0.35)] sm:h-12 sm:w-16" />
            <div className="relative flex h-9 w-11 items-center justify-center rounded-xl border border-cyan-200/25 bg-slate-950/20 backdrop-blur sm:h-11 sm:w-14">
              <Car className="h-5 w-5 text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.55)] sm:h-7 sm:w-7" />
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-4 sm:p-5">
          <div className="grid overflow-hidden rounded-2xl border border-cyan-100/10 bg-white/[0.045]">
            <GarageFact icon={Layers3} label="Давхар" value={garage.floor} />
            <GarageFact icon={Ruler} label="Талбай" value={garage.area} />
            <GarageFact icon={BadgeDollarSign} label="Үнэ" value={garage.price} />
          </div>

          <Button
            type="button"
            disabled={garage.status === "sold"}
            onClick={() => onReserve(garage)}
            className="mt-4 h-10 w-full rounded-xl border border-cyan-300/70 bg-cyan-300/10 text-sm font-black text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-cyan-300 hover:text-slate-950 hover:shadow-[0_0_34px_rgba(34,211,238,0.45)] disabled:border-slate-500/40 disabled:bg-slate-800/40 disabled:text-slate-500 disabled:shadow-none sm:mt-5 sm:h-12 sm:rounded-2xl sm:text-base"
          >
            Захиалах
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onPreview(garage)}
            className="mt-2 h-9 w-full rounded-xl border-transparent bg-transparent text-sm font-bold text-cyan-50/70 shadow-none transition-all hover:-translate-y-0.5 hover:bg-white/8 hover:text-white sm:h-10 sm:rounded-2xl"
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
    <div className="flex min-h-10 items-center justify-between gap-3 border-b border-cyan-100/10 px-3 py-2 last:border-b-0 sm:min-h-12 sm:gap-4 sm:px-4 sm:py-3">
      <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-cyan-50/68 sm:gap-2.5 sm:text-sm">
        <Icon className="h-3.5 w-3.5 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.45)] sm:h-4 sm:w-4" />
        {label}
      </span>
      <span className="text-right text-xs font-black text-white sm:text-sm">{value}</span>
    </div>
  )
}
