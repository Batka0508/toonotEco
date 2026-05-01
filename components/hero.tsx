import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, Calculator, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const highlights = [
  { label: "1 м2 үнэ", value: "3.2 саяас" },
  { label: "Сонголт", value: "42-86 м2" },
  { label: "Ашиглалт", value: "2026 он" },
]

export function Hero() {
  return (
    <section id="home" className="relative min-h-svh overflow-hidden pt-[102px]">
      <div className="absolute inset-0 z-0 pt-[102px]">
        <Image
          src="/images/zurag.jpg.png"
          alt="Тоонот Эко Хотхон"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,24,0.74)_0%,rgba(7,20,24,0.52)_42%,rgba(7,20,24,0.14)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-102px)] max-w-[1900px] items-center px-5 py-10 sm:py-12 lg:py-16">
        <div className="w-full max-w-5xl">
          <p className="mb-6 inline-flex max-w-full items-center gap-3 rounded-full border border-white/25 bg-black/25 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-black/10 backdrop-blur-md sm:mb-8 sm:px-6 sm:py-3 sm:text-base">
            <Building2 className="h-5 w-5 shrink-0" />
            <span className="truncate">Орон сууцны борлуулалт эхэллээ</span>
          </p>

          <h1 className="mb-6 max-w-5xl font-serif text-4xl font-bold leading-[0.98] text-white text-balance sm:mb-8 sm:text-6xl md:text-7xl lg:text-8xl">
            Тоонот Эко Хотхон
          </h1>

          <p className="mb-8 max-w-5xl text-lg leading-8 text-white sm:mb-9 sm:text-2xl sm:leading-[1.55] lg:text-[2rem] lg:leading-[1.55]">
            Ногоон орчин, зөв төлөвлөлт, гэр бүлд ээлтэй байршилтай орон сууцны сонголтууд.
            Үнэ, м2, зураг болон байршлын мэдээллийг нэг дороос аваарай.
          </p>

          <div className="grid gap-4 sm:flex sm:flex-row">
            <Button asChild size="lg" className="h-12 w-full rounded-md px-5 text-base font-bold shadow-xl shadow-black/20 sm:h-16 sm:w-auto sm:px-7 sm:text-lg">
              <Link href="#apartments">
                Байрны сонголт үзэх
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-md border-white/40 bg-white/10 px-5 text-base font-bold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white sm:h-16 sm:w-auto sm:px-7 sm:text-lg"
            >
              <Link href="#contact">
                <Phone className="mr-3 h-6 w-6" />
                Зөвлөгөө авах
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/15 bg-black/32 p-4 shadow-lg shadow-black/10 backdrop-blur-md sm:p-6">
                <p className="text-sm font-semibold text-white/65 sm:text-base">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 text-base font-semibold text-white sm:flex sm:items-center">
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              Улаанбаатар хот, хотын төвд ойр байршил
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
            <Link href="#price" className="inline-flex items-center gap-2 text-white hover:text-primary">
              <Calculator className="h-5 w-5" />
              Үнийн хүснэгт харах
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
