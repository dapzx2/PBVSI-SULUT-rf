"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react"
import { Article } from "@/lib/types"
import { ArticleForm } from "@/components/admin/article-form"
import { toast } from "sonner"

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
    } catch (e: any) {
      setError(e.message)
      toast.error("Gagal memuat artikel: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

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

  const handleFormSubmit = async (data: Omit<Article, 'id' | 'created_at' | 'published_at'> & { imageFile?: File | null }) => {
    setIsSubmitting(true)
    try {
      let finalImageUrl = data.image_url || null;
      const { imageFile, ...restOfData } = data; // Destructure imageFile out

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
        ...restOfData, // Spread the rest of the data without imageFile
        image_url: finalImageUrl,
      };

      let response: Response
      if (currentArticle) {
        // Update existing article
        response = await fetch("/api/articles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentArticle.id, ...articlePayload }),
        })
      } else {
        // Create new article
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

      toast.success(`Artikel berhasil ${currentArticle ? "diperbarui" : "ditambahkan"}`)
      setIsFormOpen(false)
      fetchArticles() // Refresh the list
    } catch (e: any) {
      toast.error("Gagal menyimpan artikel: " + e.message)
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

      toast.success("Artikel berhasil dihapus")
      setIsDeleteDialogOpen(false)
      fetchArticles() // Refresh the list
    } catch (e: any) {
      toast.error("Gagal menghapus artikel: " + e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Manajemen Berita & Artikel</CardTitle>
          <Button onClick={handleAddArticle}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Artikel
          </Button>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada artikel.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Penulis</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal Publikasi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>{article.author || "-"}</TableCell>
                      <TableCell>{article.category || "-"}</TableCell>
                      <TableCell>{new Date(article.published_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditArticle(article)}
                          className="mr-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteArticle(article)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentArticle ? "Edit Artikel" : "Tambah Artikel Baru"}</DialogTitle>
            <DialogDescription>
              {currentArticle ? "Edit detail artikel." : "Isi detail untuk artikel baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
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
            <DialogTitle>Konfirmasi Hapus Artikel</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus artikel "{currentArticle?.title}"? Tindakan ini tidak dapat dibatalkan.
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
