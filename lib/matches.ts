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
      ORDER BY m.match_date DESC`
    );
    return { matches: rows as Match[], error: null };
  } catch (error: any) {
    return { matches: null, error: error.message };
  }
}

export async function createMatch(matchData: Omit<Match, 'id' | 'created_at' | 'updated_at' | 'home_team' | 'away_team'>): Promise<{ match: Match | null; error: string | null }> {
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

export async function updateMatch(id: string, matchData: Partial<Omit<Match, 'id' | 'created_at' | 'updated_at' | 'home_team' | 'away_team'>>): Promise<{ match: Match | null; error: string | null }> {
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
    const matches = rows as Match[];
    if (matches.length === 0) {
      return { match: null, error: 'Match not found' };
    }
    return { match: matches[0], error: null };
  } catch (error: any) {
    return { match: null, error: error.message };
  }
}