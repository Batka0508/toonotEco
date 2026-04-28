"use client"

import { useState } from "react"
import Link from "next/link"
import { LockKeyhole, LogOut, Menu, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/app/(user-auth)/actions"

const navLinks = [
  { href: "#home", label: "Нүүр" },
  { href: "#about", label: "Төслийн тухай" },
  { href: "#advantages", label: "Давуу тал" },
  { href: "#apartments", label: "Байрны сонголт" },
  { href: "#price", label: "Үнэ" },
  { href: "#location", label: "Байршил" },
  { href: "#contact", label: "Холбоо барих" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState("#home")

  const handleNavClick = (href: string) => {
    setActiveHref(href)
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-emerald-900/10 bg-white/90 shadow-sm shadow-emerald-950/5 backdrop-blur-xl">
      <div className="container relative mx-auto px-3 sm:px-4">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          <Link href="/" onClick={() => handleNavClick("#home")} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary shadow-md shadow-emerald-900/20 sm:h-11 sm:w-11 md:h-12 md:w-12">
              <span className="text-lg font-bold text-primary-foreground sm:text-xl">T</span>
            </div>
            <div className="min-w-0">
              <span className="block max-w-[9rem] truncate font-serif text-base font-bold leading-tight text-foreground sm:max-w-none sm:text-lg md:text-xl">
                Тоонот Эко Хотхон
              </span>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">Toonot Eco Hothon</p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <a
              href="tel:+97611111111"
              className="hidden items-center gap-2 rounded-lg border border-emerald-900/10 bg-white/70 px-4 py-2 text-sm font-semibold text-foreground shadow-sm shadow-emerald-900/5 transition-colors hover:border-primary/30 hover:text-primary lg:flex"
            >
              <Phone className="h-4 w-4 text-primary" />
              +976 1111-1111
            </a>
            <Button
              asChild
              variant="outline"
              className="hidden rounded-lg border-primary/25 bg-white/70 px-4 text-primary shadow-sm shadow-emerald-900/5 hover:bg-primary/10 md:flex"
            >
              <Link href="/admin">
                <LockKeyhole className="h-4 w-4" />
                Admin
              </Link>
            </Button>
            <Button asChild className="hidden rounded-lg px-4 shadow-sm shadow-emerald-900/15 hover:bg-emerald-700 sm:flex lg:px-5">
              <Link href="#contact" onClick={() => handleNavClick("#contact")}>
                Холбогдох
              </Link>
            </Button>
            <button
              onClick={() => setIsMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-900/10 bg-white/70 text-foreground shadow-sm shadow-emerald-900/5 transition-colors hover:bg-emerald-100 hover:text-primary"
              aria-label="Цэс нээх"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="absolute right-3 top-[calc(100%+0.5rem)] w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/12 sm:right-4">
            <div className="border-b border-emerald-900/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Цэс</p>
            </div>
            <div className="p-2">
              {navLinks.map((link) => {
                const isActive = activeHref === link.href

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={[
                      "block rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-emerald-950/75 hover:bg-emerald-50 hover:text-primary",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
            <div className="grid gap-2 border-t border-emerald-900/10 p-3">
              <Button asChild variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 md:hidden">
                <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                  <LockKeyhole className="h-4 w-4" />
                  Admin
                </Link>
              </Button>
              <Button asChild className="w-full sm:hidden">
                <Link href="#contact" onClick={() => handleNavClick("#contact")}>
                  Холбогдох
                </Link>
              </Button>
              <form action={logoutUser}>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                  <LogOut className="h-4 w-4" />
                  Гарах
                </Button>
              </form>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
