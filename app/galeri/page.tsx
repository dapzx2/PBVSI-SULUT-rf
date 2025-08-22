"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ImageIcon, Loader2, RefreshCw, WifiOff } from 'lucide-react'
import { StickyHeader } from "@/components/sticky-header"
import { PageTransition } from "@/components/page-transition"
import { Separator } from "@/components/ui/separator"
import { getGalleryItems } from "@/lib/gallery"
import type { GalleryItem } from "@/lib/types"
import Image from "next/image"

export default function GaleriPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch gallery items');
      }
      const fetchedItems: GalleryItem[] = await response.json();
      setAllGalleryItems(fetchedItems || []);
    } catch (err: any) {
      console.error("Error fetching gallery data:", err);
      setError(err.message || "Terjadi kesalahan saat memuat data galeri.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter logic
  const filteredItems = allGalleryItems.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesYear = selectedYear === "all" || new Date(item.created_at).getFullYear().toString() === selectedYear
    
    return matchesSearch && matchesCategory && matchesYear
  })

  // Get unique categories and years
  const categories = [...new Set(allGalleryItems.map(item => item.category))].filter(Boolean)
  const years = [...new Set(allGalleryItems.map(item => new Date(item.created_at).getFullYear().toString()))].filter(Boolean).sort((a, b) => b.localeCompare(a))

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <StickyHeader currentPage="galeri" />
        
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Galeri PBVSI Sulut</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dokumentasi kegiatan, turnamen, dan momen bersejarah Persatuan Bola Voli Seluruh Indonesia Sulawesi Utara
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
                    placeholder="Cari foto atau video..."
                    value={searchTerm}
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

              {/* Year Filter */}
              <div className="w-full lg:w-32">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
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

            {/* Active Filters */}
            {(selectedCategory !== "all" || selectedYear !== "all" || searchTerm) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                    Pencarian: "{searchTerm}" ×
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                    Kategori: {selectedCategory} ×
                  </Badge>
                )}
                {selectedYear !== "all" && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedYear("all")}>
                    Tahun: {selectedYear} ×
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
                  className="h-6 px-2 text-xs"
                >
                  Hapus Semua
                </Button>
              </div>
            )}
          </div>

          {/* Gallery Content */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Galeri Kosong</h3>
                <p className="text-gray-600 mb-6">
                  Belum ada data di dalam database. Silakan periksa kembali nanti atau hubungi administrator.
                </p>
                <div className="text-sm text-gray-500">
                  <p>🖼️ Galeri foto dan video akan segera tersedia</p>
                </div>
              </div>
            </div>
          ) : (
            /* Gallery Grid - Ready for when data is available */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  <div className="relative aspect-square">
                    <Image
                      src={item.image_url || "/placeholder.svg?height=300&width=300&query=gallery image"}
                      alt={item.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.category && (
                      <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Statistics Section - Ready for when data is available */}
          {(allGalleryItems.length > 0) && (
            <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Galeri</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{allGalleryItems.length}</div>
                  <div className="text-sm text-gray-600">Total Item</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                  <div className="text-sm text-gray-600">Kategori</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{years.length}</div>
                  <div className="text-sm text-gray-600">Tahun</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{filteredItems.length}</div>
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