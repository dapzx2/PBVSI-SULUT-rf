"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Building2, X, Tag } from 'lucide-react'
import { EmptyState } from "@/components/ui/empty-state"
import type { Club } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface ClubListProps {
  initialClubs: Club[]
}

export function ClubList({ initialClubs }: ClubListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [allClubs] = useState<Club[]>(initialClubs)

  const filteredClubs = useMemo(() => {
    return allClubs.filter((club) => {
      const matchesSearch = club.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCity = selectedCity === "all" || club.city === selectedCity
      return matchesSearch && matchesCity
    })
  }, [allClubs, searchTerm, selectedCity])

  const cities = useMemo(() => {
    return [...new Set(allClubs.map(club => club.city))].filter(Boolean)
  }, [allClubs])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCity("all")
  }

  const hasActiveFilters = searchTerm !== "" || selectedCity !== "all"

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 h-[500px] w-full bg-gradient-to-b from-orange-50/50 to-transparent" />

      <div className="container mx-auto px-4 pt-24 md:pt-32">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16 space-y-4"
        >
          <Badge variant="outline" className="px-4 py-1 border-orange-200 text-orange-700 bg-orange-50 mb-4">
            Tim & Klub
          </Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Daftar Klub <span className="text-orange-600">PBVSI</span> Sulut
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Jelajahi profil lengkap klub-klub bola voli terkemuka di Sulawesi Utara.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama klub..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all"
              />
            </div>

            {/* City Filter for clubs */}
            <div className="w-full lg:w-48">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="bg-white/50 border-gray-200 text-gray-900">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
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
          <AnimatePresence>
            {(searchTerm || selectedCity !== "all") && (
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
                {selectedCity !== "all" && (
                  <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSelectedCity("all")}>
                    {selectedCity} <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                  Reset Filter
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Clubs Grid */}
        {filteredClubs.length === 0 ? (
          <EmptyState
            type={hasActiveFilters ? "search" : "klub"}
            title={hasActiveFilters ? "Klub Tidak Ditemukan" : "Belum Ada Data Klub"}
            description={hasActiveFilters
              ? "Coba sesuaikan kata kunci pencarian atau filter Anda untuk menemukan klub yang Anda cari."
              : "Data klub belum tersedia saat ini."
            }
            actionLabel={hasActiveFilters ? "Reset Filter" : undefined}
            onAction={hasActiveFilters ? resetFilters : undefined}
            className="bg-white rounded-3xl border border-dashed border-gray-200"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl md:rounded-2xl h-full flex flex-col">
                    <div className="relative h-48 md:h-64 overflow-hidden bg-gray-100">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {club.logo_url ? (
                        <Image
                          src={club.logo_url}
                          alt={club.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                          <Building2 className="w-20 h-20 text-gray-300" />
                        </div>
                      )}
                      {club.established_year && (
                        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20">
                          <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm shadow-sm hover:bg-white text-xs md:text-sm px-2 py-0.5 md:px-2.5 md:py-0.5">
                            Est. {club.established_year}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 md:p-6 flex-1 flex flex-col">
                      <div className="mb-3 md:mb-4">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {club.name}
                        </h2>
                        <p className="text-xs md:text-sm font-medium text-gray-500 flex items-center mt-1">
                          <Building2 className="w-3 h-3 mr-1" />
                          {club.city || "Sulawesi Utara"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
                        <div className="text-center">
                          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Kota</p>
                          <p className="font-bold text-sm md:text-base text-gray-900">{club.city || "-"}</p>
                        </div>
                        <div className="text-center border-l border-gray-200">
                          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Berdiri</p>
                          <p className="font-bold text-sm md:text-base text-gray-900">{club.established_year || "-"}</p>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Link href={`/klub/${club.slug}`} passHref>
                          <Button className="w-full bg-gray-900 hover:bg-orange-600 text-white transition-colors rounded-lg md:rounded-xl h-9 md:h-11 text-sm md:text-base font-medium">
                            Lihat Profil Lengkap
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Statistics Section */}
        {allClubs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-6 md:p-12 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Statistik Ekosistem</h3>
                <p className="text-sm md:text-base text-gray-400">Gambaran umum klub bola voli di Sulawesi Utara</p>
              </div>
              <div className="flex gap-8 md:gap-12">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">{allClubs.length}</div>
                  <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">Total Klub</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-1">{cities.length}</div>
                  <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">Kota/Kab</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

