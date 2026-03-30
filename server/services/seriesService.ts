import pool from '../config/database';
import { QUERIES } from '../models';
import { getCurrentSeason } from './seasonHelper';
import {
  SeriesPlayoff,
  SemaineBaseline,
  EquipeSemainePoints,
  LiveTeamPoints,
} from '../types';

// Playoff schedule: semaine → { debut, fin }
const PLAYOFF_WEEKS: Record<number, { debut: string; fin: string }> = {
  1: { debut: '2026-03-23', fin: '2026-03-29' }, // QF week (Mon–Sun)
  2: { debut: '2026-03-30', fin: '2026-04-05' }, // SF week
  3: { debut: '2026-04-06', fin: '2026-04-12' }, // Final week
};

export class SeriesService {
  getRondeActive(): 1 | 2 | 3 | null {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    return this.getRondeForDate(today);
  }

  /**
   * Returns the active round for a specific date string (YYYY-MM-DD).
   * Used by the snapshot cron to determine which semaine to credit based on the
   * game date being captured (yesterday UTC), not today's date.
   */
  getRondeForDate(date: string): 1 | 2 | 3 | null {
    for (const [semaineStr, range] of Object.entries(PLAYOFF_WEEKS)) {
      if (date >= range.debut && date <= range.fin) {
        return parseInt(semaineStr) as 1 | 2 | 3;
      }
    }
    const playoffStart = '2026-03-23';
    const playoffEnd = '2026-04-12';
    if (date >= playoffStart && date <= playoffEnd) {
      if (date < PLAYOFF_WEEKS[1].debut) return 1;
      if (date < PLAYOFF_WEEKS[2].debut) return 1;
      if (date < PLAYOFF_WEEKS[3].debut) return 2;
      return 3;
    }
    return null;
  }

  /**
   * Update daily series points and PJ for the active playoff round.
   * Called from snapshotService after saving live_points.
   */
  async updateDailySeries(
    saison: string,
    semaine: number,
    leaderboard: Pick<LiveTeamPoints, 'equipeId' | 'totalPJ'>[],
  ): Promise<void> {
    const week = PLAYOFF_WEEKS[semaine];
    if (!week) return;

    const [baselineResult, currentResult, existingPjResult] = await Promise.all([
      pool.query(QUERIES.GET_SEMAINE_BASELINE, [saison, semaine]),
      pool.query(QUERIES.GET_CURRENT_EQUIPE_POINTS_ALL, [saison]),
      pool.query(QUERIES.GET_SEMAINE_POINTS_MATCHS, [saison, semaine]),
    ]);

    const baselineMap = new Map<number, SemaineBaseline>(
      baselineResult.rows.map((r: SemaineBaseline) => [r.equipe_id, r]),
    );
    const existingPjMap = new Map<number, number>(
      existingPjResult.rows.map((r: { equipe_id: number; total_matchs: number }) => [
        r.equipe_id,
        r.total_matchs,
      ]),
    );
    const dailyPjMap = new Map<number, number>(leaderboard.map((t) => [t.equipeId, t.totalPJ]));

    for (const current of currentResult.rows) {
      const baseline = baselineMap.get(current.equipe_id);
      if (!baseline) continue;

      const attaque = Math.max(0, current.attaque_points - baseline.attaque_points);
      const defense = Math.max(0, current.defense_points - baseline.defense_points);
      const gardien = Math.max(0, current.gardien_points - baseline.gardien_points);
      const total   = Math.max(0, current.total_points   - baseline.total_points);

      const dailyPj = dailyPjMap.get(current.equipe_id) ?? 0;
      const newPj = (existingPjMap.get(current.equipe_id) ?? 0) + dailyPj;

      await pool.query(QUERIES.UPSERT_SEMAINE_POINTS, [
        current.equipe_id, saison, semaine, week.debut, week.fin,
        attaque, defense, gardien, total, newPj,
      ]);
    }
  }

