import Link from "next/link"
import {
  BarChart3,
  Bell,
  Building2,
  Car,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Wallet,
} from "lucide-react"
import { logoutUser } from "@/app/(user-auth)/actions"
import { NotificationNavBadge } from "@/components/admin/notification-nav-badge"
import type { AdminView } from "@/lib/admin-types"
import type { AdminNotification } from "@/lib/admin-notifications"

type NavItemConfig = {
  id: string
  href: string
  icon: typeof LayoutDashboard
  label: string
  matchViews: AdminView[]
  countKey?: "requests" | "chatbot" | "notifications"
}

const navItems: NavItemConfig[] = [
  { id: "dashboard", href: "/admin", icon: LayoutDashboard, label: "Хяналтын самбар", matchViews: ["dashboard"] },
  { id: "properties", href: "/admin?view=properties", icon: Building2, label: "Байр", matchViews: ["properties", "add"] },
  { id: "garages", href: "/admin?view=garages", icon: Car, label: "Гараж", matchViews: ["garages"] },
  { id: "requests", href: "/admin?view=requests", icon: ClipboardList, label: "Захиалга", matchViews: ["requests"], countKey: "requests" },
  { id: "chatbot", href: "/admin?view=chatbot", icon: Users, label: "Харилцагчид", matchViews: ["chatbot"], countKey: "chatbot" },
  { id: "payments", href: "/admin?view=requests", icon: Wallet, label: "Төлбөрүүд", matchViews: [] },
  { id: "reports", href: "/admin?view=reports", icon: BarChart3, label: "Тайлан", matchViews: ["reports"] },
  { id: "notifications", href: "/admin?view=notifications", icon: Bell, label: "Мэдэгдэл", matchViews: ["notifications"], countKey: "notifications" },
  { id: "settings", href: "/admin?view=content", icon: Settings, label: "Тохиргоо", matchViews: ["content"] },
]

type AdminSidebarProps = {
  activeView: AdminView
  newRequests: number
  chatbotCount: number
  notifications: AdminNotification[]
}

export function AdminSidebar({ activeView, newRequests, chatbotCount, notifications }: AdminSidebarProps) {
  const counts = { requests: newRequests, chatbot: chatbotCount, notifications: notifications.length }

  return (
    <div className="flex h-full flex-col px-4 py-6">
      <div className="mb-8 flex items-center gap-3 pr-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5d5fef]">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">Тоонот Эко</p>
          <p className="text-[11px] text-white/60">Admin System</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = item.matchViews.includes(activeView)
          const count = item.countKey ? counts[item.countKey] : undefined

          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-[#5d5fef] text-white" : "text-white/75 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <span className="flex min-w-0 items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
              {item.countKey === "notifications" ? (
                <NotificationNavBadge notifications={notifications} active={active} />
              ) : (
                !!count &&
                count > 0 && (
                  <span className={active ? "rounded-full bg-white/20 px-2 py-0.5 text-xs" : "rounded-full bg-[#5d5fef]/40 px-2 py-0.5 text-xs"}>
                    {count}
                  </span>
                )
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <form action={logoutUser}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Гарах
          </button>
        </form>
      </div>
    </div>
  )
}
