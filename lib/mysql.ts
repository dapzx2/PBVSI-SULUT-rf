import { createPool, Pool, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// Extend the NodeJS Global object to include our mysql connection pool
declare global {
  var mysqlPool: Pool | undefined;
}

// A function to lazily create and cache the connection pool
const getPool = (): Pool => {
  // If the pool is already cached in the global object, return it
  if (global.mysqlPool) {
    return global.mysqlPool;
  }
  
  // Otherwise, create a new pool
  const pool = createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'PBVSI-SULUT',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z'
  });

  // Cache the pool in the global object for subsequent requests
  global.mysqlPool = pool;
  
  return pool;
};

// Create a proxy for the pool.
// This allows us to intercept property access (e.g., pool.query)
// and ensure the pool is initialized only when it's actually used.
const poolProxy = new Proxy({}, {
  get: (target, prop) => {
    // When a property is accessed, get the (potentially new) pool
    const pool = getPool();
    // Forward the property access to the real pool object
    const property = Reflect.get(pool, prop);
    if (typeof property === 'function') {
      return property.bind(pool);
    }
    return property;
  }
}) as Pool;


export async function testConnection(): Promise<{ success: boolean; error: string | null }> {
  try {
    // Use the proxy to get a connection
    const connection = await poolProxy.getConnection();
    connection.release();
    console.log('MySQL connection test successful.');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('MySQL connection test failed:', error.message);
    return { success: false, error: error.message };
  }
}

export const query = async <T extends RowDataPacket[] | ResultSetHeader>(sql: string, values?: any[]): Promise<T> => {
  let connection: PoolConnection | undefined;
  try {
    // Use the proxy to get a connection
    connection = await poolProxy.getConnection();
    const [rows] = await connection.execute(sql, values);
    return rows as T;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Export the proxy as the default.
// This maintains API compatibility with the rest of the codebase.
export default poolProxy;
