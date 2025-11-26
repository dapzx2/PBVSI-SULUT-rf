"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, RefreshCw, Calendar, Trophy, Clock, CheckCircle2, Filter, X, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PertandinganCard } from "@/components/pertandingan-card"
import type { Match } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <Trophy className="w-10 h-10" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Pertandingan Bola Voli</h1>
              </div>
              <p className="text-xl md:text-2xl text-orange-100 leading-relaxed mb-8 font-light">
                Ikuti semua pertandingan bola voli Sulawesi Utara secara real-time
              </p>
              <div className="flex items-center justify-center gap-4 text-orange-100 bg-white/10 backdrop-blur-md py-2 px-6 rounded-full inline-flex mx-auto">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Terakhir diperbarui: {formattedLastUpdate}</span>
                </div>
                <div className="h-4 w-px bg-white/20"></div>
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-auto py-1 px-2"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", isLoading && "animate-spin")} />
                  Perbarui
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        {/* Sticky Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="sticky top-24 z-30 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari tim atau liga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all"
              />
            </div>

            {/* League Filter */}
            <div className="w-full lg:w-64">
              <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                <SelectTrigger className="bg-white/50 border-gray-200 text-gray-900">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Pilih Liga" />
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
          </div>

          {/* Active Filters & Tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t border-gray-100 gap-4">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100/50 rounded-xl">
              <button
                onClick={() => setActiveTab("live")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === "live"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full", activeTab === "live" ? "bg-orange-600 animate-pulse" : "bg-gray-400")} />
                Langsung
                <span className={cn("ml-1.5 text-xs py-0.5 px-1.5 rounded-md", activeTab === "live" ? "bg-orange-100 text-orange-700" : "bg-gray-200 text-gray-600")}>
                  {liveMatches.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === "upcoming"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                Akan Datang
                <span className={cn("ml-1.5 text-xs py-0.5 px-1.5 rounded-md", activeTab === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600")}>
                  {upcomingMatches.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("finished")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === "finished"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Selesai
                <span className={cn("ml-1.5 text-xs py-0.5 px-1.5 rounded-md", activeTab === "finished" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600")}>
                  {finishedMatches.length}
                </span>
              </button>
            </div>

            {/* Active Filter Badges */}
            <AnimatePresence>
              {(searchQuery || selectedLeague !== "all") && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-wrap gap-2 items-center"
                >
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Filter:
                  </span>
                  {searchQuery && (
                    <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSearchQuery("")}>
                      "{searchQuery}" <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {selectedLeague !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSelectedLeague("all")}>
                      {selectedLeague} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedLeague("all")
                    }}
                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Reset
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Matches Grid */}
        {isLoading && currentMatches.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6 mx-auto"></div>
                <div className="flex justify-between items-center mb-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
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
