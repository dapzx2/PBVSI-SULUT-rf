import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from 'uuid';
import pool from './mysql';
import { AdminUser } from './admin';

type AuthenticatedHandler = (request: NextRequest, context: unknown, admin: AdminUser) => Promise<Response> | Response;

const JWT_SECRET = process.env.JWT_SECRET || "pbvsi-sulut-secret-key-2024"

export interface JWTPayload {
  userId: string
  email: string
  role: string
  sessionId: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function createSession(adminUserId: string, ipAddress: string, userAgent: string): Promise<string> {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  try {
    await pool.query(
      'INSERT INTO admin_sessions (id, admin_user_id, token_hash, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [sessionId, adminUserId, sessionId, ipAddress, userAgent, expiresAt.toISOString().slice(0, 19).replace('T', ' ')]
    );
  } catch (error: any) {
    console.error("Session creation error:", error);
    throw new Error("Failed to create session");
  }
  return sessionId;
}

export async function validateSession(sessionId: string): Promise<AdminUser | null> {
  try {
    const [rows] = await pool.query(
      `SELECT 
        s.*,
        au.id as admin_id,
        au.username,
        au.email,
        au.password_hash,
        au.role,
        au.created_at as admin_created_at
      FROM admin_sessions s
      JOIN admin_users au ON s.admin_user_id = au.id
      WHERE s.id = ? AND s.expires_at > NOW()`,
      [sessionId]
    );
    const sessions = rows as any[];

    if (sessions.length === 0) return null;

    const session = sessions[0];
    return {
      id: session.admin_id,
      username: session.username,
      email: session.email,
      password_hash: session.password_hash,
      role: session.role,
      created_at: session.admin_created_at,
    };
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await pool.query('DELETE FROM admin_sessions WHERE id = ?', [sessionId]);
  } catch (error: any) {
    console.error("Session deletion error:", error);
  }
}

export async function logActivity(
  adminUserId: string | null,
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string,
): Promise<void> {
  try {
    const logId = uuidv4();
    // Get current time in WITA timezone (UTC+8)
    const timestamp = new Date();

    await pool.query(
      'INSERT INTO admin_activity_logs (id, admin_user_id, action, resource_type, resource_id, details, ip_address, user_agent, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [logId, adminUserId, action, resourceType, resourceId, JSON.stringify(details), ipAddress, userAgent, timestamp]
    );
  } catch (error) {
    console.error("Activity logging error:", error);
  }
}

export async function getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    return await validateSession(payload.sessionId);
  } catch (error) {
    console.error("Get admin from request error:", error);
    return null;
  }
}

export function requireAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context: any) => {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(request, context, admin);
  };
}

export function requireSuperAdmin(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context: any) => {
    const admin = await getAdminFromRequest(request);
    if (!admin || admin.role !== "super_admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, context, admin);
  };
}

export async function verifyAuth(request: NextRequest): Promise<{ status: number; error?: string }> {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return { status: 401, error: "Unauthorized" };
  }
  return { status: 200 };
}



