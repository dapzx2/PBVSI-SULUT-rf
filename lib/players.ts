
import pool from './mysql';
import { RowDataPacket } from 'mysql2';

export interface Player extends RowDataPacket {
  id: string;
  name: string;
  position: string | null;
  image_url: string | null;
  club_id: string | null;
  club_name: string | null; // Kita akan join untuk mendapatkan nama klub
}

export async function getPlayers(): Promise<{ players: Player[] | null; error: string | null }> {
  try {
    const sql = `
      SELECT 
        p.id, 
        p.name, 
        p.position, 
        p.image_url, 
        p.club_id,
        c.name as club_name
      FROM players p
      LEFT JOIN clubs c ON p.club_id = c.id
      ORDER BY p.name ASC
    `;
    const [rows] = await pool.query(sql);
    return { players: rows as Player[], error: null };
  } catch (error: any) {
    return { players: null, error: error.message };
  }
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const sql = `
    SELECT 
      p.id, 
      p.name, 
      p.position, 
      p.image_url,
      p.club_id,
      c.name as club_name
    FROM players p
    LEFT JOIN clubs c ON p.club_id = c.id
    WHERE p.id = ?
  `;
  const [rows] = await pool.query(sql, [id]);
  return (rows as Player[])[0] || null;
}

export async function createPlayer(player: Omit<Player, 'id' | 'club_name'>): Promise<{ id: string }> {
  const { name, position, club_id, image_url } = player;
  const id = crypto.randomUUID();
  const sql = `
    INSERT INTO players (id, name, position, club_id, image_url)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.execute(sql, [id, name, position, club_id, image_url]);
  return { id };
}

export async function updatePlayer(id: string, player: Partial<Omit<Player, 'id' | 'club_name'>>): Promise<void> {
  // Build the update query dynamically
  const fields = [];
  const values = [];
  if (player.name !== undefined) {
    fields.push('name = ?');
    values.push(player.name);
  }
  if (player.position !== undefined) {
    fields.push('position = ?');
    values.push(player.position);
  }
  if (player.club_id !== undefined) {
    fields.push('club_id = ?');
    values.push(player.club_id);
  }
  if (player.image_url !== undefined) {
    fields.push('image_url = ?');
    values.push(player.image_url);
  }

  if (fields.length === 0) {
    // Nothing to update
    return;
  }

  const sql = `
    UPDATE players
    SET ${fields.join(', ')}
    WHERE id = ?
  `;
  values.push(id);

  await pool.execute(sql, values);
}

export async function deletePlayer(id: string): Promise<void> {
  const sql = `DELETE FROM players WHERE id = ?`;
  await pool.execute(sql, [id]);
}
