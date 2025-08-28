"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Anda telah berhasil keluar.",
        })
        router.push("/admin/login")
      } else {
        const errorData = await response.json()
        toast({
          title: "Gagal",
          description: errorData.error || "Terjadi kesalahan saat keluar.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Tidak dapat terhubung ke server.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Pengaturan Sistem</CardTitle>
          <CardDescription className="text-center">Kelola pengaturan aplikasi dan keluar dari akun Anda.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-4">Pengaturan Umum</h3>
            <p className="text-gray-600">Fitur pengaturan umum akan segera hadir di sini.</p>
            {/* Add more settings options here */}
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4">Manajemen Akun</h3>
            <Button
              onClick={handleLogout}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Keluar
            </Button>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
