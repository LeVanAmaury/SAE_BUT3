# Contrat de développement - Projet CodeArena (SAÉ BUT3)

Tu interviens sur le projet CodeArena (arène tactique 2D de bots programmables).

## Architecture technique
- Backend : Node.js (ESM), Express, PostgreSQL (via `pg`).
- Frontend : Vue 3 (Composition API `<script setup>`), TailwindCSS, Canvas API.
- Sandbox : Docker (`--network none`, quotas stricts de RAM et CPU).
- Task Runner : go-task (`Taskfile.yml`).

## Règles strictes
- Consulter et respecter les règles de `.agent/rules/`.
- Commits conventionnels obligatoires (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`).
- Sécurité : requêtes SQL paramétrées obligatoires, hash bcrypt pour les mots de passe, JWT sur routes privées.
- Toute commande système doit passer par `task` et être journalisée via `2>&1 | tee ./tmp/exec_logs.log`.
