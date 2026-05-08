"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Leaf, LogOut, Menu, Phone, X } from "lucide-react"
import { logoutUser } from "@/app/(user-auth)/actions"

const navLinks = [
  { href: "#home", label: "Нүүр" },
  { href: "#vr-tour", label: "VR tour" },
  { href: "#about", label: "Төслийн тухай" },
  { href: "#location", label: "Байршил" },
  { href: "#apartments", label: "Загварууд" },
  { href: "#amenities", label: "Давуу тал" },
  { href: "#gallery", label: "Мэдээ" },
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
    <header className="relative z-40 border-b border-slate-900/10 bg-white/94 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="flex h-24 items-center justify-between gap-6">
          <Link href="/" onClick={() => handleNavClick("#home")} className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-emerald-900/70 text-emerald-950">
              <Building2 className="h-7 w-7" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-emerald-700">
                <Leaf className="h-3 w-3" />
              </span>
            </div>
            <div className="min-w-0 leading-none">
              <span className="block truncate text-xl font-black tracking-wide text-emerald-950">Монгол од</span>
              <span className="mt-1 block truncate text-sm font-bold uppercase tracking-[0.16em] text-emerald-950">Company</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-semibold text-slate-800 transition-colors hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="tel:+97675071234"
              className="hidden h-14 items-center gap-3 rounded-full bg-emerald-800 px-7 text-base font-bold text-white shadow-sm shadow-emerald-950/15 transition-colors hover:bg-emerald-900 lg:flex"
            >
              <Phone className="h-5 w-5" />
              7507-1234
            </a>
            <form action={logoutUser}>
              <button
                type="submit"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 shadow-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                aria-label="Гарах"
                title="Гарах"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </form>
            <button
              onClick={() => setIsMenuOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 shadow-sm transition-colors hover:bg-emerald-50 xl:hidden"
              aria-label="Цэс нээх"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="absolute right-5 top-[calc(100%+0.5rem)] w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/15">
            <div className="p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={[
                    "block rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    activeHref === link.href ? "bg-emerald-800 text-white" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-emerald-900/10 p-3">
              <a
                href="tel:+97675071234"
                className="flex h-12 items-center justify-center gap-3 rounded-full bg-emerald-800 px-5 text-sm font-bold text-white"
              >
                <Phone className="h-4 w-4" />
                7507-1234
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
