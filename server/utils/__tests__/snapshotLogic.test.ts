import { describe, it, expect } from 'vitest';
import { shouldServeSnapshot } from '../snapshotLogic';
import type { GameScore } from '@olirobi/nhl_api_client';
import type { LivePointsResponse } from '../../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMPTY_DATA: LivePointsResponse = {
  topPlayers: [],
  teamLeaderboard: [],
  gamesCount: 0,
  liveGamesCount: 0,
};

function snap(isoUtc: string) {
  return { data: EMPTY_DATA, updatedAt: new Date(isoUtc) };
}

function game(gameDate: string, gameState: string): GameScore {
  return { gameDate, gameState } as unknown as GameScore;
}

// ---------------------------------------------------------------------------
// Reference dates (all times are in March 2026, EDT = UTC-4)
//
//  Midnight ET     = 04:00 UTC  (e.g. "2026-03-29T04:00:00Z" = midnight ET Mar 29)
//  1:52 AM  ET     = 05:52 UTC
//  3:00 AM  ET     = 07:00 UTC  ← CRON_BOUNDARY
//  3:15 AM  ET     = 07:15 UTC  ← cron runs
//  3:20 AM  ET     = 07:20 UTC
//  9:00 AM  ET     = 13:00 UTC
//  10:00 PM ET     = 02:00 UTC next day
//  11:30 PM ET     = 03:30 UTC next day
// ---------------------------------------------------------------------------

// Snapshots (all taken by the cron at 3:15 AM ET on their respective days)
const SNAP_MAR27 = snap('2026-03-27T07:15:00Z'); // 3:15 AM ET Mar 27
const SNAP_MAR28 = snap('2026-03-28T07:15:00Z'); // 3:15 AM ET Mar 28
const SNAP_MAR29 = snap('2026-03-29T07:15:00Z'); // 3:15 AM ET Mar 29
const SNAP_MAR30 = snap('2026-03-30T07:15:00Z'); // 3:15 AM ET Mar 30

