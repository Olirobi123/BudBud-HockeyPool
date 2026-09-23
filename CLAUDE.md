# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

38BudBud is a full-stack web application for managing hockey pools. It's a bilingual (French/English) platform built with React/TypeScript frontend, Node.js/Express backend, and PostgreSQL database.

## Commands

```bash
npm run dev          # Start development server (Vite + tsx)
npm run build        # Build for production (Vite client + esbuild server)
npm start -w server  # Run production server (no root-level "start" script)
npm run check        # TypeScript type checking
npm run lint         # ESLint with strict mode (max 0 warnings)
npm run lint:fix     # Auto-fix lint issues
```

The app runs on port 5000.

## Architecture

This is an **npm workspaces monorepo** with `client/` and `server/` as separate packages. `npm run dev` runs both concurrently via `concurrently`.

### Frontend (`client/`)
- **Entry**: `main.tsx` → `App.tsx` (routing with `react-router-dom` BrowserRouter)
- **Pages**: `home`, `equipes`, `team-details`, `draft`, `regie-repechage`, `echanges`, `joueur`, `bilan`, `series`, `not-found`
- **State**: TanStack Query for server state. There is no global loading state — each page mounts its `<Layout>` immediately and renders a `*Skeleton` component in its content region while its queries resolve.
- **Components**: Feature folders under `components/` (bilan/, draft/, draft-regie/, echanges/, equipes/, home/, joueur/, navigation/, player-search/, scores/, series/, trophees/)
- **UI Primitives**: Radix-based components in `components/ui/` (shadcn/ui)
- **Hooks**: Feature-specific hooks in `hooks/[feature]/` folders; shared hooks at `hooks/` root
- **Styling**: Tailwind CSS with dark mode support
- **Path alias**: `@/*` → `client/src/*`

### Backend (`server/`)
- **Pattern**: MVC (Controllers → Services → Database)
- **External API**: NHL data via `@olirobi/nhl_api_client` (used in `services/playersService.ts`, `services/scoresService.ts`)
- **Routes registered in `routes.ts`**:
  - `/api/teams` — pool teams + roster endpoints (`GET /:id/roster`, `GET /:id/roster/stats`)
  - `/api/echanges` — trades
  - `/api/repechage` — draft picks
  - `/api/players` — player search and ownership (`GET /search`, `GET /:nhlId/ownership`, `GET /nhl/:nhlId`, `GET /bd/:id`)
  - `/api/scores` — live NHL game scores
  - `/api/points` — pool standings (season totals)
  - `/api/live-points` — live pool points during game days
  - `/api/trophees` — pool awards
  - `/api/snapshot` — nightly data snapshots for cron jobs (protected by `requireApiKey`)
  - `/api/mis-au-ballotage` — waiver wire player history
  - `/api/injuries` — NHL player injury status
  - `/api/etat` — hot/cold/normal player form (`GET /`)
  - `/api/series` — playoff series and weekly snapshots
  - `/api/draft-day` — public draft board/rankings + unlinked live draft régie (no auth)
  - `/api/health` — health check
- **Database**: PostgreSQL via connection pool (`config/database.ts`); all SQL queries in `models/index.ts`
- **Error handling**: Centralized middleware in `middleware/errorHandler.ts`

### Database (22 tables)
`equipes`, `joueurs`, `equipe_joueurs` (junction), `equipe_points`, `equipe_points_mensuel`, `equipe_saison_totaux`, `equipe_semaine_points`, `repechages`, `choix_repechage`, `types_repechage`, `echanges`, `echange_joueurs` (junction), `trophees`, `trophee_gagnants`, `api_store`, `mis_au_ballotage`, `blessures`, `etat_joueurs`, `series_playoffs`, `series_semaine_baseline`, `listes_classement`, `liste_classement_joueurs`

See `/Docs/DB_STRUCTURE.md` for full column-level detail (verified against the live Neon schema). Highlights:
- `equipes.nhl_player_ids` has been **dropped** — use `equipe_joueurs` junction table
- `echanges.details` has been **dropped** — use `echange_joueurs` junction table
- `equipes` has two columns: `division` (varchar) and `dg_name` (text)
- `api_store` — persistent JSON cache for cron snapshots (keyed by text, UPSERT pattern)
- `mis_au_ballotage` — tracks players waived/dropped before each draft event
- `blessures` / `etat_joueurs` — injury status and hot/cold form, refreshed by cron
- `series_playoffs` / `series_semaine_baseline` / `equipe_semaine_points` — playoff bracket and weekly point tracking
- `equipe_points_mensuel` / `equipe_saison_totaux` — monthly/season point breakdowns powering the Bilan page
- `listes_classement` / `liste_classement_joueurs` — imported public ranking lists shown on the draft-day home page
- Player positions: `'C'`, `'LW'`, `'RW'`, `'D'`, `'G'`

