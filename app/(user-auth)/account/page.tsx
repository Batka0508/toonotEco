import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Home, LogOut, Phone, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { USER_COOKIE_NAME, findUserByEmail, getUserEmailFromSession } from "@/lib/user-auth"
import { logoutUser } from "../actions"

export default async function AccountPage() {
  const cookieStore = await cookies()
  const email = getUserEmailFromSession(cookieStore.get(USER_COOKIE_NAME)?.value)

  if (!email) {
    redirect("/login")
  }

  const user = findUserByEmail(email)

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-emerald-800/15 bg-emerald-50/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">User</p>
            <h1 className="font-serif text-xl font-bold text-foreground">Миний бүртгэл</h1>
          </div>
          <form action={logoutUser}>
            <Button type="submit" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <LogOut className="h-4 w-4" />
              Гарах
            </Button>
          </form>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10">
        <Card className="max-w-3xl border-emerald-800/15 shadow-sm shadow-emerald-900/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-800/15 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                Утас
              </p>
              <p className="mt-2 font-semibold text-foreground">{user.phone}</p>
            </div>
            <div className="rounded-lg border border-emerald-800/15 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4 text-primary" />
                Сонирхсон хэсэг
              </p>
              <Link href="/#apartments" className="mt-2 inline-block font-semibold text-primary hover:underline">
                Байрны сонголт харах
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
