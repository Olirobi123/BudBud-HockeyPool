# Documentation de la base de données Budbud (branche développement)


## Généralités
- **Base de données** : `budbud`
- **Schéma principal** : `public`
- **Branche** : `development`

---

## Tables et structure détaillée

### 1. `echanges`
- **Taille de la table** : 8192 bytes
- **Taille des index** : 24 kB
- **Taille totale** : 32 kB

#### Colonnes
| Nom                   | Type     | Null | Par défaut                                      |
|-----------------------|----------|------|-------------------------------------------------|
| id                    | integer  | Non  | nextval('echanges_id_seq'::regclass)            |
| date                  | date     | Non  | -                                               |
| equipe_source_id      | integer  | Non  | -                                               |
| equipe_destination_id | integer  | Non  | -                                               |
| statut_confirmer      | boolean  | Oui  | false                                           |

#### Index
- `echanges_pkey` (16 kB) : UNIQUE sur `id`
- `idx_echanges_date` : Index sur `date DESC` pour les tris chronologiques

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_source_id)` → `equipes(id)`
- `FOREIGN KEY (equipe_destination_id)` → `equipes(id)`

#### Notes
- `details` : **SUPPRIMÉ** — remplacé par la table de jonction `echange_joueurs`

---

### 2. `echange_joueurs` (Table de jonction)

Table de jonction reliant les échanges aux joueurs reçus par chaque équipe. Remplace la colonne `echanges.details` (texte délimité).

#### Colonnes
| Nom                   | Type    | Null | Par défaut                                           |
|-----------------------|---------|------|------------------------------------------------------|
| id                    | integer | Non  | nextval('echange_joueurs_id_seq'::regclass)          |
| echange_id            | integer | Non  | -                                                    |
| equipe_receptrice_id  | integer | Non  | -                                                    |
| joueur_id             | integer | Oui  | -                                                    |
| joueur_nom_libre      | text    | Oui  | -                                                    |

#### Index
- `echange_joueurs_pkey` : UNIQUE sur `id`
- `idx_echange_joueurs_echange_id` : Index sur `echange_id` pour les jointures
- `idx_echange_joueurs_joueur_id` : Index partiel sur `joueur_id WHERE joueur_id IS NOT NULL`

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (echange_id)` → `echanges(id) ON DELETE CASCADE`
- `FOREIGN KEY (equipe_receptrice_id)` → `equipes(id)`
- `FOREIGN KEY (joueur_id)` → `joueurs(id) ON DELETE SET NULL`
- `CHECK (joueur_id IS NOT NULL OR joueur_nom_libre IS NOT NULL)` — au moins un des deux doit être renseigné

#### Notes
- `joueur_id` : Lien vers `joueurs` quand le joueur est enregistré dans le pool
- `joueur_nom_libre` : Nom textuel libre pour les joueurs non enregistrés (picks de repêchage, joueurs hors-pool)
- `equipe_receptrice_id` : L'équipe qui **reçoit** ce joueur dans l'échange

---

### 4. `equipes`
- **Taille de la table** : 8192 bytes
- **Taille des index** : 24 kB
- **Taille totale** : 32 kB

#### Colonnes
| Nom       | Type              | Null | Par défaut                          |
|-----------|-------------------|------|-------------------------------------|
| id        | integer           | Non  | nextval('equipes_id_seq'::regclass) |
| nom       | character varying | Non  | -                                   |
| active    | boolean           | Oui  | true                                |
| division  | character varying | Oui  | -                                   |
| dg_name   | text              | Oui  | -                                   |

#### Index
- `equipes_pkey` (16 kB) : UNIQUE sur `id`

#### Contraintes
- `PRIMARY KEY (id)`

#### Notes
- `division` : Division du pool à laquelle appartient l'équipe
- `dg_name` : Nom du directeur général (DG) de l'équipe dans le pool
- `nhl_player_ids` : **SUPPRIMÉ** — ancienne colonne tableau remplacée par la table de jonction `equipe_joueurs`

---

