-- Ordre d'affichage des types de repêchage dans le filtre de la page Repêchage.
-- L'ordre chronologique (sort_year_offset/month/day) sert à trier les événements
-- dans l'historique d'un joueur ; il ne correspond pas à l'ordre voulu à l'écran.

ALTER TABLE types_repechage ADD COLUMN IF NOT EXISTS ordre INTEGER;

UPDATE types_repechage SET ordre = v.ordre
FROM (VALUES
  (2, 1),  -- Draft annuel
  (5, 2),  -- Draft de dispersion
  (3, 3),  -- Draft d'expansion
  (1, 4),  -- Ballotage de décembre
  (4, 5)   -- Ballotage de mars
) AS v(id, ordre)
WHERE types_repechage.id = v.id;
