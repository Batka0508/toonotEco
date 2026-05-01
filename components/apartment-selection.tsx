"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BedDouble, CheckCircle2, ChevronLeft, ChevronRight, Dumbbell, MessageCircle, Ruler, School, ShieldCheck, Trees, Wallet } from "lucide-react"
import type { Apartment } from "@/lib/site-content"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const apartmentDetails: Record<string, string[]> = {
  "two-room": [
    "Залуу гэр бүл болон анхны байр худалдан авагчдад тохиромжтой.",
    "Гэрэл сайтай, зай ашиглалт сайтай төлөвлөлттэй.",
    "Төлбөрийн нөхцөлийг борлуулалтын ажилтантай лавлана.",
  ],
  "three-room": [
    "Гэр бүлд зориулсан өргөн талбайтай сонголт.",
    "Зочны өрөө, унтлагын өрөөний зохион байгуулалт тав тухтай.",
    "Давхар болон цонхны харцаас хамаарч үнэ өөрчлөгдөж болно.",
  ],
  parking: [
    "Дулаан зогсоолын нэмэлт сонголт.",
    "Орон сууцтайгаа хамт авах боломжтой.",
    "Нарийвчилсан үнэ, сул зогсоолын мэдээллийг лавлана.",
  ],
}

const amenities = [
  { icon: Dumbbell, title: "Фитнес", text: "Оршин суугчдад зориулсан дасгалын хэсэг." },
  { icon: BedDouble, title: "Спорт заал", text: "Чөлөөт цаг, идэвхтэй хөдөлгөөнд тохиромжтой." },
  { icon: School, title: "Цэцэрлэг", text: "Хүүхэдтэй гэр бүлд ойр, өдөр тутамд амар." },
  { icon: Trees, title: "Ногоон талбай", text: "Алхах, амрах, хүүхэд тоглох орчинтой." },
  { icon: ShieldCheck, title: "Аюулгүй орчин", text: "Хяналттай, гэр бүлд ээлтэй төлөвлөлттэй." },
]

function getImages(apartment: Apartment) {
  const images = apartment.images?.filter(Boolean)
  return images?.length ? images : [apartment.image]
}

type ApartmentSelectionProps = {
  apartments: Apartment[]
}

export function ApartmentSelection({ apartments }: ApartmentSelectionProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {apartments.map((apartment) => {
          const images = getImages(apartment)

          return (
            <div
              key={apartment.id}
              className="group relative overflow-hidden rounded-lg border border-emerald-800/15 bg-card shadow-sm shadow-emerald-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/12"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={images[0]}
                  alt={apartment.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {apartment.tag}
                </div>
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    {images.length} зураг
                  </div>
                )}
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="mb-4 text-xl font-semibold text-foreground sm:text-2xl">{apartment.title}</h3>
                <ApartmentFacts apartment={apartment} />
                <div className="mt-5 flex flex-wrap gap-2">
                  {amenities.slice(0, 3).map((item) => (
                    <span key={item.title} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
                      {item.title}
                    </span>
                  ))}
                </div>
                <ApartmentDialog apartment={apartment} />
              </div>
            </div>
          )
        })}
      </div>

      <div id="price" className="mt-10 overflow-hidden rounded-lg border border-emerald-800/15 bg-card shadow-sm shadow-emerald-900/5 md:mt-12">
        <div className="border-b border-border p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-foreground sm:text-2xl">Үнийн товч мэдээлэл</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Үнэ нь сонгосон давхар, цонхны харц, төлбөрийн нөхцөлөөс хамаарч өөрчлөгдөж болно.
          </p>
        </div>
        <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {apartments.map((apartment) => (
            <div key={apartment.id} className="p-5 sm:p-6">
              <p className="text-sm text-muted-foreground">{apartment.title}</p>
              <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{apartment.price}</p>
              <p className="mt-1 text-sm text-muted-foreground">{apartment.area}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ApartmentFacts({ apartment }: { apartment: Apartment }) {
  return (
    <div className="space-y-3">
      <FactRow icon={Ruler} label="Талбай" value={apartment.area} />
      <FactRow icon={Wallet} label="1 м2 үнэ" value={apartment.price} />
      <FactRow icon={BedDouble} label="Нийт үнэ" value={apartment.total} highlight />
    </div>
  )
}

function ApartmentDialog({ apartment }: { apartment: Apartment }) {
  const details = apartmentDetails[apartment.id] ?? ["Дэлгэрэнгүй мэдээллийг борлуулалтын ажилтнаас лавлана."]
  const images = getImages(apartment)
  const [activeImage, setActiveImage] = useState(0)

  const goPrevious = () => setActiveImage((value) => (value === 0 ? images.length - 1 : value - 1))
  const goNext = () => setActiveImage((value) => (value === images.length - 1 ? 0 : value + 1))

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-6 w-full">
          <MessageCircle className="h-4 w-4" />
          Энэ сонголтыг лавлах
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen max-h-screen max-w-none gap-0 overflow-y-auto rounded-none border-0 bg-slate-950 p-0 shadow-none sm:max-w-none [&_[data-slot=dialog-close]]:text-white">
        <div className="relative h-[72vh] min-h-[420px] overflow-hidden bg-slate-950">
          <Image src={images[activeImage]} alt={apartment.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-contain" />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrevious}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
                aria-label="Өмнөх зураг"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
                aria-label="Дараах зураг"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 right-3 rounded bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                {activeImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-slate-950 px-5 py-3">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(index)}
                className={[
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition-colors",
                  activeImage === index ? "border-primary ring-2 ring-primary/25" : "border-emerald-900/10 hover:border-primary/40",
                ].join(" ")}
                aria-label={`${index + 1}-р зураг`}
              >
                <Image src={image} alt={`${apartment.title} ${index + 1}`} fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-6 bg-background p-5 sm:p-6">
          <DialogHeader>
            <p className="w-fit rounded bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{apartment.tag}</p>
            <DialogTitle className="text-2xl font-bold text-foreground">{apartment.title}</DialogTitle>
            <DialogDescription>Сонгосон байрны гол мэдээлэл, орчны боломж болон лавлагааны дэлгэрэнгүй.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-3">
            <InfoBox label="Талбай" value={apartment.area} />
            <InfoBox label="1 м2 үнэ" value={apartment.price} />
            <InfoBox label="Нийт үнэ" value={apartment.total} />
          </div>

          <div className="rounded-lg border border-emerald-900/10 bg-emerald-50/60 p-4">
            <h4 className="mb-3 font-semibold text-foreground">Тодорхой мэдээлэл</h4>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {details.map((detail) => (
                <li key={detail} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-foreground">Орчны боломжууд</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {amenities.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-lg border border-emerald-900/10 bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button asChild className="w-full sm:w-auto">
              <Link href="#contact">Холбоо барих хэсэг рүү очих</Link>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FactRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Ruler
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="grid gap-1 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </span>
      <span className={highlight ? "font-semibold text-primary" : "font-semibold text-foreground"}>{value}</span>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-900/10 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}
