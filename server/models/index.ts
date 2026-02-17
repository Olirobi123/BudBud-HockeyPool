// Schémas et constantes pour les modèles de données

export const TABLES = {
  EQUIPES: 'equipes',
  ECHANGES: 'echanges',
  PLAYERS: 'players',
  REPECHAGE: 'repechage',
  JOUEURS: 'joueurs',
  EQUIPE_JOUEURS: 'equipe_joueurs',
  TROPHEES: 'trophees',
  TROPHEE_GAGNANTS: 'trophee_gagnants',
  EQUIPE_POINTS: 'equipe_points',
} as const;

export const QUERIES = {
  // Équipes
  GET_ALL_TEAMS: `SELECT * FROM ${TABLES.EQUIPES}`,
  GET_ACTIVE_TEAMS: `SELECT * FROM ${TABLES.EQUIPES} WHERE active = true`,
  GET_TEAM_BY_ID: `SELECT * FROM ${TABLES.EQUIPES} WHERE id = $1`,

  // Teams by division (alphabetically ordered)
  GET_TEAMS_BY_DIVISION: `
    SELECT id, nom, active, division, dg_name
    FROM ${TABLES.EQUIPES}
    WHERE division = $1 AND active = true
    ORDER BY nom ASC
  `,

  // Inactive teams
  GET_INACTIVE_TEAMS: `
    SELECT id, nom, active, division, dg_name
    FROM ${TABLES.EQUIPES}
    WHERE active = false
    ORDER BY nom ASC
  `,

  // Échanges
  GET_ALL_ECHANGES: `
    SELECT 
      e.id,
      e.date,
      e.details,
      e.equipe_source_id,
      e.equipe_destination_id,
      e.statut_confirmer,
      src.nom as equipe_source_nom,
      dest.nom as equipe_destination_nom
    FROM ${TABLES.ECHANGES} e
    JOIN ${TABLES.EQUIPES} src ON e.equipe_source_id = src.id
    JOIN ${TABLES.EQUIPES} dest ON e.equipe_destination_id = dest.id
    ORDER BY e.date DESC
  `,
  CREATE_ECHANGE: `
    INSERT INTO ${TABLES.ECHANGES} (equipe_source_id, equipe_destination_id, details, date)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
  `,
  GET_LATEST_ECHANGE: `
    SELECT
      e.id,
      e.date,
      e.details,
      e.equipe_source_id,
      e.equipe_destination_id,
      e.statut_confirmer,
      src.nom as equipe_source_nom,
      dest.nom as equipe_destination_nom
    FROM ${TABLES.ECHANGES} e
    JOIN ${TABLES.EQUIPES} src ON e.equipe_source_id = src.id
    JOIN ${TABLES.EQUIPES} dest ON e.equipe_destination_id = dest.id
    ORDER BY e.date DESC
    LIMIT 1
  `,
  GET_LATEST_TRADE_BY_TEAM: `
    SELECT
      e.id,
      e.date,
      e.details,
      e.equipe_source_id,
      e.equipe_destination_id,
      e.statut_confirmer,
      src.nom as equipe_source_nom,
      dest.nom as equipe_destination_nom
    FROM ${TABLES.ECHANGES} e
    JOIN ${TABLES.EQUIPES} src ON e.equipe_source_id = src.id
    JOIN ${TABLES.EQUIPES} dest ON e.equipe_destination_id = dest.id
    WHERE e.equipe_source_id = $1 OR e.equipe_destination_id = $1
    ORDER BY e.date DESC
    LIMIT 1
  `,

  // Joueurs
  GET_PLAYER_BY_ID: `SELECT * FROM ${TABLES.PLAYERS} WHERE id = $1`,
  SEARCH_PLAYERS: `SELECT * FROM ${TABLES.PLAYERS} WHERE nom ILIKE $1 OR prenom ILIKE $1`,

  // Repêchage
  GET_REPECHAGE_DATA: `
    SELECT
      r.*,
      p.nom as player_nom,
      p.prenom as player_prenom,
      e.nom as equipe_nom
    FROM ${TABLES.REPECHAGE} r
    JOIN ${TABLES.PLAYERS} p ON r.joueur_id = p.id
    JOIN ${TABLES.EQUIPES} e ON r.equipe_id = e.id
    ORDER BY r.year DESC, r.round ASC, r.pick ASC
  `,

  // Roster queries
  GET_TEAM_ROSTER: `
    SELECT j.*
    FROM ${TABLES.EQUIPE_JOUEURS} ej
    JOIN ${TABLES.JOUEURS} j ON ej.joueur_id = j.id
    WHERE ej.equipe_id = $1
    ORDER BY j.position, j.nom
  `,
  ADD_PLAYER_TO_ROSTER: `
    INSERT INTO ${TABLES.EQUIPE_JOUEURS} (equipe_id, joueur_id)
    VALUES ($1, $2)
    ON CONFLICT (joueur_id) DO UPDATE SET
      equipe_id = EXCLUDED.equipe_id
    RETURNING *
  `,

  // Joueurs queries
  GET_JOUEUR_BY_ID: `SELECT * FROM ${TABLES.JOUEURS} WHERE id = $1`,
  GET_JOUEUR_BY_NHL_ID: `SELECT * FROM ${TABLES.JOUEURS} WHERE nhl_player_id = $1`,
  GET_JOUEUR_CURRENT_TEAM: `
    SELECT e.*
    FROM ${TABLES.EQUIPE_JOUEURS} ej
    JOIN ${TABLES.EQUIPES} e ON ej.equipe_id = e.id
    WHERE ej.joueur_id = $1
  `,

  // Trophées queries
  GET_ALL_TROPHEES: `SELECT * FROM ${TABLES.TROPHEES} ORDER BY id`,
  GET_ALL_WINNERS: `
    SELECT
      tg.id,
      tg.trophee_id,
      tg.annee,
      tg.equipe_id,
      t.nom as trophee_nom,
      e.nom as equipe_nom
    FROM ${TABLES.TROPHEE_GAGNANTS} tg
    JOIN ${TABLES.TROPHEES} t ON tg.trophee_id = t.id
    JOIN ${TABLES.EQUIPES} e ON tg.equipe_id = e.id
    ORDER BY tg.annee DESC, t.id
  `,
  GET_WINNERS_BY_YEAR: `
    SELECT
      tg.id,
      tg.trophee_id,
      tg.annee,
      tg.equipe_id,
      t.nom as trophee_nom,
      e.nom as equipe_nom
    FROM ${TABLES.TROPHEE_GAGNANTS} tg
    JOIN ${TABLES.TROPHEES} t ON tg.trophee_id = t.id
    JOIN ${TABLES.EQUIPES} e ON tg.equipe_id = e.id
    WHERE tg.annee = $1
    ORDER BY t.id
  `,
  GET_TEAM_TROPHIES: `
    SELECT
      tg.id,
      tg.trophee_id,
      tg.annee,
      tg.equipe_id,
      t.nom as trophee_nom
    FROM ${TABLES.TROPHEE_GAGNANTS} tg
    JOIN ${TABLES.TROPHEES} t ON tg.trophee_id = t.id
    WHERE tg.equipe_id = $1
    ORDER BY tg.annee DESC, t.id
  `,

  // Equipe Points (classement)
  UPSERT_EQUIPE_POINTS: `
    INSERT INTO ${TABLES.EQUIPE_POINTS} (equipe_id, season, attaque_points, defense_points, gardien_points, total_points, last_update_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    ON CONFLICT (equipe_id, season) DO UPDATE SET
      attaque_points = EXCLUDED.attaque_points,
      defense_points = EXCLUDED.defense_points,
      gardien_points = EXCLUDED.gardien_points,
      total_points = EXCLUDED.total_points,
      last_update_at = NOW()
  `,
  GET_RANKINGS_BY_SEASON: `
    SELECT ep.*, e.nom as equipe_nom, e.division, e.dg_name
    FROM ${TABLES.EQUIPE_POINTS} ep
    JOIN ${TABLES.EQUIPES} e ON ep.equipe_id = e.id
    WHERE ep.season = $1
    ORDER BY ep.total_points DESC
  `,
  GET_RANKINGS_BY_DIVISION: `
    SELECT ep.*, e.nom as equipe_nom, e.division, e.dg_name
    FROM ${TABLES.EQUIPE_POINTS} ep
    JOIN ${TABLES.EQUIPES} e ON ep.equipe_id = e.id
    WHERE e.division = $1 AND ep.season = $2
    ORDER BY ep.total_points DESC
  `,
  GET_EQUIPE_POINTS_BY_TEAM: `
    SELECT ep.*, e.nom as equipe_nom, e.division, e.dg_name
    FROM ${TABLES.EQUIPE_POINTS} ep
    JOIN ${TABLES.EQUIPES} e ON ep.equipe_id = e.id
    WHERE ep.equipe_id = $1 AND ep.season = $2
  `,

  // Live Points: batch ownership lookup by NHL player IDs
  GET_BATCH_OWNERSHIP_BY_NHL_IDS: `
    SELECT j.nhl_player_id, j.nom, j.prenom, j.position,
           e.id as equipe_id, e.nom as equipe_nom
    FROM ${TABLES.JOUEURS} j
    LEFT JOIN ${TABLES.EQUIPE_JOUEURS} ej ON ej.joueur_id = j.id
    LEFT JOIN ${TABLES.EQUIPES} e ON ej.equipe_id = e.id
    WHERE j.nhl_player_id = ANY($1)
  `,
} as const;
