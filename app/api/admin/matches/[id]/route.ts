import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { home_team_id, away_team_id, match_date, score_home_sets, score_away_sets, status, league, venue } = await request.json();

    const result = await query(
      'UPDATE matches SET home_team_id = ?, away_team_id = ?, match_date = ?, score_home_sets = ?, score_away_sets = ?, status = ?, league = ?, venue = ? WHERE id = ?',
      [home_team_id ?? null, away_team_id ?? null, match_date ?? null, score_home_sets ?? null, score_away_sets ?? null, status ?? null, league ?? null, venue ?? null, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Match updated successfully' });
  } catch (error: any) {
    console.error("Error in PUT /api/admin/matches/[id]:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const result = await query(
      'DELETE FROM matches WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Match deleted successfully' });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/matches/[id]:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
