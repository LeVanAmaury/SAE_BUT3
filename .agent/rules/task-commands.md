# Commandes d'exécution

## ⛔ STRICTEMENT INTERDIT
- ❌ JAMAIS de `docker compose` directement
- ❌ JAMAIS de `npm run` ou `npx` hors de task
- ❌ JAMAIS de `cd <dossier>` pour exécuter des scripts locaux
- ❌ JAMAIS d'exécution de commande sans journalisation dans `./tmp/exec_logs.log`

## ✅ OBLIGATOIRE
- Toutes les commandes doivent être exécutées depuis la racine via `task`.
- **Journalisation obligatoire** : Toute commande exécutée par un agent doit systématiquement être redirigée avec `2>&1 | tee ./tmp/exec_logs.log` :
  ```bash
  task <commande> 2>&1 | tee ./tmp/exec_logs.log
  ```
  Exemples :
  - `task test 2>&1 | tee ./tmp/exec_logs.log`
  - `task code 2>&1 | tee ./tmp/exec_logs.log`
  - `task scan 2>&1 | tee ./tmp/exec_logs.log`
  - `task db:reset 2>&1 | tee ./tmp/exec_logs.log`
