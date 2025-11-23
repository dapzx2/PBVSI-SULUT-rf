"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Search, Filter, ImageIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Article } from "@/lib/types"

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

  const years = useMemo(() => {
    const uniqueYears = new Set(articles.map(article => new Date(article.published_at).getFullYear()).filter(Boolean));
    return [...uniqueYears].sort((a, b) => a - b);
  }, [articles]);

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
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Berita PBVSI Sulut</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Berita dan pengumuman terbaru dari PBVSI Sulawesi Utara.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

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

        {(hasActiveFilters) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-gray-600">Filter aktif:</span>
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("")}>
                Pencarian: &quot;{searchQuery}&quot; ×
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

      {filteredNews.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada berita ditemukan</h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters
                ? "Coba ubah kriteria pencarian atau filter Anda"
                : "Belum ada data di dalam database."}
            </p>
            <div className="text-sm text-gray-500">
              <p>📰 Berita akan segera tersedia</p>
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
                    src={article.image_url || "/placeholder.svg?height=300&width=300&query=article image"}
                    alt={article.title}
                    fill
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
                <Link href={`/berita/${article.slug}`} className="bg-orange-600 text-white hover:bg-orange-700 text-sm font-medium mt-2 inline-block px-3 py-1 rounded-md transition-colors">
                  Baca Selengkapnya →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

