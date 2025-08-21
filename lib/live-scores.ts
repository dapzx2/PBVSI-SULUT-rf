import pool from './mysql';
import type { Match } from './types';

export async function getLiveMatches(): Promise<{ matches: Match[] | null; error: string | null }> {
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
      WHERE m.status = 'live'
      ORDER BY m.match_date DESC`
    );
    return { matches: rows as Match[], error: null };
  } catch (error: any) {
    return { matches: null, error: error.message };
  }
}
