# Component Single-Responsibility Audit

Audit date: 2026-03-23

Files checked: all `.tsx` under `client/src/components/` — `components/ui/` excluded (shadcn primitives).

---

## Critical

> 5+ internal components or 300+ lines. Refactor first.

### `home/LivePointsLeaderboard.tsx`
Internal components: `LeaderboardSkeleton`, `PlayerRow`, `SectionLabel`, `TeamExpandedRoster`, `LeaderboardEmpty`, `RankBadge`, `TeamRow`, `LeaderboardList`, `LeaderboardContent` (9 components, 305+ lines)

### `home/PointsLeaderboard.tsx`
Internal components: `PointsLeaderboardSkeleton`, `PointsLeaderboardEmpty`, `CategoryToggle`, `RankBadge`, `DiffCell`, `TeamRow`, `RankingsList` (7 components, 326+ lines)

### `equipes/TeamRoster.tsx`
Internal components: `RosterSkeleton`, `PlayerBadge`, `MobileSkaterRow`, `MobileGoalieRow`, `SkaterGroupTable`, `GoaliesTable` (6 components, 384+ lines)

### `joueur/JoueurTabsLastFive.tsx`
Internal components: `StatBlock`, `OpponentPill`, `SkaterRow`, `GoalieRow`, `SkaterTotals`, `GoalieTotals` (5+ components)

---

## High

### `joueur/JoueurTabsStats.tsx`
Internal components: `TotalsCard`, `SkaterSeasonRow`, `GoalieSeasonRow`

### `joueur/JoueurTabsOverview.tsx`
Internal components: `SecondaryStats`, `SkaterStatsContent`, `GoalieStatsContent` + utility functions `calcAge`, `cmToFeetInches`, `kgToLbs`, `shootsLabel` (utilities should move to `lib/joueur-utils.ts`)

### `series/PlayoffBracket.tsx`
Internal components: `RoundColumn`, `DesktopBracket`, `MobileBracket`

### `LiveScoresTicker.tsx`
Internal components: `TeamRow`, `GameCard`, `TickerLabel`

---

## Medium

### `echanges/EchangeCard.tsx`
Internal components: `TeamHeader`, `PlayerList`

### `HeroSection.tsx`
Internal component: `StatPill` + fetches data (hooks) alongside complex rendering

### `series/BracketCard.tsx`
Internal component: `TeamRow`

---

## Low

### `trophees/TropheesList.tsx`
Internal component: `TropheesSkeleton`

---

## Reference: Compliant Files

`joueur/histoire/` — refactored 2026-03-23, now the reference implementation for this pattern.

---

## Fix Pattern

For each violating file, apply the `histoire/` pattern:

```
components/[feature]/
├── [feature]/              ← sub-components folder
│   ├── SubComponentA.tsx
│   ├── SubComponentB.tsx
│   └── ...
└── [Feature]ParentTab.tsx  ← thin wrapper: data fetch + empty state only
```

- Utility functions → `client/src/lib/[feature]-utils.ts`
- Skeleton components → `[Feature]Skeleton.tsx` in the subfolder
- One exported component per file, no exceptions
