import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/pool.js';
import authRouter from './routes/auth.js';
import arenaRouter from './routes/arena.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({
      status: 'UP',
      timestamp: dbRes.rows[0].now,
      database: 'Connected',
    });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', database: error.message });
  }
});

// Application routes
app.use('/auth', authRouter);
app.use('/api', arenaRouter);

app.listen(PORT, () => {
  console.log(`Backend opérationnel sur http://localhost:${PORT}`);
});
