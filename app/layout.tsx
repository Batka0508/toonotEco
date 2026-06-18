import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AIChatBot } from '@/components/AIChatBot'
import { VisitorTracker } from '@/components/visitor-tracker'
import './globals.css'

export const metadata: Metadata = {
  title: 'Тоонот Эко Хотхон | Орон сууцны борлуулалт',
  description: 'Тоонот Эко Хотхон - байрны сонголт, м2 үнэ, зураг, байршил болон борлуулалтын мэдээлэл.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <VisitorTracker />
          {children}
          <AIChatBot />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
