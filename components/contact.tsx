"use client"

import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { submitInquiry } from "@/app/contact-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { HomepageContent, IconKey } from "@/lib/homepage-content"

const contactIcons: Partial<Record<IconKey, typeof Phone>> = {
  clock: Clock,
  mail: Mail,
  map: MapPin,
  phone: Phone,
}

export function Contact({ content }: { content: HomepageContent["contact"] }) {
  return (
    <section id="contact" className="bg-slate-50 py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">{content.eyebrow}</p>
            <h2 className="text-2xl font-bold text-slate-950 text-balance sm:text-3xl md:text-4xl">{content.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">
              {content.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {content.info.map((info) => {
                const Icon = contactIcons[info.icon] ?? Phone

                return (
                <a key={info.title} href={info.href} className="flex items-start gap-4 rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm shadow-emerald-900/5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{info.title}</p>
                    <p className="mt-1 break-words font-bold text-slate-950">{info.value}</p>
                  </div>
                </a>
                )
              })}
            </div>

            <div id="location" className="mt-8 overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
              <div className="flex items-center gap-3 border-b border-slate-200 p-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-slate-950">{content.mapTitle}</h3>
              </div>
              <iframe
                title="Тоонот Эко Хотхон байршил"
                src={content.mapEmbedUrl}
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm shadow-emerald-900/5 sm:p-6 lg:p-8">
            <h3 className="mb-5 text-xl font-bold text-slate-950 sm:mb-6 sm:text-2xl">{content.formTitle}</h3>
            <form action={submitInquiry} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Нэр">
                  <Input id="name" name="name" placeholder="Таны нэр" required />
                </Field>
                <Field label="Утас">
                  <Input id="phone" name="phone" type="tel" placeholder="Утасны дугаар" required />
                </Field>
              </div>
              <Field label="И-мэйл">
                <Input id="email" name="email" type="email" placeholder="example@mail.com" />
              </Field>
              <Field label="Сонирхож буй байр">
                <select
                  id="apartment"
                  name="apartment"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Сонгох...</option>
                  <option value="2 өрөө байр">2 өрөө байр</option>
                  <option value="3 өрөө байр">3 өрөө байр</option>
                  <option value="Гарааш">Гарааш</option>
                  <option value="Төлбөрийн нөхцөл">Төлбөрийн нөхцөл</option>
                </select>
              </Field>
              <Field label="Нэмэлт мэдээлэл">
                <Textarea id="message" name="message" rows={5} placeholder="Жишээ: 2 өрөө, 50 м² орчим, урьдчилгаа төлбөрийн нөхцөл..." />
              </Field>
              <Button className="w-full" size="lg" type="submit">
                Захиалга илгээх
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      {children}
    </label>
  )
}
