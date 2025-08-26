"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react"
import { MatchForm } from "@/components/admin/match-form" // Will create this next
import type { Match, Club } from "@/lib/types"
import Image from "next/image"

export default function AdminLiveScorePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMatch, setDeletingMatch] = useState<Match | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMatches = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/matches")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Match[] = await response.json()
      setMatches(data)
    } catch (err: any) {
      setError(err.message || "Gagal memuat pertandingan.")
      toast.error("Gagal memuat pertandingan: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false)
    }
  }

  const fetchClubs = async () => {
    try {
      const response = await fetch("/api/admin/clubs")
      if (!response.ok) throw new Error("Gagal memuat klub");
      const data = await response.json();
      setClubs(data);
    } catch (error: any) {
      toast.error("Gagal memuat klub: " + error.message);
    }
  };

  useEffect(() => {
    fetchMatches()
    fetchClubs()
  }, [])

  const handleAdd = () => {
    setEditingMatch(null)
    setIsFormOpen(true)
  }

  const handleEdit = (match: Match) => {
    setEditingMatch(match)
    setIsFormOpen(true)
  }

  const handleDelete = (match: Match) => {
    setDeletingMatch(match);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMatch) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/matches/${deletingMatch.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menghapus pertandingan.")
      }
      toast.success("Pertandingan berhasil dihapus.");
      fetchMatches() // Refresh list
      setIsDeleteDialogOpen(false);
      setDeletingMatch(null);
    } catch (err: any) {
      toast.error("Gagal menghapus pertandingan: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingMatch(null)
  }

  const handleFormSuccess = () => {
    fetchMatches() // Refresh list after successful add/edit
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
          <CardTitle>Manajemen Live Score</CardTitle>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pertandingan
          </Button>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada pertandingan ditemukan.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Tim Kandang</TableHead>
                    <TableHead>Tim Tandang</TableHead>
                    <TableHead>Skor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Turnamen</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>
                        {console.log('Display - Raw match_date:', match.match_date)}
                        {console.log('Display - Parsed Date (local):', new Date(match.match_date))}
                        {match.match_date ? new Date(match.match_date).toLocaleString("id-ID") : "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {clubs.find(c => c.id === match.home_team_id)?.name || "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {clubs.find(c => c.id === match.away_team_id)?.name || "N/A"}
                      </TableCell>
                      <TableCell>{match.score_home_sets ?? "-"} - {match.score_away_sets ?? "-"}</TableCell>
                      <TableCell>{match.status}</TableCell>
                      <TableCell>{match.league || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(match)} className="mr-2">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Ubah</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(match)}>
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

      {/* Match Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMatch ? "Edit Pertandingan" : "Tambah Pertandingan Baru"}</DialogTitle>
            <DialogDescription>
              {editingMatch ? "Ubah detail di bawah ini." : "Isi detail untuk pertandingan baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <MatchForm
              initialData={editingMatch}
              onSuccess={handleFormSuccess}
              onClose={handleFormClose}
              clubs={clubs}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Pertandingan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pertandingan ini? Tindakan ini tidak dapat dibatalkan.
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
