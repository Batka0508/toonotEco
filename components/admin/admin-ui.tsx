import type { LucideIcon } from "lucide-react"

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5 ${className}`}>
      {children}
    </div>
  )
}

export function AdminStatCard({
  icon: Icon,
  label,
  value,
  subtext,
  iconClassName,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  subtext?: string
  iconClassName: string
}) {
  return (
    <AdminCard className="p-5">
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
          {subtext && <p className="mt-1 text-xs text-slate-400">{subtext}</p>}
        </div>
      </div>
    </AdminCard>
  )
}

export function AdminPrimaryButton({
  children,
  className = "",
  ...props
}: React.ComponentProps<"button"> & { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#5d5fef] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4f51e8] ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function StatusPill({
  status,
}: {
  status: "available" | "reserved" | "sold"
}) {
  const styles = {
    available: "bg-emerald-100 text-emerald-700",
    reserved: "bg-amber-100 text-amber-700",
    sold: "bg-red-100 text-red-700",
  }
  const labels = {
    available: "Боломжтой",
    reserved: "Захиалгатай",
    sold: "Борлуулсан",
  }

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export function Notice({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  const classes =
    tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
  return (
    <div
      role={tone === "success" ? "status" : "alert"}
      className={`mb-5 rounded-lg border px-4 py-3 text-sm font-semibold shadow-sm ${classes}`}
    >
      {children}
    </div>
  )
}
