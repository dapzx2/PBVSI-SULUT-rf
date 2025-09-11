import { type NextRequest, NextResponse } from "next/server"
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Token tidak ditemukan atau tidak valid",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("💥 Auth me error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
        debug: { error: error instanceof Error ? error.message : "Unknown error" },
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Cookie",
      "Access-Control-Allow-Credentials": "true",
    },
  })
}