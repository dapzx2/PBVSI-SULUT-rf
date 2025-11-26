"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Building2, X, Tag } from 'lucide-react'
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

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-4"
      >
        <Badge variant="outline" className="px-4 py-1 border-orange-200 text-orange-700 bg-orange-50 mb-4">
          Tim & Klub
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Daftar Klub <span className="text-orange-600">PBVSI</span> Sulut
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Jelajahi profil lengkap klub-klub bola voli terkemuka di Sulawesi Utara.
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="sticky top-24 z-30 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 mb-12"
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
                  "{searchTerm}" <X className="w-3 h-3 ml-1" />
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <Building2 className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Klub Tidak Ditemukan</h3>
          <p className="text-gray-500 mb-6">
            Tidak ada klub yang cocok dengan kriteria filter Anda.
          </p>
          <Button onClick={resetFilters} variant="outline">
            Hapus Semua Filter
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredClubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-gray-100 group bg-white">
                  <div className="relative h-48 bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {club.logo_url ? (
                      <Image
                        src={club.logo_url}
                        alt={club.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Building2 className="w-16 h-16 text-gray-300" />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">{club.name}</h2>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-normal">
                          {club.city}
                        </Badge>
                        {club.established_year && (
                          <span className="text-xs text-gray-400">• Est. {club.established_year}</span>
                        )}
                      </div>
                    </div>
                    <Link href={`/klub/${club.slug}`} passHref>
                      <Button className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-all">
                        Lihat Profil
                      </Button>
                    </Link>
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
          className="mt-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-8 md:p-12 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Statistik Ekosistem</h3>
              <p className="text-gray-400">Gambaran umum klub bola voli di Sulawesi Utara</p>
            </div>
            <div className="flex gap-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-1">{allClubs.length}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Total Klub</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-1">{cities.length}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Kota/Kab</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

