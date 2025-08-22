import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { Toaster } from "@/components/ui/toaster"
import { PageTransition } from "@/components/page-transition"
import { StickyHeader } from "@/components/sticky-header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PBVSI Sulawesi Utara",
  description: "Official website of PBVSI Sulawesi Utara",
    generator: 'dava.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <StickyHeader />
            <PageTransition>
              <main className="flex-1">{children}</main>{" "}
            </PageTransition>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}