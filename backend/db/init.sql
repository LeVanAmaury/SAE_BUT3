-- ==============================================================================
-- CodeArena Database Initialization Script
-- ==============================================================================

-- 1. Table: USER
CREATE TABLE IF NOT EXISTS "user" (
    player_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    elo_rank INT NOT NULL DEFAULT 1000
);

-- 2. Table: CLASS (sans clé étrangère requise initialement pour éviter la dépendance circulaire)
CREATE TABLE IF NOT EXISTS class (
    class_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    base_health INT NOT NULL,
    base_range INT NOT NULL,
    base_damage INT NOT NULL,
    required_mission_id INT
);

-- 3. Table: MISSION_PROGRESSION
CREATE TABLE IF NOT EXISTS mission_progression (
    mission_id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    required_wins INT NOT NULL,
    conditional_class_id INT REFERENCES class(class_id) ON DELETE SET NULL
);

-- 4. Contrainte clé étrangère vers MISSION_PROGRESSION
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_class_mission'
    ) THEN
        ALTER TABLE class
        ADD CONSTRAINT fk_class_mission
        FOREIGN KEY (required_mission_id) REFERENCES mission_progression(mission_id) ON DELETE SET NULL;
    END IF;
END $$;

-- 5. Table: PLAYER_UNLOCK (Association utilisateurs / classes débloquées)
CREATE TABLE IF NOT EXISTS player_unlock (
    player_id INT REFERENCES "user"(player_id) ON DELETE CASCADE,
    unlocked_class_id INT REFERENCES class(class_id) ON DELETE CASCADE,
    unlock_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (player_id, unlocked_class_id)
);

-- 6. Table: MATCH
CREATE TABLE IF NOT EXISTS match (
    match_id SERIAL PRIMARY KEY,
    player_1_id INT NOT NULL REFERENCES "user"(player_id) ON DELETE CASCADE,
    player_2_id INT NOT NULL REFERENCES "user"(player_id) ON DELETE CASCADE,
    score_p1 INT NOT NULL DEFAULT 0,
    score_p2 INT NOT NULL DEFAULT 0,
    match_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table: SCRIPT
CREATE TABLE IF NOT EXISTS script (
    script_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL REFERENCES match(match_id) ON DELETE CASCADE,
    player_id INT NOT NULL REFERENCES "user"(player_id) ON DELETE CASCADE,
    class_id INT NOT NULL REFERENCES class(class_id) ON DELETE CASCADE,
    code_content TEXT NOT NULL,
    round_number INT NOT NULL,
    CONSTRAINT chk_round CHECK (round_number > 0)
);

-- ==============================================================================
-- Seed Data (Jeu de données de test - Issue #8)
-- ==============================================================================

-- Classes initiales
INSERT INTO class (name, base_health, base_range, base_damage, required_mission_id) VALUES
('Guerrier', 100, 1, 25, NULL),
('Tank', 160, 1, 15, NULL),
('Sniper', 70, 4, 35, NULL)
ON CONFLICT DO NOTHING;

-- Missions initiales
INSERT INTO mission_progression (description, required_wins, conditional_class_id) VALUES
('Remporter 3 victoires en duel', 3, NULL),
('Remporter 5 victoires avec la classe Guerrier', 5, 1)
ON CONFLICT DO NOTHING;

-- Utilisateur de test initial (Mot de passe: password123, hash bcrypt)
INSERT INTO "user" (username, email, password, elo_rank) VALUES
('testplayer', 'test@codearena.local', '$2b$10$PjB5K4g6v5g7k4.sZ3HbeevhKkJ8qI1l2bM3R9v4.K3HjOQ8bX7vL', 1000)
ON CONFLICT (username) DO NOTHING;

-- Déblocage de la classe Guerrier par défaut pour l'utilisateur test
INSERT INTO player_unlock (player_id, unlocked_class_id)
SELECT u.player_id, c.class_id
FROM "user" u, class c
WHERE u.username = 'testplayer' AND c.name = 'Guerrier'
ON CONFLICT DO NOTHING;
