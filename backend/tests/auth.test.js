import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

describe('Sprint 2 - Sécurité & Authentification Backend', () => {
  describe('Hachage des mots de passe (bcrypt)', () => {
    it('doit hacher un mot de passe et valider la correspondance', async () => {
      const password = 'cyberSecretPassword42!';
      const hash = await bcrypt.hash(password, 10);

      assert.notEqual(hash, password);
      assert.ok(hash.startsWith('$2b$10$'));

      const isMatch = await bcrypt.compare(password, hash);
      assert.equal(isMatch, true);

      const isBadMatch = await bcrypt.compare('wrongPassword', hash);
      assert.equal(isBadMatch, false);
    });
  });

  describe('Génération et validation des jetons JWT', () => {
    it('doit signer et vérifier un token avec la charge utile attendue', () => {
      const payload = { player_id: 1, username: 'TestPilot' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

      const decoded = jwt.verify(token, JWT_SECRET);
      assert.equal(decoded.player_id, 1);
      assert.equal(decoded.username, 'TestPilot');
      assert.ok(decoded.exp > Date.now() / 1000);
    });

    it('doit rejeter un token falsifié ou signé avec un mauvais secret', () => {
      const token = jwt.sign({ player_id: 1 }, 'fake_secret_key');
      assert.throws(() => {
        jwt.verify(token, JWT_SECRET);
      }, /invalid signature/);
    });

    it('doit rejeter un token expiré', () => {
      const expiredToken = jwt.sign({ player_id: 1 }, JWT_SECRET, {
        expiresIn: '-1s',
      });
      assert.throws(() => {
        jwt.verify(expiredToken, JWT_SECRET);
      }, /jwt expired/);
    });
  });

  describe('Middleware authenticateToken', () => {
    it('doit renvoyer 401 si le token est manquant', () => {
      let statusCalled = null;
      let jsonCalled = null;
      let nextCalled = false;

      const req = { headers: {} };
      const res = {
        status(code) {
          statusCalled = code;
          return this;
        },
        json(data) {
          jsonCalled = data;
          return this;
        },
      };
      const next = () => {
        nextCalled = true;
      };

      authenticateToken(req, res, next);

      assert.equal(statusCalled, 401);
      assert.ok(jsonCalled.error.includes('Token manquant'));
      assert.equal(nextCalled, false);
    });

    it('doit renvoyer 401 si le format Authorization n’est pas Bearer', () => {
      let statusCalled = null;
      let jsonCalled = null;
      let nextCalled = false;

      const req = { headers: { authorization: 'Basic dXNlcjpwYXNz' } };
      const res = {
        status(code) {
          statusCalled = code;
          return this;
        },
        json(data) {
          jsonCalled = data;
          return this;
        },
      };
      const next = () => {
        nextCalled = true;
      };

      authenticateToken(req, res, next);

      assert.equal(statusCalled, 401);
      assert.equal(nextCalled, false);
    });

    it('doit renvoyer 403 si le token est invalide ou expiré', () => {
      let statusCalled = null;
      let jsonCalled = null;
      let nextCalled = false;

      const req = { headers: { authorization: 'Bearer invalid.token.value' } };
      const res = {
        status(code) {
          statusCalled = code;
          return this;
        },
        json(data) {
          jsonCalled = data;
          return this;
        },
      };
      const next = () => {
        nextCalled = true;
      };

      authenticateToken(req, res, next);

      assert.equal(statusCalled, 403);
      assert.ok(jsonCalled.error.includes('invalide ou expiré'));
      assert.equal(nextCalled, false);
    });

    it('doit appeler next() et injecter req.user si le token est valide', () => {
      let statusCalled = null;
      let nextCalled = false;

      const token = jwt.sign(
        { player_id: 42, username: 'CyberAce' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = {
        status(code) {
          statusCalled = code;
          return this;
        },
        json() {
          return this;
        },
      };
      const next = () => {
        nextCalled = true;
      };

      authenticateToken(req, res, next);

      assert.equal(statusCalled, null);
      assert.equal(nextCalled, true);
      assert.equal(req.user.player_id, 42);
      assert.equal(req.user.username, 'CyberAce');
    });
  });

  describe('Règles de validation des entrées (Register / Login)', () => {
    it('doit rejeter les noms d’utilisateur non conformes', () => {
      const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;

      assert.equal(usernameRegex.test('ab'), false); // Trop court
      assert.equal(usernameRegex.test('a'.repeat(31)), false); // Trop long
      assert.equal(usernameRegex.test('user name'), false); // Espace interdit
      assert.equal(usernameRegex.test('user@name'), false); // Caractère spécial
      assert.equal(usernameRegex.test('Cyber_Pilot-42'), true); // Valide
    });

    it('doit valider les adresses email selon le format standard', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      assert.equal(emailRegex.test('invalid-email'), false);
      assert.equal(emailRegex.test('user@'), false);
      assert.equal(emailRegex.test('@domain.com'), false);
      assert.equal(emailRegex.test('user@domain.com'), true);
      assert.equal(emailRegex.test('pilote.arena@but3.iut.fr'), true);
    });
  });
});
