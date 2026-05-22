import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Bot, Building2, ClipboardList, Home, Pencil, Plus, Save, Trash2, UploadCloud } from "lucide-react"
import { AdminFooter } from "@/components/admin/admin-footer"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardView } from "@/components/admin/dashboard-view"
import { MarkNotificationsSeen } from "@/components/admin/mark-notifications-seen"
import { MultiImageFileInput } from "@/components/admin/multi-image-file-input"
import { NotificationsView } from "@/components/admin/notifications-view"
import { RequestsAdmin } from "@/components/admin/requests-admin"
import { AdminCard, Notice, StatusPill } from "@/components/admin/admin-ui"
import { buildAdminNotifications } from "@/lib/admin-notifications"
import { getAdminEmails, getCurrentAdmin } from "@/lib/admin-auth"
import type { AdminView } from "@/lib/admin-types"
import { getChatbotLeads, type ChatbotLead } from "@/lib/chatbot-leads"
import { garageBlocks, getGarages, type Garage } from "@/lib/garages"
import { getHomepageContent } from "@/lib/homepage-content"
import { getInquiries, type Inquiry } from "@/lib/inquiries"
import { getApartmentImages, getSiteContent, type Apartment } from "@/lib/site-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmSubmitButton } from "@/components/confirm-submit-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createApartment, createGarage, deleteApartment, deleteGarage, deleteInquiry, updateApartment, updateGalleryContent, updateGarage, updateHomepageContent } from "./actions"

const INQUIRY_TIME_OFFSET_MS = 4 * 60 * 60 * 1000

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
  const garages = await getGarages()
  const inquiries = await getInquiries()
  const chatbotLeads = await getChatbotLeads()
  const homepageContent = view === "content" ? await getHomepageContent() : null
  const editProperty = apartments.find((property) => property.id === params.edit)
  const newRequests = inquiries.filter((inquiry) => inquiry.status === "new").length
  const notifications = buildAdminNotifications(inquiries, chatbotLeads)
  const savedMessage = params.saved === "1" ? getSavedMessage(view) : ""

  return (
    <AdminShell
      sidebar={
        <AdminSidebar
          activeView={view}
          newRequests={newRequests}
          chatbotCount={chatbotLeads.length}
          notifications={notifications}
        />
      }
      header={
        <AdminHeader title={getViewTitle(view)} email={admin.email} notifications={notifications} />
      }
      footer={<AdminFooter />}
    >
      {view !== "dashboard" && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Байр, гараж, хүсэлт болон сайтын контентыг эндээс удирдана.</p>
          <div className="flex flex-wrap items-center gap-2">
            {view !== "add" && view !== "content" && view !== "requests" && view !== "chatbot" && view !== "notifications" && (
              <Link
                href="/admin?view=add"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5d5fef] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4f51e8]"
              >
                <Plus className="h-4 w-4" />
                Шинээр нэмэх
              </Link>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Home className="h-4 w-4" />
                Сайт руу
              </Link>
            </Button>
          </div>
        </div>
      )}

      {savedMessage && <Notice tone="success">{savedMessage}</Notice>}
      {params.error === "validation" && <Notice tone="error">Гарчиг, үнэ, талбай заавал бөглөнө үү.</Notice>}
      {params.error === "storage" && <Notice tone="error">Supabase тохиргоо эсвэл garages хүснэгт бэлэн биш байна.</Notice>}

      {view === "dashboard" && (
        <DashboardView apartments={apartments} garages={garages} inquiries={inquiries} chatbotLeads={chatbotLeads} />
      )}
      {view === "properties" && (
        <div className="grid gap-6">
          {editProperty && <PropertyForm title="Байр засах" property={editProperty} action={updateApartment} cancelHref="/admin?view=properties" />}
          <PropertiesTable properties={apartments} />
        </div>
      )}
      {view === "add" && <PropertyForm title="Байр нэмэх" property={emptyProperty} action={createApartment} cancelHref="/admin?view=properties" />}
      {view === "garages" && <GaragesAdmin garages={garages} editGarageId={params.edit} savedMessage={savedMessage} />}
      {view === "requests" && <RequestsAdmin inquiries={inquiries} properties={apartments} />}
      {view === "notifications" && (
        <>
          <MarkNotificationsSeen notifications={notifications} />
          <NotificationsView notifications={notifications} />
        </>
      )}
      {view === "chatbot" && <ChatbotLeadsTable leads={chatbotLeads} />}
      {view === "content" && homepageContent && <HomepageContentEditor content={homepageContent} />}
    </AdminShell>
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

