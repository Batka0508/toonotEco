import Link from "next/link"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { registerUser } from "../actions"

type RegisterPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/images/БББ.jpg')] bg-cover bg-center px-4 py-12">
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.2)_100%)]" />

      <Card className="relative z-10 w-full max-w-md border-white/20 bg-white/90 shadow-2xl shadow-black/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Бүртгүүлэх</CardTitle>
          <CardDescription>Байрны мэдээлэл авах хэрэглэгчийн бүртгэл</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={registerUser} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Нэр
              </label>
              <Input id="name" name="name" placeholder="Таны нэр" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Утас
              </label>
              <Input id="phone" name="phone" type="tel" placeholder="+976 ..." required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                И-мэйл
              </label>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="example@mail.com" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Нууц үг
              </label>
              <Input id="password" name="password" type="password" minLength={6} placeholder="6+ тэмдэгт" required />
            </div>
            {params?.error === "exists" ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Энэ и-мэйлээр бүртгэл үүссэн байна.
              </p>
            ) : null}
            {params?.error === "invalid" ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Мэдээллээ бүрэн бөглөнө үү. Нууц үг 6-аас дээш тэмдэгттэй байх хэрэгтэй.
              </p>
            ) : null}
            <Button type="submit" size="lg" className="w-full">
              Бүртгүүлэх
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Бүртгэлтэй юу?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Нэвтрэх
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
