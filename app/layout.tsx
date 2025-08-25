"use client"

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { Toaster } from "@/components/ui/toaster"
import { PageTransition } from "@/components/page-transition"
import { StickyHeader } from "@/components/sticky-header"
import Footer from "@/components/footer"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

// Metadata should ideally be in a server component or a separate file
// For now, we'll keep it here, but note that it won't be dynamic based on pathname
export const metadata: Metadata = {
  title: "PBVSI Sulawesi Utara",
  description: "Situs web resmi PBVSI Sulawesi Utara",
    generator: 'dava.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            {!isAdminRoute && <StickyHeader />}
            <PageTransition>
              <main className="flex-1">{children}</main>{" "}
            </PageTransition>
            {!isAdminRoute && <Footer />}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}