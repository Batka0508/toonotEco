import Link from "next/link"
import { ArrowUpRight, Building2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VrApartmentTour } from "@/components/vr-apartment-tour"
import { ApartmentSelection } from "@/components/apartment-selection"
import { Contact } from "@/components/contact"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-primitives"
import { getHomepageContent } from "@/lib/homepage-content"
import { getProjectLocation } from "@/lib/project-location"
import { getSiteContent } from "@/lib/site-content"

type ApartmentsPageProps = {
  searchParams: Promise<{ inquiry?: string }>
}

export default async function ApartmentsPage({ searchParams }: ApartmentsPageProps) {
  const params = await searchParams
  const { apartments } = await getSiteContent()
  const content = await getHomepageContent()
  const projectLocation = await getProjectLocation()

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50">
      <Header />
      <div className="relative overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(16,185,129,0.18),transparent_28rem),radial-gradient(circle_at_86%_30%,rgba(20,184,166,0.12),transparent_30rem),radial-gradient(circle_at_18%_72%,rgba(16,185,129,0.12),transparent_28rem),linear-gradient(180deg,#020617_0%,#000_48%,#020617_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:84px_84px]" />
        <div className="relative z-10">
          <VrApartmentTour content={content.vrTour} />
        </div>
      </div>

      <section id="apartments" className="bg-white py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4">
          <FadeIn className="flex max-w-4xl flex-col gap-4">
            <p className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
              <Building2 className="h-4 w-4" />
              Байрны сонголт
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 text-balance sm:text-4xl md:text-5xl">
              2, 3 өрөө байрны сонголтууд
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Байрны зураг, талбай, үнэ болон төлөвийн мэдээллийг нэг дороос харж, өөрт тохирох сонголтоо харьцуулна уу.
            </p>
            <Button asChild className="w-fit bg-emerald-700 transition-all hover:-translate-y-0.5 hover:bg-emerald-800">
              <Link href="#contact">
                Захиалга өгөх
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <ApartmentSelection apartments={apartments} />
        </div>
      </section>
      <Contact content={content.contact} isInquirySent={params.inquiry === "sent"} sourcePath="/apartments" projectLocation={projectLocation} />
      <Footer variant="black" />
    </main>
  )
}
