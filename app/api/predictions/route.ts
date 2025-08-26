import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { v4 as uuidv4 } from 'uuid';
import type { Prediction } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { matchId, predictedWinnerTeamId, predictedScoreHome, predictedScoreAway } = await request.json();

    if (!matchId || !predictedWinnerTeamId || predictedScoreHome === undefined || predictedScoreAway === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newPredictionId = uuidv4();
    const userId = "placeholder-user-id"; // TODO: Replace with actual user ID from authentication

    await pool.query(
      'INSERT INTO predictions (id, match_id, user_id, predicted_winner_id, predicted_score_home_sets, predicted_score_away_sets) VALUES (?, ?, ?, ?, ?, ?)',
      [newPredictionId, matchId, userId, predictedWinnerTeamId, predictedScoreHome, predictedScoreAway]
    );

    return NextResponse.json({ message: 'Prediksi berhasil disimpan!' }, { status: 201 });
  } catch (error: any) {
    console.error("Error submitting prediction:", error);
    return NextResponse.json({ message: 'Gagal menyimpan prediksi.', error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json({ message: 'Missing matchId parameter' }, { status: 400 });
    }

    const [rows] = await pool.query('SELECT * FROM predictions WHERE match_id = ?', [matchId]);
    return NextResponse.json({ predictions: rows as Prediction[] }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json({ message: 'Gagal mengambil prediksi.', error: error.message }, { status: 500 });
  }
}
