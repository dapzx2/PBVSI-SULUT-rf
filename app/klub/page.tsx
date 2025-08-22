"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Building2, Loader2, RefreshCw, WifiOff } from 'lucide-react'
import { StickyHeader } from "@/components/sticky-header"
import { PageTransition } from "@/components/page-transition"
import { Separator } from "@/components/ui/separator"
import { getClubs } from "@/lib/clubs"
import type { Club } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export default function KlubPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [allClubs, setAllClubs] = useState<Club[]>([])
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
      setAllClubs(fetchedClubs || []);
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

  // Filter logic for clubs
  const filteredClubs = allClubs.filter((club) => {
    const matchesSearch = club.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = selectedCity === "all" || club.city === selectedCity
    
    return matchesSearch && matchesCity
  })

  // Get unique values for filters
  const cities = [...new Set(allClubs.map(club => club.city))].filter(Boolean)

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCity("all")
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <StickyHeader currentPage="Klub" />
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Memuat Daftar Klub...</h1>
            <p className="text-gray-600">Harap tunggu sebentar.</p>
            <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mt-8" />
          </div>
        </div>
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <StickyHeader currentPage="Klub" />
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <div className="text-6xl mb-4">
              <WifiOff className="h-16 w-16 mx-auto text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={fetchClubs}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <StickyHeader currentPage="Klub" />
        
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Daftar Klub PBVSI Sulut</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jelajahi profil lengkap klub-klub bola voli terkemuka di Sulawesi Utara.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari nama klub..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* City Filter for clubs */}
              <div className="w-full lg:w-48">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kota</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCity !== "all") && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                    Pencarian: "{searchTerm}" ×
                  </Badge>
                )}
                {selectedCity !== "all" && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCity("all")}>
                    Kota: {selectedCity} ×
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 text-xs">
                  Hapus Semua
                </Button>
              </div>
            )}
          </div>

          {/* Clubs Grid */}
          {filteredClubs.length === 0 ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredClubs.map((club) => (
                <Card key={club.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {club.logo_url && (
                    <Image
                      src={club.logo_url || "/placeholder.svg?height=200&width=300&query=club logo"}
                      alt={club.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-contain p-4"
                    />
                  )}
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold line-clamp-1">{club.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">Kota: {club.city}</p>
                    <p className="text-sm text-gray-600">Berdiri: {club.established_year}</p>
                    <Link href={`/klub/${club.slug}`} passHref>
                      <Button variant="outline" className="w-full mt-4 bg-transparent">
                        Lihat Detail
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        
      </div>
    </PageTransition>
  )
}