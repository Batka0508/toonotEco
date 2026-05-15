import Link from "next/link"
import Image from "next/image"
import { Armchair, ArrowRight, Building2, CalendarCheck, Droplets, Layers3, MapPin, PhoneCall, Plug, ShieldCheck, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HomepageContent, IconKey } from "@/lib/homepage-content"

const factIcons: Partial<Record<IconKey, typeof MapPin>> = {
  building: Building2,
  calendar: CalendarCheck,
  layers: Layers3,
  map: MapPin,
}

const benefits = [
  { icon: ShieldCheck, title: "Аюулгүй", description: "24/7 хяналт хамгаалалт" },
  { icon: Thermometer, title: "Дулаан", description: "-30°C хүртэл дулаан" },
  { icon: Droplets, title: "Чийггүй", description: "Чийг тусгаарлалт сайн" },
  { icon: Plug, title: "Цахилгаантай", description: "220V залгууртай" },
  { icon: Armchair, title: "Өргөн зай", description: "Тав тухтай зай талбай" },
]

export function About({ content }: { content: HomepageContent["about"] }) {
  return (
    <section id="about" className="relative overflow-hidden bg-[#001b24] py-16 text-white md:py-24">
      <Image
        src="/images/zurag.jpg.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover opacity-28"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_42%,rgba(16,185,129,0.34),transparent_24rem),linear-gradient(90deg,rgba(0,26,36,0.98)_0%,rgba(0,31,43,0.88)_42%,rgba(0,35,45,0.72)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,rgba(0,37,39,0.95),transparent)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-black uppercase tracking-wide text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">{content.eyebrow}</p>
            <h2 className="max-w-xl text-4xl font-black leading-tight text-white text-balance drop-shadow-[0_4px_24px_rgba(255,255,255,0.14)] md:text-5xl">
              {content.title}
            </h2>
            <div className="mt-7 flex items-center gap-3">
              <span className="h-1 w-24 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.8)]" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.9)]" />
            </div>
            {content.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "mt-8 max-w-2xl text-base leading-8 text-cyan-50/78" : "mt-5 max-w-2xl text-base leading-8 text-cyan-50/78"}>
                {paragraph}
              </p>
            ))}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-[1.35rem] border border-emerald-300/35 bg-emerald-400 px-8 text-base font-black text-white shadow-[0_0_36px_rgba(16,185,129,0.48)] transition-all hover:-translate-y-0.5 hover:bg-emerald-300 hover:text-emerald-950 hover:shadow-[0_0_48px_rgba(16,185,129,0.65)]"
              >
                <Link href="#apartments">
                  {content.primaryCta}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-[1.35rem] border border-emerald-300/70 bg-slate-950/30 px-8 text-base font-black text-cyan-50 shadow-[0_0_22px_rgba(16,185,129,0.12)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-emerald-400/10 hover:text-white"
              >
                <Link href="#contact">
                  <PhoneCall className="h-5 w-5 text-emerald-300" />
                  {content.secondaryCta}
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {content.facts.map((fact) => {
              const Icon = factIcons[fact.icon] ?? MapPin

              return (
              <div key={fact.label} className="min-h-[13.5rem] rounded-[1.4rem] border border-cyan-200/18 bg-cyan-100/[0.055] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-300/55 hover:bg-emerald-300/[0.075] hover:shadow-[0_0_42px_rgba(16,185,129,0.16)] md:min-h-[16rem] md:p-8">
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/45 bg-emerald-400/10 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.18)]">
                  <Icon className="h-8 w-8 drop-shadow-[0_0_12px_rgba(16,185,129,0.75)]" />
                </div>
                <p className="text-base font-black text-emerald-300">{fact.label}</p>
                <p className="mt-3 text-xl font-black leading-snug text-white md:text-2xl">{fact.value}</p>
              </div>
              )
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-4 rounded-[1.4rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-5 lg:p-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <div key={benefit.title} className="flex items-center gap-4">
                <Icon className="h-10 w-10 shrink-0 text-emerald-300 drop-shadow-[0_0_14px_rgba(16,185,129,0.72)]" />
                <div>
                  <p className="font-black text-white">{benefit.title}</p>
                  <p className="mt-1 text-sm text-cyan-50/68">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