  /**
   * Initialize the bracket from current division standings.
   * Seeds the 4 QF matchups into series_playoffs.
   */
  async initializeBracket(saison?: string): Promise<void> {
    const s = saison ?? getCurrentSeason();

    const nordResult = await pool.query(QUERIES.GET_RANKINGS_BY_DIVISION_FOR_SERIES, ['nord', s]);
    const sudResult = await pool.query(QUERIES.GET_RANKINGS_BY_DIVISION_FOR_SERIES, ['sud', s]);

    const nord = nordResult.rows;
    const sud = sudResult.rows;

    if (nord.length < 4 || sud.length < 4) {
      throw new Error(`Not enough teams: nord=${nord.length}, sud=${sud.length} (need 4 each)`);
    }

    // QF matchups: seed 1v4 (position 1), seed 2v3 (position 2)
    const qfMatchups = [
      { division: 'nord', position: 1, a: nord[0].equipe_id, b: nord[3].equipe_id },
      { division: 'nord', position: 2, a: nord[1].equipe_id, b: nord[2].equipe_id },
      { division: 'sud',  position: 3, a: sud[0].equipe_id,  b: sud[3].equipe_id },
      { division: 'sud',  position: 4, a: sud[1].equipe_id,  b: sud[2].equipe_id },
    ];

    for (const m of qfMatchups) {
      await pool.query(QUERIES.INSERT_SERIES, [s, 1, m.division, m.position, m.a, m.b, null]);
    }

    // Seed placeholder rows for SF and Final
    await pool.query(QUERIES.INSERT_SERIES, [s, 2, 'nord', 5, null, null, null]);
    await pool.query(QUERIES.INSERT_SERIES, [s, 2, 'sud',  6, null, null, null]);
    await pool.query(QUERIES.INSERT_SERIES, [s, 3, null,   7, null, null, null]);

    // Snapshot QF baseline automatically
    await this.snapshotWeekBaseline(s, 1);
  }

  /**
   * Snapshot current equipe_points into series_semaine_baseline.
   * Called at the start of each playoff week.
   */
  async snapshotWeekBaseline(saison: string, semaine: number): Promise<void> {
    const [currentPoints, playoffTeamsResult] = await Promise.all([
      pool.query(QUERIES.GET_CURRENT_EQUIPE_POINTS_ALL, [saison]),
      pool.query(QUERIES.GET_PLAYOFF_TEAMS_WITH_NAMES, [saison]),
    ]);

    const playoffTeamIds = new Set<number>(
      playoffTeamsResult.rows.map((r: { id: number }) => r.id),
    );

    for (const row of currentPoints.rows.filter((r: { equipe_id: number }) => playoffTeamIds.has(r.equipe_id))) {
      await pool.query(QUERIES.UPSERT_SEMAINE_BASELINE, [
        row.equipe_id,
        saison,
        semaine,
        row.total_points,
        row.attaque_points,
        row.defense_points,
        row.gardien_points,
        row.total_matchs,
      ]);
    }
  }

  /**
   * Compute weekly points as (current - baseline) and upsert into equipe_semaine_points.
   * No NHL API calls — DB diff only.
   */
  async updateWeeklyPoints(saison: string, semaine: number): Promise<void> {
    const week = PLAYOFF_WEEKS[semaine];
    if (!week) throw new Error(`Invalid semaine: ${semaine}`);

    const [baselineResult, currentResult] = await Promise.all([
      pool.query(QUERIES.GET_SEMAINE_BASELINE, [saison, semaine]),
      pool.query(QUERIES.GET_CURRENT_EQUIPE_POINTS_ALL, [saison]),
    ]);

    const baselineMap = new Map<number, SemaineBaseline>(
      baselineResult.rows.map((r: SemaineBaseline) => [r.equipe_id, r]),
    );

    for (const current of currentResult.rows) {
      const baseline = baselineMap.get(current.equipe_id);
      if (!baseline) continue;

      await pool.query(QUERIES.UPSERT_SEMAINE_POINTS, [
        current.equipe_id,
        saison,
        semaine,
        week.debut,
        week.fin,
        Math.max(0, current.attaque_points - baseline.attaque_points),
        Math.max(0, current.defense_points - baseline.defense_points),
        Math.max(0, current.gardien_points - baseline.gardien_points),
        Math.max(0, current.total_points - baseline.total_points),
        Math.max(0, current.total_matchs - baseline.total_matchs),
      ]);
    }
  }

