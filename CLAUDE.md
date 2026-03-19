# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

38BudBud is a full-stack web application for managing hockey pools. It's a bilingual (French/English) platform built with React/TypeScript frontend, Node.js/Express backend, and PostgreSQL database.

## Commands

```bash
npm run dev          # Start development server (Vite + tsx)
npm run build        # Build for production (Vite client + esbuild server)
npm start            # Run production server
npm run check        # TypeScript type checking
npm run lint         # ESLint with strict mode (max 0 warnings)
npm run lint:fix     # Auto-fix lint issues
```

The app runs on port 5000.

## Architecture

This is an **npm workspaces monorepo** with `client/` and `server/` as separate packages. `npm run dev` runs both concurrently via `concurrently`.

### Frontend (`client/`)
- **Entry**: `main.tsx` → `App.tsx` (routing with `react-router-dom` BrowserRouter)
- **Pages**: `home`, `equipes`, `team-details`, `draft`, `echanges`, `joueur`, `not-found`
- **State**: TanStack Query for server state, React Context for loading state (`lib/loading-context.tsx`)
- **Components**: Feature folders under `components/` (draft/, echanges/, equipes/, home/, joueur/, navigation/, player-search/, trophees/)
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
  - `/api/health` — health check
- **Database**: PostgreSQL via connection pool (`config/database.ts`); all SQL queries in `models/index.ts`
- **Error handling**: Centralized middleware in `middleware/errorHandler.ts`

### Database (12 tables)
`equipes`, `joueurs`, `equipe_joueurs` (junction), `equipe_points`, `repechages`, `types_repechage`, `echanges`, `echange_joueurs` (junction), `trophees`, `trophee_gagnants`, `api_store`, `mis_au_ballotage`
- `equipes.nhl_player_ids` has been **dropped** — use `equipe_joueurs` junction table
- `echanges.details` has been **dropped** — use `echange_joueurs` junction table
- `equipes` has two columns: `division` (varchar) and `dg_name` (text)
- `api_store` — persistent JSON cache for cron snapshots (keyed by text, UPSERT pattern)
- `mis_au_ballotage` — tracks players waived/dropped before each draft event
- Player positions: `'C'`, `'LW'`, `'RW'`, `'D'`, `'G'`

### Data Flow
1. React component → custom hook → TanStack Query → API call
2. Express route → Controller → Service → `models/index.ts` query → Database

## Documentation Priority

Before implementing features, consult in this order:
1. `/Docs/Bug_tracking.md` - Check for known issues first
2. `/Docs/Implementation.md` - Current stage tasks and implementation plan
3. `/Docs/project_structure.md` - File naming and folder structure
4. `/Docs/UI_UX_doc.md` - Design system and responsive requirements
5. `/Docs/DB_STRUCTURE.md` - PostgreSQL schema (12 tables)
6. `/Docs/Git_Workflow.md` - Branching strategy and deployment process

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

3. **After merging**, sync dev to match main:
   ```bash
   git checkout dev && git merge origin/main --no-edit && git push origin dev
   ```

## Current Development Status

The project follows a 5-stage refactoring plan. Stages 1-4 are complete (all phases including Awards and Frontend). Stage 5 (Polish, Testing & Optimization) is next. Check `/Docs/Implementation.md` for current tasks and their status.
