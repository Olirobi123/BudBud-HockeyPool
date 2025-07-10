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
| Nom   | Type                | Null | Par défaut                                      |
|-------|---------------------|------|-------------------------------------------------|
| id    | integer             | Non  | nextval('equipes_id_seq'::regclass)             |
| nom   | character varying   | Non  | -                                               |
| active| boolean             | Oui  | true                                            |

#### Index
- `equipes_pkey` (16 kB) : UNIQUE sur `id`

#### Contraintes
- `PRIMARY KEY (id)`

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
| rang       | integer             | Non  | -                                               |
| round      | integer             | Oui  | -                                               |

#### Index
- `repechages_pkey` (16 kB) : UNIQUE sur `id`

#### Contraintes
- `PRIMARY KEY (id)`
- `FOREIGN KEY (type_id)` → `types_repechage(id)`
- `FOREIGN KEY (equipe_id)` → `equipes(id)`

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
| joueur     | character varying   | Oui  | -                                               |

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

---

### 6. `types_repechage`
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
- `trophee_gagnants` → `trophees` (trophee_id)
- `trophee_gagnants` → `equipes` (equipe_id)

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

*Dernière mise à jour automatique : juillet 2025* 