"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { LockKeyhole, Menu, Phone, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "/#home", label: "Нүүр" },
  { href: "/#vr-tour", label: "3D аялал" },
  { href: "/#about", label: "Төслийн тухай" },
  { href: "/#location", label: "Байршил" },
  { href: "/apartments", label: "Байрууд" },
  { href: "/garages", label: "Гарааш" },
  { href: "/#gallery", label: "Зургийн цомог" },
  { href: "/#contact", label: "Холбоо барих" },
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
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-20 lg:h-24 lg:gap-4">
          <Link
            href="/"
            onClick={() => handleNavClick("#home")}
            className="flex min-w-0 max-w-[62vw] items-center gap-2 sm:max-w-none sm:gap-3"
            aria-label="Нүүр хуудас"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-sm shadow-emerald-950/10 sm:h-18 sm:w-18 lg:h-20 lg:w-20">
              <Image src="/logo.png" alt="Монгол Од Компани" fill sizes="(min-width: 1024px) 72px, (min-width: 640px) 64px, 48px" className="object-cover" priority />
            </div>
            <div className="min-w-0 leading-none">
              <span className="block whitespace-nowrap text-sm font-black tracking-wide text-emerald-950 dark:text-emerald-50 sm:text-xl">Монгол Од</span>
              <span className="mt-1 block whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-[0.1em] text-emerald-950 dark:text-emerald-200 sm:text-sm sm:tracking-[0.16em]">
                Компани
              </span>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-5 px-4 xl:flex 2xl:gap-8 2xl:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="relative whitespace-nowrap text-sm font-semibold text-slate-800 transition-all after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-emerald-600 after:transition-all hover:text-emerald-600 hover:drop-shadow-[0_0_10px_rgba(5,150,105,0.25)] hover:after:w-full dark:text-slate-200 dark:after:bg-emerald-300 dark:hover:text-emerald-300 2xl:text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 2xl:gap-3">
            <ThemeToggle />
            <Link
              href="/login?redirect=/admin"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 shadow-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/15 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-slate-800 sm:h-11 sm:w-11"
              aria-label="Admin нэвтрэх"
              title="Admin нэвтрэх"
            >
              <LockKeyhole className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <a
              href="tel:+97686705445"
              className="hidden h-11 items-center gap-2 rounded-full bg-emerald-800 px-4 text-sm font-bold text-white shadow-sm shadow-emerald-950/15 transition-colors hover:bg-emerald-900 2xl:flex 2xl:h-14 2xl:gap-3 2xl:px-7 2xl:text-base"
            >
              <Phone className="h-4 w-4 2xl:h-5 2xl:w-5" />
              86705445
            </a>
            <button
              onClick={() => setIsMenuOpen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 shadow-sm transition-colors hover:bg-emerald-50 dark:border-white/15 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-slate-800 xl:hidden sm:h-11 sm:w-11"
              aria-label="Цэс нээх"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="absolute left-3 right-3 top-[calc(100%+0.5rem)] z-50 max-h-[calc(100svh-5rem)] overflow-y-auto rounded-2xl border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/15 dark:border-white/10 dark:bg-slate-950 sm:left-auto sm:right-5 sm:w-[22rem] lg:right-6 xl:hidden">
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
