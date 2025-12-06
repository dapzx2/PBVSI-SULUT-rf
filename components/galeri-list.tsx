"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ImageIcon, X, Calendar, Tag } from 'lucide-react'
import type { GalleryItem } from "@/lib/types"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { formatDateLong } from "@/lib/date-utils"

interface GaleriListProps {
  initialItems: GalleryItem[];
}

export function GaleriList({ initialItems }: GaleriListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [allItems] = useState<GalleryItem[]>(initialItems)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      const matchesYear = selectedYear === "all" || new Date(item.created_at).getFullYear().toString() === selectedYear

      return matchesSearch && matchesCategory && matchesYear
    })
  }, [allItems, searchTerm, selectedCategory, selectedYear])

  const categories = useMemo(() => {
    return [...new Set(allItems.map(item => item.category))].filter(Boolean)
  }, [allItems])

  const years = useMemo(() => {
    return [...new Set(allItems.map(item => new Date(item.created_at).getFullYear().toString()))].filter(Boolean).sort((a, b) => b.localeCompare(a))
  }, [allItems])

  return (
    <div className="container mx-auto px-4 py-8 pt-24 md:pt-32 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-16 space-y-4"
      >
        <Badge variant="outline" className="px-4 py-1 border-orange-200 text-orange-700 bg-orange-50 mb-4">
          Dokumentasi & Momen
        </Badge>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
          Galeri <span className="text-orange-600">PBVSI</span> Sulut
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Koleksi foto dan video eksklusif dari berbagai turnamen, kegiatan, dan sejarah perjalanan voli di Sulawesi Utara.
        </p>
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
              placeholder="Cari momen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all"
            />
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <div className="w-full lg:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/50 border-gray-200 text-gray-900">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-32">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-white/50 border-gray-200 text-gray-900">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {(selectedCategory !== "all" || selectedYear !== "all" || searchTerm) && (
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
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSelectedCategory("all")}>
                  {selectedCategory} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {selectedYear !== "all" && (
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSelectedYear("all")}>
                  {selectedYear} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedYear("all")
                }}
                className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Reset Filter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Gallery Grid - Masonry Layout */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada hasil ditemukan</h3>
          <p className="text-gray-500">
            Coba sesuaikan kata kunci atau filter pencarian Anda.
          </p>
        </motion.div>
      ) : (
        <div className="columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="break-inside-avoid"
                onClick={() => setSelectedImage(item)}
              >
                <div className="group relative rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative w-full">
                    <Image
                      src={item.image_url || "/placeholder.svg?height=400&width=600"}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      {item.category && (
                        <Badge className="self-start mb-2 bg-orange-600 text-white border-none">
                          {item.category}
                        </Badge>
                      )}
                      <h3 className="text-white font-bold text-lg line-clamp-2 mb-1">{item.title}</h3>
                      <p className="text-gray-200 text-sm line-clamp-2">{item.description}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Image Modal/Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 backdrop-blur-lg"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              layoutId={`card-${selectedImage.id}`}
              className="relative max-w-6xl w-full min-h-[70vh] max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid lg:grid-cols-5 h-full min-h-[70vh]">
                <div className="lg:col-span-3 bg-gray-100 flex items-center justify-center h-[50vh] lg:h-auto relative overflow-hidden">
                  {/* Blurred Background */}
                  <div className="absolute inset-0">
                    <Image
                      src={selectedImage.image_url || "/placeholder.svg"}
                      alt={selectedImage.title}
                      fill
                      className="object-cover blur-3xl opacity-50 scale-110"
                    />
                  </div>
                  {/* Main Image */}
                  <div className="relative w-full h-full z-10 p-4">
                    <Image
                      src={selectedImage.image_url || "/placeholder.svg"}
                      alt={selectedImage.title}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>
                <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col h-full overflow-y-auto bg-white relative z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>

                  <div className="flex flex-wrap items-center gap-3 mb-6 pr-10">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {selectedImage.category || 'Umum'}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      {formatDateLong(selectedImage.created_at)}
                    </span>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{selectedImage.title}</h2>
                  <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                    {selectedImage.description || 'Deskripsi'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

