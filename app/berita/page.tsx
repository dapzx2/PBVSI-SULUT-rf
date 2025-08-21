"use client"

import { useMemo, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { motion } from "framer-motion"
import { Calendar, Clock, Eye, Search, Filter, X, MessageCircle, User, Loader2, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StickyHeader } from "@/components/sticky-header"
import { PageTransition } from "@/components/page-transition"
import { useTheme } from "@/contexts/theme-context"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { getArticles } from "@/lib/articles"
import type { Article } from "@/lib/types"

export const revalidate = 60 // Revalidate data every 60 seconds

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const itemVariants = {
  hidden: { y: 30 },
  visible: { y: 0 },
}

export default function BeritaPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { gender } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { articles: fetchedArticles, error: fetchError } = await getArticles()
      if (fetchError) {
        throw new Error(fetchError)
      }
      setArticles(fetchedArticles || [])
    } catch (err: any) {
      console.error("Error fetching articles:", err)
      setError(err.message || "Terjadi kesalahan saat memuat berita.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(articles.map((n) => n.category).filter(Boolean))
    return [...uniqueCategories]
  }, [articles])

  // Filter and search logic with chronological sorting
  const filteredNews = useMemo(() => {
    const filtered = articles.filter((article) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort logic - default to chronological (newest first)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        case "oldest":
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
        case "popular":
          return (b.views || 0) - (a.views || 0) // Handle undefined views
        case "comments":
          return (b.comments || 0) - (a.comments || 0) // Handle undefined comments
        default:
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy, articles])

  const featuredNews = filteredNews.find((item) => item.featured)
  const regularNews = filteredNews.filter((item) => !item.featured)

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("newest")
  }

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || sortBy !== "newest"

  const getThemeClasses = (baseClass: string) => {
    if (baseClass.includes("bg-blue-600")) return "bg-orange-600"
    if (baseClass.includes("text-blue-600")) return "text-orange-600"
    if (baseClass.includes("hover:bg-blue-50")) return "hover:bg-orange-50"
    if (baseClass.includes("border-blue-600")) return "border-orange-600"
    return baseClass
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <StickyHeader currentPage="berita" />
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Memuat Berita...</h1>
            <p className="text-gray-600">Harap tunggu sebentar.</p>
            <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mt-8" />
          </div>
        </div>
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <StickyHeader currentPage="berita" />
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <div className="text-6xl mb-4">
              <WifiOff className="h-16 w-16 mx-auto text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={fetchArticles}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <StickyHeader currentPage="berita" />

        {/* Page Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-white to-gray-50 border-b shadow-sm pt-16"
        >
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Berita Bola Voli {gender === "men" ? "Putra" : "Putri"}
                </h1>
                <p className="text-gray-600 text-base md:text-lg">Portal Berita resmi PBVSI Sulawesi Utara</p>
              </div>

              {/* Search and Filter - Responsive */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Cari publikasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 w-full lg:w-80 h-12 text-lg border-2 focus:border-orange-500 rounded-xl shadow-sm"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-12 px-6 text-lg border-2 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto ${
                      hasActiveFilters ? getThemeClasses("border-blue-600 text-blue-600") : "bg-transparent"
                    }`}
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                    {hasActiveFilters && (
                      <Badge className={`ml-2 ${getThemeClasses("bg-blue-600")} text-white`}>
                        {[searchQuery !== "", selectedCategory !== "all", sortBy !== "newest"].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Filter Panel - Responsive */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 md:p-6 bg-white rounded-xl shadow-lg border"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                  <h3 className="text-lg font-semibold">Filter Publikasi</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters} className="text-sm w-full sm:w-auto">
                      <X className="w-4 h-4 mr-1" />
                      Hapus Semua Filter
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Kategori</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Urutkan</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Urutkan berdasarkan" />
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
              </motion.div>
            )}

            {/* Results Summary - Responsive */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <p className="text-gray-600 text-center sm:text-left">
                Menampilkan <span className="font-semibold">{filteredNews.length}</span> dari{" "}
                <span className="font-semibold">{articles.length}</span> publikasi
              </p>
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Pencarian: "{searchQuery}"
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Kategori: {selectedCategory}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                    </Badge>
                  )}
                  {sortBy !== "newest" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Urutan: {sortBy === "oldest" ? "Terlama" : sortBy === "popular" ? "Populer" : "Komentar"}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSortBy("newest")} />
                    </Badge>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content - Responsive */}
        <div className="container mx-auto px-4 py-8">
          {filteredNews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {hasActiveFilters ? "Tidak ada publikasi ditemukan" : "Belum ada data di dalam database"}
              </h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? "Coba ubah kriteria pencarian atau filter Anda"
                  : "Tidak ada artikel berita yang ditemukan saat ini."}
              </p>
              <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2">
                Hapus Semua Filter
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Featured News - Responsive */}
              {featuredNews && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Publikasi Utama</h2>
                  <Link href={`/berita/${featuredNews.slug}`}>
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 cursor-pointer">
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2">
                          <Image
                            src={
                              featuredNews.featured_image ||
                              "/placeholder.svg?height=400&width=600&query=volleyball news featured"
                             || "/placeholder.svg"}
                            alt={featuredNews.title}
                            width={600}
                            height={400}
                            className="w-full h-64 lg:h-full object-contain"
                          />
                        </div>
                        <div className="lg:w-1/2 p-6 lg:p-8">
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge className={getThemeClasses("bg-blue-600")}>{featuredNews.category}</Badge>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {featuredNews.read_time} menit
                            </span>
                          </div>
                          <h3 className="text-xl lg:text-2xl font-bold mb-4 hover:text-orange-600 transition-colors">
                            {featuredNews.title}
                          </h3>
                          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{featuredNews.excerpt}</p>
                          {/* Article Meta */}
                          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {featuredNews.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(new Date(featuredNews.published_at), "dd MMMM yyyy", { locale: id })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {featuredNews.read_time} menit
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {featuredNews.views?.toLocaleString() || 0}
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {featuredNews.comments || 0}
                              </div>
                            </div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                className={`${getThemeClasses("bg-blue-600 hover:bg-blue-700")} w-full sm:w-auto`}
                              >
                                Baca Selengkapnya
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )}

              {/* Regular News Grid - Responsive */}
              {regularNews.length > 0 && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Publikasi Terbaru</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {regularNews.map((article, index) => (
                      <motion.div
                        key={article.id}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 h-full">
                          <Link href={`/berita/${article.slug}`}>
                            <div className="relative cursor-pointer h-48">
                              <Image
                                src={
                                  article.featured_image ||
                                  "/placeholder.svg?height=200&width=300&query=volleyball news article"
                                 || "/placeholder.svg"}
                                alt={article.title}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <Badge className={`absolute top-3 left-3 ${getThemeClasses("bg-blue-600")}`}>
                                {article.category}
                              </Badge>
                            </div>
                          </Link>
                          <CardContent className="p-6 flex flex-col h-full">
                            {/* Article Meta */}
                            <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{format(new Date(article.published_at), "dd MMMM yyyy", { locale: id })}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                <span>{article.author}</span>
                              </div>
                            </div>

                            <Link href={`/berita/${article.slug}`}>
                              <h3 className="font-bold text-lg mb-3 hover:text-orange-600 transition-colors line-clamp-2 flex-grow cursor-pointer">
                                {article.title}
                              </h3>
                            </Link>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                              {article.excerpt}
                            </p>

                            {/* Read Time */}
                            <div className="flex items-center text-xs text-gray-500 mb-4">
                              <Clock className="w-3 h-3 mr-1" />
                              {article.read_time} menit
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Eye className="w-3 h-3 mr-1" />
                                  {article.views || 0}
                                </div>
                                <div className="flex items-center">
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  {article.comments || 0}
                                </div>
                              </div>
                              <Link href={`/berita/${article.slug}`}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    size="sm"
                                    className={`${getThemeClasses("bg-blue-600 hover:bg-blue-700")} text-white font-medium px-4 py-2`}
                                  >
                                    Baca Selengkapnya
                                  </Button>
                                </motion.div>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Load More - Responsive */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-12"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    Muat Publikasi Lainnya
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
        <Separator className="my-12" />
        <div className="text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} PBVSI. All rights reserved.</p>
        </div>
      </div>
    </PageTransition>
  )
}