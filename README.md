# 🇫🇷 38BudBud

<img width="1408" height="837" alt="image" src="https://github.com/user-attachments/assets/3be98ce2-60ed-4a1c-a181-05c771afdb30" />

**38BudBud** est une plateforme web pour la gestion d'un pool de hockey dynasty entre amis : effectifs, échanges, repêchage, séries éliminatoires et trophées, le tout suivi en temps réel avec les données NHL en direct.

## Fonctionnalités

- **Suivi en temps réel** : scores NHL en direct et classement du pool mis à jour pendant les journées de match.
- **Équipes et effectifs** : fiches d'équipe complètes, enrichies de statistiques NHL et de l'historique des trophées.
- **Échanges et repêchage** : transferts de joueurs, choix futurs, différents types de repêchage (annuel, expansion, ballotage…) et un draft day en direct.
- **Fiche joueur** : recherche rapide, propriété dans le pool, historique complet (échanges, repêchages, ballotages), état de forme et blessures.
- **Séries éliminatoires** : bracket des playoffs du pool avec classement par semaine.
- **Interface responsive** : design mobile-first.

## Stack technique

- **Frontend** : React 18 + TypeScript, Vite, Tailwind CSS, TanStack Query, shadcn/ui (Radix)
- **Backend** : Node.js + Express + TypeScript (architecture MVC)
- **Base de données** : PostgreSQL
- **API externe** : `@olirobi/nhl_api_client`

## Documentation

La liste complète des routes API est dans `server/routes.ts`, et le schéma détaillé de la base de données dans [`Docs/DB_STRUCTURE.md`](Docs/DB_STRUCTURE.md). Voir aussi [`CLAUDE.md`](CLAUDE.md) pour l'architecture générale et [`Docs/`](Docs/) pour le design system, le suivi des bugs et les cron jobs.

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

**38BudBud** is a bilingual (French/English) web platform for running a hockey pool with friends: rosters, trades, drafts, playoff brackets and trophies, all tracked in real time against live NHL data.

## Features

- **Live tracking**: live NHL scores and pool standings updated during game days.
- **Teams and rosters**: full team pages enriched with NHL stats and trophy history.
- **Trades and drafts**: player transfers, future picks, multiple draft types (annual, expansion, waivers…), and a live draft day.
- **Player profile**: fast search, pool ownership, full history (trades, drafts, waivers), form status and injuries.
- **Playoff bracket**: pool playoff series with weekly standings.
- **Responsive UI**: mobile-first design.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, TanStack Query, shadcn/ui (Radix)
- **Backend**: Node.js + Express + TypeScript (MVC architecture)
- **Database**: PostgreSQL
- **External API**: `@olirobi/nhl_api_client`

## Documentation

The full list of API routes lives in `server/routes.ts`, and the detailed database schema in [`Docs/DB_STRUCTURE.md`](Docs/DB_STRUCTURE.md). See also [`CLAUDE.md`](CLAUDE.md) for the overall architecture and [`Docs/`](Docs/) for the design system, bug tracking, and cron jobs.

## Getting Started

```bash
# Prerequisites: NODE_ENV, DATABASE_URL in .env

npm install
npm run dev       # Development server (port 5000)
npm run build     # Production build
npm run check     # TypeScript type checking
npm run lint      # Strict lint (0 warnings allowed)
```
