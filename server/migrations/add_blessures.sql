CREATE TABLE IF NOT EXISTS blessures (
  id            SERIAL PRIMARY KEY,
  nhl_player_id INTEGER NOT NULL UNIQUE REFERENCES joueurs(nhl_player_id) ON DELETE CASCADE,
  statut        VARCHAR(50)  NOT NULL,
  type_blessure TEXT,
  commentaire   TEXT,
  date_retour   DATE,
  last_update   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blessures_nhl_player_id ON blessures(nhl_player_id);
