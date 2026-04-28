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
    <section id="home" className="relative min-h-svh overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/zurag.jpg.png"
          alt="Тоонот Эко Хотхон"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.42)_55%,rgba(0,0,0,0.16)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] items-center px-4 py-12 sm:py-16 md:min-h-[calc(100svh-5rem)] md:py-20">
        <div className="w-full max-w-4xl">
          <p className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-black/30 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-md sm:mb-6 sm:px-5 sm:text-sm">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">Орон сууцны борлуулалт эхэллээ</span>
          </p>
          <h1 className="mb-5 max-w-3xl font-serif text-4xl font-bold leading-[1.05] text-white text-balance sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
            Тоонот Эко Хотхон
          </h1>
          <p className="mb-7 max-w-3xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8 md:mb-8 md:text-2xl md:leading-10">
            Ногоон орчин, зөв төлөвлөлт, гэр бүлд ээлтэй байршилтай орон сууцны сонголтууд.
            Үнэ, м², зураг болон байршлын мэдээллийг нэг дороос аваарай.
          </p>

          <div className="grid gap-3 sm:flex sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="h-12 w-full rounded-md px-5 text-sm font-semibold shadow-xl shadow-black/20 sm:w-auto sm:px-6 sm:text-base">
              <Link href="#apartments">
                Байрны сонголт үзэх
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-md border-white/40 bg-white/8 px-5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white sm:w-auto sm:px-6 sm:text-base"
            >
              <Link href="#contact">
                <Phone className="mr-2 h-5 w-5" />
                Зөвлөгөө авах
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 md:mt-12">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/15 bg-black/30 p-4 shadow-lg shadow-black/10 backdrop-blur-md sm:p-5">
                <p className="text-xs text-white/70 sm:text-sm">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-white sm:text-2xl">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 text-sm text-white/80 sm:mt-6 sm:flex sm:items-center">
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
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
