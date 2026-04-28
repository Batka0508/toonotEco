import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, BedDouble, Ruler, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSiteContent } from "@/lib/site-content"

export function Projects() {
  const { apartments } = getSiteContent()

  return (
    <section id="apartments" className="bg-[linear-gradient(180deg,oklch(0.985_0.014_142)_0%,oklch(0.998_0.004_145)_100%)] py-16 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">Байрны сонголт</p>
            <h2 className="font-serif text-3xl font-bold text-foreground text-balance md:text-4xl">
              Өрөө, м², үнэ, зураг нэг дор
            </h2>
          </div>
          <Button asChild variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 sm:w-fit">
            <Link href="#contact">
              Борлуулалтын ажилтантай холбогдох
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {apartments.map((apartment) => (
            <div
              key={apartment.id}
              className="group relative overflow-hidden rounded-lg border border-emerald-800/15 bg-card shadow-sm shadow-emerald-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/12"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={apartment.image}
                  alt={apartment.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {apartment.tag}
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="mb-4 text-xl font-semibold text-foreground sm:text-2xl">{apartment.title}</h3>
                <div className="space-y-3">
                  <div className="grid gap-1 border-b border-border pb-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Ruler className="h-4 w-4 text-primary" />
                      Талбай
                    </span>
                    <span className="font-semibold text-foreground">{apartment.area}</span>
                  </div>
                  <div className="grid gap-1 border-b border-border pb-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Wallet className="h-4 w-4 text-primary" />
                      1 м² үнэ
                    </span>
                    <span className="font-semibold text-foreground">{apartment.price}</span>
                  </div>
                  <div className="grid gap-1 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <BedDouble className="h-4 w-4 text-primary" />
                      Нийт үнэ
                    </span>
                    <span className="font-semibold text-primary">{apartment.total}</span>
                  </div>
                </div>
                <Button asChild className="mt-6 w-full">
                  <Link href="#contact">Энэ сонголтыг лавлах</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div id="price" className="mt-10 overflow-hidden rounded-lg border border-emerald-800/15 bg-card shadow-sm shadow-emerald-900/5 md:mt-12">
          <div className="border-b border-border p-5 sm:p-6">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">Үнийн товч мэдээлэл</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Үнэ нь сонгосон давхар, цонхны харц, төлбөрийн нөхцөлөөс хамаарч өөрчлөгдөж болно.
            </p>
          </div>
          <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {apartments.map((apartment) => (
              <div key={apartment.id} className="p-5 sm:p-6">
                <p className="text-sm text-muted-foreground">{apartment.title}</p>
                <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{apartment.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">{apartment.area}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
