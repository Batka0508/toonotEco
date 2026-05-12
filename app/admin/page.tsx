import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { BadgeDollarSign, BarChart3, Building2, ClipboardList, FilePenLine, Home, Info, Layers3, LayoutDashboard, LogOut, MapPin, Pencil, Plus, Ruler, Save, Tags, Trash2, UploadCloud } from "lucide-react"
import { getAdminEmails, getCurrentAdmin } from "@/lib/admin-auth"
import { getHomepageContent } from "@/lib/homepage-content"
import { getInquiries, type Inquiry } from "@/lib/inquiries"
import { getApartmentImages, getSiteContent, type Apartment } from "@/lib/site-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmSubmitButton } from "@/components/confirm-submit-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { logoutUser } from "@/app/(user-auth)/actions"
import { createApartment, deleteApartment, deleteInquiry, replyInquiry, updateApartment, updateHomepageContent, updateInquiryStatus } from "./actions"

type AdminView = "dashboard" | "properties" | "add" | "requests" | "content"

type AdminPageProps = {
  searchParams: Promise<{ view?: string; edit?: string; error?: string; saved?: string }>
}

const emptyProperty: Apartment = {
  id: "",
  title: "",
  description: "",
  price: "",
  location: "",
  district: "",
  rooms: "",
  area: "",
  floor: "",
  totalFloors: "",
  status: "available",
  image: "/placeholder.jpg",
  images: [],
  floorPlanImage: "",
  amenities: [],
  total: "",
  tag: "",
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect("/login?redirect=/admin")
  }

  const view = parseView(params.view)
  const { apartments } = await getSiteContent()
  const inquiries = await getInquiries()
  const homepageContent = view === "content" ? await getHomepageContent() : null
  const editProperty = apartments.find((property) => property.id === params.edit)
  const newRequests = inquiries.filter((inquiry) => inquiry.status === "new").length

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white px-4 py-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Admin самбар</p>
              <h1 className="mt-1 text-xl font-bold text-slate-950">Тоонот Эко Хотхон</h1>
              <p className="mt-1 text-xs text-slate-500">{admin.email}</p>
            </div>
            <form action={logoutUser}>
              <Button type="submit" variant="outline" size="sm" className="lg:hidden">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            <NavItem href="/admin" icon={LayoutDashboard} active={view === "dashboard"} label="Хянах самбар" />
            <NavItem href="/admin?view=properties" icon={Building2} active={view === "properties"} label="Байрууд" />
            <NavItem href="/admin?view=add" icon={Plus} active={view === "add"} label="Байр нэмэх" />
            <NavItem href="/admin?view=requests" icon={ClipboardList} active={view === "requests"} label="Хүсэлтүүд" count={newRequests} />
            <NavItem href="/admin?view=content" icon={FilePenLine} active={view === "content"} label="Сайт засах" />
          </nav>

          <div className="mt-6 hidden gap-2 lg:grid">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/">
                <Home className="h-4 w-4" />
                Сайт руу
              </Link>
            </Button>
            <form action={logoutUser}>
              <Button type="submit" variant="outline" className="w-full justify-start">
                <LogOut className="h-4 w-4" />
                Гарах
              </Button>
            </form>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">{getViewTitle(view)}</h2>
              <p className="mt-1 text-sm text-slate-600">Байр, зураг, төлөв болон хэрэглэгчийн хүсэлтийг өгөгдлийн сангаас удирдана.</p>
            </div>
            {view !== "add" && (
              <Button asChild>
                <Link href="/admin?view=add">
                  <Plus className="h-4 w-4" />
                  Байр нэмэх
                </Link>
              </Button>
            )}
          </div>

          {params.saved === "1" && <Notice tone="success">Амжилттай хадгалагдлаа.</Notice>}
          {params.error === "validation" && <Notice tone="error">Гарчиг, үнэ, талбай заавал бөглөнө үү.</Notice>}

          {view === "dashboard" && <Dashboard apartments={apartments} inquiries={inquiries} />}
          {view === "properties" && (
            <div className="grid gap-6">
              {editProperty && <PropertyForm title="Байр засах" property={editProperty} action={updateApartment} cancelHref="/admin?view=properties" />}
              <PropertiesTable properties={apartments} />
            </div>
          )}
          {view === "add" && <PropertyForm title="Байр нэмэх" property={emptyProperty} action={createApartment} cancelHref="/admin?view=properties" />}
          {view === "requests" && <RequestsTable inquiries={inquiries} properties={apartments} />}
          {view === "content" && homepageContent && <HomepageContentEditor content={homepageContent} />}
        </section>
      </div>
    </main>
  )
}

