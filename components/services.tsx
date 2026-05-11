import Image from "next/image"
import { Baby, Car, Dumbbell, ShieldCheck, Trees, Wifi } from "lucide-react"
import type { HomepageContent, IconKey } from "@/lib/homepage-content"

const amenityIcons: Partial<Record<IconKey, typeof Dumbbell>> = {
  baby: Baby,
  car: Car,
  dumbbell: Dumbbell,
  shield: ShieldCheck,
  trees: Trees,
  wifi: Wifi,
}

export function Services({ content }: { content: HomepageContent["amenities"] }) {
  return (
    <section id="amenities" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-2xl md:mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">{content.eyebrow}</p>
          <h2 className="text-3xl font-bold text-slate-950 text-balance md:text-4xl">{content.title}</h2>
          <p className="mt-4 leading-8 text-slate-600">
            {content.description}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => {
            const Icon = amenityIcons[item.icon] ?? Trees

            return (
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
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
