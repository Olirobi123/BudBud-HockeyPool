# 🇫🇷 38BudBud – Pool de Hockey Moderne

**38BudBud** est une plateforme web bilingue (français/anglais) pour la gestion de pools de hockey. Elle offre un suivi en temps réel des scores NHL, la gestion des équipes et des effectifs, des statistiques avancées, un système d'échanges et de repêchage, ainsi qu'un palmarès de trophées.

## Fonctionnalités

- **Classements en temps réel** : Suivi des points du pool lors des journées de match.
- **Scores NHL en direct** : Bandeau de scores NHL intégré dans toutes les pages.
- **Gestion des équipes** : Fiche d'équipe avec effectif complet, statistiques et trophées.
- **Effectifs avec statistiques** : Top 12 attaquants, top 6 défenseurs et gardiens, enrichis via l'API NHL.
- **Échanges** : Suivi des transferts de joueurs entre équipes du pool.
- **Repêchage** : Gestion des différents types de repêchages (annuel, expansion, ballotage…).
- **Recherche de joueurs** : Recherche rapide via l'API NHL avec badge de propriété dans le pool.
- **Trophées** : Palmarès des équipes (Général, Attaque, Défense, Gardien, Playoffs).
- **Interface responsive** : Design mobile-first avec mode sombre.

## Stack technique

- **Frontend** : React 18 + TypeScript, Vite, Tailwind CSS, TanStack Query, shadcn/ui (Radix)
- **Backend** : Node.js + Express + TypeScript (architecture MVC)
- **Base de données** : PostgreSQL (8 tables)
- **API externe** : `@olirobi/nhl_api_client`

## API

| Route | Description |
|---|---|
| `GET /api/teams` | Liste des équipes |
| `GET /api/teams/:id/roster` | Effectif d'une équipe |
| `GET /api/teams/:id/roster/stats` | Effectif enrichi de statistiques NHL |
| `GET /api/players/search` | Recherche de joueurs NHL |
| `GET /api/players/:nhlId/ownership` | Propriétaire d'un joueur dans le pool |
| `GET /api/players/nhl/:nhlId` | Détails d'un joueur via l'API NHL |
| `GET /api/scores` | Scores NHL en direct |
| `GET /api/points` | Classement saison complète |
| `GET /api/live-points` | Points en direct (jours de match) |
| `GET /api/echanges` | Liste des échanges |
| `GET /api/repechage` | Choix de repêchage |
| `GET /api/trophees` | Trophées et palmarès |
| `GET /api/health` | Santé du serveur |

## Base de données (PostgreSQL)

Tables : `equipes`, `joueurs`, `equipe_joueurs` (jonction), `repechages`, `types_repechage`, `echanges`, `trophees`, `trophee_gagnants`

Voir `Docs/DB_STRUCTURE.md` pour le schéma complet.

## Démarrage

```bash
# Prérequis : NODE_ENV, DATABASE_URL dans .env

npm install
npm run dev       # Serveur de développement (port 5000)
npm run build     # Build de production
npm run check     # Vérification TypeScript
npm run lint      # Lint strict (0 avertissements)
```

---

# 🇬🇧 38BudBud – Modern Hockey Pool Platform

**38BudBud** is a bilingual (French/English) web platform for managing hockey pools. It features real-time NHL score tracking, full team and roster management, advanced statistics, a trades and draft system, and a trophy showcase.

## Features

- **Live Pool Standings**: Track pool points during game days.
- **Live NHL Scores**: NHL score ticker integrated across all pages.
- **Team Management**: Team pages with full rosters, stats, and trophy history.
- **Rosters with Statistics**: Top 12 forwards, top 6 defensemen, and goalies enriched via the NHL API.
- **Trades**: Track player transfers between pool teams.
- **Drafts**: Manage draft types (annual, expansion, waivers, etc.).
- **Player Search**: Fast NHL player search with pool ownership badge.
- **Trophies**: Team award history (Overall, Attack, Defense, Goalie, Playoffs).
- **Responsive UI**: Mobile-first design with dark mode support.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, TanStack Query, shadcn/ui (Radix)
- **Backend**: Node.js + Express + TypeScript (MVC architecture)
- **Database**: PostgreSQL (8 tables)
- **External API**: `@olirobi/nhl_api_client`

## API

| Route | Description |
|---|---|
| `GET /api/teams` | List all teams |
| `GET /api/teams/:id/roster` | Team roster |
| `GET /api/teams/:id/roster/stats` | Roster enriched with NHL stats |
| `GET /api/players/search` | Search NHL players |
| `GET /api/players/:nhlId/ownership` | Pool owner of a player |
| `GET /api/players/nhl/:nhlId` | Player details from NHL API |
| `GET /api/scores` | Live NHL scores |
| `GET /api/points` | Full season standings |
| `GET /api/live-points` | Live points on game days |
| `GET /api/echanges` | List trades |
| `GET /api/repechage` | Draft picks |
| `GET /api/trophees` | Trophies and awards |
| `GET /api/health` | Server health check |

## Database (PostgreSQL)

Tables: `equipes`, `joueurs`, `equipe_joueurs` (junction), `repechages`, `types_repechage`, `echanges`, `trophees`, `trophee_gagnants`

See `Docs/DB_STRUCTURE.md` for the full schema.

## Getting Started

```bash
# Prerequisites: NODE_ENV, DATABASE_URL in .env

npm install
npm run dev       # Development server (port 5000)
npm run build     # Production build
npm run check     # TypeScript type checking
npm run lint      # Strict lint (0 warnings allowed)
```
