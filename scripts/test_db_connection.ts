import { testConnection } from './lib/mysql';

async function runTest() {
  console.log('Attempting to connect to the database...');
  const result = await testConnection();
  if (result.success) {
    console.log('Database connection successful!');
  } else {
    console.error('Database connection failed:', result.error);
  }
}

runTest();
