import pool from './mysql'
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise'

export interface Settings {
    id: number
    website_name: string
    tagline: string
    email: string
    phone: string
    address: string
    logo_url: string | null
    facebook: string | null
    instagram: string | null
    twitter: string | null
    youtube: string | null
    whatsapp: string | null
    created_at: string
    updated_at: string
}

export interface UpdateSettingsInput {
    website_name?: string
    tagline?: string
    email?: string
    phone?: string
    address?: string
    logo_url?: string | null
    facebook?: string | null
    instagram?: string | null
    twitter?: string | null
    youtube?: string | null
    whatsapp?: string | null
}

/**
 * Get current settings (creates default if not exists)
 */
export async function getSettings(): Promise<Settings> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM settings WHERE id = 1 LIMIT 1`
    )

    if (rows.length === 0) {
        // Create default settings if not exists
        await pool.query(
            `INSERT IGNORE INTO settings (id) VALUES (1)`
        )

        // Fetch again after insert
        const [newRows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM settings WHERE id = 1 LIMIT 1`
        )
        return newRows[0] as Settings
    }

    return rows[0] as Settings
}

/**
 * Update settings
 */
export async function updateSettings(data: UpdateSettingsInput): Promise<Settings> {
    const fields: string[] = []
    const values: any[] = []

    // Build dynamic update query
    Object.entries(data).forEach(([key, value]) => {
        fields.push(`${key} = ?`)
        values.push(value)
    })

    if (fields.length === 0) {
        throw new Error('No fields to update')
    }

    const updateQuery = `
    UPDATE settings 
    SET ${fields.join(', ')}
    WHERE id = 1
  `

    await pool.query<ResultSetHeader>(updateQuery, values)

    // Fetch updated settings
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM settings WHERE id = 1 LIMIT 1`
    )

    if (rows.length === 0) {
        throw new Error('Settings not found')
    }

    return rows[0] as Settings
}