function HomepageContentEditor({ content }: { content: Awaited<ReturnType<typeof getHomepageContent>> }) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Зургийн цомог засах</CardTitle>
          <CardDescription>Нүүр хуудасны gallery хэсгийн зураг, гарчиг, ангиллыг Supabase Storage-д хадгалж удирдана.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateGalleryContent} className="grid gap-5">
            <input type="hidden" name="galleryCount" value={content.gallery.items.length} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Жижиг гарчиг">
                <Input name="galleryEyebrow" defaultValue={content.gallery.eyebrow} />
              </Field>
              <Field label="Гарчиг">
                <Input name="gallerySectionTitle" defaultValue={content.gallery.title} />
              </Field>
            </div>
            <Field label="Тайлбар">
              <Textarea name="galleryDescription" defaultValue={content.gallery.description} rows={3} />
            </Field>

            <div className="grid gap-4">
              {content.gallery.items.map((item, index) => (
                <div key={`${item.src}-${index}`} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[160px_1fr]">
                  <div className="relative h-32 overflow-hidden rounded-md bg-slate-100">
                    <Image src={item.src || "/placeholder.jpg"} alt={item.title} fill sizes="160px" className="object-cover" />
                  </div>
                  <div className="grid gap-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Зургийн гарчиг">
                        <Input name={`galleryTitle-${index}`} defaultValue={item.title} />
                      </Field>
                      <Field label="Ангилал">
                        <Input name={`galleryLabel-${index}`} defaultValue={item.label} />
                      </Field>
                    </div>
                    <Field label="Зургийн зам эсвэл public URL">
                      <Input name={`gallerySrc-${index}`} defaultValue={item.src} placeholder="/images/project-1.jpg" />
                    </Field>
                    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                      <label className="grid gap-2 text-sm font-medium text-slate-800">
                        Зураг солих
                        <Input name={`galleryImageFile-${index}`} type="file" accept="image/*" className="h-auto bg-white py-2 text-xs file:mr-3 file:rounded-md file:bg-emerald-700 file:px-3 file:py-2 file:text-xs file:text-white" />
                      </label>
                      <label className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700">
                        <input type="checkbox" name={`galleryRemove-${index}`} className="h-4 w-4" />
                        Устгах
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-4">
              <div>
                <p className="font-semibold text-emerald-900">Шинэ зураг нэмэх</p>
                <p className="text-sm text-emerald-800">File upload хийвэл Supabase public URL автоматаар хадгалагдана.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Зургийн гарчиг">
                  <Input name="newGalleryTitle" placeholder="Барилгын явц" />
                </Field>
                <Field label="Ангилал">
                  <Input name="newGalleryLabel" placeholder="Барилга" />
                </Field>
              </div>
              <Field label="Зургийн зам эсвэл public URL">
                <Input name="newGallerySrc" placeholder="/images/new-photo.jpg" />
              </Field>
              <label className="grid gap-2 text-sm font-medium text-slate-800">
                Upload
                <Input name="newGalleryImageFile" type="file" accept="image/*" className="h-auto bg-white py-2 text-xs file:mr-3 file:rounded-md file:bg-emerald-700 file:px-3 file:py-2 file:text-xs file:text-white" />
              </label>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="h-4 w-4" />
                Цомог хадгалах
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
    </div>
  )
}

function PropertiesTable({ properties }: { properties: Apartment[] }) {
  return (
    <AdminCard>
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-bold text-slate-900">Байрны жагсаалт</h2>
        <p className="mt-1 text-sm text-slate-500">Засах, устгах, төлөв харах хэсэг</p>
      </div>
      <div className="p-5">
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
      </div>
    </AdminCard>
  )
}

function GaragesAdmin({ garages, editGarageId, savedMessage }: { garages: Garage[]; editGarageId?: string; savedMessage?: string }) {
  const nextGarageNumber = getNextGarageNumber(garages)
  const editGarage = garages.find((garage) => garage.id === editGarageId)
  const groupedGarages = garageBlocks.map((block) => ({
    block,
    garages: garages.filter((garage) => garage.block === block),
  }))

  return (
    <div className="grid gap-6">
      {savedMessage && <Notice tone="success">{savedMessage}</Notice>}
      {editGarage && <GarageForm title="Гарааш засах" garage={editGarage} action={updateGarage} cancelHref="/admin?view=garages" />}
      <GarageForm
        title="Гарааш нэмэх"
        garage={{
          id: "",
          block: "A блок",
          number: nextGarageNumber,
          floor: "B1 давхар",
          area: "18 м²",
          price: "45 сая ₮",
          status: "available",
          image: "/zogsool.jpg",
        }}
        action={createGarage}
        cancelHref="/admin?view=garages"
      />

      <Card>
        <CardHeader>
          <CardTitle>Гараашны жагсаалт</CardTitle>
          <CardDescription>Гарааш худалдаа хэсэгт харагдах A, B, C блокийн card-ууд.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          {groupedGarages.map((group) => (
            <section key={group.block} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/70">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                <div>
                  <h3 className="text-base font-bold text-slate-950">{group.block}</h3>
                  <p className="text-sm text-slate-500">Энэ блокт {group.garages.length} гарааш байна.</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                  {group.garages.length} ширхэг
                </span>
              </div>

              {group.garages.length > 0 ? (
                <div className="overflow-x-auto bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дугаар</TableHead>
                        <TableHead>Давхар</TableHead>
                        <TableHead>Талбай</TableHead>
                        <TableHead>Үнэ</TableHead>
                        <TableHead>Төлөв</TableHead>
                        <TableHead className="text-right">Үйлдэл</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.garages.map((garage) => (
                        <TableRow key={garage.id}>
                          <TableCell className="font-semibold">{garage.number}</TableCell>
                          <TableCell>{garage.floor}</TableCell>
                          <TableCell>{garage.area}</TableCell>
                          <TableCell>{garage.price}</TableCell>
                          <TableCell>
                            <GarageStatusBadge status={garage.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/admin?view=garages&edit=${garage.id}`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <form action={deleteGarage}>
                                <input type="hidden" name="id" value={garage.id} />
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
                </div>
              ) : (
                <div className="bg-white px-4 py-6 text-sm text-slate-500">Энэ блокт гарааш нэмэгдээгүй байна.</div>
              )}
            </section>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function getNextGarageNumber(garages: Garage[]) {
  const nextIndex =
    garages
      .filter((garage) => garage.block === "A блок")
      .map((garage) => Number(garage.number.match(/\d+$/)?.[0] ?? 0))
      .reduce((max, value) => Math.max(max, value), 0) + 1

  return `A-G${String(nextIndex).padStart(2, "0")}`
}

function GarageForm({ title, garage, action, cancelHref }: { title: string; garage: Garage; action: (formData: FormData) => Promise<void>; cancelHref: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Зураг upload хийвэл гараашны “Харах” modal дээр харагдана.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} autoComplete="off" className="grid gap-4">
          {garage.id && (
            <>
              <input type="hidden" name="id" value={garage.id} />
              <input type="hidden" name="currentImage" value={garage.image} />
              <input type="hidden" name="createdAt" value={garage.createdAt ?? ""} />
            </>
          )}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Блок">
              <select name="block" defaultValue={garage.block} autoComplete="off" className="h-10 rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                {garageBlocks.map((block) => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
            </Field>
            <Field label="Гараашны дугаар *">
              <Input name="number" required defaultValue={garage.number} autoComplete="off" placeholder="A-G03" />
            </Field>
            <Field label="Давхар *">
              <Input name="floor" required defaultValue={garage.floor} autoComplete="off" placeholder="B1 давхар" />
            </Field>
            <Field label="Талбай *">
              <Input name="area" required defaultValue={garage.area} autoComplete="off" placeholder="18 м²" />
            </Field>
            <Field label="Үнэ *">
              <Input name="price" required defaultValue={garage.price} autoComplete="off" placeholder="45 сая ₮" />
            </Field>
            <Field label="Төлөв">
              <select name="status" defaultValue={garage.status} autoComplete="off" className="h-10 rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                <option value="available">Сул</option>
                <option value="reserved">Захиалгатай</option>
                <option value="sold">Зарагдсан</option>
              </select>
            </Field>
            <Field label="Зургийн зам">
              <Input name="image" defaultValue={garage.image} autoComplete="off" placeholder="/zogsool.jpg" />
            </Field>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Зураг upload
            <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-emerald-800">
                <UploadCloud className="h-5 w-5" />
                <span className="font-semibold">Гараашны зураг сонгох</span>
              </div>
              <Input name="imageFiles" type="file" accept="image/*" className="h-auto bg-white py-2 text-xs file:mr-3 file:rounded-md file:bg-emerald-700 file:px-3 file:py-2 file:text-xs file:text-white" />
            </div>
          </label>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {garage.id && (
              <Button asChild type="button" variant="outline">
                <Link href={cancelHref}>Болих</Link>
              </Button>
            )}
            <Button type="submit">
              <Save className="h-4 w-4" />
              Гарааш хадгалах
            </Button>
          </div>
        </form>
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
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Гарчиг *">
              <Input name="title" defaultValue={property.title} required />
            </Field>
            <Field label="Ангилал">
              <Input name="tag" defaultValue={property.tag} placeholder="1 өрөө, 2 өрөө..." />
            </Field>
            <Field label="Үнэ *">
              <Input name="price" defaultValue={property.price} required />
            </Field>
            <Field label="Нийт үнэ">
              <Input name="total" defaultValue={property.total} />
            </Field>
            <Field label="Байршил">
              <Input name="location" defaultValue={property.location} />
            </Field>
            <Field label="Дүүрэг">
              <Input name="district" defaultValue={property.district} />
            </Field>
            <Field label="Өрөөний тоо">
              <Input name="rooms" defaultValue={property.rooms} />
            </Field>
            <Field label="Талбай *">
              <Input name="area" defaultValue={property.area} required />
            </Field>
            <Field label="Давхар">
              <Input name="floor" defaultValue={property.floor} />
            </Field>
            <Field label="Нийт давхар">
              <Input name="totalFloors" defaultValue={property.totalFloors} />
            </Field>
            <Field label="Төлөв">
              <select name="status" defaultValue={property.status ?? "available"} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                <option value="available">Сул байгаа</option>
                <option value="reserved">Захиалгатай</option>
                <option value="sold">Зарагдсан</option>
              </select>
            </Field>
            <Field label="План зураг">
              <Input name="floorPlanImage" defaultValue={property.floorPlanImage} placeholder="/images/floor-plan.jpg" />
            </Field>
          </div>

          <Field label="Тайлбар">
            <Textarea name="description" defaultValue={property.description} rows={4} />
          </Field>
          <Field label="Давуу талууд">
            <Textarea name="amenities" defaultValue={(property.amenities ?? []).join("\n")} rows={4} />
          </Field>
          <Field label="Зургийн замууд">
            <Textarea name="images" defaultValue={images.join("\n")} rows={4} placeholder="/images/project-1.jpg" />
          </Field>

          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Зураг upload
            <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-emerald-800">
                <UploadCloud className="h-5 w-5" />
                <span className="font-semibold">Олон зураг сонгож болно</span>
              </div>
              <MultiImageFileInput />
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

function ChatbotLeadsTable({ leads }: { leads: ChatbotLead[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI chatbot leads
        </CardTitle>
        <CardDescription>Чатботоор ирсэн нэр, утас, сонирхсон байр/зогсоол болон нэмэлт хүсэлт.</CardDescription>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">Одоогоор chatbot lead ирээгүй байна.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Нэр</TableHead>
                <TableHead>Утас</TableHead>
                <TableHead>Сонирхол</TableHead>
                <TableHead>Мессеж</TableHead>
                <TableHead>Ирсэн огноо</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-semibold text-slate-950">{lead.name}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.apartmentType || "-"}</TableCell>
                  <TableCell className="max-w-sm whitespace-pre-wrap text-sm text-slate-700">{lead.message || "-"}</TableCell>
                  <TableCell>{formatInquiryDate(lead.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-medium text-slate-800">{label}{children}</label>
}

function PropertyStatusBadge({ status }: { status: NonNullable<Apartment["status"]> }) {
  return <StatusPill status={status} />
}

function GarageStatusBadge({ status }: { status: Garage["status"] }) {
  const classes = {
    available: "bg-emerald-100 text-emerald-800",
    reserved: "bg-amber-100 text-amber-800",
    sold: "bg-red-100 text-red-800",
  }[status]
  const labels = {
    available: "Сул",
    reserved: "Захиалгатай",
    sold: "Зарагдсан",
  }[status]

  return <span className={`rounded px-2 py-1 text-xs font-semibold ${classes}`}>{labels}</span>
}

function formatInquiryDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Date(date.getTime() - INQUIRY_TIME_OFFSET_MS).toLocaleString("mn-MN")
}

function parseView(view?: string): AdminView {
  if (
    view === "properties" ||
    view === "add" ||
    view === "garages" ||
    view === "requests" ||
    view === "chatbot" ||
    view === "notifications" ||
    view === "content"
  ) {
    return view
  }

  return "dashboard"
}

function getViewTitle(view: AdminView) {
  return {
    dashboard: "Борлуулалтын Admin",
    properties: "Байрны удирдлага",
    add: "Байр нэмэх",
    garages: "Гаражны удирдлага",
    requests: "Захиалга",
    chatbot: "Харилцагчид",
    notifications: "Мэдэгдэл",
    content: "Тохиргоо",
  }[view]
}

function getSavedMessage(view: AdminView) {
  if (view === "properties" || view === "add") {
    return "Байр амжилттай хадгалагдлаа."
  }

  if (view === "garages") {
    return "Гарааш амжилттай хадгалагдлаа."
  }

  if (view === "content") {
    return "Сайтын мэдээлэл амжилттай хадгалагдлаа."
  }

  if (view === "requests") {
    return "Хүсэлт амжилттай шинэчлэгдлээ."
  }

  if (view === "chatbot") {
    return "AI lead амжилттай шинэчлэгдлээ."
  }

  return "Амжилттай хадгалагдлаа."
}
