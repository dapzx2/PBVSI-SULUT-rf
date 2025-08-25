"use client"
import { useState, useEffect, useCallback } from "react"
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
import { PlayerForm } from "@/components/admin/player-form"
import { Loader2, Plus, Edit, Trash2, Search, Users } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Player } from "@/lib/types"

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const router = useRouter()

  const fetchPlayers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/players")
      if (!response.ok) {
        throw new Error("Failed to fetch players")
      }
      const data = await response.json()
      setPlayers(data.players)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlayers()
  }, [fetchPlayers])

  const handleEdit = (player: Player) => {
    setEditingPlayer(player)
    setIsAddPlayerModalOpen(true)
  }

  const handleDelete = async (playerId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pemain ini?")) {
      return
    }
    try {
      const response = await fetch(`/api/admin/players?id=${playerId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete player")
      }
      fetchPlayers() // Refresh the list
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleFormSuccess = () => {
    setIsAddPlayerModalOpen(false)
    setEditingPlayer(null)
    fetchPlayers()
  }

  const handleFormClose = () => {
    setIsAddPlayerModalOpen(false)
    setEditingPlayer(null)
  }

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8" />
            Manajemen Pemain
          </h2>
          <Dialog open={isAddPlayerModalOpen} onOpenChange={setIsAddPlayerModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingPlayer(null)}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Pemain Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingPlayer ? "Edit Pemain" : "Tambah Pemain Baru"}</DialogTitle>
                <DialogDescription>
                  {editingPlayer ? "Edit detail pemain di sini." : "Tambahkan pemain baru ke database."}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <PlayerForm
                  initialData={editingPlayer}
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
              Daftar Pemain
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari pemain..."
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
                <p className="ml-2 text-gray-600">Memuat data pemain...</p>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <p className="text-center text-gray-500">Tidak ada pemain ditemukan.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Pemain</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead>Klub</TableHead>
                      <TableHead>Tinggi (cm)</TableHead>
                      <TableHead>Berat (kg)</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell>{player.position}</TableCell>
                        <TableCell>{player.club?.name || "N/A"}</TableCell>
                        <TableCell>{player.height}</TableCell>
                        <TableCell>{player.weight}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleEdit(player)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(player.id)}
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