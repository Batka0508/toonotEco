import Link from "next/link"
import { MessageSquareText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { requestPasswordReset } from "../actions"

type ForgotPasswordPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/images/БББ.jpg')] bg-cover bg-center px-4 py-12">
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.2)_100%)]" />

      <Card className="relative z-10 w-full max-w-md border-white/20 bg-white/90 shadow-2xl shadow-black/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquareText className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">SMS код авах</CardTitle>
          <CardDescription>Бүртгэлтэй и-мэйл болон утсаа оруулбал сэргээх код илгээнэ</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={requestPasswordReset} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                И-мэйл
              </label>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="example@mail.com" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Бүртгэлтэй утас
              </label>
              <Input id="phone" name="phone" type="tel" placeholder="+976 ..." required />
            </div>
            {params?.error === "invalid" ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                И-мэйл болон утсаа бүрэн бөглөнө үү.
              </p>
            ) : null}
            {params?.error === "not-found" ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                И-мэйл эсвэл утас бүртгэлтэй таарахгүй байна.
              </p>
            ) : null}
            <Button type="submit" size="lg" className="w-full">
              SMS код илгээх
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Нууц үгээ санасан уу?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Нэвтрэх
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
