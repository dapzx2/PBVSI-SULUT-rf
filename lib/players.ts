import pool from './mysql';
import { v4 as uuidv4 } from 'uuid';
import type { Player } from './types';

export async function getPlayers(): Promise<{ players: Player[] | null; error: string | null }> {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, c.name as club_name FROM players p LEFT JOIN clubs c ON p.club_id = c.id ORDER BY p.name ASC'
    );
    return { players: rows as Player[], error: null };
  } catch (error: any) {
    return { players: null, error: error.message };
  }
}

export async function getPlayerById(id: string): Promise<{ player: Player | null; error: string | null }> {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, c.name as club_name FROM players p LEFT JOIN clubs c ON p.club_id = c.id WHERE p.id = ?',
      [id]
    );
    const players = rows as Player[];
    if (players.length === 0) {
      return { player: null, error: 'Player not found' };
    }
    return { player: players[0], error: null };
  } catch (error: any) {
    return { player: null, error: error.message };
  }
}

export async function createPlayer(
  playerData: Omit<Player, 'id' | 'created_at' | 'updated_at' | 'club'>
): Promise<{ player: Player | null; error: string | null }> {
  const newPlayerId = uuidv4();
  const newPlayer = { id: newPlayerId, ...playerData };
  try {
    await pool.query('INSERT INTO players SET ?', newPlayer);
    return { player: newPlayer as Player, error: null };
  } catch (error: any) {
    return { player: null, error: error.message };
  }
}

export async function updatePlayer(
  id: string,
  playerData: Partial<Omit<Player, 'id' | 'created_at' | 'updated_at' | 'club'>>
): Promise<{ player: Player | null; error: string | null }> {
  try {
    await pool.query('UPDATE players SET ? WHERE id = ?', [playerData, id]);
    const { player } = await getPlayerById(id);
    return { player, error: null };
  } catch (error: any) {
    return { player: null, error: error.message };
  }
}

export async function deletePlayer(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const [result] = await pool.query('DELETE FROM players WHERE id = ?', [id]);
    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return { success: false, error: 'Player not found' };
    }
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPlayersByClubId(clubId: string): Promise<{ players: Player[] | null; error: string | null }> {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, c.name as club_name FROM players p LEFT JOIN clubs c ON p.club_id = c.id WHERE p.club_id = ? ORDER BY p.name ASC',
      [clubId]
    );
    return { players: rows as Player[], error: null };
  } catch (error: any) {
    return { players: null, error: error.message };
  }
}