// "now" reference points
const NOW = {
  // Before 3 AM ET — 1:52 AM ET on March 29
  before3am: new Date('2026-03-29T05:52:00Z'),

  // Just after cron ran — 3:20 AM ET on March 29
  after3am: new Date('2026-03-29T07:20:00Z'),

  // Morning of the next day — 9:00 AM ET on March 30
  morning: new Date('2026-03-30T13:00:00Z'),

  // Evening, games in progress — 10:00 PM ET on March 28
  evening: new Date('2026-03-29T02:00:00Z'),

  // Late night, games just finished before midnight — 11:30 PM ET on March 28
  lateNight: new Date('2026-03-29T03:30:00Z'),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('shouldServeSnapshot', () => {

  // ── Snapshot freshness ──────────────────────────────────────────────────

  describe('stale snapshot', () => {
    it('returns false when snapshot is from 2 days ago', () => {
      // now = 9 AM Mar 30, snapshot = 3:15 AM Mar 28 → two days old
      expect(shouldServeSnapshot(SNAP_MAR28, [], NOW.morning)).toBe(false);
    });

    it('returns false when snapshot was written before the cron boundary (before 3 AM)', () => {
      // Snapshot taken at 1:00 AM ET today — not a real cron snapshot
      const earlySnap = snap('2026-03-29T05:00:00Z'); // 1:00 AM ET Mar 29
      expect(shouldServeSnapshot(earlySnap, [], NOW.after3am)).toBe(false);
    });

    it('returns false when snapshot is from yesterday but taken before 3 AM ET', () => {
      // now = 1:52 AM ET Mar 29, snapshot = 2:00 AM ET Mar 28 (minutes=120 < 180)
      const earlyYesterday = snap('2026-03-28T06:00:00Z'); // 2:00 AM ET Mar 28
      expect(shouldServeSnapshot(earlyYesterday, [], NOW.before3am)).toBe(false);
    });
  });

  // ── Before 3:00 AM ET (cron has not yet run today) ─────────────────────

  describe('before 3:00 AM ET — 1:52 AM on March 29', () => {
    // Snapshot = 3:15 AM ET Mar 28 (yesterday), todayDate ET = "2026-03-29"

    it('returns true when there are no active games (no games scheduled that day)', () => {
      expect(shouldServeSnapshot(SNAP_MAR28, [], NOW.before3am)).toBe(true);
    });

    it('returns false when a prev-day game is LIVE (overtime running past midnight)', () => {
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'LIVE')], NOW.before3am)).toBe(false);
    });

    it('returns false when a prev-day game is CRIT', () => {
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'CRIT')], NOW.before3am)).toBe(false);
    });

    it('returns false when prev-day games are FINAL (results not yet in snapshot)', () => {
      // Snapshot from Mar 28 3:15 AM was taken before Mar 28 evening games
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'FINAL')], NOW.before3am)).toBe(false);
    });

    it('returns false when prev-day games are OFF', () => {
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'OFF')], NOW.before3am)).toBe(false);
    });

    it('ignores non-active prev-day states (PRE, FUT) and returns true', () => {
      // Upcoming/pregame states should not block
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'PRE')], NOW.before3am)).toBe(true);
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'FUT')], NOW.before3am)).toBe(true);
    });
  });

  // ── After 3:15 AM ET (cron has run, fresh snapshot) ────────────────────

  describe('after 3:15 AM ET — 3:20 AM on March 29', () => {
    // Snapshot = 3:15 AM ET Mar 29 (today), todayDate ET = "2026-03-29"

    it('returns true when prev-day games are FINAL (cron captured them)', () => {
      // Critical: this was the original bug — FINAL games should NOT block after cron
      expect(shouldServeSnapshot(SNAP_MAR29, [game('2026-03-28', 'FINAL')], NOW.after3am)).toBe(true);
    });

    it('returns true when prev-day games are OFF', () => {
      expect(shouldServeSnapshot(SNAP_MAR29, [game('2026-03-28', 'OFF')], NOW.after3am)).toBe(true);
    });

    it('returns true when there are no games at all', () => {
      expect(shouldServeSnapshot(SNAP_MAR29, [], NOW.after3am)).toBe(true);
    });

    it('returns false when a prev-day game is still LIVE (extreme overtime)', () => {
      expect(shouldServeSnapshot(SNAP_MAR29, [game('2026-03-28', 'LIVE')], NOW.after3am)).toBe(false);
    });

    it('returns false when a prev-day game is still CRIT', () => {
      expect(shouldServeSnapshot(SNAP_MAR29, [game('2026-03-28', 'CRIT')], NOW.after3am)).toBe(false);
    });
  });

  // ── Morning — NHL API currentDate lag scenario ──────────────────────────

  describe('morning (9:00 AM ET) on March 30 — NHL API currentDate lag', () => {
    // Snapshot = 3:15 AM ET Mar 30, todayDate ET = "2026-03-30"
    // NHL API still returns currentDate="2026-03-29" — but we use server todayDate

    it('returns true when Mar 29 games are FINAL (prev-day, not today-ET)', () => {
      // This was the "I don't see snapshot in the morning" bug
      expect(shouldServeSnapshot(SNAP_MAR30, [game('2026-03-29', 'FINAL')], NOW.morning)).toBe(true);
    });

    it('returns true when Mar 29 games are OFF', () => {
      expect(shouldServeSnapshot(SNAP_MAR30, [game('2026-03-29', 'OFF')], NOW.morning)).toBe(true);
    });

    it('returns true with no games', () => {
      expect(shouldServeSnapshot(SNAP_MAR30, [], NOW.morning)).toBe(true);
    });

    it('returns false when snapshot is still from yesterday (stale)', () => {
      expect(shouldServeSnapshot(SNAP_MAR29, [], NOW.morning)).toBe(false);
    });

    it('returns false if somehow a Mar 30 game is already active', () => {
      expect(shouldServeSnapshot(SNAP_MAR30, [game('2026-03-30', 'LIVE')], NOW.morning)).toBe(false);
    });
  });

  // ── Evening — games in progress ─────────────────────────────────────────

  describe('evening (10:00 PM ET) — games in progress on March 28', () => {
    // Snapshot = 3:15 AM ET Mar 28, todayDate ET = "2026-03-28"

    it('returns false when today games are LIVE', () => {
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'LIVE')], NOW.evening)).toBe(false);
    });

    it('returns false when today games are CRIT', () => {
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'CRIT')], NOW.evening)).toBe(false);
    });
  });

  // ── Late night — games finished before midnight ──────────────────────────

  describe('late night (11:30 PM ET) — games just finished on March 28', () => {
    // Snapshot = 3:15 AM ET Mar 28 (taken before tonight), todayDate ET = "2026-03-28"

    it('returns false when today games are FINAL (snapshot predates them)', () => {
      // This was the "problem if games finish before midnight" bug
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'FINAL')], NOW.lateNight)).toBe(false);
    });

    it('returns false when today games are OFF', () => {
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'OFF')], NOW.lateNight)).toBe(false);
    });

    it('returns true when there are no games tonight (off day)', () => {
      expect(shouldServeSnapshot(SNAP_MAR28, [], NOW.lateNight)).toBe(true);
    });

    it('returns true when only non-active states exist for today', () => {
      // Upcoming games that never started (postponed, not yet started)
      expect(shouldServeSnapshot(SNAP_MAR28, [game('2026-03-28', 'PRE')], NOW.lateNight)).toBe(true);
    });
  });

  // ── Mixed game dates (multiple games from different days) ────────────────

  describe('multiple games from different dates', () => {
    it('returns false when one prev-day game is LIVE amid FINAL others', () => {
      const games = [
        game('2026-03-28', 'FINAL'),
        game('2026-03-28', 'LIVE'), // one still going
        game('2026-03-28', 'OFF'),
      ];
      expect(shouldServeSnapshot(SNAP_MAR29, games, NOW.after3am)).toBe(false);
    });

    it('returns true when all prev-day games are FINAL after cron', () => {
      const games = [
        game('2026-03-28', 'FINAL'),
        game('2026-03-28', 'FINAL'),
        game('2026-03-28', 'OFF'),
      ];
      expect(shouldServeSnapshot(SNAP_MAR29, games, NOW.after3am)).toBe(true);
    });

    it('before 3 AM: returns false if any prev-day game is FINAL even if others are PRE', () => {
      const games = [
        game('2026-03-28', 'PRE'),
        game('2026-03-28', 'FINAL'),
      ];
      expect(shouldServeSnapshot(SNAP_MAR28, games, NOW.before3am)).toBe(false);
    });
  });

  // ── One game done, others not yet started ────────────────────────────────

  describe('partial game day — one game FINAL, others PRE/FUT', () => {
    // Evening (10 PM ET Mar 28): early game finished, late games not yet started
    // Snapshot from 3:15 AM ET Mar 28 predates ALL of tonight's games

    it('returns false when one today game is FINAL and others are PRE', () => {
      // The FINAL game has results the snapshot does not contain — must use play-by-play
      const games = [
        game('2026-03-28', 'FINAL'), // early game done
        game('2026-03-28', 'PRE'),   // late game not started
        game('2026-03-28', 'PRE'),
      ];
      expect(shouldServeSnapshot(SNAP_MAR28, games, NOW.evening)).toBe(false);
    });

    it('returns false when one today game is FINAL and others are FUT', () => {
      const games = [
        game('2026-03-28', 'FINAL'),
        game('2026-03-28', 'FUT'),
        game('2026-03-28', 'FUT'),
      ];
      expect(shouldServeSnapshot(SNAP_MAR28, games, NOW.evening)).toBe(false);
    });

    it('returns false when one today game is OFF and others are PRE', () => {
      const games = [
        game('2026-03-28', 'OFF'),
        game('2026-03-28', 'PRE'),
      ];
      expect(shouldServeSnapshot(SNAP_MAR28, games, NOW.evening)).toBe(false);
    });

    it('returns true when ALL today games are PRE/FUT (no results yet)', () => {
      // None of tonight's games have started — snapshot is still valid
      const games = [
        game('2026-03-28', 'PRE'),
        game('2026-03-28', 'FUT'),
        game('2026-03-28', 'PRE'),
      ];
      expect(shouldServeSnapshot(SNAP_MAR28, games, NOW.evening)).toBe(true);
    });

    // Morning (9 AM Mar 30): prev-day games FINAL (cron captured), tonight PRE
    it('returns true when prev-day games are FINAL (after cron) and tonight games are PRE', () => {
      const games = [
        game('2026-03-29', 'FINAL'), // last night, captured by cron
        game('2026-03-29', 'OFF'),
        game('2026-03-30', 'PRE'),   // tonight, not started
      ];
      expect(shouldServeSnapshot(SNAP_MAR30, games, NOW.morning)).toBe(true);
    });
  });
});
