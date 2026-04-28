"use client"

import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const contactInfo = [
  {
    icon: Phone,
    title: "Борлуулалтын утас",
    value: "+976 1111-1111",
    href: "tel:+97611111111",
  },
  {
    icon: Mail,
    title: "И-мэйл",
    value: "info@toonot-eco.mn",
    href: "mailto:info@toonot-eco.mn",
  },
  {
    icon: MapPin,
    title: "Байршил",
    value: "Улаанбаатар хот",
    href: "#location",
  },
  {
    icon: Clock,
    title: "Ажлын цаг",
    value: "Даваа - Бямба: 09:00 - 18:00",
    href: "#contact",
  },
]

export function Contact() {
  return (
    <section id="contact" className="bg-[linear-gradient(180deg,var(--background)_0%,oklch(0.985_0.012_145)_100%)] py-16 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">Борлуулалтын алба</p>
            <h2 className="mb-5 font-serif text-3xl font-bold text-foreground text-balance md:mb-6 md:text-4xl">
              Байрны сонголт, үнэ, төлбөрийн нөхцөлийн талаар лавлах
            </h2>
            <p className="mb-8 leading-relaxed text-muted-foreground md:mb-10">
              Та сонирхож буй өрөөний сонголт, м², давхар, төлбөрийн нөхцөлөө үлдээгээрэй.
              Борлуулалтын ажилтан танд дэлгэрэнгүй мэдээлэл өгнө.
            </p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {contactInfo.map((info) => (
                <a key={info.title} href={info.href} className="group flex items-start gap-4 rounded-lg border border-emerald-800/10 bg-white p-4 shadow-sm shadow-emerald-900/5 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{info.title}</p>
                    <p className="break-words font-medium text-foreground transition-colors group-hover:text-primary">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div id="location" className="mt-8 rounded-lg border border-emerald-800/15 bg-card p-5 shadow-sm shadow-emerald-900/5 md:mt-10 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">Байршлын мэдээлэл</h3>
              </div>
              <div className="flex min-h-48 items-center justify-center rounded-md border border-dashed border-emerald-800/25 bg-emerald-50 text-center sm:min-h-56">
                <div className="max-w-sm px-5">
                  <p className="font-semibold text-foreground">Газрын зураг / байршлын зураг</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Энд Google Map embed эсвэл байршлын зураг байрлуулах боломжтой.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-800/15 bg-card p-5 shadow-sm shadow-emerald-900/5 sm:p-6 lg:p-8">
            <h3 className="mb-6 text-xl font-semibold text-foreground">Мэдээлэл авах хүсэлт</h3>
            <form className="space-y-5 sm:space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    Нэр
                  </label>
                  <Input id="name" placeholder="Таны нэр" />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
                    Утас
                  </label>
                  <Input id="phone" type="tel" placeholder="Утасны дугаар" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                  И-мэйл
                </label>
                <Input id="email" type="email" placeholder="example@mail.com" />
              </div>
              <div>
                <label htmlFor="apartment" className="mb-2 block text-sm font-medium text-foreground">
                  Сонирхож буй сонголт
                </label>
                <select
                  id="apartment"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Сонгох...</option>
                  <option value="2-room">2 өрөө байр</option>
                  <option value="3-room">3 өрөө байр</option>
                  <option value="parking">Зогсоол</option>
                  <option value="payment">Төлбөрийн нөхцөл</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                  Нэмэлт мэдээлэл
                </label>
                <Textarea id="message" rows={4} placeholder="Жишээ: 2 өрөө, 50 м² орчим, төлбөрийн нөхцөл..." />
              </div>
              <Button className="w-full" size="lg">
                Хүсэлт илгээх
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
