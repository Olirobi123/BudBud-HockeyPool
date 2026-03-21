-- Phase 1A: Add tiebreaker columns to equipe_points
ALTER TABLE equipe_points
  ADD COLUMN IF NOT EXISTS total_buts INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_matchs INT NOT NULL DEFAULT 0;

-- Phase 1B: Weekly playoff points (snapshot diffs)
CREATE TABLE IF NOT EXISTS equipe_semaine_points (
  id SERIAL PRIMARY KEY,
  equipe_id INT REFERENCES equipes(id) ON DELETE CASCADE,
  saison TEXT NOT NULL,
  semaine INT NOT NULL,
  debut_semaine DATE NOT NULL,
  fin_semaine DATE NOT NULL,
  attaque_points INT NOT NULL DEFAULT 0,
  defense_points INT NOT NULL DEFAULT 0,
  gardien_points INT NOT NULL DEFAULT 0,
  total_points INT NOT NULL DEFAULT 0,
  total_buts INT NOT NULL DEFAULT 0,
  total_matchs INT NOT NULL DEFAULT 0,
  last_update_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(equipe_id, saison, semaine)
);

-- Phase 1C: Playoff bracket
CREATE TABLE IF NOT EXISTS series_playoffs (
  id SERIAL PRIMARY KEY,
  saison TEXT NOT NULL,
  ronde INT NOT NULL,
  division TEXT,
  position INT NOT NULL,
  equipe_a_id INT REFERENCES equipes(id),
  equipe_b_id INT REFERENCES equipes(id),
  gagnant_id INT REFERENCES equipes(id),
  UNIQUE(saison, ronde, position)
);

-- Phase 1D: Baseline snapshots for weekly diff computation
CREATE TABLE IF NOT EXISTS series_semaine_baseline (
  id SERIAL PRIMARY KEY,
  equipe_id INT REFERENCES equipes(id) ON DELETE CASCADE,
  saison TEXT NOT NULL,
  semaine INT NOT NULL,
  total_points INT NOT NULL DEFAULT 0,
  attaque_points INT NOT NULL DEFAULT 0,
  defense_points INT NOT NULL DEFAULT 0,
  gardien_points INT NOT NULL DEFAULT 0,
  total_buts INT NOT NULL DEFAULT 0,
  total_matchs INT NOT NULL DEFAULT 0,
  snapshot_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(equipe_id, saison, semaine)
);
