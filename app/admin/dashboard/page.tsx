"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  AlertCircle,
} from "lucide-react"

import { AdminUser } from "@/lib/types"
import { AdminActivityLog } from "@/lib/admin"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { DashboardRecentActivity } from "@/components/admin/dashboard-recent-activity"

interface DashboardStatsData {
  totalPlayers: number
  totalClubs: number
  totalMatches: number
  totalArticles: number
  totalGalleryItems: number
  recentActivity: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState<DashboardStatsData>({
    totalPlayers: 0,
    totalClubs: 0,
    totalMatches: 0,
    totalArticles: 0,
    totalGalleryItems: 0,
    recentActivity: 0,
  })
  const [recentActivities, setRecentActivities] = useState<AdminActivityLog[]>([])
  const router = useRouter()

  useEffect(() => {
    // Fetch current admin user
    const fetchAdminUser = async () => {
      try {
        const response = await fetch("/api/admin/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
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
  }, [router])

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

      const activityResponse = await fetch("/api/admin/activity");
      if (!activityResponse.ok) {
        throw new Error("Failed to fetch recent activities");
      }
      const activityData = await activityResponse.json();
      setRecentActivities(activityData.data?.logs || []);

    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoadingStats(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="bg-white w-full max-w-md border-none shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600 font-medium">Memuat dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white pb-24 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">
            Selamat Datang, {user.username}!
          </h1>
          <p className="text-orange-100 text-lg">
            Berikut adalah ringkasan aktivitas dan statistik sistem PBVSI Sulut.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
        {error && (
          <Alert variant="destructive" className="mb-6 shadow-md bg-white">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DashboardStats stats={stats} loading={loadingStats} />

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          <DashboardCharts />
          <DashboardRecentActivity activities={recentActivities} />
        </div>
      </main>
    </div>
  )
}
