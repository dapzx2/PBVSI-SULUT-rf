import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.name, 
                COUNT(p.id) as value 
            FROM clubs c 
            LEFT JOIN players p ON c.id = p.club_id 
            GROUP BY c.id, c.name
            HAVING value > 0
            ORDER BY value DESC
        `);

        return NextResponse.json({ data: rows });
    } catch (error: any) {
        console.error("Failed to fetch player distribution:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
