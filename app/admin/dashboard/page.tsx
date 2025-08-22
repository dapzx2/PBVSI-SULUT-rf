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
import { AdminUser } from "@/lib/types"

interface DashboardStats {
  totalPlayers: number
  totalClubs: number
  totalMatches: number
  totalArticles: number
  totalGalleryItems: number
  recentActivity: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  user: string
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
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
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
      setRecentActivities([
        {
          id: "1",
          type: "player_added",
          description: "Pemain baru Jordan Susanto ditambahkan",
          timestamp: "2 menit yang lalu",
          user: "Admin User",
        },
        {
          id: "2",
          type: "match_updated",
          description: "Hasil pertandingan SMANSA vs SMAN 2 diperbarui",
          timestamp: "15 menit yang lalu",
          user: "Super Admin",
        },
        {
          id: "3",
          type: "article_published",
          description: "Artikel 'Turnamen Antar Sekolah' dipublikasikan",
          timestamp: "1 jam yang lalu",
          user: "Content Manager",
        },
        {
          id: "4",
          type: "gallery_updated",
          description: "5 foto baru ditambahkan ke galeri",
          timestamp: "2 jam yang lalu",
          user: "Admin User",
        },
      ])

      setQuickStats([
        { label: "Pemain Aktif", value: 142, change: 8, trend: "up" },
        { label: "Pertandingan Bulan Ini", value: 12, change: 3, trend: "up" },
        { label: "Artikel Terbaru", value: 8, change: -2, trend: "down" },
        { label: "Pengunjung Hari Ini", value: 1247, change: 156, trend: "up" },
      ])
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/images/pbvsi-logo.png" alt="PBVSI Logo" className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">PBVSI Sulawesi Utara</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <Bell className="h-4 w-4" />
                {/* {stats.pendingApprovals > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.pendingApprovals}
                  </span>
                )} */}
              </Button>

              {/* Role Toggle for Demo */}
              <div className="flex items-center gap-2">
                <Button
                  variant={currentRole === "super_admin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentRole("super_admin")}
                >
                  Super Admin
                </Button>
                <Button
                  variant={currentRole === "admin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentRole("admin")}
                >
                  Admin
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                {user.role === "super_admin" ? (
                  <Shield className="h-4 w-4 text-orange-600" />
                ) : (
                  <User className="h-4 w-4 text-blue-600" />
                )}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Badge variant={user.role === "super_admin" ? "default" : "secondary"}>
                  {user.role === "super_admin" ? "Super Admin" : "Admin"}
                </Badge>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Selamat datang, {user.username}!</h2>
              <p className="text-gray-600 mt-1">Kelola sistem PBVSI Sulawesi Utara dengan mudah dan efisien</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Terakhir login: Hari ini, 09:30</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-sm ${
                      stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    <TrendingUp className={`h-4 w-4 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                    <span>{Math.abs(stat.change)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={Math.min((stat.value / 200) * 100, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/admin/players")}
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/players/add")
                  }}
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Tambah
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/players")
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
            onClick={() => router.push("/admin/clubs")}
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/clubs/add")
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Tambah
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/clubs")
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
            onClick={() => router.push("/admin/matches")}
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/matches/add")
                  }}
                >
                  <CalendarPlus className="h-3 w-3 mr-1" />
                  Jadwal
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/matches")
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/admin/articles")}
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/articles/add")
                  }}
                >
                  <FileTextIcon className="h-3 w-3 mr-1" />
                  Tulis
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/admin/articles")
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Kelola
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Aksi Cepat
                </CardTitle>
                <CardDescription>Akses fitur utama dengan cepat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => router.push("/admin/players/add")}
                  >
                    <UserPlus className="h-6 w-6" />
                    <span className="text-sm">Tambah Pemain</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => router.push("/admin/matches/add")}
                  >
                    <CalendarPlus className="h-6 w-6" />
                    <span className="text-sm">Jadwal Match</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => router.push("/admin/articles/add")}
                  >
                    <FileTextIcon className="h-6 w-6" />
                    <span className="text-sm">Tulis Berita</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => router.push("/admin/gallery")}
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">Upload Foto</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => router.push("/admin/reports")}
                  >
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Export Data</span>
                  </Button>
                  {user.role === "super_admin" && (
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                      onClick={() => router.push("/admin/settings")}
                    >
                      <Settings className="h-6 w-6" />
                      <span className="text-sm">Pengaturan</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Status Sistem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Server</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Normal</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600">Scheduled</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Users Online</span>
                  <span className="text-sm font-medium">{stats.recentActivity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Approvals</span>
                  <Badge variant="secondary">0</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity & Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                      {activity.type === "player_added" && <UserPlus className="h-4 w-4 text-blue-600" />}
                      {activity.type === "match_updated" && <Trophy className="h-4 w-4 text-green-600" />}
                      {activity.type === "article_published" && <FileText className="h-4 w-4 text-purple-600" />}
                      {activity.type === "gallery_updated" && <ImageIcon className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{activity.user}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
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
                  onClick={() => router.push("/admin/activity-logs")}
                >
                  Lihat Semua Aktivitas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Management Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Ringkasan Manajemen
              </CardTitle>
              <CardDescription>Overview data dan statistik</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pemain Aktif</span>
                    <span className="text-sm text-gray-600">{stats.totalPlayers}/200</span>
                  </div>
                  <Progress value={(stats.totalPlayers / 200) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Klub Terdaftar</span>
                    <span className="text-sm text-gray-600">{stats.totalClubs}/30</span>
                  </div>
                  <Progress value={(stats.totalClubs / 30) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Artikel Bulan Ini</span>
                    <span className="text-sm text-gray-600">{stats.totalArticles}/15</span>
                  </div>
                  <Progress value={(stats.totalArticles / 15) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">Turnamen Aktif</p>
                    <p className="text-2xl font-bold text-blue-600">3</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium">Target Bulan</p>
                    <p className="text-2xl font-bold text-green-600">85%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
