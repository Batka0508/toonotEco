import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { VrApartmentTour } from "@/components/vr-apartment-tour"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Gallery } from "@/components/gallery"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { getHomepageContent } from "@/lib/homepage-content"
import { getProjectLocation } from "@/lib/project-location"

type HomeProps = {
  searchParams: Promise<{ inquiry?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const content = await getHomepageContent()
  const projectLocation = await getProjectLocation()

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero content={content.hero} />
      <div className="relative overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(16,185,129,0.18),transparent_28rem),radial-gradient(circle_at_86%_30%,rgba(20,184,166,0.12),transparent_30rem),radial-gradient(circle_at_18%_72%,rgba(16,185,129,0.12),transparent_28rem),linear-gradient(180deg,#020617_0%,#000_48%,#020617_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:84px_84px]" />
        <div className="relative z-10">
          <VrApartmentTour content={content.vrTour} />
          <About content={content.about} />
          <Services content={content.amenities} />
          <Gallery content={content.gallery} />
          <Contact content={content.contact} isInquirySent={params.inquiry === "sent"} projectLocation={projectLocation} variant="dark" />
        </div>
      </div>
      <Footer variant="black" />
    </main>
  )
}
