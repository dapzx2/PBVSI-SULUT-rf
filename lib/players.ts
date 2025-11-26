
import pool from './mysql';
import { RowDataPacket } from 'mysql2';

export interface Player extends RowDataPacket {
  id: string;
  name: string;
  position: string | null;
  image_url: string | null; // This maps to photo_url in frontend type, but let's keep it consistent with DB for now, or alias it if needed. Frontend uses photo_url.
  // Actually, frontend type uses photo_url. Let's check the DB schema. 
  // Based on previous file content, DB has image_url. 
  // Frontend type has photo_url.
  // Let's alias image_url as photo_url in queries.
  club_id: string | null;
  club_name: string | null;
  club?: { name: string | null }; // Added nested club object
  birth_date: string | null;
  height: number | null; // Changed from height_cm
  weight: number | null; // Changed from weight_kg
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
      club: row.club_id ? { name: row.club_name } : null
    }));

    return { players: players as Player[], error: null };
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
  return (rows as Player[])[0] || null;
}

export async function createPlayer(player: Omit<Player, 'id' | 'club_name'>): Promise<{ id: string }> {
  const { name, position, club_id, photo_url, birth_date, height, weight, country, achievements } = player as any; // Cast to any to handle property mapping
  const id = crypto.randomUUID();
  const sql = `
    INSERT INTO players (id, name, position, club_id, image_url, birth_date, height_cm, weight_kg, country, achievements)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.execute(sql, [id, name, position, club_id, photo_url, birth_date, height, weight, country, achievements]);
  return { id };
}

export async function updatePlayer(id: string, player: Partial<Omit<Player, 'id' | 'club_name'>>): Promise<void> {
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
