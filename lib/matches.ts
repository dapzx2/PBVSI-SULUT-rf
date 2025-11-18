import pool from './mysql';
import { v4 as uuidv4 } from 'uuid';
import type { Match } from './types';

export async function getMatches(): Promise<{ matches: Match[] | null; error: string | null }> {
  try {
    const [rows] = await pool.query(
      `SELECT 
        m.*,
        ht.name as home_team_name,
        ht.logo_url as home_team_logo_url,
        at.name as away_team_name,
        at.logo_url as away_team_logo_url
      FROM matches m
      LEFT JOIN clubs ht ON m.home_team_id = ht.id
      LEFT JOIN clubs at ON m.away_team_id = at.id
      WHERE ht.city IN ('Manado', 'Bitung', 'Tomohon', 'Kotamobagu')
      ORDER BY m.match_date DESC`
    );
    return { matches: rows as Match[], error: null };
  } catch (error: any) {
    return { matches: null, error: error.message };
  }
}

export async function createMatch(matchData: Omit<Match, 'id' | 'created_at' | 'updated_at' | 'home_team' | 'away_team' | 'score_home_points' | 'score_away_points'>): Promise<{ match: Match | null; error: string | null }> {
  const newMatchId = uuidv4();
  const newMatch = { id: newMatchId, ...matchData };
  try {
    await pool.query('INSERT INTO matches SET ?', newMatch);
    const [rows] = await pool.query('SELECT * FROM matches WHERE id = ?', [newMatchId]);
    return { match: (rows as Match[])[0], error: null };
  } catch (error: any) {
    return { match: null, error: error.message };
  }
}

export async function updateMatch(id: string, matchData: Partial<Omit<Match, 'id' | 'created_at' | 'updated_at' | 'home_team' | 'away_team' | 'score_home_points' | 'score_away_points'>>): Promise<{ match: Match | null; error: string | null }> {
  try {
    await pool.query('UPDATE matches SET ? WHERE id = ?', [matchData, id]);
    const [rows] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);
    const matches = rows as Match[];
    if (matches.length === 0) {
      return { match: null, error: 'Match not found' };
    }
    return { match: matches[0], error: null };
  } catch (error: any) {
    return { match: null, error: error.message };
  }
}

export async function deleteMatch(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const [result] = await pool.query('DELETE FROM matches WHERE id = ?', [id]);
    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return { success: false, error: 'Match not found' };
    }
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMatchDetails(id: string): Promise<{ match: Match | null; error: string | null }> {
  try {
    const [rows] = await pool.query(
      `SELECT
        m.*,
        ht.name as home_team_name,
        ht.logo_url as home_team_logo_url,
        at.name as away_team_name,
        at.logo_url as away_team_logo_url
      FROM matches m
      LEFT JOIN clubs ht ON m.home_team_id = ht.id
      LEFT JOIN clubs at ON m.away_team_id = at.id
      WHERE m.id = ?`,
      [id]
    );
    const matches = rows as any[]; // Use any[] for initial type to handle raw data
    if (matches.length === 0) {
      return { match: null, error: 'Match not found' };
    }

    const rawMatch = matches[0];

    const match: Match = {
      ...rawMatch,
      home_team: rawMatch.home_team_name ? { id: rawMatch.home_team_id, name: rawMatch.home_team_name, logo_url: rawMatch.home_team_logo_url, slug: '', city: '', established_year: 0, coach_name: null, home_arena: null, description: null, achievements: null, created_at: '', updated_at: '' } : undefined,
      away_team: rawMatch.away_team_name ? { id: rawMatch.away_team_id, name: rawMatch.away_team_name, logo_url: rawMatch.away_team_logo_url, slug: '', city: '', established_year: 0, coach_name: null, home_arena: null, description: null, achievements: null, created_at: '', updated_at: '' } : undefined,
      score_home_points: rawMatch.score_home_points ? JSON.parse(rawMatch.score_home_points) : null,
      score_away_points: rawMatch.score_away_points ? JSON.parse(rawMatch.score_away_points) : null,
    };

    return { match, error: null };
  } catch (error: any) {
    return { match: null, error: error.message };
  }
}
