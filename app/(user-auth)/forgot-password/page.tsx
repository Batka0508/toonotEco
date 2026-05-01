import { redirect } from "next/navigation"

export default function ForgotPasswordRedirectPage() {
  redirect("/sign-in")
}
