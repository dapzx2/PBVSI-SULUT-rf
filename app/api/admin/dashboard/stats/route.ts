import { NextResponse } from "next/server"
import pool from "@/lib/mysql";
// import { getAdminFromRequest } from "@/lib/auth" // Commented out for temporary bypass

export async function GET() {
  try {
    // const admin = await getAdminFromRequest(request) // Temporarily bypass authentication

    // if (!admin) {
    //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    // }

    // Get stats from database
    const [
      playersResult,
      clubsResult,
      articlesResult,
      galleryResult,
      matchesResult,
      activityResult,
      recentActivitiesResult,
      matchesThisMonthResult,
      articlesThisMonthResult,
    ] = await Promise.all([
      pool.query("SELECT COUNT(id) as count FROM players"),
      pool.query("SELECT COUNT(id) as count FROM clubs"),
      pool.query("SELECT COUNT(id) as count FROM articles"),
      pool.query("SELECT COUNT(id) as count FROM gallery_items"),
      pool.query("SELECT COUNT(id) as count FROM matches"),
      pool.query("SELECT COUNT(id) as count FROM admin_activity_logs WHERE timestamp >= CURDATE()"),
      pool.query(`
        SELECT
          aal.id,
          aal.action,
          aal.resource_type,
          aal.resource_id,
          aal.details,
          aal.timestamp,
          au.username AS admin_username
        FROM admin_activity_logs aal
        LEFT JOIN admin_users au ON aal.admin_user_id = au.id
        ORDER BY aal.timestamp DESC
        LIMIT 5
      `),
      pool.query("SELECT COUNT(id) as count FROM matches WHERE match_date >= CURDATE() - INTERVAL DAYOFMONTH(CURDATE())-1 DAY"),
      pool.query("SELECT COUNT(id) as count FROM articles WHERE published_at >= CURDATE() - INTERVAL DAYOFMONTH(CURDATE())-1 DAY"),
    ])

    const stats = {
      totalPlayers: (playersResult[0] as any[])[0].count || 0,
      totalClubs: (clubsResult[0] as any[])[0].count || 0,
      totalArticles: (articlesResult[0] as any[])[0].count || 0,
      totalGalleryItems: (galleryResult[0] as any[])[0].count || 0,
      totalMatches: (matchesResult[0] as any[])[0].count || 0,
      recentActivity: (activityResult[0] as any[])[0].count || 0,
    }

    const recentActivities = (recentActivitiesResult[0] as any[]).map((activity: any) => ({
      id: activity.id,
      type: activity.resource_type || 'unknown', // Use resource_type as a general type
      description: activity.action,
      timestamp: activity.timestamp, // Will need formatting on frontend
      user: activity.admin_username || 'System',
    }));

    const quickStats = [
      { label: "Pemain Aktif", value: stats.totalPlayers, change: 0, trend: "stable" }, // Change and trend are placeholders
      { label: "Pertandingan Bulan Ini", value: (matchesThisMonthResult[0] as any[])[0].count || 0, change: 0, trend: "stable" },
      { label: "Artikel Terbaru", value: (articlesThisMonthResult[0] as any[])[0].count || 0, change: 0, trend: "stable" },
      { label: "Pengunjung Hari Ini", value: 0, change: 0, trend: "stable" }, // Placeholder, no direct data
    ];

    return NextResponse.json({
      success: true,
      data: stats,
      recentActivities: recentActivities,
      quickStats: quickStats,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    // Return a proper JSON error response even if something goes wrong
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan sistem saat memuat statistik" },
      { status: 500 },
    )
  }
}