function AdminAccessRequired() {
  const adminEmails = getAdminEmails()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md border-emerald-900/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin эрх шаардлагатай</CardTitle>
          <CardDescription>Admin хэсэгт зөвхөн нэвтэрсэн, `ADMIN_EMAILS` жагсаалтад байгаа хэрэглэгч орно.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-lg border border-emerald-900/10 bg-emerald-50 p-3 text-sm text-slate-700">
            {adminEmails.length > 0 ? `Зөвшөөрөгдсөн админ: ${adminEmails.join(", ")}` : "ADMIN_EMAILS тохиргоо хоосон байна."}
          </div>
          <Button asChild>
            <Link href="/login?redirect=/admin">Нэвтрэх</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Сайт руу буцах</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

function Dashboard({ apartments, inquiries }: { apartments: Apartment[]; inquiries: Inquiry[] }) {
  const sold = apartments.filter((property) => property.status === "sold").length
  const available = apartments.filter((property) => property.status === "available").length
  const reserved = apartments.filter((property) => property.status === "reserved").length
  const newRequests = inquiries.filter((inquiry) => inquiry.status === "new").length
  const contactedRequests = inquiries.filter((inquiry) => inquiry.status === "contacted" || inquiry.status === "read").length
  const closedRequests = inquiries.filter((inquiry) => inquiry.status === "closed").length
  const maxApartmentRequests = Math.max(1, ...apartments.map((property) => inquiries.filter((inquiry) => inquiry.apartment === property.id || inquiry.apartment === property.title).length))

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Нийт байр" value={apartments.length} icon={Building2} />
        <StatCard label="Сул байгаа" value={available} icon={Home} />
        <StatCard label="Захиалгатай/зарагдсан" value={reserved + sold} icon={Building2} />
        <StatCard label="Нийт хүсэлт" value={inquiries.length} icon={ClipboardList} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Байрны сонирхол
            </CardTitle>
            <CardDescription>Хүсэлтүүдэд хамгийн их сонгогдсон байрнууд</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {apartments.map((property) => {
              const count = inquiries.filter((inquiry) => inquiry.apartment === property.id || inquiry.apartment === property.title).length
              const width = `${Math.max(8, Math.round((count / maxApartmentRequests) * 100))}%`

              return (
                <div key={property.id} className="grid gap-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-800">{property.title}</span>
                    <span className="text-slate-500">{count} хүсэлт</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Хүсэлтийн төлөв</CardTitle>
            <CardDescription>Борлуулалтын явцын товч зураг</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <StatusMetric label="Шинэ" value={newRequests} className="bg-amber-100 text-amber-800" />
            <StatusMetric label="Холбогдсон" value={contactedRequests} className="bg-emerald-100 text-emerald-800" />
            <StatusMetric label="Хаагдсан" value={closedRequests} className="bg-slate-200 text-slate-700" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Сүүлийн байрууд</CardTitle>
            <CardDescription>Өгөгдлийн сангаас уншиж байгаа байрны мэдээлэл</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {apartments.slice(0, 5).map((property) => (
              <PropertyRow key={property.id} property={property} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Сүүлийн хүсэлтүүд</CardTitle>
            <CardDescription>Холбоо барих маягтаар ирсэн лавлагаа</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {inquiries.slice(0, 5).map((inquiry) => (
              <div key={inquiry.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{inquiry.name}</p>
                  <StatusBadge status={normalizeInquiryStatus(inquiry.status)} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{inquiry.phone}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function HomepageContentEditor({ content }: { content: Awaited<ReturnType<typeof getHomepageContent>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Нүүр хуудасны content засах</CardTitle>
        <CardDescription>Hero, давуу тал, gallery, contact, 3D tour зэрэг хэсгүүд backend JSON-оос уншина.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateHomepageContent} className="grid gap-4">
          <Textarea name="content" defaultValue={JSON.stringify(content, null, 2)} rows={28} className="font-mono text-xs leading-5" />
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            JSON бүтэц эвдэрвэл хадгалахгүй. Зураг солихдоо `/images/...` эсвэл Supabase public URL ашиглаж болно.
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              <Save className="h-4 w-4" />
              Сайт шинэчлэх
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function PropertiesTable({ properties }: { properties: Apartment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Байрны жагсаалт</CardTitle>
        <CardDescription>Засах, устгах, төлөв харах хэсэг</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Байр</TableHead>
              <TableHead>Байршил</TableHead>
              <TableHead>Үнэ</TableHead>
              <TableHead>Өрөө</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead className="text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <PropertyRow property={property} compact />
                </TableCell>
                <TableCell>{property.district || property.location || "-"}</TableCell>
                <TableCell>{property.price}</TableCell>
                <TableCell>{property.rooms || "-"}</TableCell>
                <TableCell>
                  <PropertyStatusBadge status={property.status ?? "available"} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin?view=properties&edit=${property.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <form action={deleteApartment}>
                      <input type="hidden" name="id" value={property.id} />
                      <Button type="submit" size="sm" variant="outline" className="text-red-700 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function PropertyForm({ title, property, action, cancelHref }: { title: string; property: Apartment; action: (formData: FormData) => Promise<void>; cancelHref: string }) {
  const images = getApartmentImages(property).filter((image) => image !== "/placeholder.jpg")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Зураг оруулбал өгөгдлийн сангийн зургийн сан руу хадгалагдана.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-5">
          {property.id && <input type="hidden" name="id" value={property.id} />}
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <FormPanel icon={Info} title="Товч мэдээлэл" description="Сайт дээр харагдах үндсэн гарчиг, ангилал, төлөв.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Гарчиг *">
                  <Input name="title" defaultValue={property.title} required className="h-11 bg-white" placeholder="A блок, 2 өрөө байр" />
                </Field>
                <Field label="Ангилал">
                  <Input name="tag" defaultValue={property.tag} className="h-11 bg-white" placeholder="1 өрөө, 2 өрөө..." />
                </Field>
                <Field label="Төлөв">
                  <select name="status" defaultValue={property.status ?? "available"} className="h-11 rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                    <option value="available">Сул байгаа</option>
                    <option value="reserved">Захиалгатай</option>
                    <option value="sold">Зарагдсан</option>
                  </select>
                </Field>
                <Field label="План зураг">
                  <Input name="floorPlanImage" defaultValue={property.floorPlanImage} className="h-11 bg-white" placeholder="/images/floor-plan.jpg" />
                </Field>
              </div>
            </FormPanel>

            <FormPanel icon={BadgeDollarSign} title="Үнэ ба талбай" description="Үнэ, нийт үнэ, м² болон өрөөний мэдээлэл.">
              <div className="grid gap-3 sm:grid-cols-2">
                <MetricField icon={BadgeDollarSign} label="Үнэ *">
                  <Input name="price" defaultValue={property.price} required className="h-12 border-emerald-200 bg-white text-base font-semibold" placeholder="₮ 3.2 сая/м²" />
                </MetricField>
                <MetricField icon={Tags} label="Нийт үнэ">
                  <Input name="total" defaultValue={property.total} className="h-12 bg-white text-base font-semibold" placeholder="₮ 180 сая" />
                </MetricField>
                <MetricField icon={Ruler} label="Талбай *">
                  <Input name="area" defaultValue={property.area} required className="h-12 border-emerald-200 bg-white text-base font-semibold" placeholder="56 м²" />
                </MetricField>
                <MetricField icon={Building2} label="Өрөөний тоо">
                  <Input name="rooms" defaultValue={property.rooms} className="h-12 bg-white text-base font-semibold" placeholder="2" />
                </MetricField>
              </div>
            </FormPanel>
          </div>

          <FormPanel icon={MapPin} title="Байршил ба давхар" description="Байрны байршил, дүүрэг, давхрын мэдээлэл.">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Field label="Байршил">
                <Input name="location" defaultValue={property.location} className="h-11 bg-white" />
              </Field>
              <Field label="Дүүрэг">
                <Input name="district" defaultValue={property.district} className="h-11 bg-white" />
              </Field>
              <Field label="Давхар">
                <Input name="floor" defaultValue={property.floor} className="h-11 bg-white" />
              </Field>
              <Field label="Нийт давхар">
                <Input name="totalFloors" defaultValue={property.totalFloors} className="h-11 bg-white" />
              </Field>
            </div>
          </FormPanel>

          <FormPanel icon={Layers3} title="Дэлгэрэнгүй текст" description="Дэлгэрэнгүй дээр харагдах тайлбар, давуу тал, зурагны замууд.">
            <div className="grid gap-4 lg:grid-cols-3">
              <Field label="Тайлбар">
                <Textarea name="description" defaultValue={property.description} rows={5} className="bg-white" placeholder="Байрны товч тайлбар..." />
              </Field>
              <Field label="Давуу талууд">
                <Textarea name="amenities" defaultValue={(property.amenities ?? []).join("\n")} rows={5} className="bg-white" placeholder="Мөр бүрт нэг давуу тал" />
              </Field>
              <Field label="Зургийн замууд">
                <Textarea name="images" defaultValue={images.join("\n")} rows={5} className="bg-white" placeholder="/images/project-1.jpg" />
              </Field>
            </div>
          </FormPanel>

          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Зураг upload
            <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-emerald-800">
                <UploadCloud className="h-5 w-5" />
                <span className="font-semibold">Олон зураг сонгож болно</span>
              </div>
              <p className="mb-3 text-xs text-slate-600">Windows дээр Ctrl эсвэл Shift дарж олон зураг зэрэг сонгоно.</p>
              <input
                name="imageFiles"
                type="file"
                accept="image/*"
                multiple
                className="block w-full rounded-md border border-input bg-white px-3 py-2 text-xs shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-700 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white dark:bg-slate-900"
              />
            </div>
          </label>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button asChild type="button" variant="outline">
              <Link href={cancelHref}>Болих</Link>
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" />
              Хадгалах
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function RequestsTable({ inquiries, properties }: { inquiries: Inquiry[]; properties: Apartment[] }) {
  const propertyNames = new Map(properties.map((property) => [property.id, property.title]))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Холбоо барих хүсэлтүүд</CardTitle>
        <CardDescription>Admin хариу хадгалахад хэрэглэгчийн “Миний хүсэлтүүд” хэсэгт notification болж харагдана.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {inquiries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">Одоогоор ирсэн хүсэлт алга байна.</div>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
              <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="min-w-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{inquiry.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{inquiry.phone}</p>
                      <p className="text-sm text-slate-600">{inquiry.email || "И-мэйл байхгүй"}</p>
                    </div>
                    <StatusBadge status={normalizeInquiryStatus(inquiry.status)} />
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="font-medium text-slate-500">Сонирхсон байр</dt>
                      <dd className="mt-1 text-slate-900">{propertyNames.get(inquiry.apartment) ?? inquiry.apartment ?? "-"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">Ирсэн огноо</dt>
                      <dd className="mt-1 text-slate-900">{new Date(inquiry.createdAt).toLocaleString("mn-MN")}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{inquiry.message || "Мессеж бичээгүй байна."}</div>
                </div>

                <div className="grid h-fit gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <form action={updateInquiryStatus} className="grid gap-2">
                    <input type="hidden" name="id" value={inquiry.id} />
                    <label className="text-sm font-medium text-slate-700" htmlFor={`status-${inquiry.id}`}>Төлөв</label>
                    <select id={`status-${inquiry.id}`} name="status" defaultValue={normalizeInquiryStatus(inquiry.status)} className="h-9 rounded-md border border-input bg-white px-3 text-sm">
                      <option value="new">Шинэ</option>
                      <option value="contacted">Холбогдсон</option>
                      <option value="closed">Хаагдсан</option>
                    </select>
                    <Button type="submit" size="sm" variant="outline">Төлөв шинэчлэх</Button>
                  </form>
                  <form action={deleteInquiry}>
                    <input type="hidden" name="id" value={inquiry.id} />
                    <ConfirmSubmitButton
                      type="submit"
                      size="sm"
                      variant="outline"
                      message="Энэ хүсэлтийг устгах уу?"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                      Хүсэлт устгах
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>

              <form action={replyInquiry} className="grid gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                <input type="hidden" name="id" value={inquiry.id} />
                <label className="text-sm font-semibold text-slate-800" htmlFor={`reply-${inquiry.id}`}>Admin хариу</label>
                <Textarea id={`reply-${inquiry.id}`} name="reply" rows={4} defaultValue={inquiry.adminReply ?? ""} placeholder="Хэрэглэгчид харагдах хариуг энд бичнэ..." className="bg-white" />
                {inquiry.repliedAt && <p className="text-xs text-slate-500">Сүүлд хариулсан: {new Date(inquiry.repliedAt).toLocaleString("mn-MN")}</p>}
                <div className="flex justify-end">
                  <Button type="submit">Хариу хадгалах</Button>
                </div>
              </form>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function NavItem({ href, icon: Icon, active, label, count }: { href: string; icon: typeof Home; active: boolean; label: string; count?: number }) {
  return (
    <Link href={href} className={["flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors", active ? "bg-emerald-700 text-white" : "text-slate-700 hover:bg-slate-100"].join(" ")}>
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      {!!count && <span className={active ? "rounded bg-white/20 px-2 py-0.5 text-xs" : "rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800"}>{count}</span>}
    </Link>
  )
}

function PropertyRow({ property, compact = false }: { property: Apartment; compact?: boolean }) {
  const image = getApartmentImages(property)[0] ?? "/placeholder.jpg"

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className={["relative shrink-0 overflow-hidden rounded-md bg-slate-100", compact ? "h-12 w-14" : "h-14 w-16"].join(" ")}>
        <Image src={image} alt={property.title} fill sizes="64px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-950">{property.title}</p>
        <p className="truncate text-sm text-slate-600">{property.area} · {property.floor || "-"} / {property.totalFloors || "-"}</p>
      </div>
    </div>
  )
}

function FormPanel({ icon: Icon, title, description, children }: { icon: typeof Home; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm shadow-slate-900/5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function MetricField({ icon: Icon, label, children }: { icon: typeof Home; label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 shadow-xs">
      <span className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </span>
      {children}
    </label>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-medium text-slate-800">{label}{children}</label>
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-2xl font-bold text-slate-950">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusMetric({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className={`rounded px-2 py-1 text-sm font-bold ${className}`}>{value}</span>
    </div>
  )
}

function Notice({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  const classes = tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
  return <div className={`mb-5 rounded-lg border px-4 py-3 text-sm font-medium ${classes}`}>{children}</div>
}

function PropertyStatusBadge({ status }: { status: NonNullable<Apartment["status"]> }) {
  const classes = {
    available: "bg-emerald-100 text-emerald-800",
    reserved: "bg-amber-100 text-amber-800",
    sold: "bg-slate-200 text-slate-700",
  }[status]
  const labels = {
    available: "Сул байгаа",
    reserved: "Захиалгатай",
    sold: "Зарагдсан",
  }

  return <span className={`rounded px-2 py-1 text-xs font-semibold ${classes}`}>{labels[status]}</span>
}

function StatusBadge({ status }: { status: "new" | "contacted" | "closed" }) {
  const classes = {
    new: "bg-emerald-100 text-emerald-800",
    contacted: "bg-blue-100 text-blue-800",
    closed: "bg-slate-200 text-slate-700",
  }[status]
  const labels = {
    new: "Шинэ",
    contacted: "Холбогдсон",
    closed: "Хаагдсан",
  }

  return <span className={`rounded px-2 py-1 text-xs font-semibold ${classes}`}>{labels[status]}</span>
}

function normalizeInquiryStatus(status: Inquiry["status"]) {
  return status === "read" ? "contacted" : status
}

function parseView(view?: string): AdminView {
  if (view === "properties" || view === "add" || view === "requests" || view === "content") {
    return view
  }

  return "dashboard"
}

function getViewTitle(view: AdminView) {
  return {
    dashboard: "Хянах самбар",
    properties: "Байруудын удирдлага",
    add: "Байр нэмэх",
    requests: "Хүсэлтүүд",
    content: "Сайт засах",
  }[view]
}
