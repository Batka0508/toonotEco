"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react"
import { submitInquiry } from "@/app/contact-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { HomepageContent, IconKey } from "@/lib/homepage-content"
import type { ProjectLocation } from "@/lib/project-location"

const contactIcons: Partial<Record<IconKey, typeof Phone>> = {
  clock: Clock,
  mail: Mail,
  map: MapPin,
  phone: Phone,
}

export function Contact({
  content,
  isInquirySent = false,
  sourcePath = "/",
  projectLocation,
  variant = "light",
}: {
  content: HomepageContent["contact"]
  isInquirySent?: boolean
  sourcePath?: string
  projectLocation?: ProjectLocation
  variant?: "light" | "dark"
}) {
  const [showSuccess, setShowSuccess] = useState(isInquirySent)
  const toonotEcoMapUrl = "https://maps.google.com/maps?q=%D0%A2%D0%BE%D0%BE%D0%BD%D0%BE%D1%82%20%D0%AD%D0%BA%D0%BE%20apartment&t=&z=15&ie=UTF8&iwloc=&output=embed"
  const configuredMapEmbedUrl = projectLocation?.mapEmbedUrl || content.mapEmbedUrl
  const mapEmbedUrl = configuredMapEmbedUrl.includes("Ulaanbaatar%20Mongolia") ? toonotEcoMapUrl : configuredMapEmbedUrl || toonotEcoMapUrl

  const isDark = variant === "dark"
  const isGaragePage = sourcePath === "/garages"
  const darkFieldControlClass =
    "rounded-xl border-cyan-100/20 bg-white/95 text-slate-950 placeholder:text-slate-500 focus-visible:border-emerald-300 focus-visible:ring-emerald-400/35"

  useEffect(() => {
    if (!isInquirySent) {
      return
    }

    setShowSuccess(true)
    const timer = window.setTimeout(() => setShowSuccess(false), 2000)

    return () => window.clearTimeout(timer)
  }, [isInquirySent])

  return (
    <section
      id="contact"
      className={
        isDark
          ? "relative overflow-hidden py-12 sm:py-16 md:py-24"
          : "bg-slate-50 py-12 sm:py-16 md:py-24"
      }
    >
      <div className="container mx-auto px-4">
        <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className={isDark ? "mb-3 text-sm font-black uppercase tracking-wide text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "mb-3 text-sm font-semibold uppercase tracking-wide text-primary"}>{content.eyebrow}</p>
            <h2 className={isDark ? "text-2xl font-black text-white text-balance sm:text-3xl md:text-4xl" : "text-2xl font-bold text-slate-950 text-balance sm:text-3xl md:text-4xl"}>{content.title}</h2>
            <p className={isDark ? "mt-4 text-sm leading-7 text-cyan-50/75 sm:mt-5 sm:text-base sm:leading-8" : "mt-4 text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8"}>
              {content.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {content.info.map((info) => {
                const Icon = contactIcons[info.icon] ?? Phone

                return (
                <a key={info.title} href={info.href} className={isDark ? "flex items-start gap-4 rounded-[1.15rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-emerald-300/45" : "flex items-start gap-4 rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm shadow-emerald-900/5"}>
                  <div className={isDark ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/40 bg-emerald-400/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.16)]" : "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className={isDark ? "text-sm font-medium text-cyan-50/60" : "text-sm font-medium text-slate-500"}>{info.title}</p>
                    <p className={isDark ? "mt-1 break-words font-bold text-white" : "mt-1 break-words font-bold text-slate-950"}>{info.value}</p>
                  </div>
                </a>
                )
              })}
            </div>

            <div id="location" className={isDark ? "mt-8 overflow-hidden rounded-[1.35rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl" : "mt-8 overflow-hidden rounded-2xl border border-emerald-900/10 bg-white p-2 shadow-2xl shadow-emerald-950/10"}>
              <div className={isDark ? "relative h-[22rem] overflow-hidden rounded-xl bg-slate-900 sm:h-[28rem]" : "relative h-[22rem] overflow-hidden rounded-xl bg-slate-100 sm:h-[28rem]"}>
                <iframe
                  title="Тоонот Эко Хотхон байршил"
                  src={mapEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <div className={isDark ? "relative rounded-[1.35rem] border border-cyan-200/16 bg-cyan-100/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-6 lg:p-8" : "relative rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm shadow-emerald-900/5 sm:p-6 lg:p-8"}>
            {showSuccess && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4">
                <div role="status" className="flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-2xl shadow-emerald-950/30 sm:text-base">
                  <CheckCircle2 className="h-5 w-5" />
                  Амжилттай илгээгдлээ
                </div>
              </div>
            )}
            <h3 className={isDark ? "mb-5 text-xl font-bold text-white sm:mb-6 sm:text-2xl" : "mb-5 text-xl font-bold text-slate-950 sm:mb-6 sm:text-2xl"}>{content.formTitle}</h3>
            <form action={submitInquiry} className="space-y-5">
              <input type="hidden" name="sourcePath" value={sourcePath} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field variant={variant} label="Нэр">
                  <Input id="name" name="name" placeholder="Таны нэр" required className={isDark ? darkFieldControlClass : undefined} />
                </Field>
                <Field variant={variant} label="Утас">
                  <Input id="phone" name="phone" type="tel" placeholder="Утасны дугаар" required className={isDark ? darkFieldControlClass : undefined} />
                </Field>
              </div>
              <Field variant={variant} label="И-мэйл">
                <Input id="email" name="email" type="email" placeholder="example@mail.com" className={isDark ? darkFieldControlClass : undefined} />
              </Field>
              <Field variant={variant} label="Сонирхож буй байр">
                <select
                  id="apartment"
                  name="apartment"
                  className={
                    isDark
                      ? "h-11 w-full rounded-xl border border-cyan-100/20 bg-white/95 px-3 py-2 text-sm text-slate-950 outline-none focus-visible:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-400/35"
                      : "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  }
                >
                  <option value="">Сонгох...</option>
                  <option value="2 өрөө байр">2 өрөө байр</option>
                  <option value="3 өрөө байр">3 өрөө байр</option>
                  <option value="Гарааш">Гарааш</option>
                  <option value="Төлбөрийн нөхцөл">Төлбөрийн нөхцөл</option>
                </select>
              </Field>
              <Field variant={variant} label="Нэмэлт мэдээлэл">
                <Textarea id="message" name="message" rows={5} placeholder="Жишээ: 2 өрөө, 50 м² орчим, урьдчилгаа төлбөрийн нөхцөл..." className={isDark ? darkFieldControlClass : undefined} />
              </Field>
              <Button
                className={
                  isGaragePage
                    ? "h-12 w-full rounded-xl bg-emerald-400 font-black text-white shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:bg-emerald-300 hover:text-emerald-950"
                    : isDark
                      ? "h-12 w-full rounded-xl bg-emerald-400 font-black text-white shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:bg-emerald-300 hover:text-emerald-950"
                      : "w-full"
                }
                size="lg"
                type="submit"
              >
                Захиалга илгээх
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children, variant = "light" }: { label: string; children: React.ReactNode; variant?: "light" | "dark" }) {
  return (
    <label className={variant === "dark" ? "grid gap-2 text-sm font-semibold text-cyan-50/85" : "grid gap-2 text-sm font-semibold text-slate-800"}>
      {label}
      {children}
    </label>
  )
}
