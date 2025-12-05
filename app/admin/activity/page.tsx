"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock, UserPlus, Trophy, FileText, ImageIcon, Loader2, AlertCircle, ChevronLeft, ChevronRight, Shield } from "lucide-react"
import { AdminActivityLog } from "@/lib/admin"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Kamus terjemahan aksi ke Bahasa Indonesia yang ramah pengguna
const actionTranslations: Record<string, string> = {
  // Aksi CRUD umum
  "create": "Tambah",
  "update": "Ubah",
  "delete": "Hapus",
  "edit": "Edit",
  "add": "Tambah",
  "remove": "Hapus",

  // Entitas
  "player": "Pemain",
  "pemain": "Pemain",
  "match": "Pertandingan",
  "pertandingan": "Pertandingan",
  "article": "Berita",
  "berita": "Berita",
  "news": "Berita",
  "gallery": "Galeri",
  "galeri": "Galeri",
  "club": "Klub",
  "klub": "Klub",
  "team": "Tim",
  "tim": "Tim",
  "user": "Pengguna",
  "admin": "Admin",
  "public": "Publik",
  "information": "Informasi",
  "informasi": "Informasi",
  "image": "Gambar",
  "photo": "Foto",
  "document": "Dokumen",
  "file": "Berkas",
  "login": "Masuk",
  "logout": "Keluar",
  "success": "Berhasil",
  "failed": "Gagal",
  "error": "Error",
  "setting": "Pengaturan",
  "settings": "Pengaturan",
  "profile": "Profil",
  "password": "Kata Sandi",
  "schedule": "Jadwal",
  "result": "Hasil",
  "score": "Skor",
  "event": "Acara",
  "competition": "Kompetisi",
  "tournament": "Turnamen",
  "season": "Musim",
}

// Fungsi untuk menerjemahkan aksi ke Bahasa Indonesia yang ramah pengguna
const translateAction = (action: string): string => {
  // Pisahkan berdasarkan underscore atau camelCase
  const words = action
    .replace(/([a-z])([A-Z])/g, '$1_$2') // camelCase to snake_case
    .toLowerCase()
    .split('_')
    .filter(word => word.length > 0)

  // Terjemahkan setiap kata
  const translatedWords = words.map(word => {
    const translation = actionTranslations[word]
    if (translation) return translation
    // Jika tidak ada di kamus, kapitalisasi huruf pertama
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  return translatedWords.join(' ')
}

// Fungsi untuk memformat waktu ke format "27 Nov 13:04:50 WITA"
const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp)

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${day} ${month} ${hours}:${minutes}:${seconds} WITA`
}

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<AdminActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/activity?page=${page}&limit=${limit}`)
        if (!response.ok) {
          throw new Error("Gagal memuat aktivitas")
        }
        const data = await response.json()
        setActivities(data.data?.logs || [])
        setTotalPages(data.data?.pagination?.totalPages || 1)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [page, limit])

  const getActivityIcon = (action: string) => {
    if (action.includes("player") || action.includes("pemain")) return <UserPlus className="h-4 w-4 text-blue-600" />
    if (action.includes("match") || action.includes("pertandingan")) return <Trophy className="h-4 w-4 text-orange-600" />
    if (action.includes("article") || action.includes("berita")) return <FileText className="h-4 w-4 text-purple-600" />
    if (action.includes("gallery") || action.includes("galeri")) return <ImageIcon className="h-4 w-4 text-pink-600" />
    if (action.includes("club") || action.includes("klub")) return <Shield className="h-4 w-4 text-green-600" />
    return <Clock className="h-4 w-4 text-gray-600" />
  }

  const getActionBadge = (action: string) => {
    const translatedAction = translateAction(action)
    let color = "bg-gray-100 text-gray-800"
    if (action.includes("create") || action.includes("tambah") || action.includes("add")) color = "bg-green-100 text-green-800"
    if (action.includes("update") || action.includes("edit") || action.includes("ubah")) color = "bg-blue-100 text-blue-800"
    if (action.includes("delete") || action.includes("hapus") || action.includes("remove")) color = "bg-red-100 text-red-800"
    if (action.includes("login") || action.includes("success")) color = "bg-emerald-100 text-emerald-800"

    return <Badge variant="outline" className={`${color} border-none`}>{translatedAction}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="h-6 w-6 text-orange-600" />
                Aktivitas Sistem
              </CardTitle>
              <CardDescription>
                Riwayat lengkap aktivitas administrator dalam sistem.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aksi</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Belum ada aktivitas tercatat.
                        </TableCell>
                      </TableRow>
                    ) : (
                      activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">
                            {getActionBadge(activity.action)}
                          </TableCell>
                          <TableCell>{activity.username || "Unknown"}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatTimestamp(activity.timestamp)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[300px]">
                            {activity.details && typeof activity.details === 'object' ? (
                              <div className="flex flex-col gap-1">
                                {Object.entries(activity.details).map(([key, value]) => (
                                  <div key={key} className="flex gap-1">
                                    <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span>
                                    <span className="truncate" title={String(value)}>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="italic">Tidak ada detail</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </Button>
                <div className="text-sm text-muted-foreground">
                  Halaman {page} dari {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}