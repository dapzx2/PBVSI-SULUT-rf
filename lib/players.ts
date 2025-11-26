
import pool from './mysql';
import { RowDataPacket } from 'mysql2';
import { Player as FrontendPlayer } from './types'; // Import the frontend type

// Extend the frontend type but allow for nulls where DB might return nulls if strictness varies
// Or just use the frontend type structure for the return value.
// Let's define the DB row structure.
export interface PlayerRow extends RowDataPacket {
  id: string;
  name: string;
  position: string | null;
  image_url: string | null;
  club_id: string | null;
  club_name: string | null;
  birth_date: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  country: string | null;
  achievements: string | null;
  created_at: string;
  updated_at: string;
}

export async function getPlayers(): Promise<{ players: FrontendPlayer[] | null; error: string | null }> {
  try {
    const sql = `
      SELECT 
        p.id, 
        p.name, 
        p.position, 
        p.image_url as photo_url, 
        p.club_id,
        c.name as club_name,
        p.birth_date,
        p.height_cm as height,
        p.weight_kg as weight,
        p.country,
        p.achievements
      FROM players p
      LEFT JOIN clubs c ON p.club_id = c.id
      ORDER BY p.name ASC
    `;
    const [rows] = await pool.query(sql);

    const players = (rows as any[]).map(row => ({
      ...row,
      // Ensure types match FrontendPlayer
      position: row.position || "",
      club: row.club_id ? { name: row.club_name } : undefined,
      // Handle other potential nulls if necessary for strict frontend types
      photo_url: row.photo_url || null,
      achievements: row.achievements || null,
      created_at: new Date().toISOString(), // Default value since DB column is missing
      updated_at: new Date().toISOString(), // Default value since DB column is missing
    }));

    return { players: players as FrontendPlayer[], error: null };
  } catch (error: any) {
    return { players: null, error: error.message };
  }
}

export async function getPlayerById(id: string): Promise<FrontendPlayer | null> {
  const sql = `
    SELECT 
      p.id, 
      p.name, 
      p.position, 
      p.image_url as photo_url,
      p.club_id,
      c.name as club_name,
      c.city as club_city,
      p.birth_date,
      p.height_cm as height,
      p.weight_kg as weight,
      p.country,
      p.achievements
    FROM players p
    LEFT JOIN clubs c ON p.club_id = c.id
    WHERE p.id = ?
  `;
  const [rows] = await pool.query(sql, [id]);
  const row = (rows as any[])[0];

  if (!row) return null;

  return {
    ...row,
    position: row.position || "",
    club: row.club_id ? { name: row.club_name } : undefined,
    photo_url: row.photo_url || null,
    achievements: row.achievements || null,
    created_at: new Date().toISOString(), // Default value
    updated_at: new Date().toISOString(), // Default value
  } as FrontendPlayer;
}

export async function createPlayer(player: Omit<FrontendPlayer, 'id' | 'club_name' | 'created_at' | 'updated_at' | 'club'>): Promise<{ id: string }> {
  const { name, position, club_id, photo_url, birth_date, height, weight, country, achievements } = player as any; // Cast to any to handle property mapping
  const id = crypto.randomUUID();
  const sql = `
    INSERT INTO players (id, name, position, club_id, image_url, birth_date, height_cm, weight_kg, country, achievements)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.execute(sql, [id, name, position, club_id, photo_url, birth_date, height, weight, country, achievements]);
  return { id };
}

export async function updatePlayer(id: string, player: Partial<Omit<FrontendPlayer, 'id' | 'club_name' | 'created_at' | 'updated_at' | 'club'>>): Promise<void> {
  // Build the update query dynamically
  const fields = [];
  const values = [];
  const p = player as any; // Cast to any for property mapping

  if (p.name !== undefined) {
    fields.push('name = ?');
    values.push(p.name);
  }
  if (p.position !== undefined) {
    fields.push('position = ?');
    values.push(p.position);
  }
  if (p.club_id !== undefined) {
    fields.push('club_id = ?');
    values.push(p.club_id);
  }
  if (p.photo_url !== undefined) {
    fields.push('image_url = ?');
    values.push(p.photo_url);
  }
  if (p.birth_date !== undefined) {
    fields.push('birth_date = ?');
    values.push(p.birth_date);
  }
  if (p.height !== undefined) {
    fields.push('height_cm = ?');
    values.push(p.height);
  }
  if (p.weight !== undefined) {
    fields.push('weight_kg = ?');
    values.push(p.weight);
  }
  if (p.country !== undefined) {
    fields.push('country = ?');
    values.push(p.country);
  }
  if (p.achievements !== undefined) {
    fields.push('achievements = ?');
    values.push(p.achievements);
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
