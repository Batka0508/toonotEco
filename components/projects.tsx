import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSiteContent } from "@/lib/site-content"
import { ApartmentSelection } from "@/components/apartment-selection"

export function Projects() {
  const { apartments } = getSiteContent()

  return (
    <section id="apartments" className="bg-[linear-gradient(180deg,oklch(0.985_0.014_142)_0%,oklch(0.998_0.004_145)_100%)] py-16 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">Байрны сонголт</p>
            <h2 className="font-serif text-3xl font-bold text-foreground text-balance md:text-4xl">
              Өрөө, м2, үнэ, зураг нэг дор
            </h2>
          </div>
          <Button asChild variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 sm:w-fit">
            <Link href="#contact">
              Борлуулалтын ажилтантай холбогдох
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ApartmentSelection apartments={apartments} />
      </div>
    </section>
  )
}
