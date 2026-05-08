"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BedDouble, CheckCircle2, ChevronLeft, ChevronRight, Home, MessageCircle, Ruler, Wallet } from "lucide-react"
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
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {apartments.map((apartment) => {
          const images = getImages(apartment)

          return (
            <article
              key={apartment.id}
              className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <Image
                  src={images[0]}
                  alt={apartment.title}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {apartment.tag}
                </span>
                <span className="absolute right-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-bold text-emerald-900">
                  {getStatusLabel(apartment.status)}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-950">{apartment.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{apartment.location || "Тоонот Эко Хотхон"}</p>
                  </div>
                  <Home className="h-6 w-6 shrink-0 text-primary" />
                </div>

                <div className="mt-5 grid gap-3">
                  <Fact icon={Ruler} label="Талбай" value={apartment.area} />
                  <Fact icon={Wallet} label="1 м² үнэ" value={apartment.price} />
                  <Fact icon={BedDouble} label="Нийт үнэ" value={apartment.total} highlight />
                </div>

                <ApartmentDialog apartment={apartment} />
              </div>
            </article>
          )
        })}
      </div>

      <div id="price" className="mt-10 overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <h3 className="text-2xl font-bold text-slate-950">Үнэ, м² товч мэдээлэл</h3>
          <p className="mt-2 text-slate-600">Үнэ нь давхар, цонхны харц, төлбөрийн нөхцөлөөс хамаарч өөрчлөгдөж болно.</p>
        </div>
        <div className="grid divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
          {apartments.slice(0, 3).map((apartment) => (
            <div key={apartment.id} className="p-5 sm:p-6">
              <p className="text-sm font-medium text-slate-500">{apartment.title}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{apartment.price}</p>
              <p className="mt-1 text-sm text-slate-600">{apartment.area}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ApartmentDialog({ apartment }: { apartment: Apartment }) {
  const images = getImages(apartment)
  const [activeImage, setActiveImage] = useState(0)

  const goPrevious = () => setActiveImage((value) => (value === 0 ? images.length - 1 : value - 1))
  const goNext = () => setActiveImage((value) => (value === images.length - 1 ? 0 : value + 1))

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-6 w-full">
          <MessageCircle className="h-4 w-4" />
          Дэлгэрэнгүй харах
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92svh] overflow-y-auto p-0 sm:max-w-4xl">
        <div className="relative aspect-[16/10] min-h-[280px] bg-slate-950">
          <Image src={images[activeImage]} alt={apartment.title} fill sizes="(min-width: 768px) 896px, 100vw" className="object-contain" />
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
            <h4 className="font-bold text-slate-950">Layout мэдээлэл</h4>
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
