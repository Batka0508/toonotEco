"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Award, Building2, Leaf, ShieldCheck, Sparkles, Target, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HomepageContent } from "@/lib/homepage-content"

const stats = [
  { value: 500, suffix: "+", label: "Сэтгэл хангалуун харилцагч", icon: UsersRound },
  { value: 10, suffix: "+", label: "Жилийн туршлага", icon: Award },
  { value: 25, suffix: "", label: "Премиум төсөл", icon: Building2 },
  { value: 98, suffix: "%", label: "Хэрэглэгчийн сэтгэл ханамж", icon: ShieldCheck },
]

const values = [
  {
    icon: Target,
    title: "Алсын хараа",
    description: "Орчин үеийн төлөвлөлт, найдвартай барилга, үнэ цэнтэй хөрөнгө оруулалтыг нэг дор бүрдүүлсэн хотхоны стандарт бий болгоно.",
  },
  {
    icon: Sparkles,
    title: "Эрхэм зорилго",
    description: "Харилцагч бүрт ойлгомжтой мэдээлэл, мэргэжлийн зөвлөгөө, итгэлтэй худалдан авалтын туршлага хүргэнэ.",
  },
  {
    icon: Leaf,
    title: "Эко үнэ цэн",
    description: "Ногоон орчин, эрчим хүчний хэмнэлт, тав тухтай амьдрах хэв маягийг барилгын шийдэл бүрт тусгана.",
  },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(value * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export function About({ content }: { content: HomepageContent["about"] }) {
  const paragraphs = useMemo(
    () => [
      "Монгол Од Компани нь премиум үл хөдлөх хөрөнгийн борлуулалт, орон сууцны төсөл хөгжүүлэлт, харилцагчийн зөвлөгөө үйлчилгээг мэргэжлийн түвшинд хүргэдэг байгууллага юм.",
      "Бид Тоонот Эко Хотхоныг байршил, төлөвлөлт, чанартай хийц, ногоон орчин, урт хугацааны үнэ цэнийг хослуулсан орчин үеийн амьдралын сонголт болгон танилцуулж байна.",
    ],
    [],
  )

  return (
    <section id="about" className="relative overflow-hidden py-16 text-white md:py-24">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-10 max-w-2xl md:mb-12">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">{content.eyebrow || "Компанийн тухай"}</p>
          <h2 className="text-3xl font-black text-white text-balance md:text-4xl">
           Орчин үеийн амьдралын шинэ стандарт
          </h2>
          <p className="mt-4 leading-8 text-cyan-50/72">
            Монгол Од Компани нь чанар, итгэл, ногоон орчин, урт хугацааны үнэ цэнийг нэгтгэсэн орон сууцны төслүүдийг харилцагчдад мэргэжлийн түвшинд танилцуулдаг.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="group overflow-hidden rounded-[1.35rem] border border-cyan-200/16 bg-cyan-100/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-emerald-300/[0.075] hover:shadow-[0_0_42px_rgba(16,185,129,0.16)]">
            <div className="relative aspect-[16/12] min-h-[28rem] w-full overflow-hidden bg-slate-950 lg:h-full">
                <Image
                  src="/images/zurag.jpg.png"
                  alt="Тоонот Эко Хотхон барилгын зураг"
                  fill
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover opacity-82 transition-transform duration-500 group-hover:scale-105"
                  priority={false}
                />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.76))]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.1rem] border border-cyan-200/16 bg-cyan-100/[0.08] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">Premium Real Estate</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-white">Монгол Од Компани</p>
                <p className="mt-2 text-sm leading-6 text-cyan-50/70">Итгэл, чанар, үнэ цэнийг нэгтгэсэн борлуулалтын баг.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-8">
            <div className="space-y-5 text-base leading-8 text-cyan-50/72">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {values.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.1rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-emerald-300/[0.075]"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300/45 bg-emerald-400/10 text-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.16)]">
                      <Icon className="h-6 w-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
                    </div>
                    <h3 className="mt-4 text-base font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-cyan-50/70">{item.description}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-[1.1rem] bg-emerald-400 px-7 font-black text-white shadow-[0_0_30px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:text-emerald-950">
                <Link href="#gallery">
                  Дэлгэрэнгүй
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-[1.1rem] border border-emerald-300/70 bg-slate-950/30 px-7 font-black text-cyan-50 shadow-[0_0_22px_rgba(16,185,129,0.12)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-emerald-400/10 hover:text-white">
                <Link href="#contact">Холбоо барих</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="group rounded-[1.35rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-emerald-300/[0.075] hover:shadow-[0_0_42px_rgba(16,185,129,0.16)]"
              >
                  <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300/45 bg-emerald-400/10 text-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.16)]">
                    <Icon className="h-6 w-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.9)]" />
                  </div>
                  <p className="mt-7 text-4xl font-black tracking-tight text-white">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-cyan-50/70">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
