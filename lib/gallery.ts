import pool from './mysql';
import { v4 as uuidv4 } from 'uuid';
import type { GalleryItem } from './types';

export async function getGalleryItems(category?: string): Promise<{ galleryItems: GalleryItem[] | null; error: string | null }> {
  try {
    let query = 'SELECT * FROM gallery_items';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return { galleryItems: rows as GalleryItem[], error: null };
  } catch (error: any) {
    return { galleryItems: null, error: error.message };
  }
}

export async function createGalleryItem(itemData: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ galleryItem: GalleryItem | null; error: string | null }> {
  const newItemId = uuidv4();
  const newItem = { id: newItemId, ...itemData };
  try {
    await pool.query('INSERT INTO gallery_items SET ?', newItem);
    return { galleryItem: newItem as GalleryItem, error: null };
  } catch (error: any) {
    return { galleryItem: null, error: error.message };
  }
}

export async function updateGalleryItem(id: string, itemData: Partial<Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>>): Promise<{ galleryItem: GalleryItem | null; error: string | null }> {
  try {
    await pool.query('UPDATE gallery_items SET ? WHERE id = ?', [itemData, id]);
    const [rows] = await pool.query('SELECT * FROM gallery_items WHERE id = ?', [id]);
    const galleryItems = rows as GalleryItem[];
    if (galleryItems.length === 0) {
      return { galleryItem: null, error: 'Gallery item not found' };
    }
    return { galleryItem: galleryItems[0], error: null };
  } catch (error: any) {
    return { galleryItem: null, error: error.message };
  }
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const [result] = await pool.query('DELETE FROM gallery_items WHERE id = ?', [id]);
    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return { success: false, error: 'Gallery item not found' };
    }
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getGalleryItemById(id: string): Promise<{ galleryItem: GalleryItem | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery_items WHERE id = ?', [id]);
    const galleryItems = rows as GalleryItem[];
    if (galleryItems.length === 0) {
      return { galleryItem: null, error: 'Gallery item not found' };
    }
    return { galleryItem: galleryItems[0], error: null };
  } catch (error: any) {
    return { galleryItem: null, error: error.message };
  }
}