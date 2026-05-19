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
  }, [activeFilter, garages])

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
    <section className="rounded-[1.35rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-6 lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">Гарааш худалдаа</p>
          <h2 className="text-3xl font-black tracking-tight text-white text-balance md:text-4xl">Дулаан зогсоолын сонголтууд</h2>
          <p className="mt-4 text-base leading-8 text-cyan-50/72">Таны автомашинд аюулгүй, дулаан, тохилог зогсоол.</p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-[1.1rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
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
                    ? "bg-emerald-400 text-white shadow-[0_0_24px_rgba(16,185,129,0.34)]"
                    : "bg-emerald-400/10 text-cyan-50 shadow-sm ring-1 ring-emerald-300/20 hover:bg-emerald-400/18",
                ].join(" ")}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative mt-8">
        <div ref={carouselRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {groupedGarages.map((group) => (
            <div
              key={group.block}
              className="w-[calc(100vw-2rem)] shrink-0 snap-start rounded-[1.35rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:w-[34rem] sm:p-3 lg:w-[54rem]"
            >
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-300">Гарааш блок</p>
                  <h3 className="text-xl font-black text-white">{group.block}</h3>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-100 shadow-sm ring-1 ring-emerald-300/20 backdrop-blur">
                  {group.garages.length} сонголт
                </span>
              </div>

              <GarageBlockCards garages={group.garages} onPreview={setPreviewGarage} onReserve={setSelectedGarage} />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
          <CarouselButton direction="previous" onClick={() => scrollCarousel("previous")} label="Өмнөх блок" />
          <CarouselButton direction="next" onClick={() => scrollCarousel("next")} label="Дараах блок" />
        </div>
      </div>

      <ReserveDialog garage={selectedGarage} onClose={() => setSelectedGarage(null)} onSubmit={handleReserveSubmit} />
      <PreviewDialog garage={previewGarage} onClose={() => setPreviewGarage(null)} onReserve={(garage) => {
        setSelectedGarage(garage)
        setPreviewGarage(null)
      }} />
    </section>
  )
}

function GarageBlockCards({ garages, onPreview, onReserve }: { garages: Garage[]; onPreview: (garage: Garage) => void; onReserve: (garage: Garage) => void }) {
  const cardsRef = useRef<HTMLDivElement | null>(null)

  const scrollCards = (direction: "previous" | "next") => {
    const carousel = cardsRef.current
    if (!carousel) return

    carousel.scrollBy({
      left: direction === "next" ? carousel.clientWidth * 0.92 : -carousel.clientWidth * 0.92,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative">
      <div ref={cardsRef} className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden">
        {garages.map((garage) => (
          <div key={garage.id} className="w-full shrink-0 snap-start sm:w-[19rem] lg:w-[16.25rem]">
            <GarageCard garage={garage} onPreview={onPreview} onReserve={onReserve} />
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-end gap-2 sm:mt-3">
        <SmallCarouselButton direction="previous" onClick={() => scrollCards("previous")} label="Өмнөх гарааш" />
        <SmallCarouselButton direction="next" onClick={() => scrollCards("next")} label="Дараах гарааш" />
      </div>
    </div>
  )
}

function GarageCard({ garage, onPreview, onReserve }: { garage: Garage; onPreview: (garage: Garage) => void; onReserve: (garage: Garage) => void }) {
  return (
    <article className="group relative flex h-full min-h-[21rem] overflow-hidden rounded-[1.35rem] border border-cyan-200/16 bg-cyan-100/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-emerald-300/[0.075] hover:shadow-[0_0_42px_rgba(16,185,129,0.16)] sm:min-h-[27rem]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/75 to-transparent" />
      <div className="flex w-full flex-col">
        <div className="relative min-h-[8.75rem] overflow-hidden bg-[radial-gradient(circle_at_15%_5%,rgba(255,255,255,0.14),transparent_8rem),linear-gradient(135deg,#020617_0%,#064e3b_58%,#10b981_100%)] p-3.5 text-white sm:min-h-[12.75rem] sm:p-5">
          <div className="pointer-events-none absolute -right-16 bottom-0 h-32 w-72 rounded-full bg-emerald-200/16 blur-2xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0_52%,rgba(255,255,255,0.10)_52%_64%,transparent_64%)]" />
          <div className="relative grid min-h-12 grid-cols-[1fr_auto] items-start gap-2 sm:min-h-14 sm:gap-3">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-black uppercase tracking-wide text-cyan-50/82 sm:text-xs">Гараашны дугаар</p>
              <h3 className="mt-1 truncate text-[1.35rem] font-black tracking-tight text-white drop-shadow-sm sm:mt-2 sm:text-3xl">{garage.number}</h3>
            </div>
            <span className={`inline-flex h-7 min-w-[4.75rem] shrink-0 items-center justify-center rounded-full border px-2 text-center text-[0.65rem] font-black shadow-lg backdrop-blur-md sm:h-9 sm:min-w-[5.75rem] sm:px-3 sm:text-xs ${statusClasses[garage.status]}`}>
              {statusLabels[garage.status]}
            </span>
          </div>
          <div className="relative mt-3 flex h-11 w-14 items-end justify-center text-emerald-200 sm:mt-6 sm:h-16 sm:w-20">
            <div className="absolute left-1/2 top-0 h-8 w-11 -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-emerald-300/90 [clip-path:polygon(50%_0,100%_34%,100%_100%,0_100%,0_34%)] shadow-[0_0_18px_rgba(16,185,129,0.38)] sm:h-12 sm:w-16" />
            <div className="relative flex h-8 w-10 items-center justify-center rounded-xl border border-emerald-200/25 bg-slate-950/20 backdrop-blur sm:h-11 sm:w-14">
              <Car className="h-5 w-5 text-emerald-200 drop-shadow-[0_0_10px_rgba(16,185,129,0.58)] sm:h-7 sm:w-7" />
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-3.5 sm:p-5">
          <div className="grid overflow-hidden rounded-[1.1rem] border border-cyan-100/10 bg-white/[0.045]">
            <GarageFact icon={Layers3} label="Давхар" value={garage.floor} />
            <GarageFact icon={Ruler} label="Талбай" value={garage.area} />
            <GarageFact icon={BadgeDollarSign} label="Үнэ" value={garage.price} />
          </div>

          <Button
            type="button"
            disabled={garage.status === "sold"}
            onClick={() => onReserve(garage)}
            className="mt-4 h-10 w-full rounded-xl border border-emerald-300/70 bg-emerald-400/10 text-sm font-black text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.18)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:text-emerald-950 hover:shadow-[0_0_34px_rgba(16,185,129,0.42)] disabled:border-slate-500/40 disabled:bg-slate-800/40 disabled:text-slate-500 disabled:shadow-none sm:mt-5 sm:h-12 sm:rounded-[1.1rem] sm:text-base"
          >
            Захиалах
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onPreview(garage)}
            className="mt-2 h-9 w-full rounded-xl border-transparent bg-transparent text-sm font-bold text-cyan-50/70 shadow-none transition-all hover:-translate-y-0.5 hover:bg-white/8 hover:text-white sm:h-10 sm:rounded-[1.1rem]"
          >
            <Eye className="h-4 w-4" />
            Харах
          </Button>
        </div>
      </div>
    </article>
  )
}

function ReserveDialog({ garage, onClose, onSubmit }: { garage: Garage | null; onClose: () => void; onSubmit: () => void }) {
  return (
    <Dialog open={!!garage} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-[1.35rem] border-emerald-900/10 sm:max-w-xl">
        {garage && (
          <>
            <DialogHeader>
              <p className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">Гарааш захиалга</p>
              <DialogTitle className="text-2xl font-black text-slate-950">{garage.number} гарааш</DialogTitle>
              <DialogDescription>Борлуулалтын баг таны хүсэлтийг хүлээн авч, дэлгэрэнгүй нөхцөлийг танилцуулна.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 rounded-[1.1rem] bg-emerald-50 p-4">
              <GarageFact icon={Layers3} label="Давхар" value={garage.floor} variant="light" />
              <GarageFact icon={Ruler} label="Талбай" value={garage.area} variant="light" />
              <GarageFact icon={BadgeDollarSign} label="Үнэ" value={garage.price} variant="light" />
            </div>

            <DialogFooter>
              <Button type="button" onClick={onSubmit} className="h-11 rounded-xl bg-emerald-700 px-6 font-bold text-white hover:bg-emerald-800">
                Захиалга өгөх
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PreviewDialog({ garage, onClose, onReserve }: { garage: Garage | null; onClose: () => void; onReserve: (garage: Garage) => void }) {
  return (
    <Dialog open={!!garage} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden rounded-[1.35rem] border-emerald-900/10 p-0 sm:max-w-3xl">
        {garage && (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>{garage.number} гараашны зураг</DialogTitle>
              <DialogDescription>{garage.block} гараашны дэлгэрэнгүй зураг</DialogDescription>
            </DialogHeader>
            <div className="relative aspect-[16/10] min-h-[240px] bg-slate-950">
              <Image src={garage.image} alt={`${garage.number} гараашны зураг`} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.86))] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wide text-emerald-300">{garage.block}</p>
                <h3 className="mt-1 text-2xl font-black">{garage.number} гарааш</h3>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <GarageFact icon={Layers3} label="Давхар" value={garage.floor} variant="light" />
              <GarageFact icon={Ruler} label="Талбай" value={garage.area} variant="light" />
              <GarageFact icon={BadgeDollarSign} label="Үнэ" value={garage.price} variant="light" />
            </div>
            <DialogFooter className="px-5 pb-5">
              <Button
                type="button"
                disabled={garage.status === "sold"}
                onClick={() => onReserve(garage)}
                className="h-11 rounded-xl bg-emerald-700 px-6 font-bold text-white hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-500"
              >
                Захиалах
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function GarageFact({ icon: Icon, label, value, variant = "dark" }: { icon: typeof Car; label: string; value: string; variant?: "dark" | "light" }) {
  const labelClass = variant === "light" ? "text-emerald-950/68" : "text-cyan-50/68"
  const valueClass = variant === "light" ? "text-emerald-950" : "text-white"
  const borderClass = variant === "light" ? "border-emerald-900/10" : "border-cyan-100/10"

  return (
    <div className={`flex min-h-10 items-center justify-between gap-3 border-b px-3 py-2 last:border-b-0 sm:min-h-12 sm:gap-4 sm:px-4 sm:py-3 ${borderClass}`}>
      <span className={`flex min-w-0 items-center gap-2 text-xs font-semibold sm:gap-2.5 sm:text-sm ${labelClass}`}>
        <Icon className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] sm:h-4 sm:w-4" />
        {label}
      </span>
      <span className={`text-right text-xs font-black sm:text-sm ${valueClass}`}>{value}</span>
    </div>
  )
}

function CarouselButton({ direction, onClick, label }: { direction: "previous" | "next"; onClick: () => void; label: string }) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight
  const offset = direction === "previous" ? "-ml-4 hover:-translate-x-0.5" : "-mr-4 hover:translate-x-0.5"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/35 bg-emerald-400/10 text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.16)] backdrop-blur-xl transition-all hover:scale-105 hover:bg-emerald-400 hover:text-emerald-950 ${offset}`}
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}

function SmallCarouselButton({ direction, onClick, label }: { direction: "previous" | "next"; onClick: () => void; label: string }) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight
  const motion = direction === "previous" ? "hover:-translate-x-0.5" : "hover:translate-x-0.5"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-emerald-100 shadow-sm backdrop-blur transition-all hover:bg-emerald-400 hover:text-emerald-950 sm:h-10 sm:w-10 ${motion}`}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
