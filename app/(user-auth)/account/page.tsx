import Link from "next/link"
import { redirect } from "next/navigation"
import { Bell, CheckCircle2, Clock3, Home, Mail, MessageSquareText, UserRound } from "lucide-react"
import { getInquiriesForUser, type Inquiry } from "@/lib/inquiries"
import { getCurrentUser } from "@/lib/user-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logoutUser } from "../actions"

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const inquiries = await getInquiriesForUser(user.id, user.email)
  const replies = inquiries
    .filter((inquiry) => inquiry.adminReply)
    .sort((a, b) => new Date(b.repliedAt ?? b.createdAt).getTime() - new Date(a.repliedAt ?? a.createdAt).getTime())

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-emerald-900/10 bg-white/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Account</p>
            <h1 className="text-xl font-bold text-slate-950">Миний хүсэлтүүд</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/">Сайт руу</Link>
            </Button>
            <form action={logoutUser}>
              <Button type="submit" variant="outline">Гарах</Button>
            </form>
          </div>
        </div>
      </header>

      <section className="container mx-auto grid max-w-5xl gap-6 px-4 py-10">
        <Card className="border-emerald-900/10 shadow-sm shadow-emerald-900/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{user.name || "Хэрэглэгч"}</CardTitle>
                <CardDescription>{user.email || "И-мэйл бүртгэлгүй"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoTile icon={Mail} label="Бүртгэлийн и-мэйл" value={user.email || "И-мэйл байхгүй"} />
            <div className="rounded-lg border border-emerald-900/10 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Home className="h-4 w-4 text-primary" />
                Байрны мэдээлэл
              </p>
              <Link href="/#apartments" className="mt-2 inline-block font-bold text-primary hover:underline">
                Байрны сонголт харах
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-900/10 shadow-sm shadow-emerald-900/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Admin хариу notification
              {replies.length > 0 && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">{replies.length}</span>
              )}
            </CardTitle>
            <CardDescription>Admin-аас ирсэн хариунууд энд харагдана.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {replies.length === 0 ? (
              <div className="rounded-lg border border-dashed border-emerald-900/20 bg-emerald-50/70 p-6 text-sm text-slate-600">
                Одоогоор admin-аас ирсэн хариу алга байна.
              </div>
            ) : (
              replies.map((inquiry) => (
                <div key={inquiry.id} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm shadow-emerald-900/5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-primary">Шинэ хариу</p>
                      <h3 className="mt-1 font-bold text-slate-950">{inquiry.apartment || "Сонголт сонгоогүй"}</h3>
                    </div>
                    <span className="w-fit rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                      {formatDate(inquiry.repliedAt ?? inquiry.createdAt)}
                    </span>
                  </div>
                  <p className="mt-3 rounded-md bg-white p-3 text-sm leading-7 text-slate-700">{inquiry.adminReply}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-900/10 shadow-sm shadow-emerald-900/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              Илгээсэн бүх хүсэлт
            </CardTitle>
            <CardDescription>Таны contact form-оор илгээсэн хүсэлтүүд болон төлөв.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {inquiries.length === 0 ? (
              <div className="rounded-lg border border-dashed border-emerald-900/20 bg-white p-6 text-sm text-slate-600">
                Таны илгээсэн хүсэлт одоогоор алга байна.
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div key={inquiry.id} className="rounded-lg border border-emerald-900/10 bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-bold text-slate-950">{inquiry.apartment || "Сонголт сонгоогүй"}</p>
                      <p className="mt-1 text-sm text-slate-500">{formatDate(inquiry.createdAt)}</p>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${getInquiryStatusClass(inquiry.status)}`}>
                      {inquiry.status === "new" ? <Clock3 className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      {getInquiryStatusLabel(inquiry.status)}
                    </span>
                  </div>

                  {inquiry.message && <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-7 text-slate-600">{inquiry.message}</p>}

                  {inquiry.adminReply ? (
                    <div className="mt-4 rounded-lg border border-primary/15 bg-primary/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary">Admin хариу</p>
                      <p className="mt-2 text-sm leading-7 text-slate-800">{inquiry.adminReply}</p>
                      {inquiry.repliedAt && <p className="mt-2 text-xs text-slate-500">{formatDate(inquiry.repliedAt)}</p>}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">Admin хариу хараахан ирээгүй байна.</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-900/10 bg-emerald-50 p-4">
      <p className="flex items-center gap-2 text-sm text-slate-600">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </p>
      <p className="mt-2 break-words font-bold text-slate-950">{value}</p>
    </div>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("mn-MN")
}

function getInquiryStatusLabel(status: Inquiry["status"]) {
  if (status === "closed") {
    return "Хаагдсан"
  }

  if (status === "contacted" || status === "read") {
    return "Admin хариу өгсөн"
  }

  return "Шинэ хүсэлт"
}

function getInquiryStatusClass(status: Inquiry["status"]) {
  if (status === "closed") {
    return "bg-slate-200 text-slate-700"
  }

  if (status === "contacted" || status === "read") {
    return "bg-emerald-100 text-emerald-800"
  }

  return "bg-amber-100 text-amber-800"
}
