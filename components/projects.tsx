import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSiteContent } from "@/lib/site-content"
import { ApartmentSelection } from "@/components/apartment-selection"

export async function Projects() {
  const { apartments } = await getSiteContent()

  return (
    <section id="apartments" className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Apartment cards</p>
            <h2 className="text-3xl font-bold text-slate-950 text-balance md:text-4xl">1, 2, 3 өрөө байрны сонголт</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">Layout, үнэ, м² болон зурагтай танилцаад захиалга өгөх боломжтой.</p>
          </div>
          <Button asChild variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 sm:w-fit">
            <Link href="#contact">
              Борлуулалтын багтай холбогдох
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ApartmentSelection apartments={apartments} />
      </div>
    </section>
  )
}
