# Documentation de la base de données Budbud (branche développement)


## Généralités
- **Base de données** : `budbud`
- **Schéma principal** : `public`
- **Branche** : `development`

---

## Tables et structure détaillée

### 1. `echanges`

#### Colonnes
| Nom                   | Type     | Null | Par défaut                                      |
|-----------------------|----------|------|-------------------------------------------------|
| id                    | integer  | Non  | nextval('echanges_id_seq'::regclass)            |
| date                  | date     | Non  | -                                               |
| equipe_source_id      | integer  | Non  | -                                               |
| equipe_destination_id | integer  | Non  | -                                               |
| statut_confirmer      | boolean  | Oui  | false                                           |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_source_id)` → `equipes(id)`
- `FOREIGN KEY (equipe_destination_id)` → `equipes(id)`

#### Notes
- `details` : **SUPPRIMÉ** — remplacé par la table de jonction `echange_joueurs`

---

### 2. `echange_joueurs` (Table de jonction)

Table de jonction reliant les échanges aux joueurs reçus par chaque équipe. Remplace la colonne `echanges.details`.

#### Colonnes
| Nom                   | Type    | Null | Par défaut                                           |
|-----------------------|---------|------|------------------------------------------------------|
| id                    | integer | Non  | nextval('echange_joueurs_id_seq'::regclass)          |
| echange_id            | integer | Non  | -                                                    |
| equipe_receptrice_id  | integer | Non  | -                                                    |
| joueur_id             | integer | Oui  | -                                                    |
| joueur_nom_libre      | text    | Oui  | -                                                    |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (echange_id)` → `echanges(id)`
- `FOREIGN KEY (equipe_receptrice_id)` → `equipes(id)`
- `FOREIGN KEY (joueur_id)` → `joueurs(id)`

#### Notes
- `joueur_nom_libre` : pour les joueurs non enregistrés dans le pool (picks de repêchage, etc.)
- `equipe_receptrice_id` : l'équipe qui **reçoit** ce joueur dans l'échange

---

### 3. `equipes`

#### Colonnes
| Nom       | Type              | Null | Par défaut                          |
|-----------|-------------------|------|-------------------------------------|
| id        | integer           | Non  | nextval('equipes_id_seq'::regclass) |
| nom       | character varying | Non  | -                                   |
| nom_court | character varying | Oui  | -                                   |
| active    | boolean           | Oui  | true                                |
| division  | character varying | Oui  | -                                   |
| dg_name   | text              | Oui  | -                                   |

#### Notes
- `active = false` : équipes historiques hors du pool actuel (ex : Limoilou, id=15)
- `nom_court` : nom court affiché dans la page Bilan

#### Contraintes
- `PRIMARY KEY (id)`

#### Notes
- `nhl_player_ids` : **SUPPRIMÉ** — remplacé par la table de jonction `equipe_joueurs`

---

### 4. `equipe_joueurs` (Table de jonction)

Table de jonction reliant les équipes aux joueurs (remplace `equipes.nhl_player_ids`).

#### Colonnes
| Nom        | Type    | Null | Par défaut                                      |
|------------|---------|------|-------------------------------------------------|
| id         | integer | Non  | nextval('equipe_joueurs_id_seq'::regclass)      |
| equipe_id  | integer | Non  | -                                               |
| joueur_id  | integer | Non  | -                                               |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
- `FOREIGN KEY (joueur_id)` → `joueurs(id)`
- `UNIQUE (joueur_id)` — un joueur ne peut être que sur une seule équipe

---

### 5. `joueurs`

#### Colonnes
| Nom            | Type              | Null | Par défaut                                      |
|----------------|-------------------|------|-------------------------------------------------|
| id             | integer           | Non  | nextval('joueurs_id_seq'::regclass)             |
| nhl_player_id  | integer           | Non  | -                                               |
| nom            | character varying | Non  | -                                               |
| prenom         | character varying | Non  | -                                               |
| position       | character varying | Non  | -                                               |
| created_at     | timestamp         | Oui  | NOW()                                           |
| updated_at     | timestamp         | Oui  | NOW()                                           |
| compte_points  | boolean           | Non  | false                                           |

#### Contraintes
- `PRIMARY KEY (id)`
- `UNIQUE (nhl_player_id)`

