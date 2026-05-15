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
    <main className="min-h-screen overflow-x-hidden bg-[#071b3a]">
      <Header />
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_28%_10%,rgba(34,197,94,0.22),transparent_20rem),radial-gradient(circle_at_68%_6%,rgba(56,189,248,0.28),transparent_26rem),linear-gradient(135deg,#0b1d3b_0%,#0d3d78_48%,#075985_100%)] py-8 sm:py-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(20,184,166,0.28),transparent_34rem)]" />
        <div className="container mx-auto px-4">
          <div className="relative flex max-w-4xl flex-col gap-4">
            <p className="flex w-fit items-center gap-2 rounded-full border border-cyan-200/20 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-50 shadow-sm backdrop-blur">
              <Car className="h-4 w-4" />
              Гарааш худалдаа
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
              Дулаан гарааш, зогсоолын сонголт
            </h1>
            <p className="max-w-2xl text-base leading-8 text-cyan-50/78">
              A, B, C блокийн гараашны жагсаалт, төлөв, зураг болон захиалгын мэдээллийг тусдаа хуудсаар харна.
            </p>
            <Button asChild className="w-fit bg-[#0ea5e9] text-white shadow-lg shadow-sky-950/25 hover:bg-[#0284c7] hover:text-white">
              <Link href="#contact">
                Гарааш захиалах
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative bg-[radial-gradient(circle_at_22%_0%,rgba(14,165,233,0.28),transparent_24rem),radial-gradient(circle_at_78%_18%,rgba(16,185,129,0.18),transparent_22rem),linear-gradient(180deg,#075985,#071b3a_72%)] py-6 sm:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:76px_76px]" />
        <div className="container mx-auto px-4">
          <GarageSales garages={garages} />
        </div>
      </section>
      <Contact content={content.contact} isInquirySent={params.inquiry === "sent"} sourcePath="/garages" projectLocation={projectLocation} variant="dark" />
      <Footer />
    </main>
  )
}
