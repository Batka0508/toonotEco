import { existsSync, readFileSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { assertWritableBackend, canWriteLocalFiles } from "@/lib/backend-json"
import { getSupabaseAdminClient } from "@/lib/supabase"

export type IconKey =
  | "baby"
  | "building"
  | "calendar"
  | "car"
  | "clock"
  | "dumbbell"
  | "layers"
  | "mail"
  | "map"
  | "phone"
  | "ruler"
  | "shield"
  | "trees"
  | "wifi"

export type LabelValueItem = {
  icon: IconKey
  label: string
  value: string
}

export type HomepageContent = {
  hero: {
    badge: string
    title: string
    description: string
    backgroundImage: string
    primaryCta: string
    secondaryCta: string
    vrCta: string
    highlights: LabelValueItem[]
  }
  about: {
    eyebrow: string
    title: string
    paragraphs: string[]
    primaryCta: string
    secondaryCta: string
    facts: LabelValueItem[]
  }
  amenities: {
    eyebrow: string
    title: string
    description: string
    items: Array<{
      icon: IconKey
      title: string
      description: string
      image?: string
    }>
  }
  gallery: {
    eyebrow: string
    title: string
    description: string
    items: Array<{
      src: string
      title: string
      label: string
    }>
  }
  contact: {
    eyebrow: string
    title: string
    description: string
    formTitle: string
    mapTitle: string
    mapEmbedUrl: string
    info: Array<{
      icon: IconKey
      title: string
      value: string
      href: string
    }>
  }
  vrTour: {
    badge: string
    title: string
    description: string
    controlsTitle: string
    controlsDescription: string
    loadingTitle: string
    loadingDescription: string
    infoPills: Array<{ label: string; value: string }>
    panelTitle: string
    panelRows: Array<{ label: string; value: string }>
    rooms: Array<{ id: string; label: string; info: string }>
  }
}

const BUCKET_NAME = "site-content"
const HOMEPAGE_FILE = "homepage.json"

export const homepageContentPath = path.join(process.cwd(), "data", "homepage-content.json")

export const defaultHomepageContent: HomepageContent = {
  hero: {
    badge: "Улаанбаатар хотод байрлах эко хотхон",
    title: "Тоонот Эко Хотхон",
    description: "Эрчим хүчний хэмнэлттэй, байгальд ээлтэй, тав тухтай орон сууцны төсөл. 2 болон 3 өрөө байрны үнэ, м² болон захиалгын мэдээллийг нэг дороос аваарай.",
    backgroundImage: "/images/zurag.jpg.png",
    primaryCta: "Захиалга өгөх",
    secondaryCta: "Байрны сонголт харах",
    vrCta: "3D VR үзэх",
    highlights: [
      { icon: "ruler", label: "Талбай", value: "38-86 м²" },
      { icon: "building", label: "Блок", value: "3 блок" },
      { icon: "trees", label: "Орчин", value: "Ногоон бүс" },
    ],
  },
  about: {
    eyebrow: "Төслийн тухай",
    title: "Ногоон орчин, зөв план, ойлгомжтой үнэ бүхий орон сууцны төсөл",
    paragraphs: [
      "Тоонот Эко Хотхон нь өдөр тутмын амьдралд хэрэгтэй үйлчилгээ, хүүхдийн тоглоомын талбай, ногоон байгууламж, авто зогсоолыг нэг дор төлөвлөсөн орчин үеийн хотхон юм.",
      "Байр сонгохдоо өрөөний тоо, м², давхар, план зураг болон төлбөрийн нөхцөлийг борлуулалтын багтай шууд лавлах боломжтой.",
    ],
    primaryCta: "Байр сонгох",
    secondaryCta: "Холбогдох",
    facts: [
      { icon: "map", label: "Байршил", value: "Улаанбаатар хот, Нисэхийн тойрог чанх хойно" },
      { icon: "layers", label: "Давхар", value: "16 давхар" },
      { icon: "building", label: "Блок", value: "3 блок, 240 айл" },
      { icon: "calendar", label: "Ашиглалтад орох", value: "2026 оны IV улирал" },
    ],
  },
  amenities: {
    eyebrow: "Давуу тал",
    title: "Хотхоны давуу талууд",
    description: "Амьдрахад тухтай, өдөр тутам ашиглах хэрэгцээнүүдийг цэвэр, ойлгомжтой байдлаар нэг дор харууллаа.",
    items: [
      { icon: "dumbbell", title: "Фитнес", description: "Оршин суугчдад зориулсан дасгалын хэсэг, идэвхтэй амьдралын орчин.", image: "/images/gym.jpg" },
      { icon: "baby", title: "Хүүхдийн талбай", description: "Аюулгүй тоглоомын хэсэг, гэр бүлд ээлтэй гадна орчин.", image: "/images/garden.png" },
      { icon: "baby", title: "Хүүхдийн цэцэрлэг", description: "Хотхон дотороо хүүхдийн цэцэрлэгтэй." },
      { icon: "car", title: "Зогсоол", description: "Ил болон дулаан зогсоолын сонголт, ойлгомжтой хөдөлгөөний зохион байгуулалт." },
      { icon: "shield", title: "Аюулгүй орчин", description: "Камерын хяналт, гэрэлтүүлэг, нэвтрэх хэсгийн зохион байгуулалт." },
      { icon: "wifi", title: "Дэд бүтэц", description: "Интернэт, холбоо, өдөр тутмын хэрэгцээнд нийцсэн инженерийн шийдэл." },
    ],
  },
  gallery: {
    eyebrow: "Зургийн цомог",
    title: "Барилга, интерьер, орчны зураг",
    description: "Төслийн төрх, план зураг болон орчны мэдрэмжийг том зурагтай цэвэр зохион байгуулалтаар харууллаа.",
    items: [
      { src: "/images/asa.jpg", title: "Барилгын явц", label: "Барилга" },
      { src: "/images/project-1.jpg", title: "Гадна фасад", label: "Гадна төрх" },
      { src: "/images/dsdasdasdasf.jpg", title: "Интерьер шийдэл", label: "Интерьер" },
      { src: "/images/project-3.jpg", title: "Орчны зураг", label: "Орчин" },
      { src: "/images/two-room-1777448384494-0.jpg", title: "2 өрөөний план", label: "План зураг" },
      { src: "/images/5-1777617364714-0.jpg", title: "Том талбай", label: "Байр" },
    ],
  },
  contact: {
    eyebrow: "Холбоо барих",
    title: "Захиалга өгөх, дэлгэрэнгүй мэдээлэл авах",
    description: "Сонгосон өрөөний төрөл, талбай, төлбөрийн нөхцөлөө үлдээгээрэй. Борлуулалтын баг таны хүсэлтийг хүлээн авч, удирдлагын хэсгээс хариу өгнө.",
    formTitle: "Захиалгын маягт",
    mapTitle: "Байршлын зураг",
    mapEmbedUrl: "https://maps.google.com/maps?q=Ulaanbaatar%20Mongolia&t=&z=13&ie=UTF8&iwloc=&output=embed",
    info: [
      { icon: "phone", title: "Борлуулалтын утас", value: "+976 1111-1111", href: "tel:+97611111111" },
      { icon: "mail", title: "И-мэйл", value: "info@ecotown.mn", href: "mailto:info@ecotown.mn" },
      { icon: "map", title: "Байршил", value: "Улаанбаатар хот", href: "#location" },
      { icon: "clock", title: "Ажлын цаг", value: "Даваа-Бямба: 09:00-18:00", href: "#contact" },
    ],
  },
  vrTour: {
    badge: "Тоонот Эко Хотхон 3D аялал",
    title: "Орон сууцны 3D загвараар дотроос нь үзэх",
    description: "Зочны өрөө, гал тогоо, унтлагын өрөө, ариун цэврийн өрөөг 3D аяллын хэлбэрээр үзээрэй.",
    controlsTitle: "Удирдлага",
    controlsDescription: "Зураг дээр чирж эргүүлж харна. Hotspot дээр дарна. Desktop дээр WASD ашиглаж алхана.",
    loadingTitle: "3D аялал ачаалж байна",
    loadingDescription: "WebGL apartment scene ачаалж байна...",
    infoPills: [
      { label: "Материал", value: "Шил, чулуу, дулаан мод" },
      { label: "Гэрэл", value: "Байгалийн нарны гэрэл" },
      { label: "Орчин", value: "Эко хотхон + ногоон парк" },
    ],
    panelTitle: "Байрны самбар",
    panelRows: [
      { label: "Зэрэглэл", value: "Бизнес зэрэглэл" },
      { label: "Өрөө", value: "2-3 өрөө" },
      { label: "Туршлага", value: "360 панорам" },
      { label: "Хэв маяг", value: "Эко орчин үеийн" },
    ],
    rooms: [
      { id: "living", label: "Зочны өрөө", info: "Панорам шилэн цонх, хотхоны харагдац, дулаан мэдрэмжтэй орчин үеийн тавилга." },
      { id: "kitchen", label: "Гал тогоо", info: "Аралтай гал тогоо, чулуун тавцан, чанартай гэрэлтүүлэг." },
      { id: "bedroom", label: "Унтлагын өрөө", info: "Тайван өнгөний шийдэл, том шүүгээтэй мастер өрөө." },
      { id: "bathroom", label: "Ариун цэврийн өрөө", info: "Чанартай плита, шилэн душ, бодит тусгалтай интерьер." },
    ],
  },
}

function readLocalHomepageContent(): HomepageContent {
  if (!existsSync(homepageContentPath)) {
    return defaultHomepageContent
  }

  try {
    return mergeHomepageContent(JSON.parse(readFileSync(homepageContentPath, "utf8")))
  } catch {
    return defaultHomepageContent
  }
}

function mergeArray<T>(value: unknown, fallback: T[]) {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback
}

export function mergeHomepageContent(value: unknown): HomepageContent {
  const input = typeof value === "object" && value ? (value as Partial<HomepageContent>) : {}

  return {
    hero: { ...defaultHomepageContent.hero, ...input.hero, highlights: mergeArray(input.hero?.highlights, defaultHomepageContent.hero.highlights) },
    about: { ...defaultHomepageContent.about, ...input.about, paragraphs: mergeArray(input.about?.paragraphs, defaultHomepageContent.about.paragraphs), facts: mergeArray(input.about?.facts, defaultHomepageContent.about.facts) },
    amenities: { ...defaultHomepageContent.amenities, ...input.amenities, items: mergeArray(input.amenities?.items, defaultHomepageContent.amenities.items) },
    gallery: { ...defaultHomepageContent.gallery, ...input.gallery, items: mergeArray(input.gallery?.items, defaultHomepageContent.gallery.items) },
    contact: { ...defaultHomepageContent.contact, ...input.contact, info: mergeArray(input.contact?.info, defaultHomepageContent.contact.info) },
    vrTour: {
      ...defaultHomepageContent.vrTour,
      ...input.vrTour,
      infoPills: mergeArray(input.vrTour?.infoPills, defaultHomepageContent.vrTour.infoPills),
      panelRows: mergeArray(input.vrTour?.panelRows, defaultHomepageContent.vrTour.panelRows),
      rooms: mergeArray(input.vrTour?.rooms, defaultHomepageContent.vrTour.rooms),
    },
  }
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return readLocalHomepageContent()
  }

  const { data, error } = await supabase.storage.from(BUCKET_NAME).download(HOMEPAGE_FILE)

  if (error || !data) {
    return readLocalHomepageContent()
  }

  try {
    return mergeHomepageContent(JSON.parse(await data.text()))
  } catch {
    return readLocalHomepageContent()
  }
}

export async function saveHomepageContent(content: HomepageContent) {
  const normalized = mergeHomepageContent(content)
  const json = `${JSON.stringify(normalized, null, 2)}\n`
  const supabase = getSupabaseAdminClient()

  if (!supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    assertWritableBackend()
    await mkdir(path.dirname(homepageContentPath), { recursive: true })
    await writeFile(homepageContentPath, json, "utf8")
    return
  }

  const { error: bucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: false,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ["application/json"],
  })

  if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) {
    throw new Error(`Failed to prepare content bucket: ${bucketError.message}`)
  }

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(HOMEPAGE_FILE, json, {
    contentType: "application/json",
    upsert: true,
  })

  if (error) {
    throw new Error(`Failed to save homepage content: ${error.message}`)
  }

  if (canWriteLocalFiles()) {
    await mkdir(path.dirname(homepageContentPath), { recursive: true })
    await writeFile(homepageContentPath, json, "utf8")
  }
}
