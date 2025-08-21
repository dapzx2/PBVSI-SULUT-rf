import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/mysql";
// import { getAdminFromRequest } from "@/lib/auth" // Commented out for temporary bypass

export async function GET(request: NextRequest) {
  try {
    // const admin = await getAdminFromRequest(request) // Temporarily bypass authentication

    // if (!admin) {
    //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    // }

    // Get stats from database
    const [playersResult, clubsResult, articlesResult, galleryResult, matchesResult, activityResult] =
      await Promise.all([
        pool.query("SELECT COUNT(id) as count FROM players"),
        pool.query("SELECT COUNT(id) as count FROM clubs"),
        pool.query("SELECT COUNT(id) as count FROM articles"),
        pool.query("SELECT COUNT(id) as count FROM gallery_items"),
        pool.query("SELECT COUNT(id) as count FROM matches"),
        pool.query("SELECT COUNT(id) as count FROM admin_activity_logs WHERE timestamp >= CURDATE()")
      ])

    const stats = {
      totalPlayers: (playersResult[0] as any[])[0].count || 0,
      totalClubs: (clubsResult[0] as any[])[0].count || 0,
      totalArticles: (articlesResult[0] as any[])[0].count || 0,
      totalGalleryItems: (galleryResult[0] as any[])[0].count || 0,
      totalMatches: (matchesResult[0] as any[])[0].count || 0,
      recentActivity: (activityResult[0] as any[])[0].count || 0,
    }

    return NextResponse.json({
      success: true,
      data: stats,
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