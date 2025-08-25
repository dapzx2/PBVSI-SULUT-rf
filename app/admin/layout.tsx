"use client"

import { AdminNavbar } from "@/components/admin/admin-navbar"
import { PageTransition } from "@/components/page-transition"
import React from "react"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <PageTransition>
        <main className="flex-1 pt-14">
          {children}
        </main>
      </PageTransition>
    </div>
  )
}