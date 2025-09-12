import { NextResponse } from 'next/server';
import { getPertandinganLangsung } from '@/lib/pertandingan';
import { getMatches } from '@/lib/matches'; // Assuming getMatches fetches all matches

export async function GET() {
  try {
    const { matches: liveMatches, error: liveError } = await getPertandinganLangsung();
    const { matches: allMatches, error: allError } = await getMatches();

    if (liveError || allError) {
      console.error('Error fetching matches in API route:', liveError || allError);
      return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
    }

    // Combine live and all matches, ensuring no duplicates and prioritizing live status
    const combinedMatches = [...(liveMatches || []), ...(allMatches || [])]
      .filter((match, index, self) => index === self.findIndex((m) => m.id === match.id))
      .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());

    return NextResponse.json(combinedMatches);
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}