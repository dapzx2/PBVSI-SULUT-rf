import { type NextRequest, NextResponse } from "next/server"
import { getAdminUserByEmail, verifyPassword } from "@/lib/admin";
import { createSession, generateToken, logActivity } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    console.log("=== LOGIN API CALLED ===")

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      console.log("❌ Missing credentials")
      return NextResponse.json({ success: false, message: "Email dan password harus diisi" }, { status: 400 })
    }

    const { adminUser: user, error: userError } = await getAdminUserByEmail(email);

    if (userError || !user) {
      console.log("❌ Invalid credentials for:", email)
      await logActivity(
        "", // No user ID yet
        "Login Failed",
        "Authentication",
        undefined,
        { email, reason: userError || "User not found" },
        request.ip || "Unknown",
        request.headers.get("user-agent") || "Unknown"
      );
      return NextResponse.json({ success: false, message: "Email atau password salah" }, { status: 401 })
    }

    const passwordMatch = await verifyPassword(password, user.password_hash);

    if (!passwordMatch) {
      console.log("❌ Invalid credentials for:", email)
      await logActivity(
        user.id,
        "Login Failed",
        "Authentication",
        undefined,
        { email, reason: "Incorrect password" },
        request.ip || "Unknown",
        request.headers.get("user-agent") || "Unknown"
      );
      return NextResponse.json({ success: false, message: "Email atau password salah" }, { status: 401 })
    }

    // Create session and generate token
    const sessionId = await createSession(
      user.id,
      request.ip || "Unknown",
      request.headers.get("user-agent") || "Unknown"
    );

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: sessionId,
    });

    console.log("✅ Login successful, creating session and token")

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    })

    // Set admin_token as httpOnly for security
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      // domain: "localhost", // Remove for production or set dynamically
    })

    await logActivity(
      user.id,
      "Login Success",
      "Authentication",
      undefined,
      { email },
      request.ip || "Unknown",
      request.headers.get("user-agent") || "Unknown"
    );

    console.log("🍪 Session cookie set successfully")
    return response
  } catch (error: any) {
    console.error("💥 Login API error:", error)
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  })
}