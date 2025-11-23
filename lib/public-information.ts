import pool from './mysql';
import { v4 as uuidv4 } from 'uuid';
import type { PublicInformation } from './types';

export async function getPublicInformation(): Promise<{ data: PublicInformation[] | null; error: string | null }> {
    try {
        const [rows] = await pool.query('SELECT * FROM public_information ORDER BY created_at DESC');
        return { data: rows as PublicInformation[], error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

export async function createPublicInformation(data: Omit<PublicInformation, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: PublicInformation | null; error: string | null }> {
    const newId = uuidv4();
    const newData = { ...data, id: newId };

    try {
        await pool.query('INSERT INTO public_information SET ?', newData);
        return { data: newData as PublicInformation, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

export async function updatePublicInformation(id: string, data: Partial<Omit<PublicInformation, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: PublicInformation | null; error: string | null }> {
    try {
        await pool.query('UPDATE public_information SET ? WHERE id = ?', [data, id]);
        const [rows] = await pool.query('SELECT * FROM public_information WHERE id = ?', [id]);
        const updatedData = (rows as PublicInformation[])[0];
        return { data: updatedData, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

export async function deletePublicInformation(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
        const [result] = await pool.query('DELETE FROM public_information WHERE id = ?', [id]);
        const deleteResult = result as any;
        if (deleteResult.affectedRows === 0) {
            return { success: false, error: 'Data not found' };
        }
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
