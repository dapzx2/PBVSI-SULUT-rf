import { NextResponse } from 'next/server';
import { getLiveMatches } from '@/lib/live-scores';

export async function GET() {
  try {
    const { matches, error } = await getLiveMatches();

    if (error) {
      console.error('Error fetching live matches in API route:', error);
      return NextResponse.json({ error: 'Failed to fetch live matches' }, { status: 500 });
    }

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
