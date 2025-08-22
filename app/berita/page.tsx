"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { motion } from "framer-motion"
import { Calendar, Clock, Eye, Search, Filter, X, MessageCircle, User, Loader2, RefreshCw, WifiOff, ImageIcon } from 'lucide-react'
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

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch articles');
      }
      const fetchedArticles: Article[] = await response.json();
      setArticles(fetchedArticles || []);
    } catch (err: any) {
      console.error("Error fetching articles:", err);
      setError(err.message || "Terjadi kesalahan saat memuat berita.");
    } finally {
      setLoading(false);
    }
  }, []);

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

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || sortBy !== "newest"

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("newest")
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
        
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Publikasi PBVSI Sulut</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berita, artikel, dan pengumuman terbaru dari PBVSI Sulawesi Utara.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari publikasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
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

              {/* Sort By */}
              <div className="w-full lg:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
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

            {/* Active Filters */}
            {(hasActiveFilters) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                    Pencarian: "{searchQuery}" ×
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                    Kategori: {selectedCategory} ×
                  </Badge>
                )}
                {sortBy !== "newest" && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSortBy("newest")}>
                    Urutan: {sortBy === "oldest" ? "Terlama" : sortBy === "popular" ? "Populer" : "Komentar"} ×
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                  Hapus Semua
                </Button>
              </div>
            )}
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="relative aspect-video bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada publikasi ditemukan</h3>
                <p className="text-gray-600 mb-6">
                  {hasActiveFilters
                    ? "Coba ubah kriteria pencarian atau filter Anda"
                    : "Belum ada data di dalam database."}
                </p>
                <div className="text-sm text-gray-500">
                  <p>📰 Artikel berita akan segera tersedia</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredNews.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  <Link href={`/berita/${article.slug}`}>
                    <div className="relative aspect-video">
                      <Image
                        src={article.featured_image || "/placeholder.svg?height=300&width=300&query=article image"}
                        alt={article.title}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {article.category && (
                        <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                          {article.category}
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{article.excerpt}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {format(new Date(article.published_at), 'dd MMMM yyyy', { locale: id })}
                    </p>
                    <Link href={`/berita/${article.slug}`} className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2 inline-block">
                      Baca Selengkapnya →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Statistics Section */}
          {(articles.length > 0) && (
            <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Publikasi</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{articles.length}</div>
                  <div className="text-sm text-gray-600">Total Artikel</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                  <div className="text-sm text-gray-600">Kategori</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{years.length}</div>
                  <div className="text-sm text-gray-600">Tahun Publikasi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{filteredNews.length}</div>
                  <div className="text-sm text-gray-600">Hasil Filter</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}