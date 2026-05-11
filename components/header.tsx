"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Leaf, LockKeyhole, Menu, Phone, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "#home", label: "Нүүр" },
  { href: "#vr-tour", label: "3D аялал" },
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
    <header className="relative z-40 border-b border-slate-900/10 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/92">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-3 sm:h-24 sm:gap-6">
          <Link href="/" onClick={() => handleNavClick("#home")} className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-emerald-900/70 text-emerald-950 dark:border-emerald-300/70 dark:text-emerald-100 sm:h-14 sm:w-14">
              <Building2 className="h-5 w-5 sm:h-7 sm:w-7" />
              <span className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-emerald-700 dark:bg-slate-950 dark:text-emerald-300 sm:right-1 sm:top-1 sm:h-4 sm:w-4">
                <Leaf className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </span>
            </div>
            <div className="min-w-0 leading-none">
              <span className="block truncate text-base font-black tracking-wide text-emerald-950 dark:text-emerald-50 sm:text-xl">Монгол од</span>
              <span className="mt-1 block truncate text-[0.68rem] font-bold uppercase tracking-[0.14em] text-emerald-950 dark:text-emerald-200 sm:text-sm sm:tracking-[0.16em]">
                Компани
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="relative text-sm font-semibold text-slate-800 transition-all after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-emerald-600 after:transition-all hover:font-extrabold hover:text-emerald-600 hover:drop-shadow-[0_0_10px_rgba(5,150,105,0.25)] hover:after:w-full dark:text-slate-200 dark:after:bg-emerald-300 dark:hover:text-emerald-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/login?redirect=/admin"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 shadow-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/15 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-slate-800 sm:h-11 sm:w-11"
              aria-label="Admin нэвтрэх"
              title="Admin нэвтрэх"
            >
              <LockKeyhole className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <a
              href="tel:+97686705445"
              className="hidden h-14 items-center gap-3 rounded-full bg-emerald-800 px-7 text-base font-bold text-white shadow-sm shadow-emerald-950/15 transition-colors hover:bg-emerald-900 lg:flex"
            >
              <Phone className="h-5 w-5" />
              86705445
            </a>
            <button
              onClick={() => setIsMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 shadow-sm transition-colors hover:bg-emerald-50 dark:border-white/15 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-slate-800 xl:hidden sm:h-11 sm:w-11"
              aria-label="Цэс нээх"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="absolute left-4 right-4 top-[calc(100%+0.5rem)] overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/15 dark:border-white/10 dark:bg-slate-950 sm:left-auto sm:right-6 sm:w-[22rem]">
            <div className="grid grid-cols-1 gap-1 p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={[
                    "block rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    activeHref === link.href ? "bg-emerald-800 text-white" : "text-slate-700 hover:bg-emerald-100 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-emerald-400/15 dark:hover:text-emerald-200",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-emerald-900/10 p-3">
              <a href="tel:+97686705445" className="flex h-12 items-center justify-center gap-3 rounded-full bg-emerald-800 px-5 text-sm font-bold text-white">
                <Phone className="h-4 w-4" />
                86705445
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
