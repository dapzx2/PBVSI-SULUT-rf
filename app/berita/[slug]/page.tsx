"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Loader2, RefreshCw } from "lucide-react"

import { StickyHeader } from "@/components/sticky-header"
import { PageTransition } from "@/components/page-transition"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { Article } from "@/lib/types"

export default function ArticleDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchArticle = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/articles/${slug}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Gagal memuat artikel dengan slug ${slug}`)
      }
      setArticle(data)
    } catch (err: any) {
      console.error(`Error fetching article with slug ${slug}:`, err)
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Gagal terhubung ke server. Pastikan koneksi internet Anda stabil dan coba lagi.")
        toast({
          title: "Kesalahan Jaringan",
          description: "Tidak dapat memuat artikel. Periksa koneksi internet Anda.",
          variant: "destructive",
        })
      } else {
        setError(err.message || `Gagal memuat artikel ${slug}. Silakan coba lagi.`)
        toast({
          title: "Kesalahan",
          description: err.message || `Gagal memuat artikel ${slug}.`,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }, [slug, toast])

  useEffect(() => {
    if (slug) {
      fetchArticle()
    }
  }, [slug, fetchArticle])

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
          <p className="ml-2 text-xl text-gray-600 mt-4">Memuat artikel...</p>
        </div>
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Gagal Memuat Artikel</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchArticle} className="bg-orange-600 hover:bg-orange-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!article) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Artikel tidak ditemukan</h3>
            <p className="text-gray-600 mb-6">Maaf, artikel dengan slug &quot;{slug}&quot; tidak ditemukan.</p>
            <Button onClick={() => window.history.back()} className="bg-orange-600 hover:bg-orange-700">
              Kembali
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

        <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 pt-32 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{article.title}</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              {new Date(article.published_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Card className="p-6">
              {article.image_url && (
                <div className="relative w-full h-80 mb-6 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={article.image_url || "/placeholder.svg?height=320&width=600&query=article image"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="prose max-w-none text-gray-800">
                <p>{article.content}</p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}