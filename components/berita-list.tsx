"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Search, Filter, ImageIcon, X, Tag, Calendar, User, ArrowRight } from 'lucide-react'
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
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-4"
      >
        <Badge variant="outline" className="px-4 py-1 border-orange-200 text-orange-700 bg-orange-50 mb-4">
          Informasi Terkini
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Berita <span className="text-orange-600">PBVSI</span> Sulut
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Dapatkan berita terbaru, pengumuman, dan liputan eksklusif seputar dunia voli Sulawesi Utara.
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
                  "{searchQuery}" <X className="w-3 h-3 ml-1" />
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada berita ditemukan</h3>
          <p className="text-gray-500 mb-6">
            {hasActiveFilters
              ? "Coba ubah kriteria pencarian atau filter Anda"
              : "Belum ada data di dalam database."}
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Hapus Filter
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="bg-white h-full overflow-hidden hover:shadow-xl transition-all duration-300 group border-gray-100 flex flex-col">
                  <Link href={`/berita/${article.slug}`} className="block relative aspect-video overflow-hidden">
                    <Image
                      src={article.image_url || "/placeholder.svg?height=400&width=600&query=article image"}
                      alt={article.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {article.category && (
                      <Badge className="absolute top-4 left-4 bg-orange-600 text-white border-none shadow-lg">
                        {article.category}
                      </Badge>
                    )}
                  </Link>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(article.published_at), 'dd MMM yyyy', { locale: id })}
                      </span>
                      {article.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.author}
                        </span>
                      )}
                    </div>
                    <Link href={`/berita/${article.slug}`} className="block group-hover:text-orange-600 transition-colors">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                        {article.title}
                      </h3>
                    </Link>
                    {article.excerpt && (
                      <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed flex-grow">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link
                        href={`/berita/${article.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

