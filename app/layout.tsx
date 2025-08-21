import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { Toaster } from "@/components/ui/toaster"
import { PageTransition } from "@/components/page-transition"
import Footer from "@/components/footer"
import { StickyHeader } from "@/components/sticky-header" // Import StickyHeader

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
            <StickyHeader currentPage="database" />
            <PageTransition>
              {/* Memastikan main mengambil semua ruang yang tersedia dan mendorong footer ke bawah */}
              <main className="flex-1 min-h-[calc(100vh-64px)]">{children}</main>{" "}
              {/* Disesuaikan menjadi 64px untuk header h-16 */}
            </PageTransition>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
