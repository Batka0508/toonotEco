import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

const footerLinks = {
  menu: [
    { label: "Төслийн тухай", href: "#about" },
    { label: "Давуу тал", href: "#advantages" },
    { label: "Байрны сонголт", href: "#apartments" },
    { label: "Үнэ", href: "#apartments" },
    { label: "Байршил", href: "#location" },
  ],
  apartments: [
    { label: "2 өрөө байр", href: "#apartments" },
    { label: "3 өрөө байр", href: "#apartments" },
    { label: "Зогсоол", href: "#apartments" },
    { label: "Төлбөрийн нөхцөл", href: "#contact" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/share/1cEnvnedNh/", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer({ variant = "green" }: { variant?: "green" | "black" }) {
  const isBlack = variant === "black"

  return (
    <footer className={isBlack ? "bg-slate-950 text-white" : "bg-emerald-700 text-white"}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <span className="text-xl font-bold text-emerald-700">T</span>
              </div>
              <span className="font-serif text-xl font-bold text-white">Тоонот Эко Хотхон</span>
            </Link>
            <p className="mb-6 leading-relaxed text-emerald-50">
              Байрны сонголт, м2 үнэ, зураг, байршил, борлуулалтын мэдээллийг нэг дороос авах орон сууцны төсөл.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white hover:text-emerald-700"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Цэс</h4>
            <ul className="space-y-3">
              {footerLinks.menu.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-emerald-50 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Сонголтууд</h4>
            <ul className="space-y-3">
              {footerLinks.apartments.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-emerald-50 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Холбоо барих</h4>
            <ul className="space-y-3 text-emerald-50">
              <li>Улаанбаатар хот</li>
              <li>
                <a href="tel:+97611111111" className="transition-colors hover:text-white">
                  +976 1111-1111
                </a>
              </li>
              <li>
                <a href="mailto:info@toonot-eco.mn" className="transition-colors hover:text-white">
                  info@toonot-eco.mn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 md:flex-row">
          <p className="text-sm text-emerald-50/85">
            © {new Date().getFullYear()} Тоонот Эко Хотхон. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <div className="flex gap-6 text-sm text-emerald-50/85">
            <Link href="#contact" className="transition-colors hover:text-white">
              Борлуулалтын алба
            </Link>
            <Link href="#apartments" className="transition-colors hover:text-white">
              Үнийн мэдээлэл
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
