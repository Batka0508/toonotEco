import { ChevronDown } from "lucide-react"
import type { AdminNotification } from "@/lib/admin-notifications"
import { AdminNotifications } from "@/components/admin/admin-notifications"

type AdminHeaderProps = {
  title: string
  email: string
  notifications: AdminNotification[]
}

export function AdminHeader({ title, email, notifications }: AdminHeaderProps) {
  const displayName = email.split("@")[0] || "Admin"

  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-2 sm:gap-4">
      <h1 className="min-w-0 flex-1 truncate text-base font-bold text-slate-900 sm:text-xl">{title}</h1>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:gap-5">
        <AdminNotifications notifications={notifications} />

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5d5fef] to-[#7c7ff5] text-sm font-bold text-white sm:h-10 sm:w-10">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 lg:block" />
        </div>
      </div>
    </div>
  )
}
