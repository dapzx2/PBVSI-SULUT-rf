import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const matches = await query(`
      SELECT
        id,
        home_team_id,
        away_team_id,
        match_date,
        venue,
        score_home_sets,
        score_away_sets,
        score_home_points,
        score_away_points,
        status,
        league,
        created_at
      FROM matches
    `);
    // console.log('API GET - Raw match_date from DB:', (matches as RowDataPacket[]).map((m: any) => m.match_date));
    return NextResponse.json(matches);
  } catch (error: any) {
    console.error("Error in GET /api/admin/matches:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { home_team_id, away_team_id, match_date, score_home_sets, score_away_sets, status, league, venue } = await request.json();
    // console.log('API POST - Received match_date:', match_date);
    const id = uuidv4();

    // Ensure all values are not undefined, convert to null if they are
    const params = [
      id,
      home_team_id ?? null,
      away_team_id ?? null,
      match_date ?? null,
      score_home_sets ?? null,
      score_away_sets ?? null,
      status ?? null,
      league ?? null,
      venue ?? null
    ];

    const result = await query(
      'INSERT INTO matches (id, home_team_id, away_team_id, match_date, score_home_sets, score_away_sets, status, league, venue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      params
    );

    return NextResponse.json({ id, ...result });
  } catch (error: any) {
    console.error("Error in POST /api/admin/matches:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
