import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { VrApartmentTour } from "@/components/vr-apartment-tour"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Projects } from "@/components/projects"
import { Gallery } from "@/components/gallery"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/user-auth"

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/register")
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <VrApartmentTour />
      <About />
      <Services />
      <Projects />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  )
}
