import Link from "next/link"
import { KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { findResetCode } from "@/lib/password-reset"
import { resetUserPassword } from "../actions"

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    email?: string
    phone?: string
    error?: string
    sent?: string
  }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams
  const email = params?.email || ""
  const phone = params?.phone || ""
  const resetCode = email && phone ? findResetCode(email, phone) : null

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/images/БББ.jpg')] bg-cover bg-center px-4 py-12">
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.2)_100%)]" />

      <Card className="relative z-10 w-full max-w-md border-white/20 bg-white/90 shadow-2xl shadow-black/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Нууц үг шинэчлэх</CardTitle>
          <CardDescription>Утсанд ирсэн 6 оронтой код болон шинэ нууц үгээ оруулна</CardDescription>
        </CardHeader>
        <CardContent>
          {params?.sent === "sent" ? (
            <p className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              SMS код таны дугаар руу илгээгдлээ.
            </p>
          ) : null}
          {params?.sent === "dev" && resetCode?.devCode ? (
            <p className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              SMS тохиргоо хийгдээгүй тул dev код: <span className="font-bold">{resetCode.devCode}</span>
            </p>
          ) : null}
          <form action={resetUserPassword} className="space-y-5">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="phone" value={phone} />
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-foreground">
                SMS код
              </label>
              <Input id="code" name="code" inputMode="numeric" maxLength={6} placeholder="123456" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Шинэ нууц үг
              </label>
              <Input id="password" name="password" type="password" minLength={6} placeholder="6+ тэмдэгт" required />
            </div>
            {params?.error === "invalid" ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Код болон шинэ нууц үгээ зөв бөглөнө үү.
              </p>
            ) : null}
            {params?.error === "code" ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                SMS код буруу эсвэл хугацаа дууссан байна.
              </p>
            ) : null}
            <Button type="submit" size="lg" className="w-full">
              Нууц үг шинэчлэх
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Код ирээгүй юу?{" "}
            <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
              Дахин код авах
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
