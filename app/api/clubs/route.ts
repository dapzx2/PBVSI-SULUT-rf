import { NextResponse } from 'next/server';
import { getClubs } from '@/lib/clubs';

export async function GET() {
  try {
    const { clubs, error } = await getClubs();

    if (error) {
      console.error('Error fetching clubs in API route:', error);
      return NextResponse.json({ error: 'Failed to fetch clubs' }, { status: 500 });
    }

    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}