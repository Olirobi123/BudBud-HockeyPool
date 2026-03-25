# Bug Tracking

---

## BUG-001 — Stale snapshot served after NHL date flip (live-points)

**Status:** Open
**Severity:** High
**Area:** `server/services/livePointsService.ts`
**Discovered:** 2026-03-25

### Description

After the NHL API flips its `currentDate` (sometime between ~2–6 AM Eastern, once all games go `OFF`), the `/api/live-points` endpoint immediately falls into the snapshot branch and serves **stale data** (the previous night's snapshot, which contains results from two nights ago). This persists until the nightly cron refreshes the snapshot at **19:15 UTC (~3:15 PM Eastern)**.

The snapshot itself is correct — the cron at 19:15 UTC captures last night's games accurately via `getDateString(-1)`. The problem is purely a **delivery condition** issue: the service switches to snapshot too early, before the snapshot has been refreshed with last night's data.

### Desired Behaviour

| Window | Source |
|---|---|
| Games live/finishing (evening → ~2–6 AM Eastern) | Play-by-play on today's (or last night's) game day |
| After date flip until cron (~2–6 AM → 3:15 PM Eastern) | **Play-by-play on previous-day games** (they are still in the NHL API response) |
| After cron runs (3:15 PM → first puck drop) | Snapshot (now fresh with last night's results) |
| Games live again | Play-by-play |

### Root Cause

**NHL API `currentDate` does not flip at midnight Eastern.**

Confirmed via direct API inspection at 05:03 UTC (1:03 AM Eastern) on 2026-03-25:

```
GET https://api-web.nhle.com/v1/score/now
→ 307 Redirect to /v1/score/2026-03-24
currentDate: "2026-03-24"
games: 15 games, all gameDate "2026-03-24" (14 OFF, 1 FINAL — ANA @ VAN)
```

The NHL API keeps `currentDate` on the game day until all games go `OFF`. Once the last game settles, it flips `currentDate` to the next calendar date (e.g., `"2026-03-25"`). At that point, the flat `games` array in the response **still contains the previous night's `OFF` games** alongside the new day's `FUT` games.

The current delivery logic filters games strictly by `currentDate`:

```typescript
const filteredGames = games.filter((g) => g.gameDate === dateString);
// dateString = scoresResult.currentDate = "2026-03-25"  (after flip)
// → previous night's OFF games (gameDate "2026-03-24") are excluded
// → filteredGames = only FUT games → activeGames = empty → snapshot served  ← BUG
```

Previous-day `OFF` games are right there in the `games` array and could drive play-by-play, but they are discarded.

### Failing Window

```
T-flip (NHL flips currentDate, ~2–6 AM Eastern)
  → activeGames = empty (FUT only)
  → anyGameLive = false
  → snapshot served

Snapshot was written at 19:15 UTC the previous day
  → captured getDateString(-1) = two nights ago
  → users see results from 2 days ago

Gap until cron refreshes snapshot: ~9–15 hours
```

### What Was Tried

A previous attempt (`fix(live-points): prev-day play-by-play fallback`) detected previous-day `OFF` games and used them for play-by-play after the date flip. It was reverted (`revert prev-day play-by-play fallback, serve snapshot past midnight`). The reason for the revert is not documented — must be understood before retrying.

### Fix Direction

Change the delivery condition so that when `currentDate` has flipped but previous-day `FINAL`/`OFF` games are still present in the `games` response, the service uses those games for play-by-play instead of falling back to snapshot.

The snapshot should only be served when:
- No active/finished games exist for today **and**
- No previous-day games remain in the response (NHL has fully moved on)

This naturally produces the desired window: play-by-play persists until the NHL API drops the previous-day games from its response (which aligns roughly with when the cron has run and the snapshot is fresh), then snapshot takes over until live games begin.

The key code change is in the `filteredGames` / `activeGames` logic — it needs to consider `prevDate` games in the response as eligible for play-by-play when today has no active games.

---
