"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, X, RefreshCw, SlidersHorizontal, WifiOff, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { LiveScoreCard } from "@/components/live-score-card"
import { StickyHeader } from "@/components/sticky-header"
import { getLiveMatches } from "@/lib/live-scores"
import { getMatches } from "@/lib/matches"
import type { Match } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LiveScoresPage() {
  const [scores, setScores] = useState<Match[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLeague, setSelectedLeague] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"current" | "schedule">("current")
  const [sortBy, setSortBy] = useState<string>("status")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const fetchMatchesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/matches');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch matches');
      }
      const fetchedMatches: Match[] = await response.json();
      setScores(fetchedMatches);
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error("Error fetching matches:", err);
      setError(err.message || "Terjadi kesalahan saat memuat pertandingan.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatchesData();

    const interval = setInterval(() => {
      fetchMatchesData();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [fetchMatchesData]);

  // Manual refresh
  const handleRefresh = () => {
    fetchMatchesData();
  };

  // Get unique leagues from fetched matches
  const leagues = useMemo(() => {
    const uniqueLeagues = Array.from(new Set(scores.map((match) => match.league))).filter(Boolean);
    return uniqueLeagues.sort();
  }, [scores]);

  // Filter and sort scores
  const filteredAndSortedScores = useMemo(() => {
    let filtered = scores

    // Tab filter
    if (activeTab === "current") {
      filtered = filtered.filter((score) => score.status === "live" || score.status === "finished")
    } else if (activeTab === "schedule") {
      filtered = filtered.filter((score) => score.status === "upcoming")
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (score) =>
          score.home_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          score.away_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          score.league?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // League filter
    if (selectedLeague !== "all") {
      filtered = filtered.filter((score) => score.league === selectedLeague)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "status":
          const statusOrder = { live: 0, upcoming: 1, finished: 2 }
          return statusOrder[a.status] - statusOrder[b.status]
        case "date":
          return new Date(b.match_date).getTime() - new Date(a.match_date).getTime()
        case "league":
          return (a.league || '').localeCompare(b.league || '')
        default:
          return 0
      }
    })

    return filtered
  }, [scores, searchQuery, selectedLeague, activeTab, sortBy])

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLeague("all")
    setSortBy("status")
  }

  // Count active filters (excluding tab selection)
  const activeFiltersCount = [searchQuery, selectedLeague !== "all" ? selectedLeague : null].filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Cari Pertandingan</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari tim atau liga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Liga</label>
        <Select value={selectedLeague} onValueChange={setSelectedLeague}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih liga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Liga</SelectItem>
            {leagues.map((league) => (
              <SelectItem key={league} value={league}>
                {league}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Urutkan</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Urutkan berdasarkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="date">Tanggal</SelectItem>
            <SelectItem value="league">Liga</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="h-4 w-4 mr-2" />
          Hapus Filter ({activeFiltersCount})
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1">
        <StickyHeader currentPage="live-scores" />
        <div className="container mx-auto px-4 py-8 pt-20">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Live Skor Bola Voli Sulawesi Utara</h1>
                <p className="text-gray-600 mt-1">
                  Ikuti perkembangan pertandingan bola voli khusus wilayah Sulawesi Utara secara real-time
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                className="hidden sm:flex bg-transparent"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>

            <div className="text-sm text-gray-500">Terakhir diperbarui: {lastUpdate ? lastUpdate.toLocaleTimeString("id-ID") : "..."}</div>
          </div>

          {/* Tabs for Current Scores / Schedule */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "current" | "schedule")}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Skor Terkini</TabsTrigger>
              <TabsTrigger value="schedule">Jadwal</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                  <p className="ml-2 text-lg text-gray-600">Memuat pertandingan...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    <WifiOff className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">Terjadi Kesalahan</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button variant="outline" onClick={handleRefresh}>
                    Coba Lagi
                  </Button>
                </div>
              ) : (
                <>
                  {/* Results */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Menampilkan {filteredAndSortedScores.length} dari {scores.length} pertandingan
                    </p>
                  </div>

                  {/* Live Scores Grid */}
                  {filteredAndSortedScores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAndSortedScores.map((match) => (
                        <LiveScoreCard key={match.id} match={match} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <Search className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pertandingan ditemukan</h3>
                      <p className="text-gray-600 mb-4">Coba ubah filter atau kata kunci pencarian Anda</p>
                      <Button variant="outline" onClick={clearFilters}>
                        Hapus Semua Filter
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            <TabsContent value="schedule" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                  <p className="ml-2 text-lg text-gray-600">Memuat pertandingan...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    <WifiOff className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">Terjadi Kesalahan</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button variant="outline" onClick={handleRefresh}>
                    Coba Lagi
                  </Button>
                </div>
              ) : (
                <>
                  {/* Results */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Menampilkan {filteredAndSortedScores.length} dari {scores.length} pertandingan
                    </p>
                  </div>

                  {/* Live Scores Grid */}
                  {filteredAndSortedScores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAndSortedScores.map((match) => (
                        <LiveScoreCard key={match.id} match={match} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <Search className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pertandingan ditemukan</h3>
                      <p className="text-gray-600 mb-4">Coba ubah filter atau kata kunci pencarian Anda</p>
                      <Button variant="outline" onClick={clearFilters}>
                        Hapus Semua Filter
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}