import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, Eye, MapPin, Ruler, Trees } from "lucide-react"
import { Button } from "@/components/ui/button"

const highlights = [
  { icon: Ruler, label: "Талбай", value: "38-86 м²" },
  { icon: Building2, label: "Блок", value: "3 блок" },
  { icon: Trees, label: "Орчин", value: "Ногоон бүс" },
]

export function Hero() {
  return (
    <section id="home" className="relative min-h-svh overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/images/zurag.jpg.png" alt="Тоонот Эко Хотхон" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,18,0.78)_0%,rgba(5,20,18,0.54)_48%,rgba(5,20,18,0.12)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1440px] items-center px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-4xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md">
            <MapPin className="h-4 w-4 text-emerald-300" />
            Улаанбаатар хотод байрлах modern eco apartment
          </p>

          <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] text-white text-balance sm:text-6xl lg:text-7xl">
            Тоонот Эко Хотхон
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
            Эрчим хүчний хэмнэлттэй, байгальд ээлтэй бизнес зэрэглэлийн орон сууцны төсөл. 2, 3 өрөө байрны үнэ,
            м² болон захиалгын мэдээллийг нэг дороос аваарай.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="h-12 rounded-md px-6 text-base font-bold sm:h-14">
              <Link href="#contact">
                Захиалга авах
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-md border-white/40 bg-white/10 px-6 text-base font-bold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white sm:h-14"
            >
              <Link href="#apartments">Байрны сонголт харах</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-md px-6 text-base font-bold shadow-lg shadow-emerald-950/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/25 sm:h-14"
            >
              <Link href="#vr-tour">
                <Eye className="h-5 w-5 transition-transform group-hover:scale-110" />
                3D VR үзэх
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/15 bg-black/28 p-4 shadow-lg backdrop-blur-md">
                <item.icon className="mb-3 h-5 w-5 text-emerald-300" />
                <p className="text-sm font-semibold text-white/65">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
