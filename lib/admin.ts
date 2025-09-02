import pool from './mysql';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'super_admin' | 'admin';
  created_at: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getAdminUserById(id: string): Promise<{ adminUser: AdminUser | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE id = ?', [id]);
    const adminUsers = rows as AdminUser[];
    if (adminUsers.length === 0) {
      return { adminUser: null, error: 'Admin user not found' };
    }
    return { adminUser: adminUsers[0], error: null };
  } catch (error: any) {
    return { adminUser: null, error: error.message };
  }
}

export async function getAdminUserByEmail(email: string): Promise<{ adminUser: AdminUser | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    const adminUsers = rows as AdminUser[];
    if (adminUsers.length === 0) {
      return { adminUser: null, error: 'Admin user not found' };
    }
    return { adminUser: adminUsers[0], error: null };
  } catch (error: any) {
    return { adminUser: null, error: error.message };
  }
}

export async function getAdminUserByUsername(username: string): Promise<{ adminUser: AdminUser | null; error: string | null }> {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    const adminUsers = rows as AdminUser[];
    if (adminUsers.length === 0) {
      return { adminUser: null, error: 'Admin user not found' };
    }
    return { adminUser: adminUsers[0], error: null };
  } catch (error: any) {
    return { adminUser: null, error: error.message };
  }
}

export async function createAdminUser(userData: Omit<AdminUser, 'id' | 'created_at'>): Promise<{ adminUser: AdminUser | null; error: string | null }> {
  const newAdminUserId = uuidv4();
  const hashedPassword = await hashPassword(userData.password_hash); // userData.password_hash is actually the plain password here
  const newAdminUser = { id: newAdminUserId, ...userData, password_hash: hashedPassword };
  try {
    await pool.query('INSERT INTO admin_users SET ?', newAdminUser);
    return { adminUser: newAdminUser as AdminUser, error: null };
  } catch (error: any) {
    return { adminUser: null, error: error.message };
  }
}

export async function updateAdminUser(id: string, userData: Partial<Omit<AdminUser, 'id' | 'created_at'>>): Promise<{ adminUser: AdminUser | null; error: string | null }> {
  try {
    if (userData.password_hash) {
      userData.password_hash = await hashPassword(userData.password_hash);
    }
    await pool.query('UPDATE admin_users SET ? WHERE id = ?', [userData, id]);
    const { adminUser } = await getAdminUserById(id);
    return { adminUser, error: null };
  } catch (error: any) {
    return { adminUser: null, error: error.message };
  }
}

export async function deleteAdminUser(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const [result] = await pool.query('DELETE FROM admin_users WHERE id = ?', [id]);
    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return { success: false, error: 'Admin user not found' };
    }
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export interface AdminActivityLog {
  id: string;
  admin_user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: any; // JSON type
  ip_address: string | null;
  user_agent: string | null;
  timestamp: string;
  username?: string; // Added for join result
}

export const getAdminActivityLogs = async (limit: number = 10): Promise<{ logs: AdminActivityLog[]; error: string | null }> => {
  try {
    const [rows] = await pool.query(
      `SELECT
         aal.*,
         au.username
       FROM
         admin_activity_logs aal
       LEFT JOIN
         admin_users au ON aal.admin_user_id = au.id
       ORDER BY
         aal.timestamp DESC
       LIMIT ?`,
      [limit]
    );
    return { logs: rows as AdminActivityLog[], error: null };
  } catch (error: any) {
    return { logs: [], error: error.message };
  }
};
