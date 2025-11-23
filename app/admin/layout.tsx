"use client"

import { usePathname } from "next/navigation"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { PageTransition } from "@/components/page-transition"
import React from "react"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && <AdminNavbar />}
      <PageTransition>
        <main className="flex-1">
          {children}
        </main>
      </PageTransition>
    </div>
  )
}