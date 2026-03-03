# Ballotage Data-Entry Workflow

This skill processes a ballotage event end-to-end: it parses a Messenger conversation, resolves every player against the database and NHL API, and inserts all waived/drafted records atomically. Use `mcp__Neon__run_sql` and `mcp__Neon__run_sql_transaction` throughout.

---

## Connection Reference

```
Project:     white-glitter-92611915
Development: br-holy-mouse-a87byobx  ← work here first
Production:  br-frosty-lab-a85rmec2  ← promote when confirmed

types_repechage:
  1 = Ballotage de décembre
  2 = Draft annuel
  3 = Draft d'expansion
  4 = Ballotage de mars
```

---

## Step 0 — Confirm Parameters

Collect any missing information before starting:
- **Ballotage type** — mars = `type_id=4`, décembre = `type_id=1`
- **Year** — e.g. `2026`
- **Target branch** — default is `development`

Start on `development` rather than `production` directly. This lets you verify data before it goes live and keeps mistakes easy to undo.

---

## Step 1 — Load Teams

```sql
SELECT id, nom, dg_name FROM equipes WHERE active = true ORDER BY nom;
```

Show the team list to the user. You'll map messenger display names to these IDs throughout the workflow.

---

## Step 2 — Parse the Conversation

Ask the user to paste the full messenger conversation (waivers + draft picks). After receiving it, immediately show your interpretation and ask for confirmation:

> **Here's how I read this conversation:**
>
> Waived players:
> - [Team]: [Player], [Player], …
>
> Draft picks:
> - Pick 1 — [Team]: [Player]
> - Pick 2 — [Team]: [Player]
> - …
>
> **Does this match what happened? Correct anything before I continue.**

Wait for explicit confirmation. A parsing mistake caught here costs nothing; the same mistake caught after inserts means running cleanup SQL.

If any team's waiver or pick is missing from the conversation, flag the gap and ask the user to fill it in before moving on.

---

## Step 3 — Resolve All Player IDs

### 3a — Batch DB lookup

Search all players (waived and drafted) in one query rather than looping — it's faster and immediately reveals which ones need the API:

```sql
SELECT id, nhl_player_id, nom, prenom, position
FROM joueurs
WHERE LOWER(CONCAT(prenom, ' ', nom)) IN (
  'tyler seguin',
  'porter martone',
  -- every player name, lowercased
);
```

Players returned → resolved. Players absent → go to 3b.

### 3b — NHL API lookup (parallel)

The app server URL (localhost / Codespaces) requires auth and isn't accessible from WebFetch. Use the NHL search API directly, fetching all missing players in parallel in a single turn:

```
GET https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=5&q=<name>&active=true
```

