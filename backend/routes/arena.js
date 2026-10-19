import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

// GET /api/classes - List all robot classes
router.get('/classes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM class ORDER BY class_id ASC'
    );
    res.json({ classes: result.rows });
  } catch (error) {
    console.error('Erreur classes:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des classes.' });
  }
});

// GET /api/missions - List all missions
router.get('/missions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM mission_progression ORDER BY mission_id ASC'
    );
    res.json({ missions: result.rows });
  } catch (error) {
    console.error('Erreur missions:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des missions.' });
  }
});

export default router;
