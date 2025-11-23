"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, RefreshCw, Calendar, Trophy, Clock, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PertandinganCard } from "@/components/pertandingan-card"
import type { Match } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface PertandinganListProps {
  initialMatches: Match[];
}

export function PertandinganList({ initialMatches }: PertandinganListProps) {
  const [scores, setScores] = useState<Match[]>(initialMatches)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLeague, setSelectedLeague] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "finished">("live")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [formattedLastUpdate, setFormattedLastUpdate] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFormattedLastUpdate(lastUpdate.toLocaleTimeString("id-ID"))
    }
  }, [lastUpdate])

  const fetchMatchesData = useCallback(async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(fetchMatchesData, 15000)
    return () => clearInterval(interval)
  }, [fetchMatchesData])

  const handleRefresh = () => {
    fetchMatchesData()
  }

  const leagues = useMemo(() => {
    const uniqueLeagues = Array.from(new Set(scores.map((match) => match.league))).filter((league): league is string => !!league)
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
  const upcomingMatches = useMemo(() => filteredScores.filter(m => m.status === 'scheduled'), [filteredScores]);
  const finishedMatches = useMemo(() => filteredScores.filter(m => m.status === 'finished'), [filteredScores]);

  const getCurrentMatches = () => {
    switch (activeTab) {
      case 'live': return liveMatches;
      case 'upcoming': return upcomingMatches;
      case 'finished': return finishedMatches;
      default: return [];
    }
  }

  const currentMatches = getCurrentMatches();

  const EmptyState = ({ tab }: { tab: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
        <Calendar className="h-12 w-12 text-orange-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Tidak Ada Pertandingan {tab}</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Saat ini tidak ada pertandingan {tab.toLowerCase()} yang sesuai dengan filter Anda.
      </p>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Trophy className="w-12 h-12" />
                <h1 className="text-4xl md:text-6xl font-bold">Pertandingan Bola Voli</h1>
              </div>
              <p className="text-xl md:text-2xl text-orange-100 leading-relaxed mb-6">
                Ikuti semua pertandingan bola voli Sulawesi Utara secara real-time
              </p>
              <div className="flex items-center justify-center gap-4 text-orange-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Terakhir diperbarui: {formattedLastUpdate}</span>
                </div>
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                  Perbarui
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Cari tim atau liga..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* League Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedLeague === "all" ? "default" : "outline"}
                    onClick={() => setSelectedLeague("all")}
                    className={cn(
                      selectedLeague === "all"
                        ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        : "hover:bg-orange-50 hover:border-orange-300"
                    )}
                  >
                    Semua Liga
                  </Button>
                  {leagues.map((league) => (
                    <Button
                      key={league}
                      variant={selectedLeague === league ? "default" : "outline"}
                      onClick={() => setSelectedLeague(league)}
                      className={cn(
                        selectedLeague === league
                          ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                          : "hover:bg-orange-50 hover:border-orange-300"
                      )}
                    >
                      {league}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            <Button
              variant={activeTab === "live" ? "default" : "outline"}
              onClick={() => setActiveTab("live")}
              className={cn(
                "flex items-center gap-2",
                activeTab === "live"
                  ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  : "hover:bg-orange-50 hover:border-orange-300"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full", activeTab === "live" ? "bg-white animate-pulse" : "bg-orange-600")} />
              Langsung
              <Badge variant="secondary" className={cn(activeTab === "live" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700")}>
                {liveMatches.length}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "upcoming" ? "default" : "outline"}
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "flex items-center gap-2",
                activeTab === "upcoming"
                  ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  : "hover:bg-orange-50 hover:border-orange-300"
              )}
            >
              <Clock className="w-4 h-4" />
              Akan Datang
              <Badge variant="secondary" className={cn(activeTab === "upcoming" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700")}>
                {upcomingMatches.length}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "finished" ? "default" : "outline"}
              onClick={() => setActiveTab("finished")}
              className={cn(
                "flex items-center gap-2",
                activeTab === "finished"
                  ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  : "hover:bg-orange-50 hover:border-orange-300"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              Selesai
              <Badge variant="secondary" className={cn(activeTab === "finished" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700")}>
                {finishedMatches.length}
              </Badge>
            </Button>
          </div>
        </motion.div>

        {/* Matches Grid */}
        {isLoading && currentMatches.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : currentMatches.length === 0 ? (
          <EmptyState tab={activeTab === 'live' ? 'Langsung' : activeTab === 'upcoming' ? 'Akan Datang' : 'Selesai'} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {currentMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PertandinganCard match={match} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
