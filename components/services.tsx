import { Building2, Car, Leaf, ShieldCheck, Sun, Trees } from "lucide-react"

const advantages = [
  {
    icon: Building2,
    title: "Зөв төлөвлөлт",
    description: "Өрөө бүрийн ашигтай талбайг нэмэгдүүлсэн, гэр бүлийн өдөр тутмын хэрэглээнд тохирсон зохион байгуулалт.",
  },
  {
    icon: Sun,
    title: "Гэрэлтэй сууц",
    description: "Цонхны байрлал, өрөөний харьцааг байгалийн гэрэл сайн авах байдлаар төлөвлөсөн.",
  },
  {
    icon: Leaf,
    title: "Эко орчин",
    description: "Ногоон байгууламж, амрах хэсэг, алхах талбайг хотхоны үндсэн үнэ цэн болгон шийдсэн.",
  },
  {
    icon: ShieldCheck,
    title: "Аюулгүй байдал",
    description: "Нэвтрэх хэсэг, гэрэлтүүлэг, камерын хяналттай тайван амьдрах орчин.",
  },
  {
    icon: Car,
    title: "Авто зогсоол",
    description: "Оршин суугчдын хэрэгцээнд нийцсэн зогсоол, хөдөлгөөний ойлгомжтой зохион байгуулалт.",
  },
  {
    icon: Trees,
    title: "Гэр бүлд ээлтэй",
    description: "Хүүхэд, ахмад, гэр бүлийн амралтад зориулсан гадна талбай, хотхоны дотоод орчин.",
  },
]

export function Services() {
  return (
    <section id="advantages" className="bg-[linear-gradient(180deg,var(--background)_0%,oklch(0.985_0.01_145)_100%)] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">Давуу тал</p>
          <h2 className="mb-6 font-serif text-3xl font-bold text-foreground text-balance md:text-4xl">
            Сонголт хийхэд хэрэгтэй гол мэдээллүүд
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Байр худалдан авагчдад хамгийн түрүүнд хэрэгтэй төлөвлөлт, орчин, аюулгүй байдал,
            зогсоол, байршлын мэдээллийг товч бөгөөд ойлгомжтой харууллаа.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="group rounded-lg border border-emerald-800/15 bg-card p-8 shadow-sm shadow-emerald-900/5 transition-all duration-300 hover:border-primary/35 hover:shadow-lg hover:shadow-emerald-900/10"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
