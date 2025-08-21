import pool from './mysql';
import { v4 as uuidv4 } from 'uuid';
import type { Club } from './types';

export async function getClubs(): Promise<{ clubs: Club[] | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM clubs ORDER BY name ASC');
    return { clubs: rows as Club[], error: null };
  } catch (error: any) {
    return { clubs: null, error: error.message };
  }
}

export async function getClubById(id: string): Promise<{ club: Club | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM clubs WHERE id = ?', [id]);
    const clubs = rows as Club[];
    if (clubs.length === 0) {
      return { club: null, error: 'Club not found' };
    }
    return { club: clubs[0], error: null };
  } catch (error: any) {
    return { club: null, error: error.message };
  }
}
