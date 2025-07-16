# Implementation Plan for 38BudBud Refactor & UI/UX Overhaul

## Feature Analysis

### Identified Features:
- Player search (already functional)
- Trades ("Échange" section, functional but UI needs improvement)
- Draft page ("Repêchage", table UI/UX to be improved)
- Team management (create a dedicated page for each team)
- Landing page (needs redesign for clarity and relevance)
- UI/UX consistency (uniform components, visual harmony)
- Code cleanup (remove dead code, hardcoded data)
- General codebase refactor (structure, maintainability)

### Feature Categorization:
- **Must-Have Features:**
  - Code cleanup (remove dead code, hardcoded data)
  - Refactor draft page table to match player stats sections
  - Redesign landing page
  - Create dedicated team pages
- **Should-Have Features:**
  - Refactor "Échange" section UI
  - Improve code structure for maintainability
- **Nice-to-Have Features:**
 - UI/UX consistency (uniform components)

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
- [ ] Centralize UI primitives in `components/ui`
- [ ] Ensure all API calls go through hooks/services
- [ ] **Restructure the server codebase:**
    - Create `controllers/` for request/response logic
    - Create `services/` for business logic and DB access
    - Create `models/` for data schemas/types
    - Create `middleware/` for authentication, validation, and error handling
    - Create `types/` for backend TypeScript types
    - Create `utils/` for shared utility functions
    - Refactor existing route files to use controllers and services
- [ ] Revoir et uniformiser la gestion du loading et des erreurs dans tous les composants/pages.

### Stage 3: UI/UX Consistency & Feature Alignment
**Duration:** 5-7 days  
**Dependencies:** Stage 2 completion

#### Sub-steps:
- [ ] Créer les routes API nécessaires pour alimenter le feed d’activité et le dernier échange sur la page d’accueil.
- [ ] Audit all UI components for consistency (colors, spacing, typography)
- [ ] Refactor draft page table to match player search table visually and functionally
- [ ] Refactor "Échange" section UI for improved usability and consistency
- [ ] Redesign landing page for clarity and relevance
- [ ] Create dedicated team pages with consistent layout and navigation
- [ ] Ensure all pages use uniform layout and navigation components

### Stage 4: Polish, Testing & Optimization
**Duration:** 2-3 days  
**Dependencies:** Stage 3 completion

#### Sub-steps:
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