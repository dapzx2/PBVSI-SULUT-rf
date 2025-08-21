import { type NextRequest, NextResponse } from "next/server"
import { type NextRequest, NextResponse } from "next/server"
import { getMatches } from "@/lib/matches";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined

    const { matches, error } = await getMatches()
    if (error) {
      throw new Error(error);
    }
    // Filter by status if provided
    const filteredMatches = status ? matches?.filter(match => match.status === status) : matches;

    return NextResponse.json({ success: true, matches: filteredMatches })
  } catch (error: any) {
    console.error("API Error (GET matches):", error)
    return NextResponse.json({ success: false, error: error.message || "Terjadi kesalahan sistem" }, { status: 500 })
  }
}
