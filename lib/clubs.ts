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

export async function createClub(clubData: Omit<Club, 'id' | 'created_at' | 'updated_at'>): Promise<{ club: Club | null; error: string | null }> {
  const newClubId = uuidv4();
  const newClub = { id: newClubId, ...clubData };
  try {
    await pool.query('INSERT INTO clubs SET ?', newClub);
    return { club: newClub as Club, error: null };
  } catch (error: any) {
    return { club: null, error: error.message };
  }
}

export async function updateClub(id: string, clubData: Partial<Omit<Club, 'id' | 'created_at' | 'updated_at'>>): Promise<{ club: Club | null; error: string | null }> {
  try {
    await pool.query('UPDATE clubs SET ? WHERE id = ?', [clubData, id]);
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

export async function deleteClub(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const [result] = await pool.query('DELETE FROM clubs WHERE id = ?', [id]);
    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return { success: false, error: 'Club not found' };
    }
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

