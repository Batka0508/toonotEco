import Image from "next/image"
import { cookies } from "next/headers"
import { Home, ImageIcon, LockKeyhole, LogOut, Save, ShieldCheck, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ADMIN_COOKIE_NAME, isValidAdminSession } from "@/lib/admin-auth"
import { getSiteContent } from "@/lib/site-content"
import { loginAdmin, logoutAdmin, updateApartment } from "./actions"

type AdminPageProps = {
  searchParams?: Promise<{
    error?: string
    saved?: string
  }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const isLoggedIn = isValidAdminSession(session)
  const params = await searchParams

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,var(--background)_0%,oklch(0.94_0.052_139)_100%)] px-4 py-12">
        <Card className="w-full max-w-md border-emerald-800/15 shadow-xl shadow-emerald-900/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Тоонот Эко Хотхоны удирдлагын хэсэг</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={loginAdmin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  Нэвтрэх нэр
                </label>
                <Input id="username" name="username" autoComplete="username" placeholder="admin" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Нууц үг
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Нууц үг"
                  required
                />
              </div>
              {params?.error ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Нэвтрэх нэр эсвэл нууц үг буруу байна.
                </p>
              ) : null}
              <Button type="submit" size="lg" className="w-full">
                Нэвтрэх
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  }

  const content = getSiteContent()

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-emerald-800/15 bg-emerald-50/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Admin</p>
            <h1 className="font-serif text-xl font-bold text-foreground">Байрны мэдээлэл засах</h1>
          </div>
          <form action={logoutAdmin}>
            <Button type="submit" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <LogOut className="h-4 w-4" />
              Гарах
            </Button>
          </form>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-8 rounded-lg border border-emerald-800/15 bg-card p-6 shadow-sm shadow-emerald-900/5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-foreground">Борлуулалтын мэдээлэл</h2>
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                Эндээс байрны нэр, м², 1 м² үнэ, нийт үнэ, tag болон зургийг засна. Хадгалсны дараа нүүр хуудсан дээрх
                “Байрны сонголт” хэсэг шинэчлэгдэнэ.
              </p>
              {params?.saved ? (
                <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                  Амжилттай хадгаллаа.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {content.apartments.map((apartment) => (
            <Card key={apartment.id} className="border-emerald-800/15 shadow-sm shadow-emerald-900/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{apartment.title}</CardTitle>
                    <CardDescription>{apartment.area} | {apartment.price}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form action={updateApartment} className="grid gap-6 lg:grid-cols-[18rem_1fr]">
                  <input type="hidden" name="id" value={apartment.id} />

                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-emerald-800/15 bg-muted">
                      <Image src={apartment.image} alt={apartment.title} fill className="object-cover" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Одоогийн зураг: {apartment.image}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor={`${apartment.id}-title`} className="text-sm font-medium text-foreground">
                        Гарчиг
                      </label>
                      <Input id={`${apartment.id}-title`} name="title" defaultValue={apartment.title} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`${apartment.id}-tag`} className="text-sm font-medium text-foreground">
                        Tag
                      </label>
                      <Input id={`${apartment.id}-tag`} name="tag" defaultValue={apartment.tag} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`${apartment.id}-area`} className="text-sm font-medium text-foreground">
                        м² / талбай
                      </label>
                      <Input id={`${apartment.id}-area`} name="area" defaultValue={apartment.area} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`${apartment.id}-price`} className="text-sm font-medium text-foreground">
                        1 м² үнэ
                      </label>
                      <Input id={`${apartment.id}-price`} name="price" defaultValue={apartment.price} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`${apartment.id}-total`} className="text-sm font-medium text-foreground">
                        Нийт үнэ
                      </label>
                      <Input id={`${apartment.id}-total`} name="total" defaultValue={apartment.total} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`${apartment.id}-image`} className="text-sm font-medium text-foreground">
                        Зургийн path
                      </label>
                      <Input id={`${apartment.id}-image`} name="image" defaultValue={apartment.image} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor={`${apartment.id}-image-file`} className="text-sm font-medium text-foreground">
                        Шинэ зураг upload хийх
                      </label>
                      <Input id={`${apartment.id}-image-file`} name="imageFile" type="file" accept="image/*" />
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ImageIcon className="h-3.5 w-3.5" />
                        Upload хийвэл path автоматаар /images/... болж хадгалагдана.
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 md:col-span-2">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wallet className="h-4 w-4 text-primary" />
                        Үнэ, м² өөрчлөөд хадгалах товч дарна.
                      </p>
                      <Button type="submit" className="min-w-36">
                        <Save className="h-4 w-4" />
                        Хадгалах
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
