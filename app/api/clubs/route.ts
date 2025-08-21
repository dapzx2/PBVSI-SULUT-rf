import { type NextRequest, NextResponse } from "next/server"
import { getClubs } from "@/lib/clubs";

export async function GET(request: NextRequest) {
  try {
    const { clubs, error } = await getClubs()
    if (error) {
      throw new Error(error);
    }
    return NextResponse.json({ success: true, clubs })
  } catch (error: any) {
    console.error("API Error (GET clubs):", error)
    return NextResponse.json({ success: false, error: error.message || "Terjadi kesalahan sistem" }, { status: 500 })
  }
}
