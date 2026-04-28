import { CheckCircle2, Clock, MapPin, ShieldCheck, Trees } from "lucide-react"

const features = [
  "2 болон 3 өрөөний сонголттой",
  "Гэрэл сайн тусах цонх, зөв зохион байгуулалт",
  "Ногоон байгууламж, хүүхдийн тоглоомын талбай",
  "24/7 хяналт, нэвтрэх зохион байгуулалт",
  "Авто зогсоол, явган хүний аюулгүй орчин",
  "Урт хугацаанд үнэ цэнээ хадгалах хөрөнгө оруулалт",
]

const facts = [
  { icon: MapPin, label: "Байршил", value: "Улаанбаатар хот" },
  { icon: Clock, label: "Ашиглалтад орох", value: "2026 он" },
  { icon: Trees, label: "Орчны шийдэл", value: "Ногоон бүс" },
  { icon: ShieldCheck, label: "Аюулгүй байдал", value: "24/7 хяналт" },
]

export function About() {
  return (
    <section id="about" className="bg-[linear-gradient(180deg,var(--secondary)_0%,oklch(0.99_0.008_145)_100%)] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">Төслийн тухай</p>
            <h2 className="mb-6 font-serif text-3xl font-bold text-foreground text-balance md:text-4xl">
              Амьдрахад тухтай, худалдан авахад ойлгомжтой төлөвлөлт
            </h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Тоонот Эко Хотхон нь өдөр тутмын амьдралын хэрэгцээг ойр байршил, ногоон орчин,
              аюулгүй төлөвлөлттэй нэгтгэсэн орон сууцны төсөл юм.
            </p>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              Борлуулалтын мэдээллийг хэрэглэгч хурдан ойлгохоор м², өрөөний тоо, үнэ, зураг,
              байршил, холбоо барих сувгийг нэг дараалалд байршууллаа.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <span className="font-medium text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-lg border border-emerald-800/15 bg-card p-6 shadow-sm shadow-emerald-900/5">
                <fact.icon className="mb-5 h-7 w-7 text-primary" />
                <p className="text-sm text-muted-foreground">{fact.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
