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
| equipe_source_id      | integer  | Oui  | -                                               |
| equipe_destination_id | integer  | Oui  | -                                               |
| details               | text     | Oui  | -                                               |
| statut_confirmer      | boolean  | Oui  | false                                           |

#### Index
- `echanges_pkey` (16 kB) : UNIQUE sur `id`

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (equipe_source_id)` → `equipes(id)`
- `FOREIGN KEY (equipe_destination_id)` → `equipes(id)`

---

### 2. `equipes`
- **Taille de la table** : 8192 bytes
- **Taille des index** : 16 kB
- **Taille totale** : 24 kB

#### Colonnes
| Nom            | Type                | Null | Par défaut                                      |
|----------------|---------------------|------|-------------------------------------------------|
| id             | integer             | Non  | nextval('equipes_id_seq'::regclass)             |
| nom            | character varying   | Non  | -                                               |
| active         | boolean             | Oui  | true                                            |
| nhl_player_ids | integer[]           | Oui  | -                                               |

#### Index
- `equipes_pkey` (16 kB) : UNIQUE sur `id`
- `idx_equipes_nhl_player_ids_gin` (optionnel) : GIN index sur `nhl_player_ids` pour les opérations sur tableaux

#### Contraintes
- `PRIMARY KEY (id)`

#### Notes
- `nhl_player_ids` : **DEPRECIE** - Tableau d'IDs de joueurs NHL (remplace par la table de jonction `equipe_joueurs`)

---

### 3. `repechages`
- **Taille de la table** : 16 kB
- **Taille des index** : 48 kB
- **Taille totale** : 64 kB

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

### 4. `trophee_gagnants`
- **Taille de la table** : 0 bytes
- **Taille des index** : 8192 bytes
- **Taille totale** : 8192 bytes

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

### 5. `trophees`
- **Taille de la table** : 0 bytes
- **Taille des index** : 8192 bytes
- **Taille totale** : 8192 bytes

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

### 6. `equipe_joueurs` (Table de jonction)

Table de jonction reliant les equipes aux joueurs (remplace `equipes.nhl_player_ids`).

#### Colonnes
| Nom        | Type    | Null | Par defaut                                      |
|------------|---------|------|-------------------------------------------------|
| id         | integer | Non  | nextval('equipe_joueurs_id_seq'::regclass)      |
| equipe_id  | integer | Non  | -                                               |
| joueur_id  | integer | Non  | -                                               |

#### Index
- `equipe_joueurs_pkey` : UNIQUE sur `id`
- `idx_equipe_joueurs_equipe_id` : Index sur `equipe_id` pour les recherches par equipe
- `idx_equipe_joueurs_joueur_id` : Index sur `joueur_id` pour les recherches par joueur

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

### 7. `joueurs`
- **Taille de la table** : Variable (nouvelle table)
- **Taille des index** : Variable
- **Taille totale** : Variable

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

### 8. `types_repechage`
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

## Relations entre les tables
- `echanges` → `equipes` (equipe_source_id, equipe_destination_id)
- `repechages` → `types_repechage` (type_id)
- `repechages` → `equipes` (equipe_id)
- `repechages` → `joueurs` (joueur_id)
- `trophee_gagnants` → `trophees` (trophee_id)
- `trophee_gagnants` → `equipes` (equipe_id)
- `equipe_joueurs` → `equipes` (equipe_id) - Table de jonction pour les effectifs
- `equipe_joueurs` → `joueurs` (joueur_id) - Table de jonction pour les effectifs

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
*Dernière mise à jour : janvier 2026 * 