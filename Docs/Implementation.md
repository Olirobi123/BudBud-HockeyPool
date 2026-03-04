# Implementation Plan for 38BudBud

## Tech Stack

### Frontend:
- **Framework:** React 18 + TypeScript  
  *Justification: Modern, maintainable, type-safe, already in use*  
  [React Docs](https://react.dev/) | [TypeScript Docs](https://www.typescriptlang.org/)

- **Styling:** Tailwind CSS  
  *Justification: Utility-first, enforces consistency, already in use*  
  [Tailwind Docs](https://tailwindcss.com/)


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

#### Pending Optimizations (blocked on library update)

**Bulk NHL stats endpoints for points calculation**
The NHL stats REST API exposes two bulk endpoints that return all players in a single request:
- `GET https://api.nhle.com/stats/rest/en/skater/summary?cayenneExp=seasonId=YYYYYYYY` — all skaters with goals/assists/points
- `GET https://api.nhle.com/stats/rest/en/goalie/summary?cayenneExp=seasonId=YYYYYYYY` — all goalies with wins/shutouts

These need to be added to `@olirobi/nhl_api_client` first.

Once available, `pointsService.updateAllTeamPoints()` can be refactored:
- Replace the per-team `getTeamRosterWithStats()` call (which hits `/player/{id}/landing` per player) with **2 bulk calls** at the start — one for all skaters, one for all goalies
- Look up each pool player by `playerId` in the bulk response
- `getTeamRosterWithStats()` keeps using the landing endpoint for the **roster display path** (it still needs `teamLogo` and richer profile data which the bulk endpoint doesn't provide)

**Scope:** `server/services/pointsService.ts` only — the bulk approach only applies to the season standings cron, not the live points snapshot (which uses play-by-play data) and not the team roster display.

## Resource Links
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Node.js Documentation](https://nodejs.org/en/docs)
- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Vite Documentation](https://vitejs.dev/) 
- [NHL API Documentation](https://github.com/olirobi123/nhl-api-client)