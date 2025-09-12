
import pool from './mysql';
import { RowDataPacket } from 'mysql2';

export interface Player extends RowDataPacket {
  id: string;
  name: string;
  position: string | null;
  image_url: string | null;
  club_id: string | null;
  club_name: string | null; // Kita akan join untuk mendapatkan nama klub
  birth_date: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  country: string | null;
  achievements: string | null;
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
      c.name as club_name,
      c.city as club_city,
      p.birth_date,
      p.height_cm,
      p.weight_kg,
      p.country,
      p.achievements
    FROM players p
    LEFT JOIN clubs c ON p.club_id = c.id
    WHERE p.id = ?
  `;
  const [rows] = await pool.query(sql, [id]);
  return (rows as Player[])[0] || null;
}

export async function createPlayer(player: Omit<Player, 'id' | 'club_name'>): Promise<{ id: string }> {
  const { name, position, club_id, image_url, birth_date, height_cm, weight_kg, country, achievements } = player;
  const id = crypto.randomUUID();
  const sql = `
    INSERT INTO players (id, name, position, club_id, image_url, birth_date, height_cm, weight_kg, country, achievements)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.execute(sql, [id, name, position, club_id, image_url, birth_date, height_cm, weight_kg, country, achievements]);
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
  if (player.birth_date !== undefined) {
    fields.push('birth_date = ?');
    values.push(player.birth_date);
  }
  if (player.height_cm !== undefined) {
    fields.push('height_cm = ?');
    values.push(player.height_cm);
  }
  if (player.weight_kg !== undefined) {
    fields.push('weight_kg = ?');
    values.push(player.weight_kg);
  }
  if (player.country !== undefined) {
    fields.push('country = ?');
    values.push(player.country);
  }
  if (player.achievements !== undefined) {
    fields.push('achievements = ?');
    values.push(player.achievements);
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
