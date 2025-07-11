# Project Structure

## Root Directory

```
BudBudAI/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Stateless UI primitives (Button, Card, etc.)
│   │   │   ├── [feature]/         # Feature/layout components (Navigation, Footer, etc.)
│   │   ├── pages/                 # Page entry points (home, equipes, draft, etc.)
│   │   ├── hooks/                 # Custom React hooks (data fetching, logic)
│   │   ├── lib/                   # Context providers, QueryClient, utilities
│   │   ├── types/                 # TypeScript type definitions
│   │   └── index.css              # Global styles (Tailwind)
│   ├── public/                    # Static assets
│   └── index.html                 # App entry point
├── server/
│   ├── config/                    # Configuration files (DB, env)
│   ├── routes/                    # Route logic for trades, players, draft, teams
│   ├── index.ts                   # Server entry point
│   ├── routes.ts                  # Route registration
│   └── vite.ts                    # (If used for SSR/dev tooling)
├── shared/                        # Shared types/interfaces (if needed)
├── Docs/                          # Project documentation
│   ├── Implementation.md
│   ├── project_structure.md
│   └── UI_UX_doc.md
├── package.json
├── README.md
└── .cursorrules
```

## Detailed Structure

### client/
- **src/components/ui/**: Stateless, reusable UI primitives. No business logic or API calls. Used throughout the app for visual consistency. (See UI_UX_doc.md)
- **src/components/[feature]/**: Feature/layout components that compose UI primitives and orchestrate feature logic (e.g., Navigation, Footer, PlayerSearch).
- **src/pages/**: Page entry points. Compose features, orchestrate data fetching via hooks, handle loading/error states.
- **src/hooks/**: Custom React hooks for data fetching, state, or logic reuse. No UI code.
- **src/lib/**: Context providers (e.g., loading context), QueryClient setup, and utilities. No UI code.
- **src/types/**: TypeScript type definitions only.
- **src/index.css**: Global styles, Tailwind base imports.
- **public/**: Static assets (images, favicon, etc.).
- **index.html**: Main HTML entry point for the SPA.

### server/ (Current State)
- **config/**: Database configuration (`database.ts`).
- **routes/**: All route logic for different resources (trades, players, draft, teams) is handled directly in these files.
- **index.ts**: Main server entry point.
- **routes.ts**: Registers and combines all routes.
- **vite.ts**: (If used for SSR or dev tooling; otherwise, can be removed.)

#### Note:
- The server currently does **not** have explicit `controllers/`, `services/`, `models/`, `middleware/`, `types/`, or `utils/` directories. All logic is handled in route files.
- This structure is functional for small projects but will be refactored for better maintainability and scalability (see Implementation.md, Stage 2).

### server/ (Target Refactored State)
- **config/**: Configuration files (database, environment variables, etc.).
- **controllers/**: Express route handlers. Only handle HTTP logic, delegate to services.
- **services/**: Business logic and database access. Encapsulate all DB queries and business rules.
- **models/**: Data models/schemas (if using ORM or for type safety).
- **middleware/**: Express middleware (authentication, validation, error handling).
- **routes/**: Route definitions, import controllers.
- **types/**: Backend TypeScript types/interfaces.
- **utils/**: Shared utility/helper functions.
- **index.ts**: Main server entry point.

#### See Implementation.md, Stage 2 for the refactoring plan.

### shared/
- **Purpose:** Shared types/interfaces between frontend and backend (optional, for type safety).

### Docs/
- **Purpose:** All project documentation, including implementation plan, structure, and UI/UX docs. (See Implementation.md and UI_UX_doc.md)

### Configuration & Build
- **.env, .env.local:** Environment-specific configuration (API URLs, DB credentials, secrets).
- **package.json:** Project dependencies and scripts.
- **tailwind.config.ts:** Tailwind CSS configuration.
- **tsconfig.json:** TypeScript configuration.
- **vite.config.ts:** Vite build configuration.
- **eslint, prettier configs:** Linting and formatting rules.

### Asset Organization
- **public/**: Static assets for the frontend (images, favicon, etc.).
- **src/index.css:** Global styles, Tailwind imports.

### Build & Deployment
- **Vite** is used for frontend build and dev server.
- **Node.js/Express** for backend server.
- **Deployment:** Both client and server can be deployed separately or together, depending on hosting setup.

### Naming Conventions
- **Components:** PascalCase
- **Files:** kebab-case or PascalCase for components
- **Variables:** camelCase
- **Constants:** UPPER_SNAKE_CASE

### Cross-References
- See Implementation.md for the full implementation plan and task breakdown.
- See UI_UX_doc.md for design system, UI/UX guidelines, and component structure. 