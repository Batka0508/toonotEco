import Link from "next/link"
import { ArrowRight, Building2, CalendarCheck, Layers3, MapPin, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HomepageContent, IconKey } from "@/lib/homepage-content"

const factIcons: Partial<Record<IconKey, typeof MapPin>> = {
  building: Building2,
  calendar: CalendarCheck,
  layers: Layers3,
  map: MapPin,
}

export function About({ content }: { content: HomepageContent["about"] }) {
  return (
    <section id="about" className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">{content.eyebrow}</p>
            <h2 className="text-3xl font-bold leading-tight text-slate-950 text-balance md:text-4xl">
              {content.title}
            </h2>
            {content.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "mt-5 leading-8 text-slate-600" : "mt-4 leading-8 text-slate-600"}>
                {paragraph}
              </p>
            ))}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-full bg-emerald-600 px-6 text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-900/25"
              >
                <Link href="#apartments">
                  {content.primaryCta}
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
                  {content.secondaryCta}
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {content.facts.map((fact) => {
              const Icon = factIcons[fact.icon] ?? MapPin

              return (
              <div key={fact.label} className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm shadow-emerald-900/5">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-500">{fact.label}</p>
                <p className="mt-2 text-xl font-bold text-slate-950">{fact.value}</p>
              </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
