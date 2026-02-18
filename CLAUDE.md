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
  - `/api/health` — health check
- **Database**: PostgreSQL via connection pool (`config/database.ts`); all SQL queries in `models/index.ts`
- **Error handling**: Centralized middleware in `middleware/errorHandler.ts`

### Database (9 tables)
`equipes`, `joueurs`, `equipe_joueurs` (junction), `equipe_points`, `repechages`, `types_repechage`, `echanges`, `trophees`, `trophee_gagnants`
- `equipes.nhl_player_ids` has been **dropped** — use `equipe_joueurs` junction table
- `equipes` has two new columns: `division` (varchar) and `dg_name` (text)
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
5. `/Docs/DB_STRUCTURE.md` - PostgreSQL schema (8 tables)
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
- **acceptation** - Staging/QA (deployed to staging environment)
- **dev** - Development integration branch
- **feature/*** - Feature branches (created from `dev`)

### Agent Workflow (IMPORTANT)
When implementing a new feature or fix:

1. **Always create a feature branch** from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/descriptive-name
   ```

2. **Make commits** following conventional commit style

3. **When the feature is ready**, create a Pull Request:
   - Target branch: `dev`
   - Use `gh pr create` to create the PR
   - Include a clear description of changes

4. **Never push directly** to `main`, `acceptation`, or `dev`

### Promotion Flow
```
feature/* → dev → acceptation → main
```

## Current Development Status

The project follows a 5-stage refactoring plan. Stages 1-4 are complete. Stage 5 (Polish, Testing & Optimization) is next. Check `/Docs/Implementation.md` for current tasks and their status.
