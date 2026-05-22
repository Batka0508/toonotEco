"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollBlurHeader } from "@/components/motion-primitives"

const navLinks = [
  { href: "/#home", label: "Нүүр" },
  { href: "/#about", label: "Төслийн тухай" },
  { href: "/#location", label: "Байршил" },
  { href: "/apartments", label: "Байрууд" },
  { href: "/apartments#vr-tour", label: "3D аялал" },
  { href: "/garages", label: "Гарааш" },
  { href: "/#gallery", label: "Зургийн цомог" },
  { href: "/#contact", label: "Холбоо барих" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState("/#home")

  const handleNavClick = (href: string) => {
    setActiveHref(href)
    setIsMenuOpen(false)
  }

  return (
    <ScrollBlurHeader className="sticky top-0 z-40 border-b border-slate-900/10 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/92">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="flex h-16 items-center gap-3 sm:h-[4.5rem] lg:h-20 lg:gap-6">
          <Link
            href="/"
            onClick={() => handleNavClick("/#home")}
            className="flex shrink-0 items-center gap-2.5 sm:gap-3"
            aria-label="Нүүр хуудас"
          >
            <div className="relative h-11 w-11 shrink-0 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
              <Image
                src="/logo.png"
                alt="Монгол Од Компани"
                fill
                sizes="(min-width: 1024px) 56px, (min-width: 640px) 48px, 44px"
                className="object-contain object-center dark:brightness-[1.15] dark:contrast-[1.05]"
                priority
              />
            </div>
            <div className="flex flex-col items-center justify-center text-center leading-none">
              <span className="whitespace-nowrap text-sm font-black tracking-wide text-emerald-950 dark:text-emerald-50 sm:text-base lg:text-lg">
                Монгол Од
              </span>
              <span className="mt-1 whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-[0.14em] text-emerald-800 dark:text-emerald-300 sm:text-xs sm:tracking-[0.16em]">
                Компани
              </span>
            </div>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 xl:flex 2xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="relative shrink-0 whitespace-nowrap text-sm font-semibold leading-none text-slate-800 transition-all after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-emerald-600 after:transition-all hover:text-emerald-600 hover:after:w-full dark:text-slate-200 dark:after:bg-emerald-300 dark:hover:text-emerald-300 2xl:text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-emerald-950 transition-colors hover:bg-emerald-50 dark:text-emerald-100 dark:hover:bg-slate-800 xl:hidden sm:h-10 sm:w-10"
              aria-label="Цэс нээх"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                    activeHref === link.href
                      ? "bg-emerald-800 text-white"
                      : "text-slate-700 hover:bg-emerald-100 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-emerald-400/15 dark:hover:text-emerald-200",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </ScrollBlurHeader>
  )
}
