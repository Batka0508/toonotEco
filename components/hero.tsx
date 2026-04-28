import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, Calculator, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const highlights = [
  { label: "1 м² үнэ", value: "3.2 саяас" },
  { label: "Сонголт", value: "42-86 м²" },
  { label: "Ашиглалт", value: "2026 он" },
]

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/zurag.jpg.png"
          alt="Тоонот Эко Хотхон"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.38)_48%,rgba(0,0,0,0.1)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] items-center px-4 py-16 md:py-20">
        <div className="max-w-4xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-md">
            <Building2 className="h-4 w-4" />
            Орон сууцны борлуулалт эхэллээ
          </p>
          <h1 className="mb-6 max-w-3xl font-serif text-5xl font-bold leading-[1.04] text-white text-balance md:text-6xl lg:text-7xl">
            Тоонот Эко Хотхон
          </h1>
          <p className="mb-8 max-w-3xl text-lg leading-8 text-white/90 md:text-2xl md:leading-10">
            Ногоон орчин, зөв төлөвлөлт, гэр бүлд ээлтэй байршилтай орон сууцны сонголтууд.
            Үнэ, м², зураг болон байршлын мэдээллийг нэг дороос аваарай.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-md px-6 text-base font-semibold shadow-xl shadow-black/20">
              <Link href="#apartments">
                Байрны сонголт үзэх
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-md border-white/40 bg-white/8 px-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
            >
              <Link href="#contact">
                <Phone className="mr-2 h-5 w-5" />
                Зөвлөгөө авах
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/15 bg-black/30 p-5 shadow-lg shadow-black/10 backdrop-blur-md">
                <p className="text-sm text-white/70">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 text-sm text-white/80 sm:flex-row sm:items-center">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Улаанбаатар хот, хотын төвд ойр байршил
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
            <Link href="#price" className="inline-flex items-center gap-2 font-semibold text-white hover:text-primary">
              <Calculator className="h-4 w-4" />
              Үнийн хүснэгт харах
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
