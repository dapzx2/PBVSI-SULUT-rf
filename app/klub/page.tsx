"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StickyHeader } from "@/components/sticky-header"
import { useState, useEffect, useCallback } from "react"
import type { Club } from "@/lib/types"
import { Loader2, RefreshCw, WifiOff, Building2 } from "lucide-react"

export default function KlubPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/clubs');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch clubs');
      }
      const fetchedClubs: Club[] = await response.json();
      setClubs(fetchedClubs || []);
    } catch (err: any) {
      console.error("Error fetching clubs:", err);
      setError(err.message || "Terjadi kesalahan saat memuat daftar klub.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs()
  }, [fetchClubs])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <StickyHeader currentPage="Klub" />
        <main className="flex-1 pt-16">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-50 to-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-gray-800">
                    Memuat Klub...
                  </h1>
                  <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Harap tunggu sebentar.
                  </p>
                  <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mt-8" />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <StickyHeader currentPage="Klub" />
        <main className="flex-1 pt-16">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-50 to-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <WifiOff className="h-16 w-16 mx-auto text-red-500 mb-4" />
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-red-600">
                    Terjadi Kesalahan
                  </h1>
                  <p className="max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400 mb-8">
                    {error}
                  </p>
                  <Button onClick={fetchClubs}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Coba Lagi
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StickyHeader currentPage="Klub" />
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-orange-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-gray-800">
                  Daftar Klub Bola Voli
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Jelajahi profil lengkap klub-klub bola voli terkemuka, termasuk roster pemain dan staf pelatih.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Pilih Klub Anda</h2>
            {clubs.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Database Klub Kosong</h3>
                  <p className="text-gray-600 mb-6">
                    Belum ada data klub di dalam database. Silakan periksa kembali nanti atau hubungi administrator.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>🏢 Data klub akan segera tersedia</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {clubs.map((club) => (
                  <Card
                    key={club.slug}
                    className="flex flex-col items-center text-center p-6 border-2 border-gray-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    <Link href={`/klub/${club.slug}`} className="flex flex-col items-center text-center w-full">
                      <div className="relative w-32 h-32 mb-4">
                        <Image
                          src={club.logo_url || "/placeholder-logo.png"}
                          alt={`${club.name} Logo`}
                          fill
                          style={{ objectFit: "contain" }}
                          className="rounded-full border-2 border-orange-200 p-2"
                        />
                      </div>
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-xl font-semibold text-gray-800">{club.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                          {club.description}
                        </CardDescription>
                      </CardHeader>
                    </Link>
                    <CardContent className="p-0 mt-4">
                      <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Link href={`/klub/${club.slug}`}>Lihat Profil</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      {/* Assuming you have a Footer component */}
      {/* <Footer /> */}
    </div>
  )
}
