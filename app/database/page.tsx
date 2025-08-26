"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Users, Loader2, RefreshCw, WifiOff } from 'lucide-react'
import { StickyHeader } from "@/components/sticky-header"
import { PageTransition } from "@/components/page-transition"
import type { Player } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export default function DatabasePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [selectedClub, setSelectedClub] = useState<string>("all")
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const playersResponse = await fetch('/api/players');

      if (!playersResponse.ok) {
        const errorData = await playersResponse.json();
        throw new Error(errorData.error || 'Failed to fetch players');
      }
      const fetchedPlayers: Player[] = await playersResponse.json();
      setAllPlayers(fetchedPlayers || []);

    } catch (err: any) {
      console.error("Error fetching database data:", err);
      setError(err.message || "Terjadi kesalahan saat memuat data database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter logic for players
  const filteredPlayers = allPlayers.filter((player) => {
    const matchesSearch = player.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPosition = selectedPosition === "all" || player.position === selectedPosition
    const matchesClub = selectedClub === "all" || player.club?.name === selectedClub
    
    return matchesSearch && matchesPosition && matchesClub
  })

  // Get unique values for filters
  const positions = [...new Set(allPlayers.map(player => player.position))].filter(Boolean)
  const clubNames = [...new Set(allPlayers.map(player => player.club?.name))].filter(Boolean)

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedPosition("all")
    setSelectedClub("all")
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <StickyHeader currentPage="database" />
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Memuat Database...</h1>
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
          <StickyHeader currentPage="database" />
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <div className="text-6xl mb-4">
              <WifiOff className="h-16 w-16 mx-auto text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={fetchData}>
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
        <StickyHeader currentPage="database" />
        
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Database Pemain PBVSI Sulut</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Database lengkap pemain bola voli Sulawesi Utara
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
                    placeholder="Cari nama pemain..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="w-full lg:w-48">
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Posisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Posisi</SelectItem>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full lg:w-48">
                <Select value={selectedClub} onValueChange={setSelectedClub}>
                  <SelectTrigger>
                    <SelectValue placeholder="Klub" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Klub</SelectItem>
                    {clubNames.map((clubName) => (
                      <SelectItem key={clubName} value={clubName}>
                        {clubName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedPosition !== "all" || selectedClub !== "all") && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                    Pencarian: "{searchTerm}" ×
                  </Badge>
                )}
                {selectedPosition !== "all" && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedPosition("all")}>
                    Posisi: {selectedPosition} ×
                  </Badge>
                )}
                {selectedClub !== "all" && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedClub("all")}>
                    Klub: {selectedClub} ×
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 text-xs">
                  Hapus Semua
                </Button>
              </div>
            )}
          </div>

          {/* Players Content */}
          <div>
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Database Pemain Kosong</h3>
                  <p className="text-gray-600 mb-6">
                    Belum ada data pemain di dalam database. Silakan periksa kembali nanti atau hubungi administrator.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>👥 Data pemain akan segera tersedia</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Players Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPlayers.map((player) => (
                  <Card key={player.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {player.image_url && (
                      <Image
                        src={player.image_url || "/placeholder.svg?height=200&width=300&query=player photo"}
                        alt={player.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardContent className="p-4">
                      <h2 className="text-lg font-semibold line-clamp-1">{player.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">Posisi: {player.position}</p>
                      <p className="text-sm text-gray-600">Klub: {player.club?.name || "N/A"}</p>
                      <p className="text-sm text-gray-600">Tinggi: {player.height_cm} cm</p>
                      <p className="text-sm text-gray-600">Berat: {player.weight_kg} kg</p>
                      <Link href={`/pemain/${player.id}`} passHref>
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

          {/* Statistics Section */}
          {allPlayers.length > 0 && (
            <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Database</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{allPlayers.length}</div>
                  <div className="text-sm text-gray-600">Total Pemain</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{positions.length}</div>
                  <div className="text-sm text-gray-600">Posisi</div>
                </div>
              </div>
            </div>
          )}
        </div>

        
      </div>
    </PageTransition>
  )
}