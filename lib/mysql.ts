import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'PBVSI-SULUT',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testConnection(): Promise<{ success: boolean; error: string | null }> {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log('MySQL connection test successful.');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('MySQL connection test failed:', error.message);
    return { success: false, error: error.message };
  }
}

export default pool;