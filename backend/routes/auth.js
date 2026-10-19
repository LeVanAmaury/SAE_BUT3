import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (
    typeof username !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({
      error: 'Nom d’utilisateur, email et mot de passe obligatoires et valides.',
    });
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanUsername || !cleanEmail || !password) {
    return res.status(400).json({
      error: 'Nom d’utilisateur, email et mot de passe obligatoires.',
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  if (!usernameRegex.test(cleanUsername)) {
    return res.status(400).json({
      error:
        'Le nom d’utilisateur doit comporter entre 3 et 30 caractères alphanumériques (tirets autorisés).',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: 'Format d’email invalide.' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Le mot de passe doit comporter au moins 6 caractères.' });
  }

  try {
    // Check if user already exists
    const existing = await pool.query(
      'SELECT player_id FROM "user" WHERE username = $1 OR email = $2',
      [cleanUsername, cleanEmail]
    );
    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ error: 'Nom d’utilisateur ou adresse email déjà utilisé.' });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user with parameterized SQL query
    const insertResult = await pool.query(
      'INSERT INTO "user" (username, email, password, elo_rank) VALUES ($1, $2, $3, 1000) RETURNING player_id, username, email, elo_rank',
      [cleanUsername, cleanEmail, hashedPassword]
    );
    const newUser = insertResult.rows[0];

    // Unlock starting class 'Guerrier' by default
    await pool.query(
      `INSERT INTO player_unlock (player_id, unlocked_class_id)
       SELECT $1, class_id FROM class WHERE name = 'Guerrier'
       ON CONFLICT DO NOTHING`,
      [newUser.player_id]
    );

    // Generate JWT
    const token = jwt.sign(
      { player_id: newUser.player_id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Compte créé avec succès.',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return res
      .status(500)
      .json({ error: 'Erreur interne lors de la création du compte.' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (
    typeof identifier !== 'string' ||
    typeof password !== 'string' ||
    !identifier.trim() ||
    !password
  ) {
    return res
      .status(400)
      .json({ error: 'Identifiant et mot de passe requis.' });
  }

  const cleanIdentifier = identifier.trim();

  try {
    // Query user by username or email
    const result = await pool.query(
      'SELECT player_id, username, email, password, elo_rank FROM "user" WHERE username = $1 OR email = $1',
      [cleanIdentifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { player_id: user.player_id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Connexion réussie.',
      token,
      user: {
        player_id: user.player_id,
        username: user.username,
        email: user.email,
        elo_rank: user.elo_rank,
      },
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    return res
      .status(500)
      .json({ error: 'Erreur interne lors de la connexion.' });
  }
});


// GET /auth/me (Protected route)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query(
      'SELECT player_id, username, email, elo_rank FROM "user" WHERE player_id = $1',
      [req.user.player_id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    const user = userRes.rows[0];

    // Fetch unlocked classes
    const classesRes = await pool.query(
      `SELECT c.class_id, c.name, c.base_health, c.base_range, c.base_damage, pu.unlock_date
       FROM player_unlock pu
       JOIN class c ON pu.unlocked_class_id = c.class_id
       WHERE pu.player_id = $1`,
      [user.player_id]
    );

    return res.json({
      user,
      unlocked_classes: classesRes.rows,
    });
  } catch (error) {
    console.error('Erreur profil:', error);
    return res
      .status(500)
      .json({ error: 'Erreur lors de la récupération du profil.' });
  }
});

export default router;
