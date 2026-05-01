"use client"

import { useState } from "react"
import Link from "next/link"
import { LockKeyhole, Menu, MessageSquareText, Phone, X } from "lucide-react"
import { Show, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

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
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-emerald-900/10 bg-slate-50/95 shadow-sm shadow-emerald-950/5 backdrop-blur-xl">
      <div className="mx-auto max-w-[1900px] px-4 sm:px-5">
        <div className="flex h-[102px] items-center justify-between gap-4">
          <Link href="/" onClick={() => handleNavClick("#home")} className="flex min-w-0 items-center gap-4">
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-primary shadow-md shadow-emerald-900/25">
              <span className="text-3xl font-bold leading-none text-primary-foreground">T</span>
            </div>
            <div className="min-w-0">
              <span className="block truncate font-serif text-2xl font-bold leading-tight text-emerald-950 sm:text-3xl">
                Тоонот Эко Хотхон
              </span>
              <p className="mt-1 truncate text-base text-emerald-950/70">Toonot Eco Hothon</p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2.5">
            <a
              href="tel:+97611111111"
              className="hidden h-12 items-center gap-3 rounded-lg border border-emerald-900/10 bg-white px-5 text-base font-bold text-emerald-950 shadow-sm shadow-emerald-900/5 transition-colors hover:border-primary/30 hover:text-primary lg:flex"
            >
              <Phone className="h-5 w-5 text-primary" />
              +976 1111-1111
            </a>
            <Show when="signed-in">
              <Button
                asChild
                variant="outline"
                className="hidden h-12 rounded-lg border-primary/25 bg-white px-4 text-base font-semibold text-primary shadow-sm shadow-emerald-900/5 hover:bg-primary/10 lg:flex"
              >
                <Link href="/account">
                  <MessageSquareText className="h-5 w-5" />
                  Миний хүсэлт
                </Link>
              </Button>
            </Show>
            <Button
              asChild
              variant="outline"
              className="hidden h-12 rounded-lg border-primary/25 bg-white px-5 text-base font-semibold text-primary shadow-sm shadow-emerald-900/5 hover:bg-primary/10 md:flex"
            >
              <Link href="/admin">
                <LockKeyhole className="h-5 w-5" />
                Admin
              </Link>
            </Button>
            <Button asChild className="hidden h-12 rounded-lg px-6 text-base font-bold shadow-sm shadow-emerald-900/15 hover:bg-emerald-700 sm:flex">
              <Link href="#contact" onClick={() => handleNavClick("#contact")}>
                Холбогдох
              </Link>
            </Button>
            <Show when="signed-in">
              <UserButton afterSignOutUrl="/sign-in" />
            </Show>
            <button
              onClick={() => setIsMenuOpen((value) => !value)}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-900/10 bg-white text-emerald-950 shadow-sm shadow-emerald-900/5 transition-colors hover:bg-emerald-100 hover:text-primary"
              aria-label="Цэс нээх"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="absolute right-4 top-[calc(100%+0.5rem)] w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/15 sm:right-5">
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
                      isActive ? "bg-primary text-primary-foreground" : "text-emerald-950/75 hover:bg-emerald-50 hover:text-primary",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
            <div className="grid gap-2 border-t border-emerald-900/10 p-3">
              <Show when="signed-in">
                <Button asChild variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                  <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                    <MessageSquareText className="h-4 w-4" />
                    Миний хүсэлт
                  </Link>
                </Button>
              </Show>
              <Button asChild className="w-full sm:hidden">
                <Link href="#contact" onClick={() => handleNavClick("#contact")}>
                  Холбогдох
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 md:hidden">
                <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                  <LockKeyhole className="h-4 w-4" />
                  Admin
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
