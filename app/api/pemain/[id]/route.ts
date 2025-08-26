import { NextResponse } from 'next/server';
import { getPlayerById } from '@/lib/players';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const player = await getPlayerById(id);

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error fetching player in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
