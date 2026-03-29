# Cron Jobs

Tous les endpoints protégés par `requireApiKey` (`CRON_API_TOKEN` dans `.env`).

---

## Crons automatiques (nightly)

| Heure (ET) | Heure (UTC) | Endpoint | Ce que ça fait |
|------------|-------------|----------|----------------|
| **03:00** | **07:00** | `POST /api/points/update` | Recalcule les points de toutes les équipes depuis l'API NHL + snapshot `classement_prev` dans `api_store` |
| **03:15** | **07:15** | `POST /api/snapshot/live-points` | Snapshot `live_points` dans `api_store` (diff vs `classement_prev`) + si playoffs actifs : met à jour `equipe_semaine_points` (points diff baseline + PJ incrémental) |
| **À définir** | — | `POST /api/snapshot/injuries` | Snapshot blessures ESPN matchées aux joueurs du pool → table `blessures` |
| **À définir** | — | `POST /api/snapshot/etat` | Snapshot état hot/cold/normal des joueurs → table `etat_joueurs` |

> L'ordre 03:00 → 03:15 est important : `points/update` doit s'exécuter en premier pour que `classement_prev` soit à jour avant le snapshot live.

---

## Logique d'affichage : live play-by-play vs snapshot

Le endpoint `GET /api/live-points` choisit automatiquement entre les données en direct (play-by-play NHL) et le snapshot `live_points` stocké dans `api_store`.

### Règle de sélection (`shouldServeSnapshot`)

La frontière critique est **03:00 ET** (heure du cron).

| Fenêtre | Condition pour servir le snapshot |
|---------|----------------------------------|
| **Avant 03:00 ET** | `isSnapshotFresh` ET aucun match de la veille en état actif (LIVE, CRIT, FINAL, OFF) ET aucun match du jour en cours (LIVE, CRIT) |
| **Après 03:00 ET** | `isSnapshotFresh` ET aucun match en cours (LIVE, CRIT) — les FINAL/OFF sont ok car le cron les a capturés |

**`isSnapshotFresh`** : le snapshot a été écrit après la dernière exécution du cron (03:00 ET).
- Si maintenant ≥ 03:00 ET : le snapshot doit dater d'aujourd'hui à ≥ 03:00 ET.
- Si maintenant < 03:00 ET : le snapshot doit dater d'hier à ≥ 03:00 ET (ou d'aujourd'hui).

### Pourquoi les FINAL/OFF bloquent avant 03:00 ET

Le cron tourne à **03:15 ET**, après la fin des matchs du soir (~01:00 ET). Le snapshot de la veille a donc été pris à 03:15 ET *hier matin*, soit **avant** les matchs du soir. Un match en état FINAL ou OFF représente des résultats que ce snapshot ne contient pas encore — il faut donc lire le play-by-play.

Après 03:15 ET, le nouveau snapshot a capturé tous les matchs complétés : seuls les matchs encore en cours (LIVE, CRIT) le bloquent.

### Gestion des matchs passés minuit

Les matchs qui commencent le soir du jour J (gameDate = J) et se terminent après minuit ET sont inclus dans `activeGames` indépendamment de la date courante retournée par l'API NHL. Cela évite qu'un match de prolongation passé minuit disparaisse du calcul live.

### Timeline complète (jour type)

| Heure ET | Affiché | Raison |
|----------|---------|--------|
| 19:00 – minuit | **Play-by-play live** | Matchs en LIVE/CRIT → snapshot bloqué |
| Minuit – 03:00 | **Play-by-play live** | Matchs de la veille en FINAL/OFF → snapshot bloqué (avant cron) |
| **03:15** | — | Cron écrit le snapshot avec les résultats définitifs |
| 03:20 – 19:00 | **Snapshot** | `isSnapshotFresh = true`, aucun match en cours → snapshot servi |
| 19:00+ | **Play-by-play live** | Nouveaux matchs en LIVE/CRIT → snapshot bloqué à nouveau |

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
