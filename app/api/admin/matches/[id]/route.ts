import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { home_team_id, away_team_id, match_date, score_home, score_away, status, tournament, venue } = await request.json();

    const result = await query(
      'UPDATE matches SET home_team_id = ?, away_team_id = ?, match_date = ?, score_home = ?, score_away = ?, status = ?, tournament = ?, venue = ? WHERE id = ?',
      [home_team_id, away_team_id, match_date, score_home, score_away, status, tournament, venue, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Match updated successfully' });
  } catch (error: any) {
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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
