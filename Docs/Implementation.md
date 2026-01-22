# Implementation Plan for 38BudBud Refactor & UI/UX Overhaul

## Recommended Tech Stack

### Frontend:
- **Framework:** React 18 + TypeScript  
  *Justification: Modern, maintainable, type-safe, already in use*  
  [React Docs](https://react.dev/) | [TypeScript Docs](https://www.typescriptlang.org/)

- **Styling:** Tailwind CSS  
  *Justification: Utility-first, enforces consistency, already in use*  
  [Tailwind Docs](https://tailwindcss.com/)

- **Routing:** Wouter  
  *Justification: Lightweight, simple, already in use*  
  [Wouter Docs](https://github.com/molefrog/wouter)

- **State/Server State:** TanStack Query (React Query)  
  *Justification: Best-in-class for server state, already in use*  
  [TanStack Query Docs](https://tanstack.com/query/latest)

### Backend:
- **Framework:** Node.js + Express.js + TypeScript  
  *Justification: Fast, flexible, type-safe, already in use*  
  [Express Docs](https://expressjs.com/) | [Node.js Docs](https://nodejs.org/en/docs)

### Database:
- **Database:** PostgreSQL  
  *Justification: Reliable, scalable, already in use*  
  [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Additional Tools:
- **Linting/Formatting:** ESLint, Prettier  
  *Justification: Code quality, consistency*  
  [ESLint Docs](https://eslint.org/) | [Prettier Docs](https://prettier.io/)

- **Build Tool:** Vite  
  *Justification: Fast, modern, already in use*  
  [Vite Docs](https://vitejs.dev/)

## Implementation Stages

> **Workflow Rule:** Whenever a to-do list item is marked as complete, the corresponding checklist in this documentation (Implementation.md) must also be updated to reflect the change. This rule applies to all future iterations and stages.

### Stage 1: Foundation & Setup
**Duration:** 2-3 days  
**Dependencies:** None

#### Sub-steps:
- [x] Audit the codebase for dead code and hardcoded data
- [x] Remove all unused files, components, and data
- [x] Set up ESLint and Prettier with strict rules
- [x] Ensure TypeScript strict mode is enabled
- [x] Document current project structure

### Stage 2: Core Refactor & Cleanup
**Duration:** 4-6 days  
**Dependencies:** Stage 1 completion

#### Sub-steps:
- [x] Remove the following unused frontend files identified during Stage 1:
    - client/src/components/features-section.tsx
    - client/src/components/statistics-section.tsx
    - client/src/components/contact-form.tsx
- [x] Refactor client/src/pages/draft.tsx for clarity and maintainability (split large files, extract hooks/components)
- [x] Refactor client/src/pages/echanges.tsx for clarity and maintainability (split large files, extract hooks/components)
- [x] Refactor client/src/pages/home.tsx for clarity and maintainability (split large files, extract hooks/components)
- [x] Refactor client/src/components/player-search.tsx for clarity and maintainability (split large files, extract hooks/components)
- [x] Refactor client/src/components/navigation.tsx for clarity and maintainability (split large files, extract hooks/components)
- [x] Standardize file and folder naming conventions
- [x] Centralize UI primitives in `components/ui`
- [x] Ensure all API calls go through hooks/services
- [x] **Restructure the server codebase:**
    - Create `controllers/` for request/response logic
    - Create `services/` for business logic and DB access
    - Create `models/` for data schemas/types
    - Create `middleware/` for authentication, validation, and error handling
    - Create `types/` for backend TypeScript types
    - Create `utils/` for shared utility functions
    - Refactor existing route files to use controllers and services
- [x] Revoir et uniformiser la gestion du loading et des erreurs dans tous les composants/pages.

### Stage 3: UI/UX Consistency & Feature Alignment
**Duration:** 5-7 days
**Dependencies:** Stage 2 completion

#### Sub-steps:
- [x] Créer les routes API nécessaires pour alimenter le feed d'activité et le dernier échange sur la page d'accueil.
- [x] Audit all UI components for consistency (colors, spacing, typography)
- [x] Refactor draft page table to match player search table visually and functionally
- [x] Refactor "Échange" section UI for improved usability and consistency
- [x] Apply semantic tokens across content pages (home, equipes, team-details, echanges)
- [ ] Redesign landing page for clarity and relevance *(deferred - pending design decisions)*
- [x] Create dedicated team pages with consistent layout and navigation
- [x] Ensure all pages use uniform layout and navigation components *(implemented shared Layout component)*

### Stage 4: NHL API Integration & Roster Management
**Duration:** 7-8 days  
**Dependencies:** Stage 3 completion  
**Status:** Phase 1 ✅ Complete | Phase 2-9 🚀 Ready to start

#### Overview:
Implement comprehensive roster tracking, NHL API integration with @olirobi/nhl_api_client, awards system, and player ownership display.
#### Sub-steps:

**Phase 0: Live NHL Scores Ticker**
- [x] Add `/api/scores` endpoint using nhl_api_client (`server/routes/scores.ts`)
- [x] Create scores service (`server/services/scoresService.ts`)
- [x] Create `IScores.ts` types (re-export from @olirobi/nhl_api_client)
- [x] Create `useNHLScores.ts` hook
- [x] Create `LiveScoresTicker.tsx` component
- [x] Integrate ticker into `Layout.tsx`

**Phase 1: Database & Core Infrastructure** ✅ **COMPLETED**
- [x] Create `joueurs` table (id, nhl_player_id, nom, prenom, position, created_at, updated_at)
- [x] ~~Create `effectifs` table~~ **DECISION: Used array approach instead**
  - [x] Add `nhl_player_ids INTEGER[]` column to `equipes` table (Option B - array approach)
  - **Rationale:** Simpler structure, faster reads, sufficient for current needs. Historical tracking can be added later if needed.
- [x] Add `joueur_id` column to `repechages` table with foreign key constraint
- [x] Create indexes: `idx_joueurs_nhl_player_id`, `idx_joueurs_position`, `idx_repechages_joueur_id`
- [x] Populate `trophees` table with pool awards (Général, Attaque, Défense, Gardien, Playoffs)
- [x] Update Docs/DB_STRUCTURE.md with new schema documentation
- [ ] Add backend types to `server/types/index.ts` *(deferred to Phase 2)*
- [ ] Add database queries to `server/models/index.ts` for all new tables *(deferred to Phase 2)*

**Phase 2: Player Management Service** 🚀 **READY TO START**
- [ ] Create `server/services/joueursService.ts`
  - `findPlayer()` - Find player by NHL ID (@olirobi/nhl_api_client players module get function)
  - `getCurrentTeam()` - Get player's current pool team (query `equipes` where `nhl_player_ids` array contains player's NHL ID)
  - `createPlayer()` - Create new player record in `joueurs` table
  - `getPlayerById()` - Get player by internal ID
  - `getPlayerByNhlId()` - Get player by NHL player ID

**Phase 3: Roster Tracking Service**
- [ ] Modify `server/services/teamsService.ts`
  - `getTeamRoster()` - Get team's current roster using `nhl_player_ids` array from `equipes` table
    - Query `joueurs` table where `nhl_player_id = ANY(equipes.nhl_player_ids)`
    - Return array of player objects with basic info
  - `getTeamRosterWithStats()` - Roster enriched with NHL stats (call NHL API for each player)
  - `addPlayerToRoster()` - Add player to team's `nhl_player_ids` array
  - `removePlayerFromRoster()` - Remove player from team's `nhl_player_ids` array
- [ ] Update `server/services/repechageService.ts`
  - Add `syncDraftPicksToRoster()` method
- [ ] Update `server/services/echangesService.ts`
  - Enhance `createEchange()` to update rosters **Might delay this to after launch**

**Phase 4: Roster API Endpoints**
- [ ] Create `server/controllers/effectifsController.ts`
- [ ] Create `server/routes/effectifs.ts`
  - `GET /api/teams/:id/roster` - Team roster with stats
  - `POST /api/effectifs/sync-draft` - Sync draft picks
  - `POST /api/effectifs/sync-trades` - Sync trades
  - `GET /api/joueurs/:nhlPlayerId/ownership` - Player's current team
- [ ] Update `server/routes.ts` to register effectifs routes

**Phase 5: NHL API Integration with nhl_api_client**
- [ ] Update `server/services/playersService.ts`
  - Replace direct NHL API `fetch()` with `nhlClient.players.get(id)`
  - Move player search from routes to service layer **Very important**
  - Implement proper error handling **See github docs**

**Phase 6: Awards System**
- [ ] Create `server/services/tropheesService.ts`
  - `getTeamTrophies()`
- [ ] Create `server/controllers/tropheesController.ts`
- [ ] Create `server/routes/trophees.ts`
  - `GET /api/trophees`, `GET /api/trophees/winners/:year`

**Phase 7: Frontend - Player Ownership Display**
- [ ] Create `client/src/hooks/joueur/usePlayerOwnership.ts`
- [ ] Update `client/src/components/joueur/JoueurHeader.tsx`
  - Add ownership badge showing "Owned by Team X"
  - Link badge to team page

**Phase 8: Frontend - Team Roster Display**
- [ ] Update `client/src/components/equipes/TeamRoster.tsx`
  - Replace empty state with functional roster table
  - Display: Player, Position, NHL Team, GP, G, A, Pts, Acquisition source
  - Link player names to detail pages
- [ ] Verify `client/src/hooks/useTeam.ts` fetches roster correctly

**Phase 9: Frontend - Awards Section**
- [ ] Add award types to `client/src/types/index.ts`
- [ ] Create `client/src/hooks/useTrophees.ts`
- [ ] Create `client/src/components/trophees/TropheesList.tsx`
- [ ] Create `client/src/components/trophees/TropheeCard.tsx`
- [ ] Create `client/src/components/equipes/TeamTrophies.tsx`
- [ ] Review UI plan to see clever way to display trophies
- [ ] Add different icons for each award type
- [ ] Général trophies are the most important so they should have a bigger presence or priority
- [ ] Add "Trophées" to team page


#### Verification Steps:
1. Database migration runs successfully
2. `GET /api/teams/1/roster` returns roster with NHL stats
3. `GET /api/joueurs/:nhlId/ownership` returns correct team
4. Player detail pages show ownership badge
5. Team roster tables display correctly with stats
6. Awards CRUD operations work
7. New draft picks auto-create roster entries
8. New trades update player ownership

#### Critical Files:
- `server/services/effectifsService.ts` (new)
- `server/services/playersService.ts` (modify)
- `client/src/components/equipes/TeamRoster.tsx` (modify)
- `client/src/components/joueur/JoueurHeader.tsx` (modify)

### Stage 5: Polish, Testing & Optimization
**Duration:** 2-3 days
**Dependencies:** Stage 4 completion

#### Sub-steps:
- [ ] Consider splitting the project into multiple repositories (frontend, backend, shared)
- [ ] Conduct comprehensive manual and automated testing
- [ ] Optimize performance (bundle size, lazy loading, etc.)
- [ ] Enhance accessibility (a11y) and responsive design
- [ ] Finalize documentation and code comments
- [ ] Prepare for deployment

## Resource Links
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Wouter Documentation](https://github.com/molefrog/wouter)
- [Node.js Documentation](https://nodejs.org/en/docs)
- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Vite Documentation](https://vitejs.dev/) 
- [NHL API Documentation](https://github.com/olirobi123/nhl-api-client)