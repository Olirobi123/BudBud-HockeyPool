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
- `FOREIGN KEY (echange_id)` → `echanges(id) ON DELETE CASCADE`
- `FOREIGN KEY (equipe_receptrice_id)` → `equipes(id)`
- `FOREIGN KEY (joueur_id)` → `joueurs(id) ON DELETE SET NULL`
- `CHECK (joueur_id IS NOT NULL OR joueur_nom_libre IS NOT NULL)`

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
| active    | boolean           | Oui  | true                                |
| division  | character varying | Oui  | -                                   |
| dg_name   | text              | Oui  | -                                   |

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
- `FOREIGN KEY (equipe_id)` → `equipes(id) ON DELETE CASCADE`
- `FOREIGN KEY (joueur_id)` → `joueurs(id) ON DELETE CASCADE`
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
| compte_points  | boolean           | Oui  | true                                            |

#### Contraintes
- `PRIMARY KEY (id)`
- `UNIQUE (nhl_player_id)`

#### Notes
- `position` : valeurs possibles `'C'`, `'LW'`, `'RW'`, `'D'`, `'G'`
- `compte_points` : si `false`, le joueur ne compte pas pour le PJ/PTS du leaderboard live (ex. : joueur échangé en cours de saison)

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
| joueur     | character varying | Non  | -                                               |
| joueur_id  | integer           | Oui  | -                                               |
| rang       | integer           | Non  | -                                               |
| round      | integer           | Oui  | -                                               |

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (type_id)` → `types_repechage(id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
- `FOREIGN KEY (joueur_id)` → `joueurs(id) ON DELETE SET NULL`

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
| nom   | character varying | Non  | -                                               |

#### Données de référence
| id | nom                   |
|----|-----------------------|
| 1  | Ballotage de décembre |
| 2  | Draft annuel          |
| 3  | Draft d'expansion     |
| 4  | Ballotage de mars     |

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
- `FOREIGN KEY (joueur_id)` → `joueurs(id) ON DELETE SET NULL`
- `FOREIGN KEY (type_id)` → `types_repechage(id)`
- `CHECK (joueur_id IS NOT NULL OR joueur_nom_libre IS NOT NULL)`

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
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
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
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
- `UNIQUE (equipe_id, saison, semaine)`

#### Notes
- Créé automatiquement par `snapshotWeekBaseline()` lors de `POST /api/series/initialize` (semaine 1) et `POST /api/series/resolve-round` (semaines 2 et 3)
- Points semaine = `equipe_semaine_points - series_semaine_baseline`

---

## Relations entre les tables

- `echanges` → `equipes` (equipe_source_id, equipe_destination_id)
- `echange_joueurs` → `echanges` ON DELETE CASCADE
- `echange_joueurs` → `equipes` (equipe_receptrice_id)
- `echange_joueurs` → `joueurs` ON DELETE SET NULL
- `equipe_joueurs` → `equipes` + `joueurs` (junction roster)
- `equipe_points` → `equipes`
- `repechages` → `types_repechage`, `equipes`, `joueurs`
- `choix_repechage` → `equipes` (equipe_id + equipe_source_id)
- `trophee_gagnants` → `trophees`, `equipes`
- `mis_au_ballotage` → `equipes`, `joueurs`, `types_repechage`
- `series_playoffs` → `equipes` (equipe_a_id, equipe_b_id, gagnant_id)
- `equipe_semaine_points` → `equipes`
- `series_semaine_baseline` → `equipes`

---

*Dernière mise à jour : mars 2026 — ajout tables playoffs (`series_playoffs`, `equipe_semaine_points`, `series_semaine_baseline`), `blessures`, `etat_joueurs`, `choix_repechage`; colonnes `joueurs.compte_points`, `equipe_points.total_buts/total_matchs`; clé `classement_prev` dans `api_store`*
