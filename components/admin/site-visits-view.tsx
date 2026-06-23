import { Activity, Eye, MousePointerClick, Users } from "lucide-react"
import type { SiteVisitStats } from "@/lib/site-visits"
import { AdminCard, AdminStatCard } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type SiteVisitsViewProps = {
  stats: SiteVisitStats
}

export function SiteVisitsView({ stats }: SiteVisitsViewProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          icon={Eye}
          label="Нийт хандалт"
          value={stats.totalVisits}
          subtext="Сайт руу орсон нийт тоо"
          iconClassName="bg-violet-100 text-violet-600"
        />
        <AdminStatCard
          icon={MousePointerClick}
          label="Өнөөдрийн хандалт"
          value={stats.todayVisits}
          subtext="Өнөөдөр бүртгэгдсэн оролт"
          iconClassName="bg-emerald-100 text-emerald-600"
        />
        <AdminStatCard
          icon={Users}
          label="Өнөөдрийн хүн"
          value={stats.todayUniqueVisitors}
          subtext="Давхардалгүй visitor"
          iconClassName="bg-sky-100 text-sky-600"
        />
        <AdminStatCard
          icon={Activity}
          label="Одоо идэвхтэй"
          value={stats.activeVisitors}
          subtext="Сүүлийн 75 секунд"
          iconClassName="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminCard>
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-bold text-slate-900">Их орсон хуудсууд</h2>
            <p className="mt-1 text-sm text-slate-500">Visitor ping дээр үндэслэсэн page ranking.</p>
          </div>
          <div className="p-5">
            {stats.topPages.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                Одоогоор хандалт бүртгэгдээгүй байна.
              </p>
            ) : (
              <div className="grid gap-3">
                {stats.topPages.map((page) => (
                  <div key={page.path} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <span className="min-w-0 truncate text-sm font-semibold text-slate-800">{page.path}</span>
                    <span className="rounded-full bg-[#5d5fef]/10 px-3 py-1 text-xs font-bold text-[#4f51e8]">
                      {page.visits}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-bold text-slate-900">Сүүлийн хандалтууд</h2>
            <p className="mt-1 text-sm text-slate-500">Сүүлийн бүртгэгдсэн visitor event-үүд.</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Хуудас</TableHead>
                  <TableHead>Эх сурвалж</TableHead>
                  <TableHead>Огноо</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentVisits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-sm text-slate-500">
                      Хандалт хараахан бүртгэгдээгүй байна.
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-semibold text-slate-900">{visit.path}</TableCell>
                      <TableCell className="max-w-[14rem] truncate text-slate-600">{visit.referrer || "Шууд"}</TableCell>
                      <TableCell>{formatVisitDate(visit.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </AdminCard>
      </div>
    </div>
  )
}

function formatVisitDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString("mn-MN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}
