/**
 * Integration tests for updateDailySeries().
 *
 * Run: npx tsx scripts/test-series-integration.ts
 *
 * Uses the real DB (DATABASE_URL). Writes to a fake saison 'TEST_SERIES'
 * and cleans up all test rows at the end — never touches real data.
 */

import pool from '../server/config/database';
import { QUERIES } from '../server/models';
import { seriesService } from '../server/services/seriesService';

const TEST_SAISON  = 'TEST_SERIES';
const TEST_SEMAINE = 1;

// ─── Helpers ────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let equipeId: number;

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

async function getSemaineRow(): Promise<Record<string, number> | null> {
  const res = await pool.query(
    `SELECT * FROM equipe_semaine_points WHERE equipe_id = $1 AND saison = $2 AND semaine = $3`,
    [equipeId, TEST_SAISON, TEST_SEMAINE],
  );
  return res.rows[0] ?? null;
}

async function setEquipePoints(attaque: number, defense: number, gardien: number, total: number, matchs: number): Promise<void> {
  await pool.query(
    `INSERT INTO equipe_points (equipe_id, season, attaque_points, defense_points, gardien_points, total_points, total_buts, total_matchs, last_update_at)
     VALUES ($1, $2, $3, $4, $5, $6, 0, $7, NOW())
     ON CONFLICT (equipe_id, season) DO UPDATE SET
       attaque_points = EXCLUDED.attaque_points,
       defense_points = EXCLUDED.defense_points,
       gardien_points = EXCLUDED.gardien_points,
       total_points   = EXCLUDED.total_points,
       total_matchs   = EXCLUDED.total_matchs,
       last_update_at = NOW()`,
    [equipeId, TEST_SAISON, attaque, defense, gardien, total, matchs],
  );
}

async function setBaseline(attaque: number, defense: number, gardien: number, total: number, matchs: number): Promise<void> {
  await pool.query(QUERIES.UPSERT_SEMAINE_BASELINE, [
    equipeId, TEST_SAISON, TEST_SEMAINE, total, attaque, defense, gardien, matchs,
  ]);
}

async function cleanup(): Promise<void> {
  await pool.query(`DELETE FROM equipe_semaine_points       WHERE saison = $1`, [TEST_SAISON]);
  await pool.query(`DELETE FROM series_semaine_baseline     WHERE saison = $1`, [TEST_SAISON]);
  await pool.query(`DELETE FROM equipe_points               WHERE season = $1`, [TEST_SAISON]);
}

// ─── Setup ───────────────────────────────────────────────────────────────────

async function setup(): Promise<void> {
  const res = await pool.query(`SELECT id FROM equipes WHERE active = true ORDER BY id LIMIT 1`);
  if (res.rows.length === 0) throw new Error('Aucune équipe active en DB');
  equipeId = res.rows[0].id;
  console.log(`\nÉquipe de test : id=${equipeId}`);
  await cleanup(); // clean any leftover from previous run
}

// ─── Tests ───────────────────────────────────────────────────────────────────

async function testRun1(): Promise<void> {
  console.log('\n--- Test 1 : premier run (PJ=4, points diff correct) ---');

  // Baseline : attaque=100, defense=50, gardien=30, total=180, matchs=10
  await setBaseline(100, 50, 30, 180, 10);

  // Actuel : attaque=115, defense=58, gardien=35, total=208, matchs=14
  // Diff attendu : att=15, def=8, gar=5, tot=28
  await setEquipePoints(115, 58, 35, 208, 14);

  await seriesService.updateDailySeries(TEST_SAISON, TEST_SEMAINE, [
    { equipeId, totalPJ: 4 },
  ]);

  const row = await getSemaineRow();
  assert('row créé', row !== null, true);
  assert('attaque_points = 15', row?.attaque_points, 15);
  assert('defense_points = 8',  row?.defense_points, 8);
  assert('gardien_points = 5',  row?.gardien_points, 5);
  assert('total_points = 28',   row?.total_points,   28);
  assert('total_matchs = 4',    row?.total_matchs,   4);
}