### Data Flow
1. React component → custom hook → TanStack Query → API call
2. Express route → Controller → Service → `models/index.ts` query → Database

## Documentation Priority

Before implementing features, consult in this order:
1. `/Docs/Bug_tracking.md` - Check for known issues first
2. `/Docs/Design_System.md` - Design tokens, colour rules, component inventory
3. `/Docs/Design_System_Cheatsheet.md` - Quick reference for the above
4. `/Docs/DB_STRUCTURE.md` - PostgreSQL schema (22 tables)
5. `/Docs/Cron_Jobs.md` - Cron schedule, manual playoff actions, and endpoint reference

Branching strategy and deployment process are documented below in **Git Workflow**, not in a separate doc.

## Component Structure

### Single Responsibility
- **One component per file** — never group multiple components in a single file
- Each component has exactly one reason to change

### Subfolder organisation
When a feature area grows beyond one file, create a named subfolder:
```
components/joueur/
├── histoire/               ← sub-components for the Histoire tab
│   ├── TradeEventItem.tsx
│   ├── DraftEventItem.tsx
│   ├── BallotageEventItem.tsx
│   ├── HistoireEventItem.tsx   ← type dispatcher
│   └── HistoireTimeline.tsx    ← layout/scaffold
└── JoueurTabsHistoire.tsx  ← thin wrapper: data fetch + empty state only
```
- The parent file (e.g. `JoueurTabsHistoire.tsx`) is a **thin wrapper**: it fetches data, handles loading/empty states, and delegates rendering to sub-components
- Sub-components live in the subfolder and are not aware of data fetching

### Naming conventions
- Subfolders use lowercase (e.g. `histoire/`, `timeline/`)
- Component files use PascalCase matching their export (e.g. `DraftEventItem.tsx`)
- Dispatcher/router components are named `[Feature]EventItem.tsx` or `[Feature]Item.tsx`

## Key Constraints

- TypeScript strict mode - no `any` types
- ESLint max 0 warnings - all warnings must be fixed
- Environment: `.env` with `DATABASE_URL` required
- Mobile-first responsive design
- Document errors in `/Docs/Bug_tracking.md`

## Git Workflow

### Branch Strategy
- **main** - Production (deployed to production environment)
- **dev** - Development integration branch
- **feature/*** - Feature branches (created from `dev`)

### Agent Workflow (IMPORTANT)
When implementing a new feature or fix:

1. **Always create a feature branch** from `dev`:
   ```bash
   git checkout dev
   git pull --rebase origin dev
   git checkout -b feature/descriptive-name
   ```

2. **Make commits** following conventional commit style — **never add Claude as co-author**

3. **When the feature is ready**, merge directly into `dev` (no PR required):
   ```bash
   git fetch origin
   git rebase origin/dev
   git checkout dev
   git merge feature/descriptive-name --no-edit
   git push origin dev
   ```

4. **Never push directly** to `main`

### Promotion Flow
```
feature/* → dev → main
```

### Merging dev → main
When promoting `dev` to `main`:

1. **Create a PR** from `dev` to `main`:
   ```bash
   gh pr create --base main --head dev
   ```

2. **Merge using "Rebase and merge"** on GitHub — preserves commits and triggers Render/Vercel redeploy correctly. Never use "Squash and merge" (bypasses redeploy).

3. **After merging**, reset dev onto main:
   ```bash
   git checkout dev
   git fetch origin
   git reset --hard origin/main
   git push --force-with-lease origin dev
   ```

   **Reset, not merge.** "Rebase and merge" rewrites every SHA, so after the
   promotion `dev` still holds the *original* commits while `main` holds their
   rebased twins. `git merge origin/main` then joins two copies of identical
   work and every commit appears twice in `dev`'s history. Resetting is safe
   here precisely because the promotion just replayed all of `dev` onto `main`
   — the trees are identical, so nothing is lost.

   Confirm that before force-pushing. Both should print nothing:
   ```bash
   git diff --stat origin/main origin/dev   # no output = identical content
   git log --oneline origin/main..origin/dev # no output = nothing unique to dev
   ```
   If either prints anything, `dev` has work that did not make it into `main`.
   Stop and reconcile rather than resetting.

## Current Development Status

The original 5-stage refactoring plan (through Awards/Frontend) is complete. Active development has since moved to new features on top of that base: a live draft-day board with an unlinked régie control page, playoff series tracking, waiver/ballotage history, player injury and hot/cold state, and the season Bilan page. Check `git log` for the latest work rather than assuming a fixed stage.

The UI is on **Design System v2.0** — a monochrome dashboard where the chrome carries no hue and colour is reserved for state. See `/Docs/Design_System.md` before touching any styling; open UI items are tracked in `/Docs/UI_Audit.md`.
