import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Projects } from "@/components/projects"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { USER_COOKIE_NAME, getUserEmailFromSession } from "@/lib/user-auth"

export default async function Home() {
  const cookieStore = await cookies()
  const userEmail = getUserEmailFromSession(cookieStore.get(USER_COOKIE_NAME)?.value)

  if (!userEmail) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}
