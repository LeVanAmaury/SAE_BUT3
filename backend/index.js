import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pool } from './db/pool.js';
import authRouter from './routes/auth.js';
import arenaRouter from './routes/arena.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(express.json());

// OpenAPI documentation endpoint
const swaggerPath = path.resolve(__dirname, 'swagger.json');
let swaggerDoc = null;
if (fs.existsSync(swaggerPath)) {
  swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
}

app.get('/api-docs/swagger.json', (req, res) => {
  if (!swaggerDoc) {
    return res.status(404).json({ error: 'Documentation non trouvée' });
  }
  res.json(swaggerDoc);
});

app.get('/api-docs', (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>CodeArena API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>body { margin: 0; background: #0f172a; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
      });
    };
  </script>
</body>
</html>`);
});

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

let server = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Backend opérationnel sur http://localhost:${PORT}`);
  });
}

export { app, server };

