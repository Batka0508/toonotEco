"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-emerald-950 shadow-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/15 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-slate-800 sm:h-11 sm:w-11"
      aria-label={isDark ? "Light mode асаах" : "Dark mode асаах"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {mounted && isDark ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
    </button>
  )
}
