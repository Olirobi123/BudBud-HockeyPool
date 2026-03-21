# Cron Jobs

Tous les endpoints protégés par `requireApiKey` (`CRON_API_TOKEN` dans `.env`).

---

## Crons automatiques (nightly)

| Heure | Endpoint | Ce que ça fait |
|-------|----------|----------------|
| **19:00** | `POST /api/points/update` | Recalcule les points de toutes les équipes depuis l'API NHL + snapshot `classement_prev` dans `api_store` |
| **19:15** | `POST /api/snapshot/live-points` | Snapshot `live_points` dans `api_store` (diff vs `classement_prev`) + si playoffs actifs : met à jour `equipe_semaine_points` (points diff baseline + PJ incrémental) |
| **À définir** | `POST /api/snapshot/injuries` | Snapshot blessures ESPN matchées aux joueurs du pool → table `blessures` |
| **À définir** | `POST /api/snapshot/etat` | Snapshot état hot/cold/normal des joueurs → table `etat_joueurs` |

> L'ordre 19:00 → 19:15 est important : `points/update` doit s'exécuter en premier pour que `classement_prev` soit à jour avant le snapshot live.

---

## Actions manuelles (playoffs seulement)

| Moment | Endpoint | Body | Ce que ça fait |
|--------|----------|------|----------------|
| **Avant les playoffs** | `POST /api/series/initialize` | _(aucun)_ | Seed le bracket QF depuis le classement + snapshot baseline semaine 1 automatiquement |
| **Fin ronde 1** | `POST /api/series/resolve-round` | `{ ronde: 1 }` | Détermine les gagnants QF, seed les SF, snapshot baseline semaine 2 |
| **Fin ronde 2** | `POST /api/series/resolve-round` | `{ ronde: 2 }` | Détermine les gagnants SF, seed la Finale, snapshot baseline semaine 3 |
| **Fin ronde 3** | `POST /api/series/resolve-round` | `{ ronde: 3 }` | Détermine le gagnant de la Finale |

> `resolve-round` appelle `snapshotWeekBaseline` pour la ronde suivante automatiquement (rondes 1 et 2).

---

## Endpoints disponibles mais non utilisés en cron

| Endpoint | Usage |
|----------|-------|
| `POST /api/series/snapshot-baseline` | Recapturer manuellement une baseline (`{ semaine: N }`) — utile en cas de correction |
| `POST /api/series/update-week` | Recalculer manuellement les points d'une semaine (`{ semaine: N }`) — debug seulement |
| `POST /api/series/auto-update` | Idem `update-week`, remplacé par l'intégration dans `snapshot/live-points` |

---

## Flux playoffs complet

```
AVANT PLAYOFFS
  → POST /api/series/initialize
      seeds bracket QF + baseline semaine 1

NIGHTLY (automatique)
  19:00 → POST /api/points/update
  19:15 → POST /api/snapshot/live-points
              └── si ronde active: updateDailySeries() → equipe_semaine_points

FIN RONDE 1
  → POST /api/series/resolve-round  { ronde: 1 }
      gagnants QF + seed SF + baseline semaine 2

FIN RONDE 2
  → POST /api/series/resolve-round  { ronde: 2 }
      gagnants SF + seed Finale + baseline semaine 3

FIN RONDE 3
  → POST /api/series/resolve-round  { ronde: 3 }
      gagnant Finale
```

---

## Calendrier playoffs 2026

| Semaine | Ronde | Dates |
|---------|-------|-------|
| 1 | Quarts de finale | 2026-03-23 → 2026-03-29 |
| 2 | Demi-finales | 2026-03-30 → 2026-04-05 |
| 3 | Finale | 2026-04-06 → 2026-04-12 |
