"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, X, RefreshCw, SlidersHorizontal, WifiOff, Loader2, Calendar, Trophy, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LiveScoreCard } from "@/components/live-score-card"
import { StickyHeader } from "@/components/sticky-header"
import type { Match } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LiveScoresPage() {
  const [scores, setScores] = useState<Match[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLeague, setSelectedLeague] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "finished">("live")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [formattedLastUpdate, setFormattedLastUpdate] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFormattedLastUpdate(lastUpdate.toLocaleTimeString("id-ID"))
    }
  }, [lastUpdate])

  const fetchMatchesData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/matches')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal memuat pertandingan')
      }
      const fetchedMatches: Match[] = await response.json()
      setScores(fetchedMatches)
      setLastUpdate(new Date())
    } catch (err: any) {
      console.error("Kesalahan mengambil pertandingan:", err)
      setError(err.message || "Terjadi kesalahan saat memuat pertandingan.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMatchesData()
    const interval = setInterval(fetchMatchesData, 15000) // 15s refresh
    return () => clearInterval(interval)
  }, [fetchMatchesData])

  const handleRefresh = () => {
    fetchMatchesData()
  }

  const leagues = useMemo(() => {
    const uniqueLeagues = Array.from(new Set(scores.map((match) => match.league))).filter(Boolean)
    return uniqueLeagues.sort()
  }, [scores])

  const filteredScores = useMemo(() => {
    return scores
      .filter((score) => {
        const matchesLeague = selectedLeague === "all" || score.league === selectedLeague
        const matchesSearch = 
          searchQuery === "" ||
          score.home_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          score.away_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          score.league?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesLeague && matchesSearch
      })
  }, [scores, searchQuery, selectedLeague])

  const liveMatches = useMemo(() => filteredScores.filter(m => m.status === 'live'), [filteredScores]);
  const upcomingMatches = useMemo(() => filteredScores.filter(m => m.status === 'upcoming'), [filteredScores]);
  const finishedMatches = useMemo(() => filteredScores.filter(m => m.status === 'finished'), [filteredScores]);

  const featuredMatch = useMemo(() => {
    return liveMatches.length > 0 ? liveMatches[0] : upcomingMatches.length > 0 ? upcomingMatches[0] : finishedMatches.length > 0 ? finishedMatches[0] : null;
  }, [liveMatches, upcomingMatches, finishedMatches]);

  const renderMatchList = (matches: Match[], emptyState: React.ReactNode) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
    if (matches.length === 0) return emptyState;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.map((match) => (
          <LiveScoreCard key={match.id} match={match} />
        ))}
      </div>
    )
  }

  const EmptyState = ({ tab }: { tab: string }) => (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-4">
        <Calendar className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Pertandingan {tab}</h3>
      <p className="text-gray-600">Saat ini tidak ada pertandingan {tab} yang sesuai dengan filter Anda.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader currentPage="live-scores" />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Live Skor</h1>
                <p className="text-lg text-gray-600 mt-1">Ikuti semua pertandingan bola voli Sulawesi Utara.</p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <span className="text-sm text-gray-500">Terakhir diperbarui: {formattedLastUpdate}</span>
                <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="icon" className="bg-transparent">
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
              </div>
            </div>

            {/* Featured Match */}
            {featuredMatch && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pertandingan Utama</h2>
                <LiveScoreCard match={featuredMatch} />
              </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="live">Langsung ({liveMatches.length})</TabsTrigger>
                <TabsTrigger value="upcoming">Akan Datang ({upcomingMatches.length})</TabsTrigger>
                <TabsTrigger value="finished">Selesai ({finishedMatches.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="live" className="mt-6">
                {renderMatchList(liveMatches, <EmptyState tab="Langsung" />)}
              </TabsContent>
              <TabsContent value="upcoming" className="mt-6">
                {renderMatchList(upcomingMatches, <EmptyState tab="Akan Datang" />)}
              </TabsContent>
              <TabsContent value="finished" className="mt-6">
                {renderMatchList(finishedMatches, <EmptyState tab="Selesai" />)}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <Card>
                <CardHeader>
                  <CardTitle>Pencarian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari tim atau liga..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* League Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Liga</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={selectedLeague === "all" ? "secondary" : "ghost"}
                    onClick={() => setSelectedLeague("all")}
                    className="w-full justify-start"
                  >
                    Semua Liga
                  </Button>
                  {leagues.map((league) => (
                    <Button
                      key={league}
                      variant={selectedLeague === league ? "secondary" : "ghost"}
                      onClick={() => setSelectedLeague(league)}
                      className="w-full justify-start"
                    >
                      {league}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
