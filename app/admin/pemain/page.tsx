"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Player, AdminUser } from "@/lib/types"
import { PlusCircle, Edit, Trash2, Loader2, AlertCircle, Shield, User, LogOut } from "lucide-react"
import { PlayerForm } from "@/components/admin/player-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // Mock user for demonstration purposes (replace with actual auth context)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [currentRole, setCurrentRole] = useState<"super_admin" | "admin">("super_admin")

  const fetchPlayers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/players")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal memuat data pemain.")
      }
      const data = await response.json()
      setPlayers(data.players)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Kesalahan",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    // Simulate user data based on currentRole state
    setUser({
      id: "demo-user-id",
      email: currentRole === "super_admin" ? "superadmin@demo.com" : "admin@demo.com",
      username: currentRole === "super_admin" ? "Demo Super Admin" : "Demo Admin",
      password_hash: "", // Not used here
      role: currentRole,
      created_at: new Date().toISOString(),
    })
    fetchPlayers()
  }, [currentRole, fetchPlayers]) // Re-fetch players when role changes or fetchPlayers changes

  const handleAddPlayer = () => {
    setSelectedPlayer(null)
    setIsFormOpen(true)
  }

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player)
    setIsFormOpen(true)
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (!user || user.role !== "super_admin") {
      toast({
        title: "Akses Ditolak",
        description: "Hanya Super Admin yang dapat menghapus pemain.",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Apakah Anda yakin ingin menghapus pemain ini?")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/players?id=${playerId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menghapus pemain.")
      }

      toast({
        title: "Sukses",
        description: "Pemain berhasil dihapus.",
      })
      fetchPlayers() // Refresh list
    } catch (err: any) {
      toast({
        title: "Kesalahan",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedPlayer(null)
  }

  const handleLogout = async () => {
    console.log("🚪 Simulating logout (no actual logout in no-auth mode)")
    alert("Simulasi logout. Untuk mengaktifkan kembali autentikasi, kembalikan kode asli.")
    window.location.href = "/admin/login" // Redirect to login page
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600">Memuat dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Pemain</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddPlayer}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pemain
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedPlayer ? "Edit Pemain" : "Tambah Pemain Baru"}</DialogTitle>
              </DialogHeader>
              <PlayerForm initialData={selectedPlayer} onSuccess={fetchPlayers} onClose={handleFormClose} />
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
              <p className="text-gray-600">Memuat data pemain...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pemain</CardTitle>
            </CardHeader>
            <CardContent>
              {players.length === 0 ? (
                <p className="text-center text-muted-foreground">Tidak ada data pemain.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Posisi</TableHead>
                        <TableHead>Klub</TableHead>
                        <TableHead>Tinggi (cm)</TableHead>
                        <TableHead>Berat (kg)</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell>{player.position}</TableCell>
                          <TableCell>{player.club?.name || "N/A"}</TableCell>
                          <TableCell>{player.height}</TableCell>
                          <TableCell>{player.weight}</TableCell>
                          <TableCell className="flex gap-2">
                            <Dialog open={isFormOpen && selectedPlayer?.id === player.id} onOpenChange={setIsFormOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => handleEditPlayer(player)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Ubah</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Pemain</DialogTitle>
                                </DialogHeader>
                                <PlayerForm
                                  initialData={selectedPlayer}
                                  onSuccess={fetchPlayers}
                                  onClose={handleFormClose}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePlayer(player.id)}
                              disabled={isDeleting || user.role !== "super_admin"}
                            >
                              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
        )}
      </main>
    </div>
  )
}