
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PlayerForm from '@/components/admin/player-form';
import { toast } from 'sonner';
import { PlusCircle, Loader2, Edit, Trash2, Search, RefreshCw, Users } from 'lucide-react';
import { Player } from '@/lib/types';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/players');
      if (!response.ok) throw new Error('Gagal mengambil data pemain');
      const data = await response.json();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Gagal memuat pemain: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (player.position && player.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ((player as any).club_name && (player as any).club_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players);
    }
  }, [searchQuery, players]);

  const handleAdd = () => {
    setEditingPlayer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const handleDelete = (player: Player) => {
    setDeletingPlayer(player);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPlayer) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/players/${deletingPlayer.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus pemain');
      }
      toast.success('Pemain berhasil dihapus.');
      fetchPlayers();
      setIsDeleteDialogOpen(false);
      setDeletingPlayer(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingPlayer(null);
    fetchPlayers();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPlayer(null);
  };

  const getPositionBadge = (position: string) => {
    const colors: Record<string, string> = {
      "Spiker": "bg-red-100 text-red-800",
      "Libero": "bg-yellow-100 text-yellow-800",
      "Tosser": "bg-blue-100 text-blue-800",
      "Blocker": "bg-green-100 text-green-800",
      "Server": "bg-purple-100 text-purple-800",
    };
    return colors[position] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Manajemen Pemain
            </CardTitle>
            <CardDescription className="mt-1">
              Kelola data pemain voli di Sulawesi Utara.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="icon" onClick={fetchPlayers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleAdd} className="flex-1 md:flex-none">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pemain
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari pemain berdasarkan nama, posisi, atau klub..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading && players.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
              <p>Memuat pemain...</p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
              <Users className="h-12 w-12 mb-2 opacity-20" />
              <p className="font-medium">Tidak ada pemain ditemukan</p>
              {searchQuery && <p className="text-sm">Coba kata kunci pencarian lain</p>}
              {!searchQuery && (
                <Button variant="link" onClick={handleAdd} className="mt-2">
                  Tambah Pemain Baru
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[60px]">Foto</TableHead>
                      <TableHead>Nama Pemain</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead className="hidden md:table-cell">Tinggi/Berat</TableHead>
                      <TableHead className="hidden lg:table-cell">Klub</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlayers.map((player) => (
                      <TableRow key={player.id} className="hover:bg-muted/5">
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={player.photo_url || undefined} alt={player.name} />
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell>
                          {player.position ? (
                            <Badge variant="secondary" className={`${getPositionBadge(player.position)} border-none`}>
                              {player.position}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {player.height && player.weight
                            ? `${player.height} cm / ${player.weight} kg`
                            : '-'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {(player as any).club_name || <span className="text-muted-foreground">Tanpa Klub</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(player)}
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Ubah</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(player)}
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

      {/* Player Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{editingPlayer ? 'Ubah Pemain' : 'Tambah Pemain Baru'}</DialogTitle>
            <DialogDescription>
              {editingPlayer ? 'Ubah detail di bawah ini.' : 'Isi detail untuk pemain baru.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <PlayerForm
              initialData={editingPlayer}
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
            <DialogTitle>Konfirmasi Hapus Pemain</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pemain &quot;{deletingPlayer?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
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