#### Notes
- `position` : valeurs possibles `'C'`, `'LW'`, `'RW'`, `'D'`, `'G'`
- `compte_points` : si `false`, le joueur ne compte pas pour le PJ/PTS du leaderboard live — mis à jour dynamiquement par `UPDATE_COMPTE_POINTS`

---

### 6. `equipe_points`

Stocke les points cumulés par équipe par saison, décomposés par catégorie.

#### Colonnes
| Nom              | Type    | Null | Par défaut |
|------------------|---------|------|------------|
| id               | integer | Non  | -          |
| equipe_id        | integer | Oui  | -          |
| season           | text    | Non  | -          |
| attaque_points   | integer | Non  | 0          |
| defense_points   | integer | Non  | 0          |
| gardien_points   | integer | Non  | 0          |
| total_points     | integer | Non  | 0          |
| total_buts       | integer | Non  | 0          |
| total_matchs     | integer | Non  | 0          |
| last_update_at   | date    | Oui  | now()      |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
- `UNIQUE (equipe_id, season)`

#### Notes
- `season` : format `'20242025'`
- `total_points` = somme de `attaque_points + defense_points + gardien_points`

---

### 7. `repechages`

#### Colonnes
| Nom        | Type              | Null | Par défaut                                      |
|------------|-------------------|------|-------------------------------------------------|
| id         | integer           | Non  | nextval('repechages_id_seq'::regclass)          |
| annee      | integer           | Non  | -                                               |
| type_id    | integer           | Oui  | -                                               |
| equipe_id  | integer           | Oui  | -                                               |
| joueur     | character varying | Oui  | -                                               |
| joueur_id  | integer           | Oui  | -                                               |
| rang       | integer           | Non  | -                                               |
| round      | integer           | Oui  | -                                               |
| equipe_source_id | integer     | Oui  | -                                               |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (type_id)` → `types_repechage(id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
- `FOREIGN KEY (joueur_id)` → `joueurs(id)`
- `FOREIGN KEY (equipe_source_id)` → `equipes(id)`

#### Notes
- `annee` suit `types_repechage.sort_year_offset` : le draft annuel d'octobre 2026 est `annee = 2027`
- `joueur` : `NULL` tant qu'un choix du draft en cours n'a pas été fait (choix pré-remplis, voir `server/migrations/seed_draft_2027.sql`)
- `equipe_source_id` : équipe d'origine d'un choix échangé — `NULL` pour l'historique et les choix non échangés

---

### 8. `choix_repechage`

Stocke les choix de repêchage futurs détenus par chaque équipe (picks échangeables).

#### Colonnes
| Nom              | Type    | Null | Par défaut                                        |
|------------------|---------|------|---------------------------------------------------|
| id               | integer | Non  | nextval('choix_repechage_id_seq'::regclass)       |
| annee            | integer | Non  | -                                                 |
| round            | integer | Non  | -                                                 |
| equipe_id        | integer | Non  | -                                                 |
| equipe_source_id | integer | Oui  | -                                                 |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
- `FOREIGN KEY (equipe_source_id)` → `equipes(id)`

#### Notes
- `equipe_id` : équipe qui **détient** le pick
- `equipe_source_id` : équipe d'origine du pick (si acquis par échange)

---

### 9. `types_repechage`

#### Colonnes
| Nom   | Type              | Null | Par défaut                                      |
|-------|-------------------|------|-------------------------------------------------|
| id    | integer           | Non  | nextval('types_repechage_id_seq'::regclass)     |
| nom              | character varying | Non  | -                                               |
| sort_year_offset | integer           | Non  | 0                                               |
| sort_month       | integer           | Non  | 1                                               |
| sort_day         | integer           | Non  | 1                                               |
| ordre            | integer           | Oui  | -                                               |

#### Données de référence
| id | nom                   | sort_year_offset | sort_month | sort_day | ordre |
|----|-----------------------|------------------|------------|----------|-------|
| 1  | Ballotage de décembre | -1               | 12         | 1        | 4     |
| 2  | Draft annuel          | -1               | 10         | 3        | 1     |
| 3  | Draft d'expansion     | -1               | 6          | 20       | 3     |
| 4  | Ballotage de mars     | 0                | 3          | 1        | 5     |
| 5  | Draft de dispersion   | -1               | 6          | 1        | 2     |

#### Notes
- `sort_year_offset` / `sort_month` / `sort_day` : ordre **chronologique**, utilisé pour situer les événements dans l'historique d'un joueur
- `ordre` : ordre **d'affichage** du filtre de la page Repêchage (`GET /api/repechage/types`) — indépendant de la chronologie ; un type sans `ordre` passe à la fin

---

### 10. `trophees`

#### Colonnes
| Nom   | Type              | Null | Par défaut                                      |
|-------|-------------------|------|-------------------------------------------------|
| id    | integer           | Non  | nextval('trophees_id_seq'::regclass)            |
| nom   | character varying | Non  | -                                               |

#### Données de référence
| id | nom      |
|----|----------|
| 1  | Général  |
| 2  | Attaque  |
| 3  | Défense  |
| 4  | Gardien  |
| 5  | Playoffs |

---

### 11. `trophee_gagnants`

#### Colonnes
| Nom        | Type    | Null | Par défaut                                      |
|------------|---------|------|-------------------------------------------------|
| id         | integer | Non  | nextval('trophee_gagnants_id_seq'::regclass)    |
| trophee_id | integer | Oui  | -                                               |
| annee      | integer | Non  | -                                               |
| equipe_id  | integer | Oui  | -                                               |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (trophee_id)` → `trophees(id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`

---

### 12. `mis_au_ballotage`

Trace les joueurs retirés par une équipe avant chaque événement de repêchage.

#### Colonnes
| Nom               | Type    | Null | Par défaut                                           |
|-------------------|---------|------|------------------------------------------------------|
| id                | integer | Non  | nextval('mis_au_ballotage_id_seq'::regclass)         |
| equipe_id         | integer | Non  | -                                                    |
| joueur_id         | integer | Oui  | -                                                    |
| joueur_nom_libre  | text    | Oui  | -                                                    |
| annee             | integer | Non  | -                                                    |
| type_id           | integer | Non  | -                                                    |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
- `FOREIGN KEY (joueur_id)` → `joueurs(id)`
- `FOREIGN KEY (type_id)` → `types_repechage(id)`

#### Notes
- Pour un `(annee, type_id)` donné : `mis_au_ballotage` = qui est parti, `repechages` = qui est arrivé

---

### 13. `api_store`

Stocke des snapshots JSON persistants, indexés par clé textuelle. Conçu pour l'UPSERT — une seule ligne par clé.

#### Colonnes
| Nom           | Type        | Null | Par défaut                              |
|---------------|-------------|------|-----------------------------------------|
| id            | integer     | Non  | nextval('api_store_id_seq'::regclass)   |
| key           | text        | Non  | -                                       |
| json_response | jsonb       | Non  | -                                       |
| updated_at    | timestamptz | Non  | NOW()                                   |

#### Contraintes
- `PRIMARY KEY (id)`
- `UNIQUE (key)`

#### Clés utilisées
| Clé               | Contenu                                                               | Mise à jour              |
|-------------------|-----------------------------------------------------------------------|--------------------------|
| `live_points`     | `{ topPlayers, teamLeaderboard, gamesCount, liveGamesCount }`         | Cron nightly (après minuit UTC) |
| `classement_prev` | `{ teams: { [equipe_id]: total_points }, updatedAt }`                 | Cron `POST /api/points/update` |
| `draft_day`       | `{ actif: boolean, annee: number }`                                   | À la main — `actif = true` remplace la home par le tableau du repêchage |

#### Notes
- `classement_prev` : baseline des points cumulés avant la journée de matchs — utilisé pour calculer le diff journalier dans `live_points`

---

### 14. `blessures`

Snapshot des blessures des joueurs du pool, alimenté depuis ESPN et matché aux joueurs via `nhl_player_id`.

#### Colonnes
| Nom             | Type        | Null | Par défaut                                    |
|-----------------|-------------|------|-----------------------------------------------|
| id              | integer     | Non  | nextval('blessures_id_seq'::regclass)         |
| nhl_player_id   | integer     | Non  | -                                             |
| statut          | varchar     | Non  | -                                             |
| type_blessure   | text        | Oui  | -                                             |
| commentaire     | text        | Oui  | -                                             |
| date_retour     | date        | Oui  | -                                             |
| last_update     | timestamptz | Non  | now()                                         |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (nhl_player_id)` → `joueurs(nhl_player_id)`
- `UNIQUE (nhl_player_id)`

#### Notes
- Alimentée par `POST /api/snapshot/injuries`
- `statut` : ex. `'injured'`, `'day-to-day'`

---

### 15. `etat_joueurs`

Snapshot de l'état de forme (hot/cold/normal) des joueurs du pool sur les 5 derniers matchs.

#### Colonnes
| Nom                    | Type        | Null | Par défaut      |
|------------------------|-------------|------|-----------------|
| id                     | integer     | Non  | nextval(...)    |
| nhl_player_id          | integer     | Non  | -               |
| etat                   | varchar     | Non  | -               |
| points_5_matchs        | integer     | Oui  | -               |
| victoires_5_matchs     | integer     | Oui  | -               |
| blanchissages_5_matchs | integer     | Oui  | -               |
| save_pctg_5_matchs     | numeric     | Oui  | -               |
| derniers_matchs        | jsonb       | Non  | '[]'            |
| last_update            | timestamptz | Non  | now()           |

#### Contraintes
- `PRIMARY KEY (id)`
- `UNIQUE (nhl_player_id)`
- `CHECK (etat IN ('hot', 'cold', 'normal'))`

#### Notes
- Alimentée par `POST /api/snapshot/etat`
- `etat` : `'hot'`, `'cold'`, ou `'normal'`
- `derniers_matchs` : tableau JSON des stats des 5 dernières parties

---

### 16. `series_playoffs`

Bracket des séries éliminatoires du pool. Une ligne par affrontement (QF, SF, Finale).

#### Colonnes
| Nom          | Type    | Null | Par défaut                                         |
|--------------|---------|------|----------------------------------------------------|
| id           | integer | Non  | nextval('series_playoffs_id_seq'::regclass)        |
| saison       | text    | Non  | -                                                  |
| ronde        | integer | Non  | -                                                  |
| division     | text    | Oui  | -                                                  |
| position     | integer | Non  | -                                                  |
| equipe_a_id  | integer | Oui  | -                                                  |
| equipe_b_id  | integer | Oui  | -                                                  |
| gagnant_id   | integer | Oui  | -                                                  |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_a_id)` → `equipes(id)`
- `FOREIGN KEY (equipe_b_id)` → `equipes(id)`
- `FOREIGN KEY (gagnant_id)` → `equipes(id)`
- `UNIQUE (saison, ronde, position)`

#### Notes
- `ronde` : `1` = QF, `2` = SF, `3` = Finale
- `position` : 1–4 = QF, 5–6 = SF, 7 = Finale
- `division` : `'nord'`, `'sud'`, ou `null` (Finale)
- Initialisé par `POST /api/series/initialize`

---

### 17. `equipe_semaine_points`

Points accumulés par équipe pendant chaque semaine des séries. Calculé comme diff `equipe_points - series_semaine_baseline`.

#### Colonnes
| Nom              | Type        | Null | Par défaut   |
|------------------|-------------|------|--------------|
| id               | integer     | Non  | nextval(...) |
| equipe_id        | integer     | Oui  | -            |
| saison           | text        | Non  | -            |
| semaine          | integer     | Non  | -            |
| debut_semaine    | date        | Non  | -            |
| fin_semaine      | date        | Non  | -            |
| attaque_points   | integer     | Non  | 0            |
| defense_points   | integer     | Non  | 0            |
| gardien_points   | integer     | Non  | 0            |
| total_points     | integer     | Non  | 0            |
| total_buts       | integer     | Non  | 0            |
| total_matchs     | integer     | Non  | 0            |
| last_update_at   | timestamptz | Oui  | now()        |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id) ON DELETE CASCADE`
- `UNIQUE (equipe_id, saison, semaine)`

#### Notes
- Mise à jour par `updateDailySeries()` appelé depuis `POST /api/snapshot/live-points` si une ronde est active
- `semaine` : `1` = QF, `2` = SF, `3` = Finale

---

### 18. `series_semaine_baseline`

Snapshot des points cumulés (`equipe_points`) au début de chaque semaine de playoffs. Sert de baseline pour calculer les points de la semaine.

#### Colonnes
| Nom              | Type        | Null | Par défaut   |
|------------------|-------------|------|--------------|
| id               | integer     | Non  | nextval(...) |
| equipe_id        | integer     | Oui  | -            |
| saison           | text        | Non  | -            |
| semaine          | integer     | Non  | -            |
| total_points     | integer     | Non  | 0            |
| attaque_points   | integer     | Non  | 0            |
| defense_points   | integer     | Non  | 0            |
| gardien_points   | integer     | Non  | 0            |
| total_buts       | integer     | Non  | 0            |
| total_matchs     | integer     | Non  | 0            |
| snapshot_at      | timestamptz | Oui  | now()        |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id) ON DELETE CASCADE`
- `UNIQUE (equipe_id, saison, semaine)`

#### Notes
- Créé automatiquement par `snapshotWeekBaseline()` lors de `POST /api/series/initialize` (semaine 1) et `POST /api/series/resolve-round` (semaines 2 et 3)
- Points semaine = `equipe_semaine_points - series_semaine_baseline`

---

### 19. `listes_classement`

Listes de classement publiques affichées sur la home du jour du repêchage (Pronman U23, top 200 fantasy, ...). Importées avec `npm run import:liste -w server -- <fichier.json>` (fichiers dans `server/data/listes/`).

#### Colonnes
| Nom       | Type    | Null | Par défaut                                     |
|-----------|---------|------|------------------------------------------------|
| id        | integer | Non  | nextval('listes_classement_id_seq'::regclass)  |
| nom       | text    | Non  | -                                              |
| auteur    | text    | Oui  | -                                              |
| publie_le | date    | Oui  | -                                              |
| ordre     | integer | Non  | 0                                              |

---

### 20. `liste_classement_joueurs`

#### Colonnes
| Nom           | Type       | Null | Par défaut                                           |
|---------------|------------|------|------------------------------------------------------|
| id            | integer    | Non  | nextval('liste_classement_joueurs_id_seq'::regclass) |
| liste_id      | integer    | Non  | -                                                    |
| rang          | integer    | Non  | -                                                    |
| nom           | text       | Non  | -                                                    |
| position      | varchar(2) | Non  | -                                                    |
| equipe_nhl    | text       | Oui  | -                                                    |
| tier          | text       | Oui  | -                                                    |
| nhl_player_id | integer    | Oui  | -                                                    |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (liste_id)` → `listes_classement(id) ON DELETE CASCADE`
- `UNIQUE (liste_id, rang)`

