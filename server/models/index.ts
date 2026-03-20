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
  API_STORE: 'api_store',
  ECHANGE_JOUEURS: 'echange_joueurs',
  MIS_AU_BALLOTAGE: 'mis_au_ballotage',
  TYPES_REPECHAGE: 'types_repechage',
  BLESSURES: 'blessures',
  ETAT_JOUEURS: 'etat_joueurs',
  EQUIPE_SEMAINE_POINTS: 'equipe_semaine_points',
  SERIES_PLAYOFFS: 'series_playoffs',
  SERIES_SEMAINE_BASELINE: 'series_semaine_baseline',
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
      e.id, e.date, e.equipe_source_id, e.equipe_destination_id, e.statut_confirmer,
      src.nom  AS equipe_source_nom,
      dest.nom AS equipe_destination_nom,
      COALESCE(array_agg(
        COALESCE(NULLIF(TRIM(CONCAT(j.prenom, ' ', j.nom)), ''), ej.joueur_nom_libre)
        ORDER BY (ej.joueur_id IS NULL), ej.id
      ) FILTER (WHERE ej.equipe_receptrice_id = e.equipe_source_id),
        ARRAY[]::text[]) AS joueurs_source,
      COALESCE(array_agg(
        COALESCE(NULLIF(TRIM(CONCAT(j.prenom, ' ', j.nom)), ''), ej.joueur_nom_libre)
        ORDER BY (ej.joueur_id IS NULL), ej.id
      ) FILTER (WHERE ej.equipe_receptrice_id = e.equipe_destination_id),
        ARRAY[]::text[]) AS joueurs_destination
    FROM ${TABLES.ECHANGES} e
    JOIN ${TABLES.EQUIPES} src  ON e.equipe_source_id      = src.id
    JOIN ${TABLES.EQUIPES} dest ON e.equipe_destination_id = dest.id
    LEFT JOIN ${TABLES.ECHANGE_JOUEURS} ej ON ej.echange_id = e.id
    LEFT JOIN ${TABLES.JOUEURS} j           ON ej.joueur_id  = j.id
    GROUP BY e.id, src.nom, dest.nom
    ORDER BY e.date DESC, e.id DESC
  `,
  GET_LATEST_ECHANGE: `
    SELECT
      e.id, e.date, e.equipe_source_id, e.equipe_destination_id, e.statut_confirmer,
      src.nom  AS equipe_source_nom,
      dest.nom AS equipe_destination_nom,
      COALESCE(array_agg(
        COALESCE(NULLIF(TRIM(CONCAT(j.prenom, ' ', j.nom)), ''), ej.joueur_nom_libre)
        ORDER BY (ej.joueur_id IS NULL), ej.id
      ) FILTER (WHERE ej.equipe_receptrice_id = e.equipe_source_id),
        ARRAY[]::text[]) AS joueurs_source,
      COALESCE(array_agg(
        COALESCE(NULLIF(TRIM(CONCAT(j.prenom, ' ', j.nom)), ''), ej.joueur_nom_libre)
        ORDER BY (ej.joueur_id IS NULL), ej.id
      ) FILTER (WHERE ej.equipe_receptrice_id = e.equipe_destination_id),
        ARRAY[]::text[]) AS joueurs_destination
    FROM ${TABLES.ECHANGES} e
    JOIN ${TABLES.EQUIPES} src  ON e.equipe_source_id      = src.id
    JOIN ${TABLES.EQUIPES} dest ON e.equipe_destination_id = dest.id
    LEFT JOIN ${TABLES.ECHANGE_JOUEURS} ej ON ej.echange_id = e.id
    LEFT JOIN ${TABLES.JOUEURS} j           ON ej.joueur_id  = j.id
    GROUP BY e.id, src.nom, dest.nom
    ORDER BY e.date DESC, e.id DESC
    LIMIT 1
  `,
  GET_LATEST_TRADE_BY_TEAM: `
    SELECT
      e.id, e.date, e.equipe_source_id, e.equipe_destination_id, e.statut_confirmer,
      src.nom  AS equipe_source_nom,
      dest.nom AS equipe_destination_nom,
      COALESCE(array_agg(
        COALESCE(NULLIF(TRIM(CONCAT(j.prenom, ' ', j.nom)), ''), ej.joueur_nom_libre)
        ORDER BY (ej.joueur_id IS NULL), ej.id
      ) FILTER (WHERE ej.equipe_receptrice_id = e.equipe_source_id),
        ARRAY[]::text[]) AS joueurs_source,
      COALESCE(array_agg(
        COALESCE(NULLIF(TRIM(CONCAT(j.prenom, ' ', j.nom)), ''), ej.joueur_nom_libre)
        ORDER BY (ej.joueur_id IS NULL), ej.id
      ) FILTER (WHERE ej.equipe_receptrice_id = e.equipe_destination_id),
        ARRAY[]::text[]) AS joueurs_destination
    FROM ${TABLES.ECHANGES} e
    JOIN ${TABLES.EQUIPES} src  ON e.equipe_source_id      = src.id
    JOIN ${TABLES.EQUIPES} dest ON e.equipe_destination_id = dest.id
    LEFT JOIN ${TABLES.ECHANGE_JOUEURS} ej ON ej.echange_id = e.id
    LEFT JOIN ${TABLES.JOUEURS} j           ON ej.joueur_id  = j.id
    WHERE e.equipe_source_id = $1 OR e.equipe_destination_id = $1
    GROUP BY e.id, src.nom, dest.nom
    ORDER BY e.date DESC
    LIMIT 5
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
    INSERT INTO ${TABLES.EQUIPE_POINTS} (equipe_id, season, attaque_points, defense_points, gardien_points, total_points, total_buts, total_matchs, last_update_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (equipe_id, season) DO UPDATE SET
      attaque_points = EXCLUDED.attaque_points,
      defense_points = EXCLUDED.defense_points,
      gardien_points = EXCLUDED.gardien_points,
      total_points = EXCLUDED.total_points,
      total_buts = EXCLUDED.total_buts,
      total_matchs = EXCLUDED.total_matchs,
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

  // Mis au ballotage (joueurs retirés avant draft/ballotage)
  GET_ALL_MIS_AU_BALLOTAGE: `
    SELECT
      m.id, m.annee, m.type_id,
      m.joueur_id, m.joueur_nom_libre,
      COALESCE(NULLIF(TRIM(CONCAT(j.prenom, ' ', j.nom)), ''), m.joueur_nom_libre) AS joueur_nom,
      e.id   AS equipe_id,
      e.nom  AS equipe_nom,
      tr.nom AS type_nom
    FROM ${TABLES.MIS_AU_BALLOTAGE} m
    JOIN ${TABLES.EQUIPES} e          ON m.equipe_id = e.id
    JOIN ${TABLES.TYPES_REPECHAGE} tr ON m.type_id   = tr.id
    LEFT JOIN ${TABLES.JOUEURS} j     ON m.joueur_id = j.id
    ORDER BY m.annee DESC, m.type_id, e.nom
  `,
  GET_MIS_AU_BALLOTAGE_BY_TYPE_AND_YEAR: `
    SELECT
      m.id, m.annee, m.type_id,
      m.joueur_id, m.joueur_nom_libre,
      COALESCE(NULLIF(TRIM(CONCAT(j.prenom, ' ', j.nom)), ''), m.joueur_nom_libre) AS joueur_nom,
      e.id   AS equipe_id,
      e.nom  AS equipe_nom,
      tr.nom AS type_nom
    FROM ${TABLES.MIS_AU_BALLOTAGE} m
    JOIN ${TABLES.EQUIPES} e          ON m.equipe_id = e.id
    JOIN ${TABLES.TYPES_REPECHAGE} tr ON m.type_id   = tr.id
    LEFT JOIN ${TABLES.JOUEURS} j     ON m.joueur_id = j.id
    WHERE m.type_id = $1 AND m.annee = $2
    ORDER BY e.nom, joueur_nom
  `,

  // API Store: persistent JSON snapshots
  GET_API_STORE: `
    SELECT json_response, last_update
    FROM ${TABLES.API_STORE}
    WHERE key = $1
  `,
  UPSERT_API_STORE: `
    INSERT INTO ${TABLES.API_STORE} (key, json_response, last_update)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE SET
      json_response = EXCLUDED.json_response,
      last_update   = NOW()
  `,

  // Choix de repêchage futurs
  GET_TEAM_DRAFT_PICKS: `
    SELECT
      cr.annee,
      cr.round,
      src.nom AS equipe_source_nom
    FROM choix_repechage cr
    LEFT JOIN equipes src ON cr.equipe_source_id = src.id
    WHERE cr.equipe_id = $1
    ORDER BY cr.annee ASC, cr.round ASC
  `,

  // Blessures (injuries)
  GET_ALL_INJURIES: `SELECT * FROM ${TABLES.BLESSURES}`,
  TRUNCATE_INJURIES: `TRUNCATE TABLE ${TABLES.BLESSURES}`,
  INSERT_INJURY: `
    INSERT INTO ${TABLES.BLESSURES} (nhl_player_id, statut, type_blessure, commentaire, date_retour, last_update)
    VALUES ($1, $2, $3, $4, $5, NOW())
  `,

  // Joueurs for injury name matching
  GET_ALL_JOUEURS_FOR_INJURY_MATCH: `SELECT nhl_player_id, nom, prenom FROM ${TABLES.JOUEURS}`,

  // Joueurs with position (for état snapshot)
  GET_ALL_JOUEURS_WITH_POSITION: `SELECT nhl_player_id, position FROM ${TABLES.JOUEURS}`,

  // État joueurs (hot/cold/normal)
  GET_ALL_ETAT: `SELECT * FROM ${TABLES.ETAT_JOUEURS}`,
  TRUNCATE_ETAT: `TRUNCATE TABLE ${TABLES.ETAT_JOUEURS}`,
  INSERT_ETAT: `
    INSERT INTO ${TABLES.ETAT_JOUEURS} (nhl_player_id, etat, points_5_matchs, victoires_5_matchs, blanchissages_5_matchs, save_pctg_5_matchs, derniers_matchs, last_update)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
  `,

  // Live Points: batch ownership lookup by NHL player IDs
  GET_BATCH_OWNERSHIP_BY_NHL_IDS: `
    SELECT j.nhl_player_id, j.nom, j.prenom, j.position, j.compte_points,
           e.id as equipe_id, e.nom as equipe_nom
    FROM ${TABLES.JOUEURS} j
    LEFT JOIN ${TABLES.EQUIPE_JOUEURS} ej ON ej.joueur_id = j.id
    LEFT JOIN ${TABLES.EQUIPES} e ON ej.equipe_id = e.id
    WHERE j.nhl_player_id = ANY($1)
  `,

  // Update compte_points flag: true for active top players, false for all others
  UPDATE_COMPTE_POINTS: `
    UPDATE ${TABLES.JOUEURS}
    SET compte_points = (nhl_player_id = ANY($1::int[]))
  `,

  // Series Playoffs
  GET_CURRENT_EQUIPE_POINTS_ALL: `
    SELECT ep.equipe_id, ep.season, ep.attaque_points, ep.defense_points,
           ep.gardien_points, ep.total_points, ep.total_buts, ep.total_matchs,
           e.nom as equipe_nom, e.division
    FROM ${TABLES.EQUIPE_POINTS} ep
    JOIN ${TABLES.EQUIPES} e ON ep.equipe_id = e.id
    WHERE ep.season = $1 AND e.active = true
    ORDER BY ep.total_points DESC
  `,
  GET_RANKINGS_BY_DIVISION_FOR_SERIES: `
    SELECT ep.equipe_id, ep.season, ep.total_points,
           e.nom as equipe_nom, e.division
    FROM ${TABLES.EQUIPE_POINTS} ep
    JOIN ${TABLES.EQUIPES} e ON ep.equipe_id = e.id
    WHERE e.division = $1 AND ep.season = $2 AND e.active = true
    ORDER BY ep.total_points DESC
  `,
  INSERT_SERIES: `
    INSERT INTO ${TABLES.SERIES_PLAYOFFS} (saison, ronde, division, position, equipe_a_id, equipe_b_id, gagnant_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (saison, ronde, position) DO UPDATE SET
      equipe_a_id = EXCLUDED.equipe_a_id,
      equipe_b_id = EXCLUDED.equipe_b_id,
      gagnant_id = EXCLUDED.gagnant_id
  `,
  UPDATE_SERIES_WINNER: `
    UPDATE ${TABLES.SERIES_PLAYOFFS}
    SET gagnant_id = $1
    WHERE saison = $2 AND ronde = $3 AND position = $4
  `,
  GET_SERIES_BY_SAISON: `
    SELECT
      sp.*,
      ea.nom as equipe_a_nom, ea.division as equipe_a_division,
      eb.nom as equipe_b_nom, eb.division as equipe_b_division,
      eg.nom as gagnant_nom
    FROM ${TABLES.SERIES_PLAYOFFS} sp
    LEFT JOIN ${TABLES.EQUIPES} ea ON sp.equipe_a_id = ea.id
    LEFT JOIN ${TABLES.EQUIPES} eb ON sp.equipe_b_id = eb.id
    LEFT JOIN ${TABLES.EQUIPES} eg ON sp.gagnant_id = eg.id
    WHERE sp.saison = $1
    ORDER BY sp.ronde, sp.position
  `,
  UPSERT_SEMAINE_BASELINE: `
    INSERT INTO ${TABLES.SERIES_SEMAINE_BASELINE}
      (equipe_id, saison, semaine, total_points, attaque_points, defense_points, gardien_points, total_matchs, snapshot_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (equipe_id, saison, semaine) DO UPDATE SET
      total_points = EXCLUDED.total_points,
      attaque_points = EXCLUDED.attaque_points,
      defense_points = EXCLUDED.defense_points,
      gardien_points = EXCLUDED.gardien_points,
      total_matchs = EXCLUDED.total_matchs,
      snapshot_at = NOW()
  `,
  GET_SEMAINE_BASELINE: `
    SELECT *
    FROM ${TABLES.SERIES_SEMAINE_BASELINE}
    WHERE saison = $1 AND semaine = $2
  `,
  UPSERT_SEMAINE_POINTS: `
    INSERT INTO ${TABLES.EQUIPE_SEMAINE_POINTS}
      (equipe_id, saison, semaine, debut_semaine, fin_semaine, attaque_points, defense_points, gardien_points, total_points, total_matchs, last_update_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
    ON CONFLICT (equipe_id, saison, semaine) DO UPDATE SET
      attaque_points = EXCLUDED.attaque_points,
      defense_points = EXCLUDED.defense_points,
      gardien_points = EXCLUDED.gardien_points,
      total_points = EXCLUDED.total_points,
      total_matchs = EXCLUDED.total_matchs,
      last_update_at = NOW()
  `,
  GET_SEMAINE_POINTS: `
    SELECT esp.*, e.nom as equipe_nom, e.division
    FROM ${TABLES.EQUIPE_SEMAINE_POINTS} esp
    JOIN ${TABLES.EQUIPES} e ON esp.equipe_id = e.id
    WHERE esp.saison = $1 AND esp.semaine = $2
  `,
  GET_SEMAINE_POINTS_MATCHS: `
    SELECT equipe_id, total_matchs
    FROM ${TABLES.EQUIPE_SEMAINE_POINTS}
    WHERE saison = $1 AND semaine = $2
  `,

  // Player history (trades, drafts, ballotage) by NHL player ID
  GET_PLAYER_TRADE_HISTORY: `
    SELECT
      e.id, e.date, e.equipe_source_id, e.equipe_destination_id, e.statut_confirmer,
      src.nom  AS equipe_source_nom,
      dest.nom AS equipe_destination_nom,
      COALESCE(array_agg(
        COALESCE(NULLIF(TRIM(CONCAT(jall.prenom, ' ', jall.nom)), ''), ejall.joueur_nom_libre)
        ORDER BY (ejall.joueur_id IS NULL), ejall.id
      ) FILTER (WHERE ejall.equipe_receptrice_id = e.equipe_source_id),
        ARRAY[]::text[]) AS joueurs_source,
      COALESCE(array_agg(
        COALESCE(NULLIF(TRIM(CONCAT(jall.prenom, ' ', jall.nom)), ''), ejall.joueur_nom_libre)
        ORDER BY (ejall.joueur_id IS NULL), ejall.id
      ) FILTER (WHERE ejall.equipe_receptrice_id = e.equipe_destination_id),
        ARRAY[]::text[]) AS joueurs_destination
    FROM ${TABLES.JOUEURS} j
    JOIN ${TABLES.ECHANGE_JOUEURS} ej_player ON ej_player.joueur_id = j.id
    JOIN ${TABLES.ECHANGES} e                ON e.id = ej_player.echange_id
    JOIN ${TABLES.EQUIPES} src               ON src.id = e.equipe_source_id
    JOIN ${TABLES.EQUIPES} dest              ON dest.id = e.equipe_destination_id
    LEFT JOIN ${TABLES.ECHANGE_JOUEURS} ejall ON ejall.echange_id = e.id
    LEFT JOIN ${TABLES.JOUEURS} jall          ON jall.id = ejall.joueur_id
    WHERE j.nhl_player_id = $1
    GROUP BY e.id, e.date, e.equipe_source_id, e.equipe_destination_id,
             e.statut_confirmer, src.nom, dest.nom
    ORDER BY e.date ASC, e.id ASC
  `,

  GET_PLAYER_DRAFT_HISTORY: `
    SELECT r.id, r.annee, r.round, r.rang, r.equipe_id,
           e.nom AS equipe_nom, r.type_id, tr.nom AS type_nom
    FROM repechages r
    JOIN ${TABLES.JOUEURS} j          ON r.joueur_id = j.id
    JOIN ${TABLES.EQUIPES} e          ON e.id = r.equipe_id
    JOIN ${TABLES.TYPES_REPECHAGE} tr ON tr.id = r.type_id
    WHERE j.nhl_player_id = $1
    ORDER BY r.annee ASC, r.type_id ASC, r.rang ASC
  `,

  GET_PLAYER_BALLOTAGE_HISTORY: `
    SELECT m.id, m.annee, m.equipe_id,
           e.nom AS equipe_nom, m.type_id, tr.nom AS type_nom
    FROM ${TABLES.MIS_AU_BALLOTAGE} m
    JOIN ${TABLES.JOUEURS} j          ON m.joueur_id = j.id
    JOIN ${TABLES.EQUIPES} e          ON e.id = m.equipe_id
    JOIN ${TABLES.TYPES_REPECHAGE} tr ON tr.id = m.type_id
    WHERE j.nhl_player_id = $1
    ORDER BY m.annee ASC, m.type_id ASC
  `,
} as const;
