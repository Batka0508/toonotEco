import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/images/БББ.jpg')] bg-cover bg-center px-4 py-12">
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.2)_100%)]" />
      <div className="relative z-10">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/#apartments"
          forceRedirectUrl="/#apartments"
        />
      </div>
    </main>
  )
}
