import Link from "next/link"
import { ArrowUpRight, Car } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GarageSales } from "@/components/garage-sales"
import { Contact } from "@/components/contact"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-primitives"
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
      <div className="relative overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(16,185,129,0.18),transparent_28rem),radial-gradient(circle_at_86%_30%,rgba(20,184,166,0.12),transparent_30rem),radial-gradient(circle_at_18%_72%,rgba(16,185,129,0.12),transparent_28rem),linear-gradient(180deg,#020617_0%,#000_48%,#020617_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:84px_84px]" />

        <div className="relative z-10">
          <section className="py-16 text-white md:py-24">
            <div className="container mx-auto px-4">
              <FadeIn className="flex max-w-4xl flex-col gap-4">
                <p className="flex w-fit items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                  <Car className="h-4 w-4" />
                  Дулаан зогсоол
                </p>
                <h1 className="text-3xl font-black tracking-tight text-white text-balance md:text-5xl">
                  Дулаан гарааш, зогсоолын сонголт
                </h1>
                <p className="max-w-2xl text-base leading-8 text-cyan-50/72">
                  A, B, C блокийн гараашны жагсаалт, төлөв, зураг болон захиалгын мэдээллийг нэг дороос харна.
                </p>
                <Button asChild className="h-12 w-fit rounded-[1.1rem] bg-emerald-400 px-6 font-black text-white shadow-[0_0_30px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:text-emerald-950">
                  <Link href="#contact">
                    Гарааш захиалах
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </FadeIn>
            </div>
          </section>

          <section className="pb-16 md:pb-24">
            <div className="container mx-auto px-4">
              <GarageSales garages={garages} />
            </div>
          </section>
          <Contact content={content.contact} isInquirySent={params.inquiry === "sent"} isInquiryFailed={params.inquiry === "failed"} sourcePath="/garages" projectLocation={projectLocation} variant="dark" />
        </div>
      </div>
      <Footer variant="black" />
    </main>
  )
}
