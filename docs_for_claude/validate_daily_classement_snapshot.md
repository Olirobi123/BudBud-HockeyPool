# Validation Procedure: Daily Classement Snapshot

## Context

The daily classement snapshot relies on two cron endpoints that **must run in order**:

1. `POST /api/points/update` — updates `equipe_points`, snapshots `classement_prev`, flags `compte_points`
2. `POST /api/snapshot/live-points` — reads yesterday's play-by-play, patches `totalPoints` using the diff, saves `live_points`

An empty `teamLeaderboard` in `live_points` is **expected when there are no NHL games** for the target date. It does NOT mean the implementation is wrong. Validation must be done on a real game night or with synthetic data.

---

## When to validate

Validate **on a day with NHL games**, after games have finished (ideally after midnight UTC so the snapshot cron window is correct). Check the schedule at https://www.nhl.com/schedule.

---

## Step-by-step validation

### Step 1 — Before running anything: record baseline

```sql
-- Record current equipe_points totals
SELECT equipe_id, total_points FROM equipe_points WHERE season = '20252026' ORDER BY equipe_id;

-- Record current classement_prev (should exist from previous run)
SELECT json_response->'updatedAt', json_response->'teams' FROM api_store WHERE key = 'classement_prev';

-- Record compte_points state
SELECT nhl_player_id, compte_points FROM joueurs ORDER BY nhl_player_id LIMIT 20;
```

### Step 2 — Run `POST /api/points/update`

```bash
curl -s -X POST http://localhost:5000/api/points/update -H "x-api-key: <key>" | jq .
```

**Expected response:**
```json
{ "success": true, "data": { "teamsUpdated": 10, "season": "20252026", "timestamp": "..." } }
```

**Verify in DB:**

```sql
-- 1. classement_prev must be freshly written (check updatedAt matches now)
SELECT key, last_update, json_response->'updatedAt', json_response->'teams'
FROM api_store WHERE key = 'classement_prev';

-- 2. teams in classement_prev must match the PREVIOUS equipe_points totals (baseline from Step 1)
-- The values should equal what you recorded before running the update.

-- 3. compte_points must flag exactly 200 players (10 teams × 20 active: 12F + 6D + 2G)
SELECT COUNT(*) FILTER (WHERE compte_points = true) AS active,
       COUNT(*) FILTER (WHERE compte_points = false) AS inactive
FROM joueurs;
-- Expected: active = 200

-- 4. Spot-check: the top 12 forwards of one team should be flagged
SELECT j.nom, j.prenom, j.position, j.compte_points
FROM joueurs j
JOIN equipe_joueurs ej ON ej.joueur_id = j.id
WHERE ej.equipe_id = 1  -- change to any known team id
ORDER BY j.position, j.compte_points DESC;
```

### Step 3 — Run `POST /api/snapshot/live-points`

Wait until games for the target date are in FINAL/OFF state, then run:

```bash
curl -s -X POST http://localhost:5000/api/snapshot/live-points -H "x-api-key: <key>" | jq .
```

**Expected response:**
```json
{ "success": true, "data": { "saved": true } }
```

**Verify in DB:**

```sql
-- 1. live_points must be freshly written
SELECT key, last_update FROM api_store WHERE key = 'live_points';

-- 2. teamLeaderboard must NOT be empty on a game night
SELECT jsonb_array_length(json_response->'teamLeaderboard') AS team_count,
       json_response->'gamesCount' AS games
FROM api_store WHERE key = 'live_points';
-- Expected: team_count = 10, games > 0

-- 3. totalPoints in leaderboard = diff between current equipe_points and classement_prev
-- Pick one team and validate manually:
SELECT
  ep.equipe_id,
  ep.total_points AS current_pts,
  (prev.json_response->'teams'->>ep.equipe_id::text)::int AS prev_pts,
  ep.total_points - (prev.json_response->'teams'->>ep.equipe_id::text)::int AS expected_diff
FROM equipe_points ep
CROSS JOIN (SELECT json_response FROM api_store WHERE key = 'classement_prev') prev
WHERE ep.season = '20252026'
ORDER BY ep.equipe_id;
-- Compare expected_diff with totalPoints in the leaderboard JSON for each team.

-- 4. totalPJ: check that PJ counts only compte_points=true players who appeared in games
-- (manual cross-check: look at the live_points JSON players array, filter by poolTeam,
--  count those where compte_points = true in joueurs table)
SELECT json_response->'teamLeaderboard'->0->>'equipeNom' AS team,
       json_response->'teamLeaderboard'->0->'totalPJ' AS pj,
       json_response->'teamLeaderboard'->0->'totalPoints' AS pts
FROM api_store WHERE key = 'live_points';
```

### Step 4 — UI spot-check

Open the home page and expand a team row:
- Summary shows **PJ | Pts** (no B or A columns)
- PJ value matches `totalPJ` from the DB query above
- Expanded card shows position headers: Attaque / Défense / Gardiens
- Pts value reflects the **daily diff**, not the season total

---

## Known timing constraints

- `snapshotPreviousClassement` is called at the START of `POST /api/points/update`, before the NHL API call. This means `classement_prev` captures points *before* today's update.
- `POST /api/snapshot/live-points` must run **after** `POST /api/points/update` to have an accurate diff.
- The snapshot cron uses yesterday's date (UTC-offset) for play-by-play. If run too early (before games finish), `teamLeaderboard` may be partial.
- If `classement_prev` is missing (first-ever run), all diffs will be 0. Run `POST /api/points/update` once to seed it before testing the snapshot.
