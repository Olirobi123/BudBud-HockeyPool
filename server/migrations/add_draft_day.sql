-- Draft day (issue #137)

-- Les choix du draft en cours sont pré-remplis sans joueur, puis complétés en direct.
ALTER TABLE repechages ALTER COLUMN joueur DROP NOT NULL;

-- Équipe d'origine d'un choix échangé (NULL pour l'historique et les choix non échangés).
ALTER TABLE repechages ADD COLUMN equipe_source_id INTEGER NULL REFERENCES equipes(id);

-- Listes de classement publiques (Pronman U23, top 200 fantasy, ...).
CREATE TABLE listes_classement (
  id        SERIAL PRIMARY KEY,
  nom       TEXT NOT NULL,
  auteur    TEXT,
  publie_le DATE,
  ordre     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE liste_classement_joueurs (
  id            SERIAL PRIMARY KEY,
  liste_id      INTEGER NOT NULL REFERENCES listes_classement(id) ON DELETE CASCADE,
  rang          INTEGER NOT NULL,
  nom           TEXT NOT NULL,
  position      VARCHAR(2) NOT NULL,
  equipe_nhl    TEXT,
  tier          TEXT,
  nhl_player_id INTEGER NULL,
  UNIQUE (liste_id, rang)
);

-- Bascule de la page d'accueil : mettre "actif" à true le jour du draft.
INSERT INTO api_store (key, json_response)
VALUES ('draft_day', '{"actif": false, "annee": 2027}')
ON CONFLICT (key) DO NOTHING;
