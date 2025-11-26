"use client"

import * as React from "react"
import { ThemeProvider as AppThemeProvider } from "@/contexts/theme-context"
import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PageTransition } from "@/components/page-transition"
import { StickyHeader } from "@/components/sticky-header"
import Footer from "@/components/footer"
import { usePathname } from "next/navigation"

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith("/admin");

    return (
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AppThemeProvider>
                <div className="min-h-screen flex flex-col">
                    {!isAdminRoute && <StickyHeader />}
                    <PageTransition>
                        <main className="flex-1">{children}</main>
                    </PageTransition>
                    {!isAdminRoute && <Footer />}
                </div>
                <Toaster />
            </AppThemeProvider>
        </NextThemeProvider>
    )
}