**When searches go wrong:**
- Wrong player returned → search by **last name only** (e.g. `q=Broberg`, not `q=Filip+Broberg`) — first-name collisions are common
- Apostrophes (O'Reilly, etc.) → also try last name only
- Always verify the returned `name` field matches who you expected before accepting the result

**Position codes:** The API returns `L` and `R` (not `LW`/`RW`). Store them as-is — the DB uses the same single-letter codes.

From each result, extract: `playerId` → `nhl_player_id`, split `name` → `prenom`/`nom`, `positionCode` → `position`.

### 3c — Batch-insert new players

Insert all newly found players in one statement:

```sql
INSERT INTO joueurs (nhl_player_id, nom, prenom, position)
VALUES
  (<nhl_player_id>, '<nom>', '<prenom>', '<position>'),
  ...
ON CONFLICT (nhl_player_id) DO NOTHING
RETURNING id, nhl_player_id, nom, prenom;
```

If `ON CONFLICT` fires for a player and no row is returned, they exist under a slightly different name — query by `nhl_player_id` to retrieve their `id`.

### 3d — Fallback for truly unknown players

If a player can't be found anywhere, set `joueur_id = NULL` and populate `joueur_nom_libre` with their name as written. Flag them for manual follow-up after the workflow.

---

## Step 4 — Final Review

Show the full resolved dataset before touching the database — this is the last easy checkpoint:

**Waived players:**
| Équipe | Joueur | joueur_id | Note |
|--------|--------|-----------|------|

**Draft picks:**
| Rang | Équipe | Joueur | joueur_id | Note |
|------|--------|--------|-----------|------|

Ask: **"Everything look right? I'll insert once you confirm."**

---

## Steps 5–8 — Database Inserts

Run all four operations as a **single transaction** so they succeed or fail together — if the DELETE goes through but the repechage insert fails, the roster would be left in an inconsistent state:

```
mcp__Neon__run_sql_transaction with four SQL statements:
```

**Statement 1 — Waived players → `mis_au_ballotage`**
```sql
INSERT INTO mis_au_ballotage (equipe_id, joueur_id, joueur_nom_libre, annee, type_id)
VALUES
  (<equipe_id>, <joueur_id_or_null>, <nom_libre_or_null>, <ANNEE>, <TYPE_ID>),
  ...;
```
The DB enforces `CHECK (joueur_id IS NOT NULL OR joueur_nom_libre IS NOT NULL)` — at least one must be set.

**Statement 2 — Remove waived players from `equipe_joueurs`**
```sql
DELETE FROM equipe_joueurs WHERE joueur_id IN (<id1>, <id2>, ...);
```
Only include players with a resolved `joueur_id` — skip NULLs, they have no roster row to remove.

**Statement 3 — Draft picks → `repechages`**
```sql
INSERT INTO repechages (annee, type_id, equipe_id, joueur, joueur_id, rang)
VALUES
  (<ANNEE>, <TYPE_ID>, <equipe_id>, '<full_name>', <joueur_id_or_null>, <rang>),
  ...;
```
`joueur` (the varchar column) is always filled; `joueur_id` can be NULL.

**Statement 4 — Add picked players to `equipe_joueurs`**
```sql
INSERT INTO equipe_joueurs (equipe_id, joueur_id)
VALUES
  (<equipe_id>, <joueur_id>),
  ...
ON CONFLICT (joueur_id) DO UPDATE SET equipe_id = EXCLUDED.equipe_id;
```
`ON CONFLICT` handles rare edge cases where a player was already rostered (e.g. mid-season trade). Skip `joueur_id = NULL` rows.

---

## Step 9 — Verify

```sql
-- Waived players
SELECT m.id, e.nom AS equipe,
       COALESCE(CONCAT(j.prenom, ' ', j.nom), m.joueur_nom_libre) AS joueur,
       m.annee, m.type_id
FROM mis_au_ballotage m
JOIN equipes e ON m.equipe_id = e.id
LEFT JOIN joueurs j ON m.joueur_id = j.id
WHERE m.annee = <ANNEE> AND m.type_id = <TYPE_ID>
ORDER BY e.nom;

-- Draft picks
SELECT r.rang, e.nom AS equipe, r.joueur, r.joueur_id
FROM repechages r
JOIN equipes e ON r.equipe_id = e.id
WHERE r.annee = <ANNEE> AND r.type_id = <TYPE_ID>
ORDER BY r.rang;
```

Report row counts for each, and flag any `joueur_id = NULL` entries that need follow-up.

---

## Step 10 — Promote to Production

Ask: **"Data is confirmed on development. Promote to production?"**

If yes, follow this sequence. Each sub-step depends on the previous one — don't skip or reorder.

### 10a — Reset sequences first

Neon branch sequences fall out of sync with actual data over time, causing `duplicate key` errors on insert. Reset them before anything else:

```sql
SELECT setval('joueurs_id_seq',            (SELECT MAX(id) FROM joueurs));
SELECT setval('mis_au_ballotage_id_seq',   (SELECT MAX(id) FROM mis_au_ballotage));
SELECT setval('repechages_id_seq',         (SELECT MAX(id) FROM repechages));
SELECT setval('equipe_joueurs_id_seq',     (SELECT MAX(id) FROM equipe_joueurs));
```

### 10b — Insert new players into production

```sql
INSERT INTO joueurs (nhl_player_id, nom, prenom, position)
VALUES ...
ON CONFLICT (nhl_player_id) DO NOTHING
RETURNING id, nhl_player_id, nom, prenom;
```

### 10c — Remap IDs to production values

Development and production assign different auto-increment IDs to new players because their sequences were at different points. Using dev IDs on production inserts would silently link picks to the wrong players.

After the insert above, look up the actual production IDs:

```sql
SELECT id, nhl_player_id, nom, prenom FROM joueurs
WHERE nhl_player_id IN (<nhl_id1>, <nhl_id2>, ...);
```

Use these production IDs for the transaction below.

### 10d — Run the production transaction

Replay Statements 1–4 from Steps 5–8 as a single transaction on the production branch, using the remapped IDs.

### 10e — Verify production parity

Run the Step 9 queries on the production branch. Row counts should match development exactly.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `duplicate key on _pkey` | Sequence out of sync with data | Run the four `setval` calls from Step 10a |
| NHL API returns wrong player | First-name collision or apostrophe stripped | Search by last name only |
| `ON CONFLICT` fires on `joueurs`, no RETURNING row | Player exists under a different name spelling | Query by `nhl_player_id` to get their `id` |
| Ambiguous team name from conversation | Messenger display names don't match DB | Show candidates from Step 1, ask user to confirm |
| Transaction fails mid-way | Any SQL error | All changes roll back cleanly — fix the error and retry |

---

## After Completion

Remind the user to:
1. Check `/draft` (filter: type + year) — picks should appear
2. Check `/equipes` — roster counts should look reasonable
3. Any `joueur_id = NULL` entries need manual resolution