  /**
   * Resolve a round: determine winners, update bracket, seed next round.
   */
  async resolveRound(saison: string, ronde: 1 | 2 | 3): Promise<void> {
    const semaine = ronde; // semaine === ronde (1=QF, 2=SF, 3=Final)

    const [seriesResult, weekPointsResult] = await Promise.all([
      pool.query(QUERIES.GET_SERIES_BY_SAISON, [saison]),
      pool.query(QUERIES.GET_SEMAINE_POINTS, [saison, semaine]),
    ]);

    const matchups: SeriesPlayoff[] = seriesResult.rows.filter(
      (r: SeriesPlayoff) => r.ronde === ronde && r.equipe_a_id !== null && r.equipe_b_id !== null,
    );

    const weekMap = new Map<number, EquipeSemainePoints>(
      weekPointsResult.rows.map((r: EquipeSemainePoints) => [r.equipe_id, r]),
    );

    const winners: Array<{ position: number; gagnantId: number; division: string | null }> = [];

    for (const matchup of matchups) {
      const a = weekMap.get(matchup.equipe_a_id!);
      const b = weekMap.get(matchup.equipe_b_id!);

      if (!a || !b) continue;

      const gagnantId = this.determineWinner(a, b);
      await pool.query(QUERIES.UPDATE_SERIES_WINNER, [gagnantId, saison, ronde, matchup.position]);
      winners.push({ position: matchup.position, gagnantId, division: matchup.division });
    }

    // Seed next round
    if (ronde === 1 && winners.length === 4) {
      const nordWinners = winners.filter((w) => w.division === 'nord').map((w) => w.gagnantId);
      const sudWinners = winners.filter((w) => w.division === 'sud').map((w) => w.gagnantId);

      if (nordWinners.length === 2) {
        await pool.query(QUERIES.INSERT_SERIES, [saison, 2, 'nord', 5, nordWinners[0], nordWinners[1], null]);
      }
      if (sudWinners.length === 2) {
        await pool.query(QUERIES.INSERT_SERIES, [saison, 2, 'sud', 6, sudWinners[0], sudWinners[1], null]);
      }

      await this.snapshotWeekBaseline(saison, 2);
    } else if (ronde === 2 && winners.length === 2) {
      await pool.query(QUERIES.INSERT_SERIES, [saison, 3, null, 7, winners[0].gagnantId, winners[1].gagnantId, null]);
      await this.snapshotWeekBaseline(saison, 3);
    } else if (ronde === 3 && winners.length === 1) {
      // Auto-attribuer le trophée Playoffs au champion
      const annee = parseInt(saison.slice(4)); // '20242025' → 2025
      await pool.query(QUERIES.INSERT_TROPHEE_PLAYOFF_IF_ABSENT, [annee, winners[0].gagnantId]);
    }
  }

  /**
   * Determine winner between two teams using tiebreaker rules.
   */
  private determineWinner(a: EquipeSemainePoints, b: EquipeSemainePoints): number {
    // Rule 1: most weekly pool points
    if (a.total_points !== b.total_points) {
      return a.total_points > b.total_points ? a.equipe_id : b.equipe_id;
    }

    // Rule 2: best PPG (points per game played)
    const ppgA = a.total_matchs > 0 ? a.total_points / a.total_matchs : 0;
    const ppgB = b.total_matchs > 0 ? b.total_points / b.total_matchs : 0;
    if (Math.abs(ppgA - ppgB) > 0.0001) {
      return ppgA > ppgB ? a.equipe_id : b.equipe_id;
    }

    // Fallback: team A wins (should never happen)
    return a.equipe_id;
  }

  /**
   * Get full bracket data for the frontend.
   */
  async getSeriesData(saison?: string): Promise<{
    saison: string;
    quartsDeFinale: SeriesPlayoff[];
    demiFinales: SeriesPlayoff[];
    finale: SeriesPlayoff | null;
    rondeActive: 1 | 2 | 3 | null;
    weekPoints: Record<number, EquipeSemainePoints[]>;
  }> {
    const s = saison ?? getCurrentSeason();
    const [seriesResult, week1, week2, week3] = await Promise.all([
      pool.query(QUERIES.GET_SERIES_BY_SAISON, [s]),
      pool.query(QUERIES.GET_SEMAINE_POINTS, [s, 1]),
      pool.query(QUERIES.GET_SEMAINE_POINTS, [s, 2]),
      pool.query(QUERIES.GET_SEMAINE_POINTS, [s, 3]),
    ]);

    const all: SeriesPlayoff[] = seriesResult.rows;

    return {
      saison: s,
      quartsDeFinale: all.filter((r) => r.ronde === 1),
      demiFinales: all.filter((r) => r.ronde === 2),
      finale: all.find((r) => r.ronde === 3) ?? null,
      rondeActive: this.getRondeActive(),
      weekPoints: {
        1: week1.rows,
        2: week2.rows,
        3: week3.rows,
      },
    };
  }
}

export const seriesService = new SeriesService();
