import { NextResponse } from 'next/server'
import { getPlayerById } from '@/lib/players'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const player = await getPlayerById(id)

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    // Transform the data to create a nested club object
    const { club_id, club_name, club_city, ...restOfPlayer } = player

    const transformedPlayer = {
      ...restOfPlayer,
      club: club_id ? {
        id: club_id,
        name: club_name,
        city: club_city,
        // Add other club properties if they are available and needed by the frontend
        slug: '', // Placeholder
        established_year: 0, // Placeholder
        coach_name: '', // Placeholder
        home_arena: '', // Placeholder
        logo_url: '', // Placeholder
        description: '', // Placeholder
        achievements: '', // Placeholder
        created_at: '', // Placeholder
        updated_at: '', // Placeholder
      } : null,
    }

    return NextResponse.json(transformedPlayer)
  } catch (error: any) {
    console.error(`[API PLAYER ${id}]`, error)
    return NextResponse.json({ error: 'Failed to fetch player data' }, { status: 500 })
  }
}