import { NextResponse } from 'next/server';
import { getPlayers } from '@/lib/players';

export async function GET() {
  try {
    const { players, error } = await getPlayers();

    if (error) {
      console.error('Error fetching players in API route:', error);
      return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
    }

    return NextResponse.json(players);
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}