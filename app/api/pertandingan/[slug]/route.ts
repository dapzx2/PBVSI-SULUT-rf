import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import type { Match } from '@/lib/types';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const [rows] = await pool.query(
            `SELECT 
                m.*,
                ht.id as home_team_id,
                ht.name as home_team_name,
                ht.slug as home_team_slug,
                ht.city as home_team_city,
                ht.logo_url as home_team_logo_url,
                at.id as away_team_id,
                at.name as away_team_name,
                at.slug as away_team_slug,
                at.city as away_team_city,
                at.logo_url as away_team_logo_url
            FROM matches m
            LEFT JOIN clubs ht ON m.home_team_id = ht.id
            LEFT JOIN clubs at ON m.away_team_id = at.id
            WHERE m.slug = ?`,
            [slug]
        );

        const matchRows = rows as any[];

        if (matchRows.length === 0) {
            return NextResponse.json(
                { error: 'Pertandingan tidak ditemukan' },
                { status: 404 }
            );
        }

        const rawMatch = matchRows[0];

        // Transform the flat data into proper Match object
        const match: Match = {
            id: rawMatch.id,
            slug: rawMatch.slug,
            home_team_id: rawMatch.home_team_id,
            away_team_id: rawMatch.away_team_id,
            match_date: rawMatch.match_date,
            score_home: rawMatch.score_home,
            score_away: rawMatch.score_away,
            score_home_sets: rawMatch.score_home_sets,
            score_away_sets: rawMatch.score_away_sets,
            score_home_points: rawMatch.score_home_points ? JSON.parse(rawMatch.score_home_points) : null,
            score_away_points: rawMatch.score_away_points ? JSON.parse(rawMatch.score_away_points) : null,
            status: rawMatch.status,
            league: rawMatch.league,
            venue: rawMatch.venue,
            created_at: rawMatch.created_at,
            updated_at: rawMatch.updated_at,
            home_team: rawMatch.home_team_name ? {
                id: rawMatch.home_team_id,
                name: rawMatch.home_team_name,
                slug: rawMatch.home_team_slug,
                city: rawMatch.home_team_city,
                logo_url: rawMatch.home_team_logo_url,
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
                slug: rawMatch.away_team_slug,
                city: rawMatch.away_team_city,
                logo_url: rawMatch.away_team_logo_url,
                established_year: 0,
                coach_name: null,
                home_arena: null,
                description: null,
                achievements: null,
                created_at: '',
                updated_at: ''
            } : undefined
        };

        return NextResponse.json(match);
    } catch (error: any) {
        console.error('Error fetching match by slug:', error);
        return NextResponse.json(
            { error: 'Gagal memuat data pertandingan' },
            { status: 500 }
        );
    }
}
