"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Banknote, BedDouble, Calculator, CheckCircle2, ChevronLeft, ChevronRight, GitCompare, Home, MessageCircle, Percent, Ruler, TrendingUp, Wallet } from "lucide-react"
import type { Apartment } from "@/lib/site-content"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

function getImages(apartment: Apartment) {
  const images = apartment.images?.filter(Boolean)
  return images?.length ? images : [apartment.image]
}

function getStatusLabel(status?: Apartment["status"]) {
  if (status === "sold") {
    return "Зарагдсан"
  }

  if (status === "reserved") {
    return "Захиалгатай"
  }

  return "Сул байгаа"
}

export function ApartmentSelection({ apartments }: { apartments: Apartment[] }) {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(apartments.slice(0, 2).map((apartment) => apartment.id))
  const compareApartments = apartments.filter((apartment) => selectedCompareIds.includes(apartment.id))

  const toggleCompare = (id: string) => {
    setSelectedCompareIds((value) => {
      if (value.includes(id)) {
        return value.filter((item) => item !== id)
      }

      return [...value, id].slice(-3)
    })
  }

  const scrollCarousel = (direction: "previous" | "next") => {
    const carousel = carouselRef.current
    if (!carousel) return

    const amount = carousel.clientWidth * 0.86
    carousel.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    })
  }

  return (
    <>
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {apartments.map((apartment) => {
            const images = getImages(apartment)

            return (
              <article
                key={apartment.id}
                className="w-[84vw] shrink-0 snap-start overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10 min-[420px]:w-[21rem] sm:w-[23rem] lg:w-[25rem]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={images[0]}
                    alt={apartment.title}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 368px, 88vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    {apartment.tag}
                  </span>
                  <span className="absolute right-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-bold text-emerald-900">
                    {getStatusLabel(apartment.status)}
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950 sm:text-2xl">{apartment.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{apartment.location || "Тоонот Эко Хотхон"}</p>
                    </div>
                    <Home className="h-6 w-6 shrink-0 text-primary" />
                  </div>

                  <div className="mt-5 grid gap-3">
                    <Fact icon={Ruler} label="Талбай" value={apartment.area} />
                    <Fact icon={Wallet} label="1 м² үнэ" value={apartment.price} />
                    <Fact icon={BedDouble} label="Нийт үнэ" value={apartment.total} highlight />
                  </div>

                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant={selectedCompareIds.includes(apartment.id) ? "default" : "outline"}
                      onClick={() => toggleCompare(apartment.id)}
                      className="w-full border-2 border-emerald-700/45 shadow-sm dark:border-emerald-300/45"
                    >
                      <GitCompare className="h-4 w-4" />
                      Харьцуулах
                    </Button>
                    <ApartmentDialog apartment={apartment} />
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
          <button
            type="button"
            onClick={() => scrollCarousel("previous")}
            className="pointer-events-auto -ml-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 shadow-lg shadow-emerald-950/15 transition-colors hover:bg-emerald-50 dark:border-white/15 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-slate-800"
            aria-label="Өмнөх байр"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel("next")}
            className="pointer-events-auto -mr-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 shadow-lg shadow-emerald-950/15 transition-colors hover:bg-emerald-50 dark:border-white/15 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-slate-800"
            aria-label="Дараах байр"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <PriceCalculator />
      <CompareApartments apartments={compareApartments} />
    </>
  )
}

function ApartmentDialog({ apartment }: { apartment: Apartment }) {
  const images = getImages(apartment)
  const [activeImage, setActiveImage] = useState(0)
  const activeImageUrl = images[activeImage]?.replace(/"/g, "%22") ?? "/placeholder.jpg"

  const goPrevious = () => setActiveImage((value) => (value === 0 ? images.length - 1 : value - 1))
  const goNext = () => setActiveImage((value) => (value === images.length - 1 ? 0 : value + 1))

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <MessageCircle className="h-4 w-4" />
          Дэлгэрэнгүй харах
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92svh] w-[calc(100vw-1rem)] overflow-y-auto p-0 sm:max-w-4xl">
        <div className="relative aspect-[4/3] min-h-[220px] bg-slate-950 sm:aspect-[16/10] sm:min-h-[280px]">
          <div
            role="img"
            aria-label={apartment.title}
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${activeImageUrl}")` }}
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrevious}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75"
                aria-label="Өмнөх зураг"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75"
                aria-label="Дараах зураг"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="grid gap-5 p-5 sm:p-6">
          <DialogHeader>
            <p className="w-fit rounded-md bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{apartment.tag}</p>
            <DialogTitle className="text-2xl font-bold text-slate-950">{apartment.title}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-3">
            <InfoBox label="Талбай" value={apartment.area} />
            <InfoBox label="Үнэ" value={apartment.price} />
            <InfoBox label="Нийт" value={apartment.total} />
          </div>

          <div className="rounded-lg border border-emerald-900/10 bg-emerald-50 p-4">
            <h4 className="font-bold text-slate-950">План зургийн мэдээлэл</h4>
            <ul className="mt-3 grid gap-2 text-sm leading-7 text-slate-700">
              {(apartment.amenities?.length ? apartment.amenities : ["Зөв зохион байгуулалт", "Гэрэл сайн тусах цонх", "Төлбөрийн нөхцөл лавлах боломжтой"]).map(
                (item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <DialogFooter>
            <Button asChild className="w-full sm:w-auto">
              <Link href="#contact">Захиалга өгөх</Link>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const calculatorApartments = [
  { id: "two-room", title: "2 өрөө байр" },
  { id: "three-room", title: "3 өрөө байр" },
]

function PriceCalculator() {
  const [apartmentId, setApartmentId] = useState(calculatorApartments[0].id)
  const [area, setArea] = useState(50)
  const [pricePerSquare, setPricePerSquare] = useState(3200000)
  const [downPayment, setDownPayment] = useState(30)
  const [months, setMonths] = useState(120)

  const apartment = calculatorApartments.find((item) => item.id === apartmentId)
  const total = area * pricePerSquare
  const loan = total * (1 - downPayment / 100)
  const monthly = months > 0 ? loan / months : 0

  return (
    <section className="mt-8 rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm shadow-emerald-900/5 sm:mt-10 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-950 sm:text-2xl">Үнэ тооцоолуур</h3>
          <p className="mt-1 text-sm text-slate-600">Ойролцоогоор төлбөрийн зураг гаргана.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Байр
            <select value={apartmentId} onChange={(event) => setApartmentId(event.target.value)} className="h-10 rounded-md border-2 border-emerald-700/45 bg-white px-3 text-sm shadow-sm outline-none transition-colors focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:border-emerald-300/45">
              {calculatorApartments.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </label>
          <NumberField label="Талбай м²" value={area} min={20} max={200} step={1} onChange={setArea} />
          <NumberField label="1 м² үнэ" value={pricePerSquare} min={1000000} max={10000000} step={50000} onChange={setPricePerSquare} />
          <NumberField label="Урьдчилгаа %" value={downPayment} min={0} max={100} step={5} onChange={setDownPayment} />
          <NumberField label="Хугацаа / сар" value={months} min={1} max={360} step={12} onChange={setMonths} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <CalcMetricCard
            title="Нийт үнэ"
            value={formatMoney(total)}
            note={apartment?.title ?? "Сонгосон байр"}
            icon={Banknote}
            tone="dark"
          />
          <CalcMetricCard
            title="Урьдчилгаа"
            value={formatMoney(total * (downPayment / 100))}
            note={`${downPayment}% төлбөр`}
            icon={Percent}
            accent="text-blue-600"
          />
          <CalcMetricCard
            title="Зээлийн дүн"
            value={formatMoney(loan)}
            note={`${months} сарын хугацаа`}
            icon={Wallet}
            accent="text-amber-500"
          />
          <CalcMetricCard
            title="Сарын төлөлт"
            value={formatMoney(monthly)}
            note="Ойролцоогоор"
            icon={TrendingUp}
            accent="text-emerald-600"
          />
        </div>
      </div>
    </section>
  )
}

function CompareApartments({ apartments }: { apartments: Apartment[] }) {
  if (apartments.length === 0) {
    return null
  }

  return (
    <section className="mt-8 overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 sm:mt-10">
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950 sm:text-2xl">
          <GitCompare className="h-5 w-5 text-primary" />
          Байр харьцуулах
        </h3>
        <p className="mt-2 text-sm text-slate-600">Дээд талын “Харьцуулах” товчоор 3 хүртэл байр сонгоно.</p>
      </div>
      <div className="grid divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
        {apartments.map((apartment) => (
          <div key={apartment.id} className="grid gap-3 p-5 sm:p-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={getImages(apartment)[0]}
                alt={apartment.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-xs font-bold text-white">
                {apartment.tag || getStatusLabel(apartment.status)}
              </span>
            </div>
            <p className="text-lg font-bold text-slate-950">{apartment.title}</p>
            <InfoBox label="Талбай" value={apartment.area} />
            <InfoBox label="Үнэ" value={apartment.price} />
            <InfoBox label="Нийт" value={apartment.total} />
            <InfoBox label="Төлөв" value={getStatusLabel(apartment.status)} />
          </div>
        ))}
      </div>
    </section>
  )
}

function NumberField({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-10 rounded-md border-2 border-emerald-700/45 bg-white px-3 text-sm shadow-sm outline-none transition-colors focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:border-emerald-300/45"
      />
    </label>
  )
}

function CalcMetricCard({
  title,
  value,
  note,
  icon: Icon,
  tone,
  accent = "text-sky-600",
}: {
  title: string
  value: string
  note: string
  icon: typeof Wallet
  tone?: "dark"
  accent?: string
}) {
  const dark = tone === "dark"

  return (
    <div
      className={[
        "min-h-[10.5rem] rounded-2xl border p-4 shadow-sm",
        dark
          ? "border-slate-950 bg-slate-900 text-white shadow-slate-900/20"
          : "border-slate-200 bg-[#f0eef8] text-slate-950 shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className={dark ? "max-w-[8rem] text-lg font-black leading-tight text-white" : "max-w-[8rem] text-lg font-black leading-tight text-slate-950 dark:text-white"}>
          {title}
        </h4>
        <Icon className={dark ? "h-8 w-8 text-lime-300" : `h-8 w-8 ${accent}`} />
      </div>

      <div className="mt-6 flex justify-end">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">
          ↑ 100.0%
        </span>
      </div>

      <p className={dark ? "mt-3 text-right text-2xl font-black text-lime-300" : `mt-3 text-right text-2xl font-black ${accent}`}>
        {value}
      </p>

      <div className={dark ? "mt-4 border-t border-white/70 pt-3 text-right text-sm font-bold text-white" : "mt-4 border-t border-slate-200 pt-3 text-right text-sm font-bold text-slate-950 dark:border-white/10 dark:text-white"}>
        {note}
      </div>
    </div>
  )
}

function formatMoney(value: number) {
  return `${Math.round(value).toLocaleString("mn-MN")} ₮`
}

function Fact({ icon: Icon, label, value, highlight }: { icon: typeof Ruler; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </span>
      <span className={highlight ? "font-bold text-primary" : "font-bold text-slate-950"}>{value}</span>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
    </div>
  )
}
