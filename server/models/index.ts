// Schémas et constantes pour les modèles de données

export const TABLES = {
  EQUIPES: 'equipes',
  ECHANGES: 'echanges',
  PLAYERS: 'players',
  REPECHAGE: 'repechage',
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
} as const; 