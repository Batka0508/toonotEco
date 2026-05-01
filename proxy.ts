import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

export const config = {
  matcher: [
    "/account(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
  ],
}
