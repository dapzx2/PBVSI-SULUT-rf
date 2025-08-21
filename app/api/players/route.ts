import { NextResponse } from "next/server"
import { NextResponse } from "next/server"
import { getPlayers, getPlayersByClubId } from "@/lib/players";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get("club_id")

    let players;
    if (clubId) {
      const { players: clubPlayers, error } = await getPlayersByClubId(clubId);
      if (error) {
        throw new Error(error);
      }
      players = clubPlayers;
    } else {
      const { players: allPlayers, error } = await getPlayers();
      if (error) {
        throw new Error(error);
      }
      players = allPlayers;
    }

    return NextResponse.json({ players })
  } catch (error: any) {
    console.error("Error fetching players:", error)
    return NextResponse.json({ error: "Failed to fetch players", details: error.message }, { status: 500 })
  }
}
