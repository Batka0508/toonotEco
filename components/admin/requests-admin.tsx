import { Check, Mail, Phone, Trash2, User } from "lucide-react"
import { deleteInquiry, updateInquiryStatus } from "@/app/admin/actions"
import type { Inquiry } from "@/lib/inquiries"
import type { Apartment } from "@/lib/site-content"
import { ConfirmSubmitButton } from "@/components/confirm-submit-button"
import { AdminCard, AdminStatCard } from "@/components/admin/admin-ui"

const INQUIRY_TIME_OFFSET_MS = 4 * 60 * 60 * 1000

type RequestsAdminProps = {
  inquiries: Inquiry[]
  properties: Apartment[]
}

export function RequestsAdmin({ inquiries, properties }: RequestsAdminProps) {
  const propertyNames = new Map(properties.map((property) => [property.id, property.title]))

  const notContacted = inquiries.filter((i) => !isContacted(i.status) && i.status !== "closed")
  const contacted = inquiries.filter((i) => isContacted(i.status))
  const closed = inquiries.filter((i) => i.status === "closed")

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          icon={Mail}
          label="Нийт хүсэлт"
          value={inquiries.length}
          iconClassName="bg-violet-100 text-violet-600"
        />
        <AdminStatCard
          icon={Phone}
          label="Холбогдоогүй"
          value={notContacted.length}
          subtext="Шинэ хүсэлт"
          iconClassName="bg-amber-100 text-amber-600"
        />
        <AdminStatCard
          icon={Check}
          label="Холбогдсон"
          value={contacted.length}
          iconClassName="bg-emerald-100 text-emerald-600"
        />
        <AdminStatCard
          icon={User}
          label="Хаагдсан"
          value={closed.length}
          iconClassName="bg-slate-100 text-slate-600"
        />
      </div>

      {inquiries.length === 0 ? (
        <AdminCard className="p-10 text-center">
          <p className="text-sm text-slate-500">Одоогоор ирсэн хүсэлт алга байна.</p>
        </AdminCard>
      ) : (
        <>
          {notContacted.length > 0 && (
            <RequestSection
              title="Холбогдоогүй"
              description="Шинэ ирсэн хүсэлтүүд — холбогдсон товч дарж тэмдэглэнэ"
              badgeClassName="bg-amber-100 text-amber-700"
              inquiries={notContacted}
              propertyNames={propertyNames}
            />
          )}
          {contacted.length > 0 && (
            <RequestSection
              title="Холбогдсон"
              description="Ажилтан холбогдсон гэж тэмдэглэсэн хүсэлтүүд"
              badgeClassName="bg-emerald-100 text-emerald-700"
              inquiries={contacted}
              propertyNames={propertyNames}
            />
          )}
          {closed.length > 0 && (
            <RequestSection
              title="Хаагдсан"
              description="Дууссан хүсэлтүүд"
              badgeClassName="bg-slate-100 text-slate-600"
              inquiries={closed}
              propertyNames={propertyNames}
            />
          )}
        </>
      )}
    </div>
  )
}

function RequestSection({
  title,
  description,
  badgeClassName,
  inquiries,
  propertyNames,
}: {
  title: string
  description: string
  badgeClassName: string
  inquiries: Inquiry[]
  propertyNames: Map<string, string>
}) {
  return (
    <AdminCard>
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeClassName}`}>{inquiries.length}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Хэрэглэгч</th>
              <th className="px-3 py-3">Холбоо</th>
              <th className="px-3 py-3">Сонирхсон байр</th>
              <th className="px-3 py-3">Мессеж</th>
              <th className="px-3 py-3">Ирсэн</th>
              <th className="px-3 py-3">Төлөв</th>
              <th className="px-5 py-3 text-right">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <RequestRow key={inquiry.id} inquiry={inquiry} propertyNames={propertyNames} />
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  )
}

function RequestRow({
  inquiry,
  propertyNames,
}: {
  inquiry: Inquiry
  propertyNames: Map<string, string>
}) {
  const contacted = isContacted(inquiry.status)
  const apartmentLabel = propertyNames.get(inquiry.apartment) ?? inquiry.apartment ?? "—"

  return (
    <tr className="border-b border-slate-50 align-top transition-colors hover:bg-slate-50/50">
      <td className="px-5 py-4">
        <p className="font-semibold text-slate-900">{inquiry.name}</p>
        {inquiry.email && <p className="mt-0.5 text-xs text-slate-500">{inquiry.email}</p>}
      </td>
      <td className="px-3 py-4">
        <a href={`tel:${inquiry.phone}`} className="font-medium text-[#5d5fef] hover:underline">
          {inquiry.phone}
        </a>
      </td>
      <td className="px-3 py-4 text-slate-700">{apartmentLabel}</td>
      <td className="max-w-xs px-3 py-4">
        <p className="line-clamp-2 text-slate-600">{inquiry.message || "—"}</p>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-slate-500">{formatInquiryDate(inquiry.createdAt)}</td>
      <td className="px-3 py-4">
        <ContactToggle inquiryId={inquiry.id} contacted={contacted} />
      </td>
      <td className="px-5 py-4">
        <div className="flex justify-end gap-1">
          {!contacted && inquiry.status !== "closed" && (
            <form action={updateInquiryStatus}>
              <input type="hidden" name="id" value={inquiry.id} />
              <input type="hidden" name="status" value="closed" />
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Хаах
              </button>
            </form>
          )}
          <form action={deleteInquiry}>
            <input type="hidden" name="id" value={inquiry.id} />
            <ConfirmSubmitButton
              type="submit"
              message="Энэ хүсэлтийг устгах уу?"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </ConfirmSubmitButton>
          </form>
        </div>
      </td>
    </tr>
  )
}

function ContactToggle({ inquiryId, contacted }: { inquiryId: string; contacted: boolean }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-sm">
      <form action={updateInquiryStatus}>
        <input type="hidden" name="id" value={inquiryId} />
        <input type="hidden" name="status" value="new" />
        <button
          type="submit"
          className={[
            "cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]",
            !contacted
              ? "bg-amber-100 text-amber-800 shadow-sm ring-1 ring-amber-200 hover:bg-amber-200"
              : "text-slate-500 hover:bg-amber-50 hover:text-amber-800",
          ].join(" ")}
        >
          Холбогдоогүй
        </button>
      </form>
      <form action={updateInquiryStatus}>
        <input type="hidden" name="id" value={inquiryId} />
        <input type="hidden" name="status" value="contacted" />
        <button
          type="submit"
          className={[
            "cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]",
            contacted
              ? "bg-[#5d5fef] text-white shadow-sm ring-1 ring-[#5d5fef]/30 hover:bg-[#4f51e8]"
              : "text-slate-500 hover:bg-[#5d5fef]/10 hover:text-[#4f51e8]",
          ].join(" ")}
        >
          Холбогдсон
        </button>
      </form>
    </div>
  )
}

function isContacted(status: Inquiry["status"]) {
  return status === "contacted" || status === "read"
}

function formatInquiryDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Date(date.getTime() - INQUIRY_TIME_OFFSET_MS).toLocaleString("mn-MN")
}
