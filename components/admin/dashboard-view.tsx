import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  Car,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { deleteApartment } from "@/app/admin/actions"
import type { ChatbotLead } from "@/lib/chatbot-leads"
import type { Garage } from "@/lib/garages"
import type { Inquiry } from "@/lib/inquiries"
import type { Apartment } from "@/lib/site-content"
import type { SiteVisitStats } from "@/lib/site-visits"
import { getApartmentImages } from "@/lib/site-content"
import { Button } from "@/components/ui/button"
import { SalesDonutChart } from "@/components/admin/sales-donut-chart"
import { AdminCard, AdminStatCard, StatusPill } from "@/components/admin/admin-ui"

type DashboardViewProps = {
  apartments: Apartment[]
  garages: Garage[]
  inquiries: Inquiry[]
  chatbotLeads: ChatbotLead[]
  visitStats: SiteVisitStats
}

type RecentRow = {
  id: string
  image: string
  name: string
  type: string
  block: string
  floor: string
  area: string
  price: string
  status: "available" | "reserved" | "sold"
  isGarage: boolean
}

export function DashboardView({ apartments, garages, inquiries, chatbotLeads, visitStats }: DashboardViewProps) {
  const soldApartments = apartments.filter((p) => p.status === "sold").length
  const reservedApartments = apartments.filter((p) => p.status === "reserved").length
  const availableApartments = apartments.filter((p) => (p.status ?? "available") === "available").length
  const soldGarages = garages.filter((g) => g.status === "sold").length
  const reservedGarages = garages.filter((g) => g.status === "reserved").length
  const reservedTotal = reservedApartments + reservedGarages

  const recentRows: RecentRow[] = [
    ...apartments.map((p) => ({
      id: p.id,
      image: getApartmentImages(p)[0] ?? "/placeholder.jpg",
      name: p.title,
      type: "Орон сууц",
      block: p.district || p.location || "—",
      floor: p.floor || "—",
      area: p.area,
      price: p.price,
      status: (p.status ?? "available") as RecentRow["status"],
      isGarage: false,
    })),
    ...garages.map((g) => ({
      id: g.id,
      image: g.image || "/zogsool.jpg",
      name: g.number,
      type: "Гараж",
      block: g.block,
      floor: g.floor,
      area: g.area,
      price: g.price,
      status: g.status,
      isGarage: true,
    })),
  ].slice(0, 6)

  const activities = buildActivities(apartments, garages, inquiries, chatbotLeads)

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <AdminStatCard
          icon={Building2}
          label="Нийт байр"
          value={apartments.length}
          subtext={`${availableApartments} боломжтой`}
          iconClassName="bg-violet-100 text-violet-600"
        />
        <AdminStatCard
          icon={CheckCircle2}
          label="Борлуулсан байр"
          value={soldApartments}
          subtext={`${soldGarages} гараж борлуулсан`}
          iconClassName="bg-emerald-100 text-emerald-600"
        />
        <AdminStatCard
          icon={ShoppingCart}
          label="Захиалгатай"
          value={reservedTotal}
          subtext={`${inquiries.filter((i) => i.status === "new").length} шинэ хүсэлт`}
          iconClassName="bg-amber-100 text-amber-600"
        />
        <AdminStatCard
          icon={Car}
          label="Нийт гараж"
          value={garages.length}
          subtext={`${garages.filter((g) => g.status === "available").length} боломжтой`}
          iconClassName="bg-sky-100 text-sky-600"
        />
        <AdminStatCard
          icon={Wallet}
          label="Нийт хүсэлт"
          value={inquiries.length}
          subtext={`${chatbotLeads.length} AI lead`}
          iconClassName="bg-red-100 text-red-600"
        />
        <AdminStatCard
          icon={Eye}
          label="Өнөөдрийн хандалт"
          value={visitStats.todayVisits}
          subtext={`${visitStats.activeVisitors} одоо идэвхтэй`}
          iconClassName="bg-indigo-100 text-indigo-600"
        />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,1fr)]">
        <AdminCard>
          <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <h2 className="min-w-0 text-base font-bold text-slate-900">Сүүлийн үл хөдлөх хөрөнгүүд</h2>
            <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center">
              <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-[#5d5fef] focus:ring-2 focus:ring-[#5d5fef]/20">
                <option>Бүгд</option>
                <option>Боломжтой</option>
                <option>Захиалгатай</option>
                <option>Борлуулсан</option>
              </select>
              <Link
                href="/admin?view=add"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#5d5fef] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4f51e8]"
              >
                <Plus className="h-4 w-4" />
                Шинээр нэмэх
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-3 py-3">Зураг</th>
                  <th className="px-3 py-3">Нэр</th>
                  <th className="px-3 py-3">Төрөл</th>
                  <th className="px-3 py-3">Блок</th>
                  <th className="px-3 py-3">Давхар</th>
                  <th className="px-3 py-3">Талбай</th>
                  <th className="px-3 py-3">Үнэ</th>
                  <th className="px-3 py-3">Байдал</th>
                  <th className="px-5 py-3 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {recentRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-medium text-slate-600">{row.id.slice(0, 8)}</td>
                    <td className="px-3 py-3">
                      <div className="relative h-10 w-14 overflow-hidden rounded-md bg-slate-100">
                        <Image src={row.image} alt={row.name} fill sizes="56px" className="object-cover" />
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-900">{row.name}</td>
                    <td className="px-3 py-3 text-slate-600">{row.type}</td>
                    <td className="px-3 py-3 text-slate-600">{row.block}</td>
                    <td className="px-3 py-3 text-slate-600">{row.floor}</td>
                    <td className="px-3 py-3 text-slate-600">{row.area}</td>
                    <td className="px-3 py-3 font-medium text-slate-800">{row.price}</td>
                    <td className="px-3 py-3">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-[#5d5fef]">
                          <Link href={row.isGarage ? `/admin?view=garages&edit=${row.id}` : `/admin?view=properties&edit=${row.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        {!row.isGarage && (
                          <form action={deleteApartment}>
                            <input type="hidden" name="id" value={row.id} />
                            <Button type="submit" size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-3">
            <Link href="/admin?view=properties" className="inline-flex items-center gap-1 text-sm font-semibold text-[#5d5fef] hover:text-[#4f51e8]">
              Бүгдийг харах
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AdminCard>

        <div className="grid gap-6">
          <AdminCard className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#5d5fef]" />
              <h2 className="text-base font-bold text-slate-900">Борлуулалтын статистик</h2>
            </div>
            <SalesDonutChart apartmentSold={soldApartments} garageSold={soldGarages} reserved={reservedTotal} />
          </AdminCard>

          <AdminCard>
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">Сүүлийн үйл ажиллагаа</h2>
            </div>
            <ul className="divide-y divide-slate-50 px-5">
              {activities.map((activity) => (
                <li key={activity.id} className="flex gap-3 py-4">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}>
                    <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{activity.text}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 px-5 py-3">
              <Link href="/admin?view=requests" className="inline-flex items-center gap-1 text-sm font-semibold text-[#5d5fef] hover:text-[#4f51e8]">
                Бүгдийг харах
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  )
}

function buildActivities(
  apartments: Apartment[],
  garages: Garage[],
  inquiries: Inquiry[],
  chatbotLeads: ChatbotLead[],
) {
  const items: {
    id: string
    text: string
    time: string
    icon: typeof CheckCircle2
    iconBg: string
    iconColor: string
  }[] = []

  const sold = apartments.find((p) => p.status === "sold")
  if (sold) {
    items.push({
      id: `sold-${sold.id}`,
      text: `${sold.title} байр амжилттай борлуулагдлаа`,
      time: "Сүүлийн шинэчлэлт",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    })
  }

  const reserved = apartments.find((p) => p.status === "reserved")
  if (reserved) {
    items.push({
      id: `reserved-${reserved.id}`,
      text: `${reserved.title} байр захиалгатай боллоо`,
      time: "Сүүлийн шинэчлэлт",
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    })
  }

  const latestGarage = garages[garages.length - 1]
  if (latestGarage) {
    items.push({
      id: `garage-${latestGarage.id}`,
      text: `${latestGarage.number} гараж шинээр нэмэгдлээ`,
      time: "Сүүлийн шинэчлэлт",
      icon: FileText,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
    })
  }

  const latestInquiry = inquiries[0]
  if (latestInquiry) {
    items.push({
      id: `inquiry-${latestInquiry.id}`,
      text: `${latestInquiry.name} холбоо барих хүсэлт илгээлээ`,
      time: formatRelativeTime(latestInquiry.createdAt),
      icon: FileText,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    })
  } else if (chatbotLeads[0]) {
    const lead = chatbotLeads[0]
    items.push({
      id: `lead-${lead.id}`,
      text: `${lead.name} AI чатботоор холбогдлоо`,
      time: formatRelativeTime(lead.createdAt),
      icon: FileText,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    })
  }

  return items.slice(0, 3)
}

function formatRelativeTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return "Саяхан"
  if (diffHours < 24) return `Өнөөдөр ${date.toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" })}`
  return date.toLocaleDateString("mn-MN")
}
