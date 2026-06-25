"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

type AdminShellProps = {
  sidebar: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}

export function AdminShell({ sidebar, header, footer, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Цэс хаах"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-[17rem] max-w-[82vw] flex-col bg-[#1a1f36] text-white shadow-xl transition-transform duration-200 md:w-60 md:translate-x-0 lg:w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Цэс хаах"
          className="absolute right-3 top-4 rounded-md p-1 text-white/70 hover:bg-white/10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        {sidebar}
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col bg-white md:pl-60 lg:pl-64">
        <div className="sticky top-0 z-20">
          <div className="flex min-w-0 items-center gap-2 border-b border-slate-200/80 bg-white px-3 py-3 shadow-sm sm:gap-3 sm:px-5 lg:px-8">
            <button
              type="button"
              aria-label="Цэс нээх"
              className="shrink-0 rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">{header}</div>
          </div>
        </div>

        <main className="min-w-0 flex-1 bg-white px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-6">{children}</main>
        {footer}
      </div>
    </div>
  )
}