### 5. `repechages`
- **Taille de la table** : 16 kB
- **Taille des index** : 64 kB
- **Taille totale** : 80 kB

#### Colonnes
| Nom        | Type                | Null | Par défaut                                      |
|------------|---------------------|------|-------------------------------------------------|
| id         | integer             | Non  | nextval('repechages_id_seq'::regclass)          |
| annee      | integer             | Non  | -                                               |
| type_id    | integer             | Oui  | -                                               |
| equipe_id  | integer             | Oui  | -                                               |
| joueur     | character varying   | Non  | -                                               |
| joueur_id  | integer             | Oui  | -                                               |
| rang       | integer             | Non  | -                                               |
| round      | integer             | Oui  | -                                               |

#### Index
- `repechages_pkey` (16 kB) : UNIQUE sur `id`
- `idx_repechages_joueur_id` : Index sur `joueur_id` pour les jointures avec `joueurs`

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (type_id)` → `types_repechage(id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
- `FOREIGN KEY (joueur_id)` → `joueurs(id) ON DELETE SET NULL`

#### Notes
- `joueur` : Colonne VARCHAR conservée pour compatibilité ascendante (peut être dépréciée plus tard)
- `joueur_id` : Lien vers la table `joueurs` pour une meilleure intégrité des données

---

### 6. `trophee_gagnants`
- **Taille de la table** : 8192 bytes
- **Taille des index** : 16 kB
- **Taille totale** : 24 kB

#### Colonnes
| Nom        | Type                | Null | Par défaut                                      |
|------------|---------------------|------|-------------------------------------------------|
| id         | integer             | Non  | nextval('trophee_gagnants_id_seq'::regclass)    |
| trophee_id | integer             | Oui  | -                                               |
| annee      | integer             | Non  | -                                               |
| equipe_id  | integer             | Oui  | -                                               |

#### Index
- `trophee_gagnants_pkey` (8192 bytes) : UNIQUE sur `id`

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (trophee_id)` → `trophees(id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`

---

### 7. `trophees`
- **Taille de la table** : 8192 bytes
- **Taille des index** : 16 kB
- **Taille totale** : 24 kB

#### Colonnes
| Nom   | Type                | Null | Par défaut                                      |
|-------|---------------------|------|-------------------------------------------------|
| id    | integer             | Non  | nextval('trophees_id_seq'::regclass)            |
| nom   | character varying   | Non  | -                                               |

#### Index
- `trophees_pkey` (8192 bytes) : UNIQUE sur `id`

#### Contraintes
- `PRIMARY KEY (id)`

#### Données initiales
| id | nom      |
|----|----------|
| 1  | Général  |
| 2  | Attaque  |
| 3  | Défense  |
| 4  | Gardien  |
| 5  | Playoffs |

---

### 8. `equipe_joueurs` (Table de jonction)
- **Taille de la table** : 16 kB
- **Taille des index** : 88 kB
- **Taille totale** : 104 kB

Table de jonction reliant les equipes aux joueurs (remplace `equipes.nhl_player_ids`).

#### Colonnes
| Nom        | Type    | Null | Par defaut                                      |
|------------|---------|------|-------------------------------------------------|
| id         | integer | Non  | nextval('equipe_joueurs_id_seq'::regclass)      |
| equipe_id  | integer | Non  | -                                               |
| joueur_id  | integer | Non  | -                                               |

#### Index
- `equipe_joueurs_pkey` (16 kB) : UNIQUE sur `id`
- `equipe_joueurs_joueur_id_key` (16 kB) : UNIQUE sur `joueur_id`
- `idx_equipe_joueurs_equipe_id` (16 kB) : Index sur `equipe_id` pour les recherches par equipe
- `idx_equipe_joueurs_joueur_id` (16 kB) : Index sur `joueur_id` pour les recherches par joueur

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE CASCADE`
- `FOREIGN KEY (joueur_id) REFERENCES joueurs(id) ON DELETE CASCADE`
- `UNIQUE (joueur_id)` - Un joueur ne peut etre que sur une equipe

#### Notes
- Remplace l'approche par tableau `equipes.nhl_player_ids`
- Permet des jointures efficaces pour recuperer les effectifs
- La contrainte UNIQUE sur `joueur_id` garantit qu'un joueur n'est que sur une seule equipe

---

### 9. `joueurs`
- **Taille de la table** : 24 kB
- **Taille des index** : 96 kB
- **Taille totale** : 120 kB

#### Colonnes
| Nom            | Type                | Null | Par défaut                                      |
|----------------|---------------------|------|-------------------------------------------------|
| id             | integer             | Non  | nextval('joueurs_id_seq'::regclass)             |
| nhl_player_id  | integer             | Non  | -                                               |
| nom            | character varying   | Non  | -                                               |
| prenom         | character varying   | Non  | -                                               |
| position       | character varying   | Non  | -                                               |
| created_at     | timestamp           | Oui  | NOW()                                           |
| updated_at     | timestamp           | Oui  | NOW()                                           |

#### Index
- `joueurs_pkey` : UNIQUE sur `id`
- `idx_joueurs_nhl_player_id` : UNIQUE sur `nhl_player_id` pour les recherches rapides depuis l'API NHL
- `idx_joueurs_position` : Index sur `position` pour le filtrage des effectifs

#### Contraintes
- `PRIMARY KEY (id)`
- `UNIQUE (nhl_player_id)`

#### Notes
- **But** : Registre central des joueurs liant les joueurs NHL aux joueurs du pool
- `nhl_player_id` : Identifiant unique du joueur dans l'API NHL (contrainte UNIQUE pour garantir un seul enregistrement par joueur NHL)
- `position` : Valeurs possibles : 'C', 'LW', 'RW', 'D', 'G'
- `nom` et `prenom` : Stockés pour l'affichage (peuvent être synchronisés depuis l'API NHL)

---

### 10. `equipe_points`
- **Taille de la table** : 8192 bytes
- **Taille des index** : 72 kB
- **Taille totale** : 80 kB

Stocke les points cumulés par équipe par saison, décomposés par catégorie (attaque, défense, gardien).

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
| last_update_at   | date    | Oui  | now()      |

#### Index
- `equipe_stats_pkey` (16 kB) : UNIQUE sur `id`
- `equipe_points_equipe_id_season_unique` (16 kB) : UNIQUE sur `(equipe_id, season)`

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`
- `UNIQUE (equipe_id, season)` - Une seule ligne de points par équipe par saison

#### Notes
- `season` : Format texte (ex. `'20242025'`) correspondant à la saison NHL
- Les points sont divisés en 3 catégories reflétant les positions : attaque (C/LW/RW), défense (D), gardien (G)
- `total_points` est la somme des 3 catégories

---

### 11. `types_repechage`
- **Taille de la table** : 8192 bytes
- **Taille des index** : 16 kB
- **Taille totale** : 24 kB

#### Colonnes
| Nom   | Type                | Null | Par défaut                                      |
|-------|---------------------|------|-------------------------------------------------|
| id    | integer             | Non  | nextval('types_repechage_id_seq'::regclass)     |
| nom   | character varying   | Non  | -                                               |

#### Index
- `types_repechage_pkey` (16 kB) : UNIQUE sur `id`

#### Contraintes
- `PRIMARY KEY (id)`

---

### Données de référence : `types_repechage`

| id | nom                   |
|----|-----------------------|
| 1  | Ballotage de décembre |
| 2  | Draft annuel          |
| 3  | Draft d'expansion     |
| 4  | Ballotage de mars     |

---

### 12. `api_store`

Stocke des snapshots JSON persistants, indexés par clé textuelle. Conçu pour l'UPSERT : une seule ligne par clé, jamais de duplication.

#### Colonnes
| Nom           | Type        | Null | Par défaut                          |
|---------------|-------------|------|-------------------------------------|
| id            | integer     | Non  | nextval('api_store_id_seq'::regclass) |
| key           | text        | Non  | -                                   |
| json_response | jsonb       | Non  | -                                   |
| last_update   | timestamptz | Non  | NOW()                               |

#### Index
- `api_store_pkey` : UNIQUE sur `id`
- `idx_api_store_key` : Index sur `key` pour les lectures rapides
- Contrainte UNIQUE implicite sur `key` (utilisée par l'UPSERT `ON CONFLICT (key)`)

#### Contraintes
- `PRIMARY KEY (id)`
- `UNIQUE (key)` — une seule entrée par clé

#### Clés utilisées
| Clé                        | Contenu                                                          | Mise à jour       |
|----------------------------|------------------------------------------------------------------|-------------------|
| `live_points`              | `{ topPlayers, teamLeaderboard, gamesCount, liveGamesCount }`    | Cron 3h00 nightly |
| `live_points_leaderboard`  | `{ teamLeaderboard, gamesCount, liveGamesCount }`                | Cron 3h00 nightly |
| `live_points_feed`         | `{ topPlayers, gamesCount, liveGamesCount }`                     | Cron 3h00 nightly |

#### Notes
- Pas de FK — table autonome pour le stockage de cache persistant
- L'UPSERT met à jour `json_response` et `last_update` si la clé existe déjà
- Alimentée par `POST /api/snapshot/live-points` (protégé par `requireApiKey`)

---

### 13. `mis_au_ballotage`

Trace les joueurs retirés par une équipe avant chaque événement de repêchage (draft annuel, ballotage de décembre, ballotage de mars). Pendant que `repechages` enregistre les arrivées, `mis_au_ballotage` enregistre les départs.

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
- `type_id` réutilise `types_repechage` : `1` = avant ballotage de décembre, `2` = avant draft annuel, `4` = avant ballotage de mars
- `joueur_id` : lien vers `joueurs` si le joueur est enregistré dans le pool
- `joueur_nom_libre` : nom textuel pour les joueurs non enregistrés
- Pour un `(annee, type_id)` donné : `mis_au_ballotage` = qui est parti, `repechages` = qui est arrivé

#### API
- `GET /api/mis-au-ballotage` — tous les entrées
- `GET /api/mis-au-ballotage/:type/:annee` — filtré par type et année

---

## Relations entre les tables
- `echanges` → `equipes` (equipe_source_id, equipe_destination_id)
- `echange_joueurs` → `echanges` (echange_id) ON DELETE CASCADE — Table de jonction pour les joueurs échangés
- `echange_joueurs` → `equipes` (equipe_receptrice_id) — équipe qui reçoit le joueur
- `echange_joueurs` → `joueurs` (joueur_id) ON DELETE SET NULL — joueur lié (optionnel)
- `repechages` → `types_repechage` (type_id)
- `repechages` → `equipes` (equipe_id)
- `repechages` → `joueurs` (joueur_id)
- `trophee_gagnants` → `trophees` (trophee_id)
- `trophee_gagnants` → `equipes` (equipe_id)
- `equipe_joueurs` → `equipes` (equipe_id) - Table de jonction pour les effectifs
- `equipe_joueurs` → `joueurs` (joueur_id) - Table de jonction pour les effectifs
- `equipe_points` → `equipes` (equipe_id) - Points cumulés par équipe par saison
- `mis_au_ballotage` → `equipes` (equipe_id) — équipe qui retire le joueur
- `mis_au_ballotage` → `joueurs` (joueur_id) ON DELETE SET NULL — joueur lié (optionnel)
- `mis_au_ballotage` → `types_repechage` (type_id) — type d'événement précédé par ce retrait

---

## Index et séquences
- Chaque table possède une séquence pour l’auto-incrémentation de l’id.
- Les index primaires sont présents sur chaque id.

---

## Notes utiles pour le développement
- Toutes les relations de clés étrangères sont documentées ci-dessus.
- Les tailles de tables et d’index sont indiquées pour surveiller la volumétrie.
- Les types de colonnes sont précisés pour chaque table.
- Les valeurs par défaut sont indiquées.
- Les contraintes d’unicité et de clé primaire sont listées.

---
*Dernière mise à jour : février 2026 — ajout table `mis_au_ballotage` ; import des échanges 2023-2026 et normalisation des noms de picks*