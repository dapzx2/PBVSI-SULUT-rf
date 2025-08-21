import pool from './mysql';
import { v4 as uuidv4 } from 'uuid';
import type { Article } from './types';

export async function getArticles(): Promise<{ articles: Article[] | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM articles ORDER BY published_at DESC');
    return { articles: rows as Article[], error: null };
  } catch (error: any) {
    return { articles: null, error: error.message };
  }
}

export async function getArticleById(id: string): Promise<{ article: Article | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    const articles = rows as Article[];
    if (articles.length === 0) {
      return { article: null, error: 'Article not found' };
    }
    return { article: articles[0], error: null };
  } catch (error: any) {
    return { article: null, error: error.message };
  }
}

export async function createArticle(articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<{ article: Article | null; error: string | null }> {
  const newArticleId = uuidv4();
  const newArticle = { id: newArticleId, ...articleData };
  try {
    await pool.query('INSERT INTO articles SET ?', newArticle);
    return { article: newArticle as Article, error: null };
  } catch (error: any) {
    return { article: null, error: error.message };
  }
}

export async function updateArticle(id: string, articleData: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>): Promise<{ article: Article | null; error: string | null }> {
  try {
    await pool.query('UPDATE articles SET ? WHERE id = ?', [articleData, id]);
    const { article } = await getArticleById(id);
    return { article, error: null };
  } catch (error: any) {
    return { article: null, error: error.message };
  }
}

export async function deleteArticle(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return { success: false, error: 'Article not found' };
    }
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getArticleBySlug(slug: string): Promise<{ article: Article | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM articles WHERE slug = ?', [slug]);
    const articles = rows as Article[];
    if (articles.length === 0) {
      return { article: null, error: 'Article not found' };
    }
    return { article: articles[0], error: null };
  } catch (error: any) {
    return { article: null, error: error.message };
  }
}