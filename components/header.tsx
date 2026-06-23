"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, Phone, X } from "lucide-react"
import { ScrollBlurHeader } from "@/components/motion-primitives"

const navLinks = [
  { href: "/#home", label: "Нүүр" },
  { href: "/#about", label: "Төслийн тухай" },
  { href: "/#location", label: "Байршил" },
  { href: "/apartments", label: "Байрууд" },
  { href: "/apartments#vr-tour", label: "3D аялал" },
  { href: "/garages", label: "Гарааш" },
  { href: "/#gallery", label: "Зургийн цомог" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState("/#home")

  const handleNavClick = (href: string) => {
    setActiveHref(href)
    setIsMenuOpen(false)
  }

  return (
    <ScrollBlurHeader className="sticky top-0 z-40 border-b border-white/10 bg-[#071513]/92 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="flex h-16 items-center gap-3 sm:h-[4.5rem] lg:h-20 lg:gap-6">
          <Link
            href="/"
            onClick={() => handleNavClick("/#home")}
            className="flex shrink-0 items-center gap-2.5 sm:gap-3"
            aria-label="Нүүр хуудас"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-11 sm:w-11">
              <Image
                src="/logo.png"
                alt="Монгол Од Компани"
                fill
                sizes="44px"
                className="scale-125 object-cover object-center brightness-[1.12] contrast-[1.08]"
                priority
              />
            </div>
            <div className="leading-none">
              <span className="block whitespace-nowrap text-lg font-black tracking-wide text-white sm:text-xl">
                Монгол Од
              </span>
              <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/62">
                Компани
              </span>
            </div>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 xl:flex 2xl:gap-5">
            {navLinks.map((link) => {
              const isActive = activeHref === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={[
                    "relative shrink-0 whitespace-nowrap px-2 py-3 text-sm font-semibold leading-none transition-colors 2xl:text-[0.95rem]",
                    isActive ? "text-white" : "text-white/72 hover:text-white",
                    "after:absolute after:bottom-1 after:left-2 after:h-0.5 after:rounded-full after:bg-[#8fcd4f] after:transition-all",
                    isActive ? "after:w-7" : "after:w-0 hover:after:w-7",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <a
              href="tel:+97675058877"
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-white/82 transition-colors hover:bg-white/8 hover:text-white lg:flex"
            >
              <Phone className="h-4 w-4 text-[#8fcd4f]" />
              75058877
            </a>
            <Link
              href="/#contact"
              onClick={() => handleNavClick("/#contact")}
              className="hidden rounded-full bg-[#7ec243] px-5 py-3 text-sm font-black text-[#10210f] shadow-[0_12px_30px_rgba(126,194,67,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#91d956] sm:inline-flex"
            >
              Захиалга өгөх
            </Link>
            <button
              onClick={() => setIsMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-colors hover:bg-white/14 xl:hidden"
              aria-label="Цэс нээх"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="absolute left-3 right-3 top-[calc(100%+0.5rem)] z-50 max-h-[calc(100svh-5rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#071513]/96 p-2 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:left-auto sm:right-5 sm:w-[22rem] lg:right-6 xl:hidden">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={[
                    "block rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    activeHref === link.href
                      ? "bg-[#7ec243] text-[#10210f]"
                      : "text-white/78 hover:bg-white/8 hover:text-white",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:+97675058877"
                className="mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white/82 hover:bg-white/8 hover:text-white"
              >
                <Phone className="h-4 w-4 text-[#8fcd4f]" />
                75058877
              </a>
              <Link
                href="/#contact"
                onClick={() => handleNavClick("/#contact")}
                className="mt-1 rounded-xl bg-[#7ec243] px-4 py-3 text-center text-sm font-black text-[#10210f]"
              >
                Захиалга өгөх
              </Link>
            </div>
          </nav>
        )}
      </div>
    </ScrollBlurHeader>
  )
}
