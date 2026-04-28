import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { USER_COOKIE_NAME, getUserEmailFromSession } from "@/lib/user-auth"
import { loginUser } from "../actions"

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string
    reset?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies()
  const userEmail = getUserEmailFromSession(cookieStore.get(USER_COOKIE_NAME)?.value)

  if (userEmail) {
    redirect("/#apartments")
  }

  const params = await searchParams

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/images/БББ.jpg')] bg-cover bg-center px-4 py-12">
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.2)_100%)]" />

      <Card className="relative z-10 w-full max-w-md border-white/20 bg-white/90 shadow-2xl shadow-black/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Хэрэглэгч нэвтрэх</CardTitle>
          <CardDescription>Нэвтэрсний дараа борлуулалтын мэдээлэл рүү орно</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginUser} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                И-мэйл
              </label>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="example@mail.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Нууц үг
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                  Нууц үг мартсан уу?
                </Link>
              </div>
              <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Нууц үг" required />
            </div>
            {params?.error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                И-мэйл эсвэл нууц үг буруу байна.
              </p>
            ) : null}
            {params?.reset ? (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Нууц үг амжилттай шинэчлэгдлээ. Шинэ нууц үгээрээ нэвтэрнэ үү.
              </p>
            ) : null}
            <Button type="submit" size="lg" className="w-full">
              Нэвтрэх
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Бүртгэлгүй юу?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Бүртгүүлэх
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
