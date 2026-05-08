import { redirect } from "next/navigation"

type SignInRedirectPageProps = {
  searchParams: Promise<{ redirect_url?: string; redirect?: string }>
}

export default async function SignInRedirectPage({ searchParams }: SignInRedirectPageProps) {
  const params = await searchParams
  const redirectTo = params.redirect || params.redirect_url || ""

  redirect(redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login")
}
