"use client"

import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const contactInfo = [
  {
    icon: Phone,
    title: "Утас",
    value: "+976 1123-4567",
    href: "tel:+97611234567",
  },
  {
    icon: Mail,
    title: "И-мэйл",
    value: "info@mongolod.mn",
    href: "mailto:info@mongolod.mn",
  },
  {
    icon: MapPin,
    title: "Хаяг",
    value: "Улаанбаатар, Хан-Уул дүүрэг",
    href: "#",
  },
  {
    icon: Clock,
    title: "Ажлын цаг",
    value: "Даваа - Баасан: 09:00 - 18:00",
    href: "#",
  },
]

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div>
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Холбоо барих
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Бидэнтэй холбогдох
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Төслийнхөө талаар асуух зүйл байвал бидэнтэй холбогдоорой. 
              Бид таны санал хүсэлтэд хариулахад таатай байх болно.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info) => (
                <a
                  key={info.title}
                  href={info.href}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.title}</p>
                    <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                      {info.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Үнийн санал авах
            </h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Нэр
                  </label>
                  <Input id="name" placeholder="Таны нэр" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Утас
                  </label>
                  <Input id="phone" type="tel" placeholder="Утасны дугаар" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  И-мэйл
                </label>
                <Input id="email" type="email" placeholder="example@mail.com" />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                  Үйлчилгээ
                </label>
                <select
                  id="service"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Сонгох...</option>
                  <option value="office">Оффис барилга</option>
                  <option value="residential">Орон сууц</option>
                  <option value="commercial">Худалдааны төв</option>
                  <option value="renovation">Барилга засвар</option>
                  <option value="infrastructure">Дэд бүтэц</option>
                  <option value="design">Зураг төсөл</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Мессеж
                </label>
                <Textarea id="message" rows={4} placeholder="Төслийнхөө талаар дэлгэрэнгүй бичнэ үү..." />
              </div>
              <Button className="w-full" size="lg">
                Илгээх
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
