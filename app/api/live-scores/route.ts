import { NextResponse } from "next/server"
import { getLiveScores } from "@/lib/live-scores"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filterRegion = searchParams.get("region") as "sulut" | "international" | "national" | undefined

  try {
    const { matches, error } = await getLiveScores();
    if (error) {
      throw new Error(error);
    }

    // Note: Filtering by region is not implemented in the MySQL version of getLiveScores.
    // If region filtering is required, it needs to be implemented in lib/live-scores.ts
    // or handled here after fetching all matches.
    const filteredMatches = filterRegion ? matches?.filter(match => match.league?.includes(filterRegion)) : matches;

    return NextResponse.json({ matches: filteredMatches })
  } catch (error: any) {
    console.error("API Error (GET live scores):", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}