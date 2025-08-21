"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, PlusCircle, Edit, Trash2, ImageIcon } from "lucide-react"
import { GalleryForm } from "@/components/admin/gallery-form"
import type { GalleryItem } from "@/lib/types"
import Image from "next/image"

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const { toast } = useToast()

  const fetchGalleryItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/gallery")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: GalleryItem[] = await response.json()
      setGalleryItems(data)
    } catch (err: any) {
      setError(err.message || "Gagal memuat item galeri.")
      toast({
        title: "Error",
        description: "Gagal memuat item galeri.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item galeri ini?")) {
      return
    }
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menghapus item galeri.")
      }
      toast({
        title: "Sukses",
        description: "Item galeri berhasil dihapus.",
      })
      fetchGalleryItems() // Refresh list
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const handleFormSuccess = () => {
    fetchGalleryItems() // Refresh list after successful add/edit
    handleFormClose()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Galeri</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Item Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Item Galeri" : "Tambah Item Galeri Baru"}</DialogTitle>
            </DialogHeader>
            <GalleryForm initialData={editingItem} onSuccess={handleFormSuccess} onClose={handleFormClose} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
          <p className="ml-2 text-lg text-gray-600">Memuat item galeri...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          <p>Error: {error}</p>
          <Button onClick={fetchGalleryItems} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      ) : galleryItems.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada item galeri ditemukan.</h3>
            <p className="text-gray-600">Klik "Tambah Item Baru" untuk mulai menambahkan foto ke galeri Anda.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Item Galeri</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Gambar</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal Acara</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {galleryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image
                            src={item.image_url || "/placeholder.svg?height=48&width=64&query=gallery thumbnail"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{new Date(item.event_date).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
