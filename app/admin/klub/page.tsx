"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { ClubForm } from "@/components/admin/club-form"
import { Loader2, Plus, Edit, Trash2, Search, Shield } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const router = useRouter()

  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/clubs")
      if (!response.ok) {
        throw new Error("Failed to fetch clubs")
      }
      const data = await response.json()
      setClubs(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (club: Club) => {
    setEditingClub(club)
    setIsAddClubModalOpen(true)
  }

  const handleDelete = async (clubId: string) => {
    if (!confirm("Are you sure you want to delete this club?")) {
      return
    }
    try {
      const response = await fetch(`/api/admin/clubs?id=${clubId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete club")
      }
      fetchClubs() // Refresh the list
    } catch (err: any) {
      setError(err.message)
    }
  }

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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Manajemen Klub
          </h2>
          <Dialog open={isAddClubModalOpen} onOpenChange={setIsAddClubModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingClub(null)}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Klub Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingClub ? "Edit Klub" : "Tambah Klub Baru"}</DialogTitle>
                <DialogDescription>
                  {editingClub ? "Edit detail klub di sini." : "Tambahkan klub baru ke database."}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <ClubForm
                  initialData={editingClub}
                  onSuccess={handleFormSuccess}
                  onClose={handleFormClose}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Daftar Klub
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari klub..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <p className="ml-2 text-gray-600">Memuat data klub...</p>
              </div>
            ) : filteredClubs.length === 0 ? (
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
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleEdit(club)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(club.id)}
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
      </main>
    </div>
  )
}