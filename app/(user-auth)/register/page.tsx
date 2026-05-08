import Link from "next/link"
import { registerUser } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type RegisterPageProps = {
  searchParams: Promise<{ error?: string; redirect?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const loginHref = params.redirect ? `/login?redirect=${encodeURIComponent(params.redirect)}` : "/login"

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md border-emerald-900/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Бүртгэл үүсгэх</CardTitle>
          <CardDescription>Энгийн бүртгэлээр шууд нэвтэрнэ.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={registerUser} className="grid gap-4">
            <input type="hidden" name="redirect" value={params.redirect || ""} />
            {params.error === "invalid" && <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">Бүх талбарыг бөглөж, нууц үгээ 6-аас дээш тэмдэгт болгоно уу.</p>}
            {params.error === "exists" && <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">Энэ имэйлээр бүртгэл үүссэн байна.</p>}
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Нэр
              <Input name="name" autoComplete="name" required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Имэйл
              <Input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Утас
              <Input name="phone" type="tel" autoComplete="tel" required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Нууц үг
              <Input name="password" type="password" autoComplete="new-password" minLength={6} required />
            </label>
            <Button type="submit" className="w-full">Бүртгүүлэх</Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Бүртгэлтэй юу? <Link href={loginHref} className="font-semibold text-primary hover:underline">Нэвтрэх</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
