-- Pré-remplissage du draft annuel d'octobre 2026 (annee = 2027, type 2).
-- Ordre = classement général 2025-26, pire équipe en premier, même ordre à chaque ronde.
-- Le détenteur de chaque choix vient de choix_repechage (annee 2026).
INSERT INTO repechages (annee, type_id, equipe_id, equipe_source_id, joueur, joueur_id, rang, round)
SELECT
  2027,
  2,
  cr.equipe_id,
  CASE WHEN cr.equipe_id <> o.origine THEN o.origine END,
  NULL,
  NULL,
  (cr.round - 1) * 10 + o.pos,
  cr.round
FROM (VALUES
  (1, 13),  -- Boys de Sherbrooke
  (2, 14),  -- L'Escouade de Beauport
  (3, 5),   -- Paramédics de Rimouski
  (4, 12),  -- Nordiques de Forestville
  (5, 11),  -- Winners de Trois-Rivières
  (6, 10),  -- Suceurs de Pabst de Verdun
  (7, 9),   -- Bélugas de Chicoutimi
  (8, 3),   -- Délinquants de Port-Cartier
  (9, 4),   -- Dream Team de Sorel-Tracy
  (10, 7)   -- Enculés de Westmount
) AS o(pos, origine)
JOIN choix_repechage cr
  ON cr.annee = 2026
 AND COALESCE(cr.equipe_source_id, cr.equipe_id) = o.origine;
