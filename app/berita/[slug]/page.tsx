"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Loader2, RefreshCw, User } from "lucide-react"

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
        throw new Error(data.error || `Gagal memuat berita dengan slug ${slug}`)
      }
      setArticle(data)
    } catch (err: any) {
      console.error(`Error fetching article with slug ${slug}:`, err)
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Gagal terhubung ke server. Pastikan koneksi internet Anda stabil dan coba lagi.")
        toast({
          title: "Kesalahan Jaringan",
          description: "Tidak dapat memuat berita. Periksa koneksi internet Anda.",
          variant: "destructive",
        })
      } else {
        setError(err.message || `Gagal memuat berita ${slug}. Silakan coba lagi.`)
        toast({
          title: "Kesalahan",
          description: err.message || `Gagal memuat berita ${slug}.`,
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
          <p className="ml-2 text-xl text-gray-600 mt-4">Memuat berita...</p>
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
            <h3 className="text-2xl font-bold text-red-600 mb-2">Gagal Memuat Berita</h3>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Berita tidak ditemukan</h3>
            <p className="text-gray-600 mb-6">Maaf, berita dengan slug &quot;{slug}&quot; tidak ditemukan.</p>
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
      <div className="min-h-screen bg-gray-50">
        <main className="pt-32 pb-16">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg p-8">
            {/* Header section with category and title */}
            <div className="text-center mb-8">
              {article.category && (
                <p className="text-base font-semibold text-orange-600 tracking-wide uppercase">{article.category}</p>
              )}
              <h1 className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {article.title}
              </h1>
            </div>

            {/* Metadata: Author and Date */}
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-8 border-y py-4">
              <div className="flex items-center gap-2">
                <User aria-label={article.author} className="h-8 w-8 text-gray-400 rounded-full bg-gray-100 p-1" />
                <span className="font-medium text-gray-800">{article.author}</span>
              </div>
              <span className="text-gray-300">•</span>
              <time dateTime={article.published_at}>
                {new Date(article.published_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>


            {/* Main Image */}
            {article.image_url && (
              <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none text-gray-800 mx-auto"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

          </article>
        </main>
      </div>
    </PageTransition>
  )
}