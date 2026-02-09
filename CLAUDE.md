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

### Frontend (`client/`)
- **Entry**: `main.tsx` → `App.tsx` (routing with Wouter)
- **State**: TanStack Query for server state, React Context for loading state
- **Components**: Feature folders under `components/` (draft/, echanges/, home/, joueur/, navigation/, player-search/)
- **UI Primitives**: 40+ Radix-based components in `components/ui/` (shadcn/ui)
- **Hooks**: Feature-specific hooks in `hooks/[feature]/` folders
- **Styling**: Tailwind CSS with dark mode support

### Backend (`server/`)
- **Pattern**: MVC (Controllers → Services → Database)
- **Routes**: `/api/teams`, `/api/echanges`, `/api/repechage`, `/api/players/:id`, `/api/search/players`
- **Database**: PostgreSQL via connection pool (config in `config/database.ts`)
- **Error handling**: Centralized middleware in `middleware/errorHandler.ts`

### Data Flow
1. React component → custom hook → TanStack Query → API call
2. Express route → Controller → Service → Database query

## Documentation Priority

Before implementing features, consult in this order:
1. `/Docs/Bug_tracking.md` - Check for known issues first
2. `/Docs/Implementation.md` - Current stage tasks and implementation plan
3. `/Docs/project_structure.md` - File naming and folder structure
4. `/Docs/UI_UX_doc.md` - Design system and responsive requirements
5. `/Docs/DB_STRUCTURE.md` - PostgreSQL schema (6 tables: equipes, echanges, repechages, types_repechage, trophees, trophee_gagnants)
6. `/Docs/Git_Workflow.md` - Branching strategy and deployment process

## Key Constraints

- TypeScript strict mode - no `any` types
- ESLint max 0 warnings - all warnings must be fixed
- Environment: `.env` with `DATABASE_URL` required
- Path alias: `@/*` maps to `client/src/*`
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

The project follows a 4-stage refactoring plan (Stages 1-2 complete, Stage 3 in progress). Check `/Docs/Implementation.md` for current tasks and their status.
