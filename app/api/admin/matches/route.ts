import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';
import { generateMatchSlug } from '@/lib/slug-utils';

export async function GET() {
  try {
    const matches = await query(`
      SELECT
        m.id,
        m.slug,
        m.home_team_id,
        m.away_team_id,
        m.match_date,
        m.venue,
        m.score_home_sets,
        m.score_away_sets,
        m.score_home_points,
        m.score_away_points,
        m.status,
        m.league,
        m.created_at,
        ht.name as home_team_name,
        at.name as away_team_name
      FROM matches m
      LEFT JOIN clubs ht ON m.home_team_id = ht.id
      LEFT JOIN clubs at ON m.away_team_id = at.id
    `);
    return NextResponse.json(matches);
  } catch (error: any) {
    console.error("Error in GET /api/admin/matches:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { home_team_id, away_team_id, match_date, score_home_sets, score_away_sets, status, league, venue } = await request.json();
    const id = uuidv4();

    // Fetch team names for slug generation
    let homeTeamName = 'tim-tuan-rumah';
    let awayTeamName = 'tim-tamu';

    if (home_team_id) {
      const [homeTeam] = await query('SELECT name FROM clubs WHERE id = ?', [home_team_id]) as any[];
      if (homeTeam && homeTeam[0]) homeTeamName = homeTeam[0].name;
    }
    if (away_team_id) {
      const [awayTeam] = await query('SELECT name FROM clubs WHERE id = ?', [away_team_id]) as any[];
      if (awayTeam && awayTeam[0]) awayTeamName = awayTeam[0].name;
    }

    // Generate slug
    const slug = generateMatchSlug(homeTeamName, awayTeamName, match_date || new Date());

    const params = [
      id,
      slug,
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
      'INSERT INTO matches (id, slug, home_team_id, away_team_id, match_date, score_home_sets, score_away_sets, status, league, venue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      params
    );

    return NextResponse.json({ id, slug, ...result });
  } catch (error: any) {
    console.error("Error in POST /api/admin/matches:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
