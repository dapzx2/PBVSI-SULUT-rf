"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, PlusCircle, Edit, Trash2, Search, RefreshCw, FileText, Image as ImageIcon } from "lucide-react"
import { Article } from "@/lib/types"
import { ArticleForm } from "@/components/admin/article-form"
import { toast } from "sonner"
import Image from "next/image"
import { formatDateShort } from "@/lib/date-utils"

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchArticles = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/articles")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Article[] = await response.json()
      setArticles(data)
      setFilteredArticles(data)
    } catch (e: any) {
      setError(e.message)
      toast.error("Gagal memuat berita: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.author && article.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (article.category && article.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredArticles(filtered)
    } else {
      setFilteredArticles(articles)
    }
  }, [searchQuery, articles])

  const handleAddArticle = () => {
    setCurrentArticle(null)
    setIsFormOpen(true)
  }

  const handleEditArticle = (article: Article) => {
    setCurrentArticle(article)
    setIsFormOpen(true)
  }

  const handleDeleteArticle = (article: Article) => {
    setCurrentArticle(article)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: Omit<Article, 'id' | 'created_at' | 'published_at' | 'image_url' | 'updated_at' | 'slug' | 'excerpt'> & { imageFile?: File | null }) => {
    setIsSubmitting(true)
    try {
      let finalImageUrl = currentArticle?.image_url || null;
      const { imageFile, ...restOfData } = data;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || `Gagal mengunggah gambar: ${uploadResponse.status}`);
        }
        const uploadResult = await uploadResponse.json();
        finalImageUrl = uploadResult.url;
      }

      const articlePayload = {
        ...restOfData,
        image_url: finalImageUrl,
      };

      let response: Response
      if (currentArticle) {
        response = await fetch("/api/articles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentArticle.id, ...articlePayload }),
        })
      } else {
        response = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articlePayload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      toast.success(`Berita berhasil ${currentArticle ? "diperbarui" : "ditambahkan"}`)
      setIsFormOpen(false)
      fetchArticles()
    } catch (e: any) {
      toast.error("Gagal menyimpan berita: " + e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!currentArticle) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentArticle.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      toast.success("Berita berhasil dihapus")
      setIsDeleteDialogOpen(false)
      fetchArticles()
    } catch (e: any) {
      toast.error("Gagal menghapus berita: " + e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Manajemen Berita
            </CardTitle>
            <CardDescription className="mt-1">
              Kelola artikel, berita, dan pengumuman untuk website.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="icon" onClick={fetchArticles} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleAddArticle} className="flex-1 md:flex-none">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Berita
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berita berdasarkan judul, penulis, atau kategori..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading && articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
              <p>Memuat berita...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 mb-2 opacity-20" />
              <p className="font-medium">Tidak ada berita ditemukan</p>
              {searchQuery && <p className="text-sm">Coba kata kunci pencarian lain</p>}
              {!searchQuery && (
                <Button variant="link" onClick={handleAddArticle} className="mt-2">
                  Tambah Berita Baru
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[80px]">Gambar</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Penulis</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map((article) => (
                    <TableRow key={article.id} className="hover:bg-muted/5">
                      <TableCell>
                        <div className="relative h-12 w-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                          {article.image_url ? (
                            <Image
                              src={article.image_url}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[300px]">
                        <div className="truncate" title={article.title}>
                          {article.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        {article.category ? (
                          <Badge variant="secondary" className="capitalize">
                            {article.category}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{article.author || "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateShort(article.published_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditArticle(article)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Ubah</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteArticle(article)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Article Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{currentArticle ? "Ubah Berita" : "Tambah Berita Baru"}</DialogTitle>
            <DialogDescription>
              {currentArticle ? "Edit detail berita." : "Isi detail untuk berita baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden p-6">
            <ArticleForm
              initialData={currentArticle}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              isLoading={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Berita</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus berita &quot;{currentArticle?.title}&quot;? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
