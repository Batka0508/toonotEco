import Link from "next/link"
import { ArrowUpRight, Car } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GarageSales } from "@/components/garage-sales"
import { Contact } from "@/components/contact"
import { Button } from "@/components/ui/button"
import { getGarages } from "@/lib/garages"
import { getHomepageContent } from "@/lib/homepage-content"
import { getProjectLocation } from "@/lib/project-location"

type GaragesPageProps = {
  searchParams: Promise<{ inquiry?: string }>
}

export default async function GaragesPage({ searchParams }: GaragesPageProps) {
  const params = await searchParams
  const garages = await getGarages()
  const content = await getHomepageContent()
  const projectLocation = await getProjectLocation()

  return (
    <main className="min-h-screen overflow-x-hidden bg-black">
      <Header />
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_24%_8%,rgba(16,185,129,0.24),transparent_22rem),radial-gradient(circle_at_78%_12%,rgba(20,184,166,0.14),transparent_28rem),linear-gradient(135deg,#020617_0%,#000_54%,#03150f_100%)] py-8 sm:py-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.032)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.026)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.2),transparent_34rem)]" />
        <div className="container mx-auto px-4">
          <div className="relative flex max-w-4xl flex-col gap-4">
            <p className="flex w-fit items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200 shadow-[0_0_22px_rgba(16,185,129,0.12)] backdrop-blur">
              <Car className="h-4 w-4" />
              Гарааш худалдаа
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
              Дулаан гарааш, зогсоолын сонголт
            </h1>
            <p className="max-w-2xl text-base leading-8 text-cyan-50/78">
              A, B, C блокийн гараашны жагсаалт, төлөв, зураг болон захиалгын мэдээллийг тусдаа хуудсаар харна.
            </p>
            <Button asChild className="w-fit rounded-xl bg-emerald-400 px-6 font-black text-white shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:bg-emerald-300 hover:text-emerald-950">
              <Link href="#contact">
                Гарааш захиалах
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative bg-[radial-gradient(circle_at_22%_0%,rgba(16,185,129,0.16),transparent_24rem),radial-gradient(circle_at_78%_18%,rgba(20,184,166,0.1),transparent_22rem),linear-gradient(180deg,#020617,#000_72%)] py-6 sm:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:76px_76px]" />
        <div className="container mx-auto px-4">
          <GarageSales garages={garages} />
        </div>
      </section>
      <Contact content={content.contact} isInquirySent={params.inquiry === "sent"} sourcePath="/garages" projectLocation={projectLocation} variant="dark" />
      <Footer variant="black" />
    </main>
  )
}
