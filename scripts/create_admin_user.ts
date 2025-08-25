import { createAdminUser } from '../lib/admin';
import pool from '../lib/mysql';

async function createDefaultAdmin() {
  try {
    console.log("Attempting to create default admin user...");
    const { adminUser, error } = await createAdminUser({
      email: "admin@pbvsisulut.com",
      username: "admin",
      password_hash: "admin123", // This will be hashed by createAdminUser
      role: "super_admin",
    });

    if (error) {
      console.error("Error creating admin user:", error);
    } else if (adminUser) {
      console.log("Default admin user created successfully:", adminUser.email);
    } else {
      console.log("Admin user creation did not return an adminUser or an error.");
    }
  } catch (e: any) {
    console.error("An unexpected error occurred:", e.message);
  } finally {
    pool.end(); // Close the database connection pool
  }
}

createDefaultAdmin();
