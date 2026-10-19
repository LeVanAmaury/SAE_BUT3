import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET =
  process.env.JWT_SECRET || 'codearena_dev_secret_key_change_in_production';


export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Accès non autorisé : Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ error: 'Accès interdit : Token invalide ou expiré' });
    }
    req.user = decoded;
    next();
  });
}

export { JWT_SECRET };
