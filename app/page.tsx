import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { VrApartmentTour } from "@/components/vr-apartment-tour"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Projects } from "@/components/projects"
import { Gallery } from "@/components/gallery"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { getHomepageContent } from "@/lib/homepage-content"

export default async function Home() {
  const content = await getHomepageContent()

  return (
    <main className="min-h-screen">
      <Header />
      <Hero content={content.hero} />
      <VrApartmentTour content={content.vrTour} />
      <About content={content.about} />
      <Services content={content.amenities} />
      <Projects />
      <Gallery content={content.gallery} />
      <Contact content={content.contact} />
      <Footer />
    </main>
  )
}
