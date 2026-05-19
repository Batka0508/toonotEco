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
    <section id="amenities" className="relative overflow-hidden py-16 text-white md:py-24">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-10 max-w-2xl md:mb-12">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">{content.eyebrow}</p>
          <h2 className="text-3xl font-black text-white text-balance md:text-4xl">{content.title}</h2>
          <p className="mt-4 leading-8 text-cyan-50/72">
            {content.description}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => {
            const Icon = amenityIcons[item.icon] ?? Trees

            return (
            <div
              key={item.title}
              className="group overflow-hidden rounded-[1.35rem] border border-cyan-200/16 bg-cyan-100/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-emerald-300/[0.075] hover:shadow-[0_0_42px_rgba(16,185,129,0.16)]"
            >
              {item.image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover opacity-82 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.76))]" />
                </div>
              )}
              <div className="p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300/45 bg-emerald-400/10 text-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.16)]">
                  <Icon className="h-6 w-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
                </div>
                <h3 className="text-xl font-black text-white">{item.title}</h3>
                <p className="mt-3 leading-7 text-cyan-50/70">{item.description}</p>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
