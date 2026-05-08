import Image from "next/image"
import { Baby, Car, Dumbbell, ShieldCheck, Trees, Wifi } from "lucide-react"

const amenities = [
  {
    icon: Dumbbell,
    title: "Фитнес",
    description: "Оршин суугчдад зориулсан дасгалын хэсэг, идэвхтэй амьдралын орчин.",
    image: "/images/gym.jpg",
  },
  {
    icon: Baby,
    title: "Хүүхдийн талбай",
    description: "Аюулгүй тоглоомын хэсэг, гэр бүлд ээлтэй гадна орчин.",
    image: "/images/garden.png",
  },
  {
    icon: Trees,
    title: "Ногоон байгууламж",
    description: "Амрах, алхах, цэвэр агаарт цаг өнгөрүүлэх тохижилттой талбай.",
  },
  {
    icon: Car,
    title: "Зогсоол",
    description: "Ил болон дулаан зогсоолын сонголт, ойлгомжтой хөдөлгөөний зохион байгуулалт.",
  },
  {
    icon: ShieldCheck,
    title: "Аюулгүй орчин",
    description: "Камерын хяналт, гэрэлтүүлэг, нэвтрэх хэсгийн зохион байгуулалт.",
  },
  {
    icon: Wifi,
    title: "Дэд бүтэц",
    description: "Интернэт, холбоо, өдөр тутмын хэрэгцээнд нийцсэн инженерийн шийдэл.",
  },
]

export function Services() {
  return (
    <section id="amenities" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-2xl md:mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Amenities</p>
          <h2 className="text-3xl font-bold text-slate-950 text-balance md:text-4xl">Хотхоны давуу талууд</h2>
          <p className="mt-4 leading-8 text-slate-600">
            Амьдрахад тухтай, давтамжтай ашиглах хэрэгцээнүүдийг clean card layout-аар нэг дор харууллаа.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item) => (
            <div
              key={item.title}
              className="overflow-hidden rounded-lg border border-emerald-900/10 bg-slate-50 shadow-sm shadow-emerald-900/5 transition-all hover:border-primary/30 hover:bg-white hover:shadow-lg hover:shadow-emerald-900/10"
            >
              {item.image && (
                <div className="relative aspect-[16/10] w-full bg-emerald-50">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
