import { testConnection } from '../lib/mysql.js';

async function runTest() {
  await testConnection();
}

runTest();