async function testRun2(): Promise<void> {
  console.log('\n--- Test 2 : deuxième run (PJ accumulation : 4+2=6, nouveau diff) ---');

  // Actuel avance encore : attaque=120, defense=60, gardien=38, total=218
  // Nouveau diff vs baseline : att=20, def=10, gar=8, tot=38
  await setEquipePoints(120, 60, 38, 218, 16);

  await seriesService.updateDailySeries(TEST_SAISON, TEST_SEMAINE, [
    { equipeId, totalPJ: 2 },
  ]);

  const row = await getSemaineRow();
  assert('attaque_points = 20', row?.attaque_points, 20);
  assert('defense_points = 10', row?.defense_points, 10);
  assert('gardien_points = 8',  row?.gardien_points, 8);
  assert('total_points = 38',   row?.total_points,   38);
  assert('total_matchs = 6',    row?.total_matchs,   6); // 4 + 2
}

async function testNegativeDiff(): Promise<void> {
  console.log('\n--- Test 3 : diff négatif bloqué à 0 ---');

  // Points actuels sous la baseline (ne devrait pas arriver mais doit être géré)
  await setEquipePoints(90, 45, 25, 160, 8);

  await seriesService.updateDailySeries(TEST_SAISON, TEST_SEMAINE, [
    { equipeId, totalPJ: 1 },
  ]);

  const row = await getSemaineRow();
  assert('attaque_points ≥ 0', (row?.attaque_points ?? -1) >= 0, true);
  assert('defense_points ≥ 0', (row?.defense_points ?? -1) >= 0, true);
  assert('total_points ≥ 0',   (row?.total_points   ?? -1) >= 0, true);
  assert('total_matchs = 7',   row?.total_matchs, 7); // 6 + 1, PJ continue d'accumuler
}

async function testNoBaseline(): Promise<void> {
  console.log('\n--- Test 4 : sans baseline → aucune écriture ---');

  // Supprimer la baseline
  await pool.query(
    `DELETE FROM series_semaine_baseline WHERE equipe_id = $1 AND saison = $2 AND semaine = $3`,
    [equipeId, TEST_SAISON, TEST_SEMAINE],
  );
  // Supprimer le row semaine aussi (pour partir de zéro)
  await pool.query(
    `DELETE FROM equipe_semaine_points WHERE equipe_id = $1 AND saison = $2 AND semaine = $3`,
    [equipeId, TEST_SAISON, TEST_SEMAINE],
  );

  await seriesService.updateDailySeries(TEST_SAISON, TEST_SEMAINE, [
    { equipeId, totalPJ: 5 },
  ]);

  const row = await getSemaineRow();
  assert('aucun row créé sans baseline', row, null);
}

async function testInvalidSemaine(): Promise<void> {
  console.log('\n--- Test 5 : semaine invalide → early return silencieux ---');

  // Remettre une baseline propre
  await setBaseline(100, 50, 30, 180, 10);
  await setEquipePoints(115, 58, 35, 208, 14);

  // semaine=99 n'existe pas dans PLAYOFF_WEEKS
  await seriesService.updateDailySeries(TEST_SAISON, 99, [{ equipeId, totalPJ: 3 }]);

  const row = await pool.query(
    `SELECT * FROM equipe_semaine_points WHERE equipe_id = $1 AND saison = $2 AND semaine = 99`,
    [equipeId, TEST_SAISON],
  );
  assert('aucune écriture pour semaine=99', row.rows.length, 0);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== test-series-integration ===');

  try {
    await setup();
    await testRun1();
    await testRun2();
    await testNegativeDiff();
    await testNoBaseline();
    await testInvalidSemaine();
  } finally {
    await cleanup();
    console.log('\n[cleanup] données de test supprimées');
    await pool.end();
  }

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Résultat : ${passed} passés, ${failed} échoués`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
