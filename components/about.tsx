import Link from "next/link"
import { ArrowRight, Building2, CalendarCheck, Layers3, MapPin, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"

const facts = [
  { icon: MapPin, label: "Байршил", value: "Улаанбаатар хот, Нисэхийн тойрог чанх хойно" },
  { icon: Layers3, label: "Давхар", value: "16 давхар" },
  { icon: Building2, label: "Блок", value: "3 блок, 240 айл" },
  { icon: CalendarCheck, label: "Ашиглалтад орох", value: "2026 оны IV улирал" },
]

export function About() {
  return (
    <section id="about" className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">About project</p>
            <h2 className="text-3xl font-bold leading-tight text-slate-950 text-balance md:text-4xl">
              Ногоон орчин, зөв layout, ойлгомжтой үнэ бүхий орон сууцны төсөл
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Тоонот Эко Хотхон нь өдөр тутмын амьдралд хэрэгтэй үйлчилгээ, хүүхдийн тоглоомын талбай, ногоон
              байгууламж, авто зогсоолыг нэг дор төлөвлөсөн modern хотхон юм.
            </p>
            <p className="mt-4 leading-8 text-slate-600">
              Байр сонгохдоо өрөөний тоо, м², давхар, layout болон төлбөрийн нөхцөлийг борлуулалтын багтай шууд
              лавлах боломжтой.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-full bg-emerald-600 px-6 text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-900/25"
              >
                <Link href="#apartments">
                  Байр сонгох
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-emerald-700/25 bg-white px-6 text-base font-bold text-emerald-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-700/40 hover:bg-emerald-50"
              >
                <Link href="#contact">
                  <PhoneCall className="h-4 w-4" />
                  Холбогдох
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm shadow-emerald-900/5">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <fact.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-500">{fact.label}</p>
                <p className="mt-2 text-xl font-bold text-slate-950">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
