"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error("Gagal memuat item galeri: " + (err.message || "Unknown error"));
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

  const handleDelete = (item: GalleryItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/gallery/${deletingItem.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menghapus item galeri.")
      }
      toast.success("Item galeri berhasil dihapus.");
      fetchGalleryItems() // Refresh list
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    } catch (err: any) {
      toast.error("Gagal menghapus item galeri: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const handleFormSuccess = () => {
    fetchGalleryItems() // Refresh list after successful add/edit
    handleFormClose()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Manajemen Galeri</CardTitle>
          <Button onClick={() => { setEditingItem(null); setIsFormOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Item Baru
          </Button>
        </CardHeader>
        <CardContent>
          {galleryItems.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada item galeri ditemukan.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Gambar</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
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
                      <TableCell>{new Date(item.created_at).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="mr-2">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Ubah</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Hapus</span>
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

      {/* Gallery Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item Galeri" : "Tambah Item Galeri Baru"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Ubah detail di bawah ini." : "Isi detail untuk item galeri baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <GalleryForm initialData={editingItem} onSuccess={handleFormSuccess} onClose={handleFormClose} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Item Galeri</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus item galeri "{deletingItem?.title}"? Tindakan ini tidak dapat dibatalkan.
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
              {isSubmitting ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}