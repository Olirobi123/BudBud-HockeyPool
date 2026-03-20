/**
 * Unit tests for getRondeActive() logic.
 *
 * Run: npx tsx scripts/test-ronde-active.ts
 *
 * Tests the date-matching logic inline (no DB needed).
 * Also calls the real method to assert the expected value for today.
 */

import { seriesService } from '../server/services/seriesService';

// ─── Helpers ────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(label: string, actual: unknown, expected: unknown): void {
  if (actual === expected) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    console.error(`      expected: ${JSON.stringify(expected)}`);
    console.error(`      actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

// Replicate the getRondeActive logic with an injectable date for testing
const PLAYOFF_WEEKS: Record<number, { debut: string; fin: string }> = {
  1: { debut: '2026-03-23', fin: '2026-03-29' },
  2: { debut: '2026-03-30', fin: '2026-04-05' },
  3: { debut: '2026-04-06', fin: '2026-04-12' },
};
const PLAYOFF_START = '2026-03-23';
const PLAYOFF_END   = '2026-04-12';

function getRondeForDate(today: string): 1 | 2 | 3 | null {
  for (const [semaineStr, range] of Object.entries(PLAYOFF_WEEKS)) {
    if (today >= range.debut && today <= range.fin) {
      return parseInt(semaineStr) as 1 | 2 | 3;
    }
  }
  if (today >= PLAYOFF_START && today <= PLAYOFF_END) {
    if (today < PLAYOFF_WEEKS[2].debut) return 1;
    if (today < PLAYOFF_WEEKS[3].debut) return 2;
    return 3;
  }
  return null;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

console.log('\n=== getRondeActive — tests logique de dates ===\n');

console.log('Hors playoffs:');
assert('avant les playoffs (2026-03-22)', getRondeForDate('2026-03-22'), null);
assert('après les playoffs (2026-04-13)', getRondeForDate('2026-04-13'), null);
assert('début de saison régulière (2025-10-01)', getRondeForDate('2025-10-01'), null);

console.log('\nRonde 1 — Quarts de finale (2026-03-23 → 2026-03-29):');
assert('premier jour QF (2026-03-23)', getRondeForDate('2026-03-23'), 1);
assert('milieu QF (2026-03-26)',        getRondeForDate('2026-03-26'), 1);
assert('dernier jour QF (2026-03-29)', getRondeForDate('2026-03-29'), 1);

console.log('\nRonde 2 — Demi-finales (2026-03-30 → 2026-04-05):');
assert('premier jour SF (2026-03-30)', getRondeForDate('2026-03-30'), 2);
assert('milieu SF (2026-04-02)',        getRondeForDate('2026-04-02'), 2);
assert('dernier jour SF (2026-04-05)', getRondeForDate('2026-04-05'), 2);

console.log('\nRonde 3 — Finale (2026-04-06 → 2026-04-12):');
assert('premier jour Finale (2026-04-06)', getRondeForDate('2026-04-06'), 3);
assert('milieu Finale (2026-04-09)',        getRondeForDate('2026-04-09'), 3);
assert('dernier jour Finale (2026-04-12)', getRondeForDate('2026-04-12'), 3);

console.log('\nAujourd\'hui (méthode réelle):');
const today = new Date().toISOString().slice(0, 10);
const ronde = seriesService.getRondeActive();
const expected = getRondeForDate(today);
assert(`getRondeActive() pour ${today}`, ronde, expected);

// ─── Résumé ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(40)}`);
console.log(`Résultat : ${passed} passés, ${failed} échoués`);
if (failed > 0) process.exit(1);
