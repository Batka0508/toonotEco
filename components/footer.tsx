import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

const footerLinks = {
  company: [
    { label: "Бидний тухай", href: "#about" },
    { label: "Үйлчилгээ", href: "#services" },
    { label: "Төслүүд", href: "#projects" },
    { label: "Холбоо барих", href: "#contact" },
  ],
  services: [
    { label: "Оффис барилга", href: "#" },
    { label: "Орон сууц", href: "#" },
    { label: "Худалдааны төв", href: "#" },
    { label: "Барилга засвар", href: "#" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">M</span>
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-background">Mongol Od</span>
              </div>
            </Link>
            <p className="text-background/70 mb-6 leading-relaxed">
              Чанартай барилга, итгэлтэй хамтрагч. 25 жилийн туршлагатай Монголын тэргүүлэгч барилгын компани.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Компани</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Үйлчилгээ</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Холбоо барих</h4>
            <ul className="space-y-3 text-background/70">
              <li>Улаанбаатар, Хан-Уул дүүрэг</li>
              <li>
                <a href="tel:+97611234567" className="hover:text-primary transition-colors">
                  +976 1123-4567
                </a>
              </li>
              <li>
                <a href="mailto:info@mongolod.mn" className="hover:text-primary transition-colors">
                  info@mongolod.mn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Mongol Od. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <div className="flex gap-6 text-sm text-background/50">
            <Link href="#" className="hover:text-background transition-colors">
              Нууцлалын бодлого
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Үйлчилгээний нөхцөл
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
