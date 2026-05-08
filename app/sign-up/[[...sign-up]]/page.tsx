import { redirect } from "next/navigation"

type SignUpRedirectPageProps = {
  searchParams: Promise<{ redirect_url?: string; redirect?: string }>
}

export default async function SignUpRedirectPage({ searchParams }: SignUpRedirectPageProps) {
  const params = await searchParams
  const redirectTo = params.redirect || params.redirect_url || ""

  redirect(redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register")
}
