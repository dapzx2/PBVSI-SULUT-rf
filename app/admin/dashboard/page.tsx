"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Trophy,
  FileText,
  Settings,
  LogOut,
  Shield,
  User,
  Loader2,
  Database,
  Activity,
  ImageIcon,
  AlertCircle,
  TrendingUp,
  Eye,
  Plus,
  Edit,
  UserPlus,
  CalendarPlus,
  FileTextIcon,
  Upload,
  Download,
  Bell,
  Clock,
  Award,
  Target,
  Zap,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { AdminUser } from "@/lib/types"
import { AdminActivityLog } from "@/lib/admin"

interface DashboardStats {
  totalPlayers: number
  totalClubs: number
  totalMatches: number
  totalArticles: number
  totalGalleryItems: number
  recentActivity: number
}



interface QuickStat {
  label: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
}

export default function AdminDashboard() {
  const [currentRole, setCurrentRole] = useState<"super_admin" | "admin">("super_admin")
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState<DashboardStats>({
    totalPlayers: 0,
    totalClubs: 0,
    totalMatches: 0,
    totalArticles: 0,
    totalGalleryItems: 0,
    recentActivity: 0,
  })
  const [recentActivities, setRecentActivities] = useState<AdminActivityLog[]>([])
  const [quickStats, setQuickStats] = useState<QuickStat[]>([])
  const router = useRouter()

  useEffect(() => {
    // Fetch current admin user
    const fetchAdminUser = async () => {
      try {
        const response = await fetch("/api/admin/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setCurrentRole(data.user.role);
        } else {
          // If not authenticated, redirect to login
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Failed to fetch admin user:", err);
        router.push("/admin/login");
      }
    };

    fetchAdminUser();
    loadDashboardData();
  }, [])

  const loadDashboardData = async () => {
    setLoadingStats(true)
    setError("")
    try {
      const response = await fetch("/api/admin/dashboard/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      const data = await response.json();
      setStats(data.data);

      // Mock data for recent activities and quick stats for now
      const activityResponse = await fetch("/api/admin/activity");
          if (!activityResponse.ok) {
            throw new Error("Failed to fetch recent activities");
          }
          const activityData = await activityResponse.json();
          setRecentActivities(activityData.data?.logs || []);

      setQuickStats([])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      // Handle error
    }
    window.location.href = "/admin/login"
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
        

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pemain</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalPlayers}</div>
              )}
              <p className="text-xs text-muted-foreground">Pemain terdaftar</p>
              <div className="flex items-center space-x-2 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Tambah
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tambah Pemain Baru</DialogTitle>
                      <DialogDescription>Isi detail untuk pemain baru.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="image">Foto Pemain</Label>
                          <Input id="image" accept="image/*" type="file" />
                          <p className="text-sm text-muted-foreground">Pilih gambar baru untuk mengganti foto saat ini.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Pemain</Label>
                          <Input id="name" required={true} value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">Posisi</Label>
                          <Input id="position" value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="club_id">Klub</Label>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Tanpa Klub" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="null">Tanpa Klub</SelectItem>
                              <SelectItem value="dcaec988-1b17-4527-93f0-00d334d8cb82">Klub 1</SelectItem>
                              <SelectItem value="eccbe43c-27dc-4e91-b30f-41cb3d38128d">Klub 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                          </DialogClose>
                          <Button type="submit">Simpan</Button>
                        </DialogFooter>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/pemain")
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Lihat
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Klub</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalClubs}</div>
              )}
              <p className="text-xs text-muted-foreground">Klub aktif</p>
              <div className="flex items-center space-x-2 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Tambah
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tambah Klub Baru</DialogTitle>
                      <DialogDescription>Isi detail untuk klub baru.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="club_name">Nama Klub</Label>
                          <Input id="club_name" required={true} placeholder="Nama lengkap klub" value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="club_city">Kota</Label>
                          <Input id="club_city" placeholder="Kota asal klub" value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="club_established_year">Tahun Berdiri</Label>
                          <Input id="club_established_year" type="number" placeholder="0" value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="club_coach">Pelatih</Label>
                          <Input id="club_coach" placeholder="Nama pelatih utama" value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="club_logo">Unggah Logo Baru</Label>
                          <Input id="club_logo" accept="image/*" type="file" />
                          <p className="text-sm text-muted-foreground">Pilih logo untuk klub.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="club_description">Deskripsi</Label>
                          <textarea id="club_description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Deskripsi singkat tentang klub" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="club_achievements">Prestasi</Label>
                          <Input id="club_achievements" placeholder="Daftar prestasi klub (pisahkan dengan koma)" value="" />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                          </DialogClose>
                          <Button type="submit">Simpan</Button>
                        </DialogFooter>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/klub")
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Kelola
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pertandingan</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalMatches}</div>
              )}
              <p className="text-xs text-muted-foreground">Pertandingan tercatat</p>
              <div className="flex items-center space-x-2 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Tambah
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tambah Pertandingan Baru</DialogTitle>
                      <DialogDescription>Isi detail untuk pertandingan baru.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="home_team">Tim Kandang</Label>
                          <Input id="home_team" required={true} value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="away_team">Tim Tandang</Label>
                          <Input id="away_team" required={true} value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="match_datetime">Tanggal & Waktu Pertandingan</Label>
                          <Input id="match_datetime" type="datetime-local" required={true} value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home_set_score">Skor Set Kandang</Label>
                          <Input id="home_set_score" type="number" value="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="away_set_score">Skor Set Tandang</Label>
                          <Input id="away_set_score" type="number" value="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="upcoming">Akan Datang</SelectItem>
                              <SelectItem value="live">Sedang Berlangsung</SelectItem>
                              <SelectItem value="finished">Selesai</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tournament">Turnamen</Label>
                          <Input id="tournament" value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="venue">Venue</Label>
                          <Input id="venue" value="" />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                          </DialogClose>
                          <Button type="submit">Simpan</Button>
                        </DialogFooter>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/pertandingan")
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Lihat
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalArticles}</div>
              )}
              <p className="text-xs text-muted-foreground">Artikel berita</p>
              <div className="flex items-center space-x-2 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <FileTextIcon className="h-3 w-3 mr-1" />
                      Tulis
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tulis Artikel Baru</DialogTitle>
                      <DialogDescription>Isi detail untuk artikel baru.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="article_title">Judul Artikel</Label>
                          <Input id="article_title" required={true} value="" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="article_content">Konten Artikel</Label>
                          <textarea id="article_content" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="article_author">Penulis</Label>
                          <Input id="article_author" value="" />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                          </DialogClose>
                          <Button type="submit">Simpan</Button>
                        </DialogFooter>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/publikasi")
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Kelola
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        

        {/* Recent Activity & Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Aktivitas Terbaru
              </CardTitle>
              <CardDescription>Aktivitas sistem dalam 24 jam terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0">
                      {activity.action.includes("player") && <UserPlus className="h-4 w-4 text-blue-600" />}
                      {activity.action.includes("match") && <Trophy className="h-4 w-4 text-green-600" />}
                      {activity.action.includes("article") && <FileText className="h-4 w-4 text-purple-600" />}
                      {activity.action.includes("gallery") && <ImageIcon className="h-4 w-4 text-orange-600" />}
                      {/* Add more icons based on action type if needed */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{activity.username || "Unknown User"}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => router.push("/admin/activity")}
                >
                  Lihat Semua Aktivitas
                </Button>
              </div>
            </CardContent>
          </Card>

          
        </div>
      </main>
    </div>
  )
}
