import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const matches = await query('SELECT * FROM matches');
    return NextResponse.json(matches);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { home_team_id, away_team_id, match_date, score_home, score_away, status, tournament, venue } = await request.json();
    const id = uuidv4();

    const result = await query(
      'INSERT INTO matches (id, home_team_id, away_team_id, match_date, score_home, score_away, status, tournament, venue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, home_team_id, away_team_id, match_date, score_home, score_away, status, tournament, venue]
    );

    return NextResponse.json({ id, ...result });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
