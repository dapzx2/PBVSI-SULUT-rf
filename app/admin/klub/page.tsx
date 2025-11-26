"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, Plus, Edit, Trash2, Search, RefreshCw, Shield, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import dynamic from 'next/dynamic'

const ClubForm = dynamic(() => import('@/components/admin/club-form').then(mod => mod.ClubForm), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
})

import { Club } from "@/lib/types"

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddClubModalOpen, setIsAddClubModalOpen] = useState(false)
  const [editingClub, setEditingClub] = useState<Club | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingClub, setDeletingClub] = useState<Club | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/clubs")
      if (!response.ok) {
        throw new Error("Gagal mengambil data klub")
      }
      const data = await response.json()
      setClubs(data)
    } catch (err: any) {
      setError(err.message)
      toast.error("Gagal memuat klub: " + err.message);
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (club: Club) => {
    setEditingClub(club)
    setIsAddClubModalOpen(true)
  }

  const handleDelete = (club: Club) => {
    setDeletingClub(club);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingClub) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/clubs?id=${deletingClub.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus klub");
      }
      toast.success("Klub berhasil dihapus.");
      fetchClubs();
      setIsDeleteDialogOpen(false);
      setDeletingClub(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsAddClubModalOpen(false)
    setEditingClub(null)
    fetchClubs()
  }

  const handleFormClose = () => {
    setIsAddClubModalOpen(false)
    setEditingClub(null)
  }

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Manajemen Klub
            </CardTitle>
            <CardDescription className="mt-1">
              Kelola data klub voli di Sulawesi Utara.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="icon" onClick={fetchClubs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => { setEditingClub(null); setIsAddClubModalOpen(true); }} className="flex-1 md:flex-none">
              <Plus className="mr-2 h-4 w-4" /> Tambah Klub
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari klub berdasarkan nama atau kota..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && clubs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
              <p>Memuat klub...</p>
            </div>
          ) : filteredClubs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
              <Shield className="h-12 w-12 mb-2 opacity-20" />
              <p className="font-medium">Tidak ada klub ditemukan</p>
              {searchTerm && <p className="text-sm">Coba kata kunci pencarian lain</p>}
              {!searchTerm && (
                <Button variant="link" onClick={() => { setEditingClub(null); setIsAddClubModalOpen(true); }} className="mt-2">
                  Tambah Klub Baru
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[80px]">Logo</TableHead>
                      <TableHead>Nama Klub</TableHead>
                      <TableHead>Kota</TableHead>
                      <TableHead className="hidden md:table-cell">Tahun</TableHead>
                      <TableHead className="hidden lg:table-cell">Pelatih</TableHead>
                      <TableHead className="hidden xl:table-cell">Arena</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClubs.map((club) => (
                      <TableRow key={club.id} className="hover:bg-muted/5">
                        <TableCell>
                          <div className="relative h-12 w-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                            {club.logo_url ? (
                              <Image
                                src={club.logo_url}
                                alt={`${club.name} logo`}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <Shield className="h-6 w-6 text-muted-foreground/50" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{club.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-none">
                            {club.city}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {club.established_year}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {club.coach_name}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                          {club.home_arena || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(club)}
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Ubah</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(club)}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Hapus</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Club Form Dialog */}
      <Dialog open={isAddClubModalOpen} onOpenChange={setIsAddClubModalOpen}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{editingClub ? "Ubah Klub" : "Tambah Klub Baru"}</DialogTitle>
            <DialogDescription>
              {editingClub ? "Ubah detail klub yang sudah ada." : "Isi detail untuk klub baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <ClubForm
              initialData={editingClub}
              onSuccess={handleFormSuccess}
              onClose={handleFormClose}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Klub</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus klub &quot;{deletingClub?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
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
