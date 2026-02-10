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
} as const;

export const QUERIES = {
  // Équipes
  GET_ALL_TEAMS: `SELECT * FROM ${TABLES.EQUIPES}`,
  GET_ACTIVE_TEAMS: `SELECT * FROM ${TABLES.EQUIPES} WHERE active = true`,
  GET_TEAM_BY_ID: `SELECT * FROM ${TABLES.EQUIPES} WHERE id = $1`,

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
  GET_RECENT_ECHANGES: `
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
    LIMIT 10
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
} as const;
