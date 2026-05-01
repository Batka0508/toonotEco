import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CheckCircle2, Clock3, Home, Mail, MessageSquareText, UserRound } from "lucide-react"
import { getInquiriesForUser, type Inquiry } from "@/lib/inquiries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AccountPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const email = user.primaryEmailAddress?.emailAddress || ""
  const inquiries = getInquiriesForUser(user.id, email)

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-emerald-800/15 bg-white/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">User</p>
            <h1 className="font-serif text-xl font-bold text-foreground">Миний бүртгэл</h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Сайт руу</Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto grid gap-6 px-4 py-10">
        <Card className="max-w-4xl border-emerald-800/15 shadow-sm shadow-emerald-900/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{user.fullName || user.username || "Хэрэглэгч"}</CardTitle>
                <CardDescription>{email || "И-мэйл бүртгэлгүй"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-800/15 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                Бүртгэлийн и-мэйл
              </p>
              <p className="mt-2 break-words font-semibold text-foreground">{email || "И-мэйл байхгүй"}</p>
            </div>
            <div className="rounded-lg border border-emerald-800/15 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4 text-primary" />
                Борлуулалтын мэдээлэл
              </p>
              <Link href="/#apartments" className="mt-2 inline-block font-semibold text-primary hover:underline">
                Байрны сонголт харах
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-4xl border-emerald-800/15 shadow-sm shadow-emerald-900/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              Миний илгээсэн хүсэлтүүд
            </CardTitle>
            <CardDescription>Admin таны хүсэлтийг харсан эсэх болон хариуг эндээс харна.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {inquiries.length === 0 ? (
              <div className="rounded-lg border border-dashed border-emerald-800/20 bg-emerald-50/60 p-6 text-sm text-muted-foreground">
                Таны илгээсэн хүсэлт одоогоор алга байна. Contact form бөглөж илгээсний дараа энд харагдана.
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div key={inquiry.id} className="rounded-lg border border-emerald-800/15 bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{inquiry.apartment || "Сонголт сонгоогүй"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{new Date(inquiry.createdAt).toLocaleString("mn-MN")}</p>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${getInquiryStatusClass(inquiry.status)}`}>
                      {inquiry.status === "new" ? <Clock3 className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      {getInquiryStatusLabel(inquiry.status)}
                    </span>
                  </div>

                  {inquiry.message && <p className="mt-4 rounded bg-emerald-50 p-3 text-sm leading-relaxed text-muted-foreground">{inquiry.message}</p>}

                  {inquiry.adminReply ? (
                    <div className="mt-4 rounded-lg border border-primary/15 bg-primary/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin хариу</p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground">{inquiry.adminReply}</p>
                      {inquiry.repliedAt && <p className="mt-2 text-xs text-muted-foreground">{new Date(inquiry.repliedAt).toLocaleString("mn-MN")}</p>}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">Admin хариу хараахан ирээгүй байна.</p>
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

function getInquiryStatusLabel(status: Inquiry["status"]) {
  if (status === "closed") {
    return "Хаагдсан"
  }

  if (status === "contacted" || status === "read") {
    return "Админ хариу өгсөн"
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
