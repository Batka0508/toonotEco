import Link from "next/link"
import { LockKeyhole, UserRound } from "lucide-react"
import { loginUser } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type LoginPageProps = {
  searchParams: Promise<{ error?: string; reset?: string; redirect?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const isAdminMode = params.redirect === "/admin"
  const registerHref = params.redirect ? `/register?redirect=${encodeURIComponent(params.redirect)}` : "/register"

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/bair.jpg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/50" />

      <Card className="relative z-10 w-full max-w-md border-white/30 bg-white/95 shadow-xl shadow-slate-950/25 backdrop-blur">
        <CardHeader>
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              {isAdminMode ? <LockKeyhole className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
            </div>
            <Link
              href={isAdminMode ? "/login" : "/login?redirect=/admin"}
              className={[
                "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold transition-colors",
                isAdminMode
                  ? "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800"
                  : "border-emerald-700/25 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
              ].join(" ")}
            >
              <LockKeyhole className="h-3.5 w-3.5" />
              Admin
            </Link>
          </div>
          <CardTitle className="text-2xl">{isAdminMode ? "Admin нэвтрэх" : "Хэрэглэгч нэвтрэх"}</CardTitle>
          <CardDescription>
            {isAdminMode ? "Admin имэйл болон нууц үгээрээ самбар руу орно." : "Имэйл болон нууц үгээрээ сайт руу орно."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginUser} className="grid gap-4" autoComplete={isAdminMode ? "off" : "on"}>
            <input type="hidden" name="redirect" value={isAdminMode ? "/admin" : ""} />
            {isAdminMode && (
              <>
                <input className="hidden" tabIndex={-1} type="text" name="email" autoComplete="username" aria-hidden="true" />
                <input className="hidden" tabIndex={-1} type="password" name="password" autoComplete="current-password" aria-hidden="true" />
              </>
            )}
            {params.error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {isAdminMode ? "Admin имэйл эсвэл нууц үг буруу байна." : "Имэйл эсвэл нууц үг буруу байна."}
              </p>
            )}
            {params.reset && (
              <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">Нууц үг шинэчлэгдлээ. Одоо нэвтэрнэ үү.</p>
            )}
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              {isAdminMode ? "Admin имэйл" : "Имэйл"}
              <Input
                name={isAdminMode ? "adminLoginId" : "email"}
                type={isAdminMode ? "text" : "email"}
                inputMode="email"
                autoComplete={isAdminMode ? "new-password" : "email"}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore={isAdminMode ? "true" : undefined}
                data-1p-ignore={isAdminMode ? "true" : undefined}
                data-form-type={isAdminMode ? "other" : undefined}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Нууц үг
              <Input
                name={isAdminMode ? "adminSecret" : "password"}
                type={isAdminMode ? "text" : "password"}
                autoComplete={isAdminMode ? "new-password" : "current-password"}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore={isAdminMode ? "true" : undefined}
                data-1p-ignore={isAdminMode ? "true" : undefined}
                data-form-type={isAdminMode ? "other" : undefined}
                className={isAdminMode ? "[-webkit-text-security:disc]" : undefined}
                required
              />
            </label>
            <Button type="submit" className="w-full">
              {isAdminMode ? "Admin-аар орох" : "Нэвтрэх"}
            </Button>
          </form>

          {!isAdminMode && (
            <div className="mt-4 grid gap-2 text-center text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:underline">Нууц үг мартсан?</Link>
              <p className="text-slate-600">
                Бүртгэлгүй юу? <Link href={registerHref} className="font-semibold text-primary hover:underline">Бүртгүүлэх</Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
