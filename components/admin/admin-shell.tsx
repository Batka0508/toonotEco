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
    <div className="min-h-screen bg-[#f0f2f5]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Цэс хаах"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#1a1f36] text-white shadow-xl transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Цэс хаах"
          className="absolute right-3 top-4 rounded-md p-1 text-white/70 hover:bg-white/10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        {sidebar}
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <div className="sticky top-0 z-20">
          <div className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-4 py-3 shadow-sm sm:px-6">
            <button
              type="button"
              aria-label="Цэс нээх"
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">{header}</div>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        {footer}
      </div>
    </div>
  )
}
