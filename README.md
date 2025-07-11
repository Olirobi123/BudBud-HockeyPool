# 🇫🇷 38BudBud – Pool de Hockey Moderne

**38BudBud** est une plateforme web moderne pour la gestion de pools de hockey, offrant une expérience utilisateur intuitive, un suivi en temps réel, des statistiques avancées et des fonctionnalités collaboratives pour les échanges, repêchages et classements d’équipes.

## Fonctionnalités principales

- **Gestion des équipes** : Visualisation et gestion des équipes participantes.
- **Échanges** : Création et suivi des échanges de joueurs entre équipes.
- **Repêchage** : Gestion des différents types de repêchages (annuel, expansion, ballotage…).
- **Recherche de joueurs** : Recherche rapide de joueurs via l’API NHL.
- **Statistiques avancées** : Suivi des performances, classements et analytics.
- **Interface responsive** : Design moderne, adaptatif et rapide.
- **Sécurité et accessibilité** : Standards élevés pour la sécurité et l’accessibilité.

## Structure technique

- **Frontend** : React + TypeScript, Vite, TailwindCSS
- **Backend** : Node.js, Express, PostgreSQL
- **API** :
  - `/api/teams` : Récupération des équipes (toutes, actives, par ID)
  - `/api/echanges` : Liste et création d’échanges
  - `/api/repechage` : Liste des choix de repêchage, par type/année
  - `/api/players/:id` : Détails d’un joueur via l’API NHL

## Base de données (PostgreSQL)

- Tables principales : `equipes`, `echanges`, `repechages`, `trophees`, `trophee_gagnants`, `types_repechage`
- Relations documentées dans `Docs/DB_STRUCTURE.md`

---

# 🇬🇧 38BudBud – Modern Hockey Pool Platform

**38BudBud** is a modern web platform for managing hockey pools, offering an intuitive user experience, real-time tracking, advanced statistics, and collaborative features for trades, drafts, and team rankings.

## Main Features

- **Team Management**: View and manage participating teams.
- **Trades**: Create and track player trades between teams.
- **Drafts**: Manage various draft types (annual, expansion, waivers, etc.).
- **Player Search**: Fast player search via the NHL API.
- **Advanced Statistics**: Performance tracking, rankings, and analytics.
- **Responsive UI**: Modern, adaptive, and fast design.
- **Security & Accessibility**: High standards for security and accessibility.

## Technical Stack

- **Frontend**: React + TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, PostgreSQL
- **API**:
  - `/api/teams`: Get teams (all, active, by ID)
  - `/api/echanges`: List and create trades
  - `/api/repechage`: List draft picks, by type/year
  - `/api/players/:id`: Player details via NHL API

## Database (PostgreSQL)

- Main tables: `equipes`, `echanges`, `repechages`, `trophees`, `trophee_gagnants`, `types_repechage`
- See `Docs/DB_STRUCTURE.md` for full schema
