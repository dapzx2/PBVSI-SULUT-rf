"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Shield, X, Tag, User, Users, Trophy } from 'lucide-react'
import { EmptyState } from "@/components/ui/empty-state"
import type { Player } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface DatabaseListProps {
  initialPlayers: Player[];
}

export function DatabaseList({ initialPlayers }: DatabaseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [selectedClub, setSelectedClub] = useState<string>("all")
  const [selectedGender, setSelectedGender] = useState<'putra' | 'putri'>('putra')
  const [allPlayers] = useState<Player[]>(initialPlayers)

  // Filter players by gender first
  const playersByGender = useMemo(() => {
    return allPlayers.filter(player => player.gender === selectedGender)
  }, [allPlayers, selectedGender])

  const filteredPlayers = useMemo(() => {
    return playersByGender.filter((player) => {
      const matchesSearch = player.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPosition = selectedPosition === "all" || player.position === selectedPosition
      const matchesClub = selectedClub === "all" || player.club?.name === selectedClub

      return matchesSearch && matchesPosition && matchesClub
    })
  }, [playersByGender, searchTerm, selectedPosition, selectedClub])

  const positions = useMemo(() => {
    return [...new Set(playersByGender.map(player => player.position))].filter(Boolean)
  }, [playersByGender])

  const clubNames = useMemo(() => {
    return [...new Set(playersByGender.map(player => player.club?.name))].filter((name): name is string => !!name)
  }, [playersByGender])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedPosition("all")
    setSelectedClub("all")
  }

  const hasActiveFilters = searchTerm !== "" || selectedPosition !== "all" || selectedClub !== "all"

  // Theme colors based on gender - using full class names for Tailwind
  const isPutri = selectedGender === 'putri'
  const themeColors = {
    badge: isPutri ? 'border-pink-200 text-pink-700 bg-pink-50' : 'border-orange-200 text-orange-700 bg-orange-50',
    titleAccent: isPutri ? 'text-pink-600' : 'text-orange-600',
    gradient: isPutri ? 'from-pink-50 to-pink-100' : 'from-orange-50 to-orange-100',
    statsBg: isPutri ? 'from-pink-500 to-pink-600' : 'from-orange-500 to-orange-600',
    statsAccent: isPutri ? 'text-pink-500' : 'text-orange-500',
    statsLight: isPutri ? 'text-pink-100' : 'text-orange-100',
    buttonPrimary: isPutri ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-900 hover:bg-orange-600',
    focusRing: isPutri ? 'focus:border-pink-500 focus:ring-pink-500' : 'focus:border-orange-500 focus:ring-orange-500',
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 md:pt-32 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 relative"
      >
        <div className={`absolute inset-0 -z-10 bg-gradient-to-r ${themeColors.gradient} opacity-50 blur-3xl rounded-full transform -translate-y-1/2`} />
        <Badge variant="outline" className={`px-4 py-1 ${themeColors.badge} mb-4`}>
          Database Atlet
        </Badge>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Database <span className={themeColors.titleAccent}>Pemain</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Temukan talenta terbaik bola voli Sulawesi Utara. Jelajahi profil, statistik, dan prestasi para atlet kebanggaan daerah.
        </p>

        {/* Gender Toggle */}
        <div className="flex justify-center gap-2">
          <Button
            variant={selectedGender === 'putra' ? 'default' : 'outline'}
            onClick={() => { setSelectedGender('putra'); resetFilters(); }}
            className={selectedGender === 'putra'
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'border-orange-200 text-orange-700 hover:bg-orange-50'}
          >
            <Users className="w-4 h-4 mr-2" />
            Putra
          </Button>
          <Button
            variant={selectedGender === 'putri' ? 'default' : 'outline'}
            onClick={() => { setSelectedGender('putri'); resetFilters(); }}
            className={selectedGender === 'putri'
              ? 'bg-pink-600 hover:bg-pink-700 text-white'
              : 'border-pink-200 text-pink-700 hover:bg-pink-50'}
          >
            <Users className="w-4 h-4 mr-2" />
            Putri
          </Button>
        </div>
      </motion.div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 mb-12"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari nama pemain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 transition-all"
            />
          </div>

          <div className="w-full lg:w-56">
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="bg-white/50 border-gray-200 text-gray-900">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Posisi" />
                </div>
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

          <div className="w-full lg:w-56">
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger className="bg-white/50 border-gray-200 text-gray-900">
                <div className="flex items-center text-gray-600">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Klub" />
                </div>
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
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100"
            >
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Filter aktif:
              </span>
              {searchTerm && (
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSearchTerm("")}>
                  &quot;{searchTerm}&quot; <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {selectedPosition !== "all" && (
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSelectedPosition("all")}>
                  Posisi: {selectedPosition} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {selectedClub !== "all" && (
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSelectedClub("all")}>
                  Klub: {selectedClub} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                Reset Filter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Players Grid */}
      <div>
        {filteredPlayers.length === 0 ? (
          <EmptyState
            type={hasActiveFilters ? "search" : "pemain"}
            title={hasActiveFilters ? "Tidak Ada Pemain Ditemukan" : "Belum Ada Data Pemain"}
            description={hasActiveFilters
              ? "Coba sesuaikan kata kunci pencarian atau filter Anda untuk menemukan pemain yang Anda cari."
              : "Data pemain belum tersedia saat ini."
            }
            actionLabel={hasActiveFilters ? "Reset Filter" : undefined}
            onAction={hasActiveFilters ? resetFilters : undefined}
            className="bg-white rounded-3xl border border-dashed border-gray-200"
          />
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredPlayers.map((player) => (
              <motion.div key={player.id} variants={item}>
                <Card className="group overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl md:rounded-2xl h-full flex flex-col">
                  <div className="relative h-48 md:h-64 overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Image
                      src={player.photo_url || "/placeholder.svg?height=400&width=300&query=player"}
                      alt={player.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20">
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm shadow-sm hover:bg-white text-xs md:text-sm px-2 py-0.5 md:px-2.5 md:py-0.5">
                        {player.position}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 md:p-6 flex-1 flex flex-col">
                    <div className="mb-3 md:mb-4">
                      <h2 className={`text-lg md:text-xl font-bold text-gray-900 line-clamp-1 ${isPutri ? 'group-hover:text-pink-600' : 'group-hover:text-orange-600'} transition-colors`}>
                        {player.name}
                      </h2>
                      <p className="text-xs md:text-sm font-medium text-gray-500 flex items-center mt-1">
                        <Shield className="w-3 h-3 mr-1" />
                        {player.club?.name || "Tanpa Klub"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
                      <div className="text-center">
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Tinggi</p>
                        <p className="font-bold text-sm md:text-base text-gray-900">{player.height} <span className="text-[10px] md:text-xs font-normal text-gray-500">cm</span></p>
                      </div>
                      <div className="text-center border-l border-gray-200">
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Berat</p>
                        <p className="font-bold text-sm md:text-base text-gray-900">{player.weight} <span className="text-[10px] md:text-xs font-normal text-gray-500">kg</span></p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Link href={`/pemain/${player.slug || player.id}`} passHref>
                        <Button className={`w-full ${themeColors.buttonPrimary} text-white transition-colors rounded-lg md:rounded-xl h-9 md:h-11 text-sm md:text-base font-medium`}>
                          Lihat Profil Lengkap
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Statistics Section */}
      {playersByGender.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`bg-gradient-to-br ${themeColors.statsBg} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <Users className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <p className={themeColors.statsLight + " font-medium mb-1"}>Total Pemain {selectedGender === 'putra' ? 'Putra' : 'Putri'}</p>
                <h3 className="text-4xl font-bold">{playersByGender.length}</h3>
                <p className={`text-sm ${themeColors.statsLight} mt-4 opacity-80`}>Terdaftar dalam database</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 transform translate-x-1/4 -translate-y-1/4">
                <Trophy className="w-48 h-48 text-gray-900" />
              </div>
              <div className="relative z-10">
                <p className="text-gray-500 font-medium mb-1">Posisi Berbeda</p>
                <h3 className="text-4xl font-bold text-gray-900">{positions.length}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {positions.slice(0, 3).map(pos => (
                    <Badge key={pos} variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                      {pos}
                    </Badge>
                  ))}
                  {positions.length > 3 && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                      +{positions.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 transform translate-x-1/4 -translate-y-1/4">
                <Shield className="w-48 h-48 text-gray-900" />
              </div>
              <div className="relative z-10">
                <p className="text-gray-500 font-medium mb-1">Klub Terdaftar</p>
                <h3 className="text-4xl font-bold text-gray-900">{clubNames.length}</h3>
                <p className="text-sm text-gray-500 mt-4">
                  Dari berbagai daerah di Sulawesi Utara
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
