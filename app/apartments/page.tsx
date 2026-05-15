import Link from "next/link"
import { ArrowUpRight, Building2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ApartmentSelection } from "@/components/apartment-selection"
import { Contact } from "@/components/contact"
import { Button } from "@/components/ui/button"
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
      <section className="bg-white py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex max-w-4xl flex-col gap-4">
            <p className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
              <Building2 className="h-4 w-4" />
              Байрны сонголт
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 text-balance sm:text-4xl md:text-5xl">
              1, 2, 3 өрөө байрны сонголтууд
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Байрны зураг, талбай, үнэ болон төлөвийн мэдээллийг нэг дороос харж, өөрт тохирох сонголтоо харьцуулна уу.
            </p>
            <Button asChild className="w-fit bg-emerald-700 hover:bg-emerald-800">
              <Link href="#contact">
                Захиалга өгөх
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <ApartmentSelection apartments={apartments} />
        </div>
      </section>
      <Contact content={content.contact} isInquirySent={params.inquiry === "sent"} sourcePath="/apartments" projectLocation={projectLocation} />
      <Footer />
    </main>
  )
}
