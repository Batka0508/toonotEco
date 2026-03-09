"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#home", label: "Нүүр" },
  { href: "#about", label: "Бидний тухай" },
  { href: "#services", label: "Үйлчилгээ" },
  { href: "#projects", label: "Төслүүд" },
  { href: "#contact", label: "Холбоо барих" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-bold text-foreground">Mongol Od</span>
              <p className="text-xs text-muted-foreground -mt-1">Барилгын Компани</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a href="tel:+97611234567" className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground">
              <Phone className="w-4 h-4 text-primary" />
              +976 1123-4567
            </a>
            <Button className="hidden sm:flex">
              Үнийн санал авах
            </Button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Button className="mt-2 w-full">
                Үнийн санал авах
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
