"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, PlusCircle, Edit, Trash2, Search, RefreshCw, Trophy } from "lucide-react"
import { MatchForm } from "@/components/admin/match-form"
import type { Match, Club } from "@/lib/types"

export default function AdminPertandinganPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
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
      setFilteredMatches(data)
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

  useEffect(() => {
    if (searchQuery) {
      const filtered = matches.filter(match => {
        const homeTeam = clubs.find(c => c.id === match.home_team_id)?.name || "";
        const awayTeam = clubs.find(c => c.id === match.away_team_id)?.name || "";
        const league = match.league || "";

        return homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          league.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredMatches(filtered);
    } else {
      setFilteredMatches(matches);
    }
  }, [searchQuery, matches, clubs]);

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
      fetchMatches()
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
    fetchMatches()
    handleFormClose()
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "live":
        return { label: "Sedang Berlangsung", className: "bg-red-100 text-red-800 border-none" };
      case "finished":
        return { label: "Selesai", className: "bg-green-100 text-green-800 border-none" };
      case "scheduled":
      default:
        return { label: "Terjadwal", className: "bg-blue-100 text-blue-800 border-none" };
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Manajemen Pertandingan
            </CardTitle>
            <CardDescription className="mt-1">
              Kelola jadwal dan hasil pertandingan voli.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="icon" onClick={fetchMatches} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleAdd} className="flex-1 md:flex-none">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pertandingan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari pertandingan berdasarkan tim atau turnamen..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading && matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
              <p>Memuat pertandingan...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
              <Trophy className="h-12 w-12 mb-2 opacity-20" />
              <p className="font-medium">Tidak ada pertandingan ditemukan</p>
              {searchQuery && <p className="text-sm">Coba kata kunci pencarian lain</p>}
              {!searchQuery && (
                <Button variant="link" onClick={handleAdd} className="mt-2">
                  Tambah Pertandingan Baru
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Tim Kandang</TableHead>
                      <TableHead>Tim Tandang</TableHead>
                      <TableHead>Skor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Turnamen</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatches.map((match) => {
                      const statusBadge = getStatusBadge(match.status);
                      return (
                        <TableRow key={match.id} className="hover:bg-muted/5">
                          <TableCell className="text-sm">
                            {match.match_date ? new Date(match.match_date).toLocaleDateString("id-ID", {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : "N/A"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {clubs.find(c => c.id === match.home_team_id)?.name || "N/A"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {clubs.find(c => c.id === match.away_team_id)?.name || "N/A"}
                          </TableCell>
                          <TableCell className="font-bold text-primary">
                            {match.score_home_sets ?? "-"} - {match.score_away_sets ?? "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={statusBadge.className}>
                              {statusBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {match.league || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(match)}
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Ubah</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(match)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{editingMatch ? "Edit Pertandingan" : "Tambah Pertandingan Baru"}</DialogTitle>
            <DialogDescription>
              {editingMatch ? "Ubah detail di bawah ini." : "Isi detail untuk pertandingan baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
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
