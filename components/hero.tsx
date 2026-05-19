"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, Eye, MapPin, Ruler, Trees } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroMotion, StaggerGroup, StaggerItem } from "@/components/motion-primitives"
import type { HomepageContent, IconKey } from "@/lib/homepage-content"

const highlightIcons: Partial<Record<IconKey, typeof Ruler>> = {
  building: Building2,
  ruler: Ruler,
  trees: Trees,
}

export function Hero({ content }: { content: HomepageContent["hero"] }) {
  return (
    <section id="home" className="relative min-h-[calc(100svh-4rem)] overflow-hidden sm:min-h-[calc(100svh-6rem)]">
      <div className="absolute inset-0 z-0">
        <Image src={content.backgroundImage} alt={content.title} fill className="scale-105 object-cover" priority />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,18,0.82)_0%,rgba(5,20,18,0.58)_52%,rgba(5,20,18,0.22)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1440px] items-center px-4 py-10 sm:min-h-[calc(100svh-6rem)] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <HeroMotion className="w-full max-w-4xl">
          <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md sm:mb-5 sm:px-4 sm:text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-emerald-300" />
            <span className="truncate">{content.badge}</span>
          </p>

          <h1 className="max-w-4xl text-3xl font-bold leading-[1.08] text-white text-balance min-[380px]:text-4xl sm:text-6xl lg:text-7xl">
            {content.title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/88 sm:mt-6 sm:text-xl sm:leading-8">
            {content.description}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="h-12 w-full rounded-md px-6 text-base font-bold sm:h-14 sm:w-auto">
              <Link href="#contact" className="justify-center">
                {content.primaryCta}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-md border-white/40 bg-white/10 px-6 text-base font-bold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white sm:h-14 sm:w-auto"
            >
              <Link href="#apartments" className="justify-center">
                {content.secondaryCta}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="group h-12 w-full rounded-md bg-emerald-800 px-6 text-base font-bold shadow-lg shadow-emerald-950/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-xl hover:shadow-emerald-950/25 sm:h-14 sm:w-auto"
            >
              <Link href="#vr-tour" className="justify-center">
                <Eye className="h-5 w-5 transition-transform group-hover:scale-110" />
                {content.vrCta}
              </Link>
            </Button>
          </div>

          <StaggerGroup className="mt-6 grid max-w-3xl gap-3 min-[420px]:grid-cols-3 sm:mt-10">
            {content.highlights.map((item) => {
              const Icon = highlightIcons[item.icon] ?? Ruler

              return (
              <StaggerItem key={item.label} className="rounded-lg border border-white/15 bg-black/28 p-3 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-black/36 sm:p-4">
                <Icon className="mb-3 h-5 w-5 text-emerald-300" />
                <p className="text-sm font-semibold text-white/65">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-white sm:text-2xl">{item.value}</p>
              </StaggerItem>
              )
            })}
          </StaggerGroup>
        </HeroMotion>
      </div>
    </section>
  )
}
