import { createAdminUser } from '../lib/admin';
import pool from '../lib/mysql';

async function createDefaultAdmin() {
  try {
    await createAdminUser({
      email: "admin@pbvsisulut.com",
      username: "admin",
      password_hash: "admin123", // This will be hashed by createAdminUser
      role: "super_admin",
    });
  } catch (e: any) {
    // console.error("An unexpected error occurred:", e.message);
  } finally {
    pool.end(); // Close the database connection pool
  }
}

createDefaultAdmin();
