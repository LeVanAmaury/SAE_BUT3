import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});
