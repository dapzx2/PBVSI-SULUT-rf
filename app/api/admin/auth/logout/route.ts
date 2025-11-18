import { type NextRequest, NextResponse } from "next/server"
import { deleteSession, logActivity, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    console.log("=== LOGOUT API CALLED ===")

    const token = request.cookies.get("admin_token")?.value;
    let userId: string | undefined;
    let sessionId: string | undefined;

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
        sessionId = payload.sessionId;
        await deleteSession(payload.sessionId);
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    })

    // Clear all session cookies
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    // Log activity if userId is available
    if (userId) {
      await logActivity(
        userId,
        "Logout Success",
        "Authentication",
        undefined,
        { sessionId },
        request.ip || "Unknown",
        request.headers.get("user-agent") || "Unknown"
      );
    }

    console.log("✅ Session cookies cleared")
    return response
  } catch (error) {
    console.error("💥 Logout API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  })
}
