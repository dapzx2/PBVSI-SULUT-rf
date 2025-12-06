"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, X, Tag, Calendar, ArrowRight } from 'lucide-react'
import { formatDateLong } from "@/lib/date-utils"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Article } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface BeritaListProps {
  initialArticles: Article[];
}

export function BeritaList({ initialArticles }: BeritaListProps) {
  const [articles] = useState<Article[]>(initialArticles)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const categories = useMemo(() => {
    const uniqueCategories = new Set(articles.map((n) => n.category).filter(Boolean))
    return [...uniqueCategories]
  }, [articles])

  const filteredNews = useMemo(() => {
    const filtered = articles.filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        case "oldest":
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
        case "popular":
          return (b.views || 0) - (a.views || 0)
        case "comments":
          return (b.comments || 0) - (a.comments || 0)
        default:
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy, articles])

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || sortBy !== "newest"

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("newest")
  }

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
          Informasi Terkini
        </Badge>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
          Berita <span className="text-orange-600">PBVSI</span> Sulut
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Dapatkan berita terbaru, pengumuman, dan liputan eksklusif seputar dunia voli Sulawesi Utara.
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
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 transition-all"
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

            <div className="w-full lg:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/50 border-gray-200 text-gray-900">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="oldest">Terlama</SelectItem>
                  <SelectItem value="popular">Paling Populer</SelectItem>
                  <SelectItem value="comments">Paling Banyak Komentar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {(hasActiveFilters) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100"
            >
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Filter aktif:
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSearchQuery("")}>
                  &quot;{searchQuery}&quot; <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSelectedCategory("all")}>
                  {selectedCategory} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {sortBy !== "newest" && (
                <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" onClick={() => setSortBy("newest")}>
                  Urutan: {sortBy === "oldest" ? "Terlama" : sortBy === "popular" ? "Populer" : "Komentar"} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                Reset Filter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {filteredNews.length === 0 ? (
        <EmptyState
          type={hasActiveFilters ? "search" : "berita"}
          title={hasActiveFilters ? "Tidak ada berita ditemukan" : undefined}
          description={hasActiveFilters ? "Coba ubah kriteria pencarian atau filter Anda" : "Belum ada data di dalam database."}
          actionLabel={hasActiveFilters ? "Hapus Filter" : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <AnimatePresence>
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="h-full"
              >
                <Link href={`/berita/${article.slug}`} className="group h-full block">
                  <Card className="flex flex-col h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white group-hover:-translate-y-2">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                      <Image
                        src={article.image_url || "/placeholder.svg?height=400&width=600&query=article image"}
                        alt={article.title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                      {article.category && (
                        <Badge className="absolute top-4 left-4 z-20 bg-orange-600 hover:bg-orange-700 text-white border-none shadow-lg">
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="flex flex-col flex-1 p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span>{formatDateLong(article.published_at)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-4 flex-1">
                        {article.excerpt || article.content.replace(/<[^>]*>?/gm, '').slice(0, 150) + (article.content.length > 150 ? '...' : '')}
                      </p>
                      <div className="flex items-center text-orange-600 font-medium text-sm group-hover:underline">
                        Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
