import pool from './mysql';
import type { Match } from './types';

export async function getPertandinganLangsung(): Promise<{ matches: Match[] | null; error: string | null }> {
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

    // Transform the flat data into proper Match objects
    const matches = (rows as any[]).map(rawMatch => ({
      ...rawMatch,
      home_team: rawMatch.home_team_name ? {
        id: rawMatch.home_team_id,
        name: rawMatch.home_team_name,
        logo_url: rawMatch.home_team_logo_url,
        slug: '',
        city: '',
        established_year: 0,
        coach_name: null,
        home_arena: null,
        description: null,
        achievements: null,
        created_at: '',
        updated_at: ''
      } : undefined,
      away_team: rawMatch.away_team_name ? {
        id: rawMatch.away_team_id,
        name: rawMatch.away_team_name,
        logo_url: rawMatch.away_team_logo_url,
        slug: '',
        city: '',
        established_year: 0,
        coach_name: null,
        home_arena: null,
        description: null,
        achievements: null,
        created_at: '',
        updated_at: ''
      } : undefined,
      score_home_points: rawMatch.score_home_points ? JSON.parse(rawMatch.score_home_points) : null,
      score_away_points: rawMatch.score_away_points ? JSON.parse(rawMatch.score_away_points) : null,
    }));

    return { matches: matches as Match[], error: null };
  } catch (error: any) {
    return { matches: null, error: error.message };
  }
}
