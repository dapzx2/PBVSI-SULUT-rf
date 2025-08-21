import pool from './mysql';
import { v4 as uuidv4 } from 'uuid';
import type { Prediction } from './types';

export async function submitPrediction(
  matchId: string,
  predictedWinnerTeamId: string,
  predictedScoreHome: number,
  predictedScoreAway: number,
): Promise<{ success: boolean; message: string; error?: string }> {
  const newPredictionId = uuidv4();
  const userId = "placeholder-user-id"; // TODO: Replace with actual user ID from authentication

  try {
    await pool.query(
      'INSERT INTO predictions (id, match_id, user_id, predicted_winner_id, predicted_score_home_sets, predicted_score_away_sets) VALUES (?, ?, ?, ?, ?, ?)',
      [newPredictionId, matchId, userId, predictedWinnerTeamId, predictedScoreHome, predictedScoreAway]
    );
    return { success: true, message: "Prediksi berhasil disimpan!" };
  } catch (error: any) {
    console.error("Error submitting prediction:", error);
    return { success: false, message: "Gagal menyimpan prediksi.", error: error.message };
  }
}

export async function getMatchPredictions(matchId: string): Promise<{ predictions: Prediction[] | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM predictions WHERE match_id = ?', [matchId]);
    return { predictions: rows as Prediction[], error: null };
  } catch (error: any) {
    return { predictions: null, error: error.message };
  }
}