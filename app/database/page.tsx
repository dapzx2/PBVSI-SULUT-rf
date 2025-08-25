"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Users, Building2, Loader2, RefreshCw, WifiOff } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StickyHeader } from "@/components/sticky-header"
import { PageTransition } from "@/components/page-transition"
import { Separator } from "@/components/ui/separator"
import { getPlayers } from "@/lib/players"
import { getClubs } from "@/lib/clubs"
import type { Player, Club } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<string>("players")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [selectedClub, setSelectedClub] = useState<string>("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [allClubs, setAllClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [playersResponse, clubsResponse] = await Promise.all([
        fetch('/api/players'),
        fetch('/api/clubs')
      ]);

      if (!playersResponse.ok) {
        const errorData = await playersResponse.json();
        throw new Error(errorData.error || 'Failed to fetch players');
      }
      const fetchedPlayers: Player[] = await playersResponse.json();
      setAllPlayers(fetchedPlayers || []);

      if (!clubsResponse.ok) {
        const errorData = await clubsResponse.json();
        throw new Error(errorData.error || 'Failed to fetch clubs');
      }
      const fetchedClubs: Club[] = await clubsResponse.json();
      setAllClubs(fetchedClubs || []);

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

  // Filter logic for clubs
  const filteredClubs = allClubs.filter((club) => {
    const matchesSearch = club.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = selectedCity === "all" || club.city === selectedCity
    
    return matchesSearch && matchesCity
  })

  // Get unique values for filters
  const positions = [...new Set(allPlayers.map(player => player.position))].filter(Boolean)
  const clubNames = [...new Set(allPlayers.map(player => player.club?.name))].filter(Boolean)
  const cities = [...new Set(allClubs.map(club => club.city))].filter(Boolean)

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedPosition("all")
    setSelectedClub("all")
    setSelectedCity("all")
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Database PBVSI Sulut</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Database lengkap pemain dan klub bola voli Sulawesi Utara
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="players" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Pemain
                </TabsTrigger>
                <TabsTrigger value="clubs" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Klub
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={activeTab === "players" ? "Cari nama pemain..." : "Cari nama klub..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters based on active tab */}
              {activeTab === "players" ? (
                <>
                  {/* Position Filter */}
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

                  {/* Club Filter */}
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
                </>
              ) : (
                /* City Filter for clubs */
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
              )}
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedPosition !== "all" || selectedClub !== "all" || selectedCity !== "all") && (
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

          {/* Tab Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="players">
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
                /* Players Grid - Ready for when data is available */
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
            </TabsContent>

            <TabsContent value="clubs">
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
                /* Clubs Grid - Ready for when data is available */
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
            </TabsContent>
          </Tabs>

          {/* Statistics Section - Ready for when data is available */}
          {(allPlayers.length > 0 || allClubs.length > 0) && (
            <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Database</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{allPlayers.length}</div>
                  <div className="text-sm text-gray-600">Total Pemain</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{allClubs.length}</div>
                  <div className="text-sm text-gray-600">Total Klub</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{positions.length}</div>
                  <div className="text-sm text-gray-600">Posisi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{cities.length}</div>
                  <div className="text-sm text-gray-600">Kota</div>
                </div>
              </div>
            </div>
          )}
        </div>

        
      </div>
    </PageTransition>
  )
}