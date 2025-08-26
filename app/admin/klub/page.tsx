"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { ClubForm } from "@/components/admin/club-form"
import { toast } from "sonner"
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react"

interface Club {
  id: string
  name: string
  city: string
  established_year: number
  coach_name: string
  home_arena: string
  logo_url: string | null
}

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
      fetchClubs(); // Refresh list
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
          <CardTitle>Manajemen Klub</CardTitle>
          <Button onClick={() => { setEditingClub(null); setIsAddClubModalOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Klub Baru
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative w-full max-w-sm mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari klub..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredClubs.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada klub ditemukan.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Klub</TableHead>
                    <TableHead>Kota</TableHead>
                    <TableHead>Tahun Berdiri</TableHead>
                    <TableHead>Pelatih</TableHead>
                    <TableHead>Arena Kandang</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClubs.map((club) => (
                    <TableRow key={club.id}>
                      <TableCell className="font-medium">{club.name}</TableCell>
                      <TableCell>{club.city}</TableCell>
                      <TableCell>{club.established_year}</TableCell>
                      <TableCell>{club.coach_name}</TableCell>
                      <TableCell>{club.home_arena}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(club)}
                          className="mr-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Ubah</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(club)}
                        >
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

      {/* Club Form Dialog */}
      <Dialog open={isAddClubModalOpen} onOpenChange={setIsAddClubModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClub ? 'Ubah Klub' : 'Tambah Klub Baru'}</DialogTitle>
            <DialogDescription>
              {editingClub ? 'Ubah detail di bawah ini.' : 'Isi detail untuk klub baru.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
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
              Apakah Anda yakin ingin menghapus klub "{deletingClub?.name}"? Tindakan ini tidak dapat dibatalkan.
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