#### Notes
- `nhl_player_id` n'est pas une FK : un prospect peut ne pas être dans `joueurs`. Le propriétaire est déduit via `joueurs.nhl_player_id` → `equipe_joueurs`, ou via le choix du draft en cours (`repechages.joueur_id`)

---

## Relations entre les tables

- `echanges` → `equipes` (equipe_source_id, equipe_destination_id)
- `echange_joueurs` → `echanges` ON DELETE CASCADE
- `echange_joueurs` → `equipes` (equipe_receptrice_id)
- `echange_joueurs` → `joueurs` ON DELETE SET NULL
- `equipe_joueurs` → `equipes` + `joueurs` (junction roster)
- `equipe_points` → `equipes`
- `repechages` → `types_repechage`, `equipes` (equipe_id + equipe_source_id), `joueurs`
- `liste_classement_joueurs` → `listes_classement` ON DELETE CASCADE
- `choix_repechage` → `equipes` (equipe_id + equipe_source_id)
- `trophee_gagnants` → `trophees`, `equipes`
- `mis_au_ballotage` → `equipes`, `joueurs`, `types_repechage`
- `series_playoffs` → `equipes` (equipe_a_id, equipe_b_id, gagnant_id)
- `equipe_semaine_points` → `equipes`
- `series_semaine_baseline` → `equipes`

---

*Dernière mise à jour : avril 2026 — correction contraintes FK (suppression ON DELETE CASCADE/SET NULL erronés sur `echange_joueurs`, `equipe_joueurs`, `repechages`, `mis_au_ballotage`), ajout contraintes manquantes (`blessures` FK+UNIQUE, `etat_joueurs` CHECK+UNIQUE, `series_playoffs` UNIQUE), correction `joueurs.compte_points` default false/NOT NULL, ajout colonnes `types_repechage.sort_*`, ajout type id=5 « Draft de dispersion »*
