/**
 * Full integration tests for the series/playoffs flow.
 *
 * Run: DATABASE_URL="..." npx tsx scripts/test-series-full.ts
 *
 * Covers:
 *   - initializeBracket → bracket seeded + baseline semaine 1 auto
 *   - updateDailySeries semaine 1 (points diff + PJ accumulation)
 *   - resolveRound(1) → QF winners, SF seeded, baseline semaine 2 auto
 *   - updateDailySeries semaine 2
 *   - resolveRound(2) → SF winners, Finale seeded, baseline semaine 3 auto
 *   - updateDailySeries semaine 3
 *   - resolveRound(3) → Final winner
 *   - Tiebreaker PPG (equal points, different games played)
 *   - Tiebreaker fallback (equal points, equal PPG → équipe A wins)
 *   - getSeriesData structure
 *   - Cleanup vérifié en fin de test
 *
 * Uses saison='TEST_FULL' — never touches real data.
 */

import pool from '../server/config/database';
import { QUERIES } from '../server/models';
import { seriesService } from '../server/services/seriesService';

const SAISON  = 'TEST_FULL';

// ─── State ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let nord: number[] = []; // 4 equipe_ids division nord
let sud:  number[] = []; // 4 equipe_ids division sud

// ─── Helpers ─────────────────────────────────────────────────────────────────

function assert(label: string, actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    console.error(`      expected: ${JSON.stringify(expected)}`);
    console.error(`      actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

function assertTruthy(label: string, value: unknown): void {
  if (value) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label} (got ${JSON.stringify(value)})`);
    failed++;
  }
}

async function upsertPoints(equipeId: number, att: number, def: number, gar: number, tot: number, matchs: number): Promise<void> {
  await pool.query(
    `INSERT INTO equipe_points (equipe_id, season, attaque_points, defense_points, gardien_points, total_points, total_buts, total_matchs, last_update_at)
     VALUES ($1, $2, $3, $4, $5, $6, 0, $7, NOW())
     ON CONFLICT (equipe_id, season) DO UPDATE SET
       attaque_points = EXCLUDED.attaque_points, defense_points = EXCLUDED.defense_points,
       gardien_points = EXCLUDED.gardien_points, total_points   = EXCLUDED.total_points,
       total_matchs   = EXCLUDED.total_matchs,   last_update_at = NOW()`,
    [equipeId, SAISON, att, def, gar, tot, matchs],
  );
}

async function getSemaineRow(equipeId: number, semaine: number): Promise<Record<string, number> | null> {
  const res = await pool.query(
    `SELECT * FROM equipe_semaine_points WHERE equipe_id=$1 AND saison=$2 AND semaine=$3`,
    [equipeId, SAISON, semaine],
  );
  return res.rows[0] ?? null;
}

async function getSeriesRows(): Promise<{ ronde: number; equipe_a_id: number | null; equipe_b_id: number | null; gagnant_id: number | null; position: number }[]> {
  const res = await pool.query(
    `SELECT ronde, equipe_a_id, equipe_b_id, gagnant_id, position FROM series_playoffs WHERE saison=$1 ORDER BY ronde, position`,
    [SAISON],
  );
  return res.rows;
}

async function getBaseline(equipeId: number, semaine: number): Promise<Record<string, number> | null> {
  const res = await pool.query(
    `SELECT * FROM series_semaine_baseline WHERE equipe_id=$1 AND saison=$2 AND semaine=$3`,
    [equipeId, SAISON, semaine],
  );
  return res.rows[0] ?? null;
}

async function cleanup(): Promise<void> {
  await pool.query(`DELETE FROM equipe_semaine_points   WHERE saison = $1`, [SAISON]);
  await pool.query(`DELETE FROM series_semaine_baseline WHERE saison = $1`, [SAISON]);
  await pool.query(`DELETE FROM series_playoffs         WHERE saison = $1`, [SAISON]);
  await pool.query(`DELETE FROM equipe_points           WHERE season = $1`, [SAISON]);
}

// ─── Setup ───────────────────────────────────────────────────────────────────

async function setup(): Promise<void> {
  const nordRes = await pool.query(
    `SELECT id FROM equipes WHERE active=true AND division='nord' ORDER BY id LIMIT 4`,
  );
  const sudRes = await pool.query(
    `SELECT id FROM equipes WHERE active=true AND division='sud' ORDER BY id LIMIT 4`,
  );
  if (nordRes.rows.length < 4 || sudRes.rows.length < 4) {
    throw new Error(`Pas assez d'équipes actives (nord=${nordRes.rows.length}, sud=${sudRes.rows.length})`);
  }
  nord = nordRes.rows.map((r: { id: number }) => r.id);
  sud  = sudRes.rows.map((r: { id: number }) => r.id);
  console.log(`\nÉquipes nord : ${nord.join(', ')}`);
  console.log(`Équipes sud  : ${sud.join(', ')}`);
  await cleanup();

  // Seed équipe_points de départ (toutes équipes, baseline)
  // Nord: scores décroissants pour que seed 1>4, 2>3 soit prévisible
  const allIds = [...nord, ...sud];
  for (let i = 0; i < allIds.length; i++) {
    await upsertPoints(allIds[i], 100 - i * 5, 50, 30, 180 - i * 10, 10);
  }
}

// ─── Test: initializeBracket ──────────────────────────────────────────────────

async function testInitialize(): Promise<void> {
  console.log('\n=== initializeBracket ===');

  await seriesService.initializeBracket(SAISON);

  const rows = await getSeriesRows();

  // 7 rows: 4 QF + 2 SF placeholders + 1 Final placeholder
  assert('7 lignes créées dans series_playoffs', rows.length, 7);

  const qf = rows.filter(r => r.ronde === 1);
  const sf = rows.filter(r => r.ronde === 2);
  const fi = rows.filter(r => r.ronde === 3);
  assert('4 QF', qf.length, 4);
  assert('2 SF placeholders', sf.length, 2);
  assert('1 Finale placeholder', fi.length, 1);

  // SF and Final placeholders have null teams
  assertTruthy('SF équipe_a_id null', sf[0].equipe_a_id === null);
  assertTruthy('Finale équipe_a_id null', fi[0].equipe_a_id === null);

  // Baseline semaine 1 auto-créée pour toutes les équipes
  const b = await getBaseline(nord[0], 1);
  assertTruthy('baseline semaine 1 auto-créée', b !== null);
  assert('baseline total_points = 180', b?.total_points, 180);
}

// ─── Test: updateDailySeries semaine 1 ───────────────────────────────────────

async function testDailySeries1(): Promise<void> {
  console.log('\n=== updateDailySeries — semaine 1 ===');

  // Nord[0] gagnera la semaine 1 contre Nord[3] (plus de points)
  // Nord[0]: +30 pts, 4 PJ
  await upsertPoints(nord[0], 130, 65, 40, 235, 14);
  // Nord[3]: +10 pts, 2 PJ
  await upsertPoints(nord[3], 145, 77, 46, 268, 12); // baseline était 155,82,51,288 → diff=0 (négatif bloqué)

  // Recalcule les baselines pour nord[3] pour que son diff soit +10
  await pool.query(`UPDATE series_semaine_baseline SET total_points=258, attaque_points=135, defense_points=72, gardien_points=41 WHERE equipe_id=$1 AND saison=$2 AND semaine=1`, [nord[3], SAISON]);
  await upsertPoints(nord[3], 145, 82, 51, 268, 12);

  // Nord[1] vs Nord[2] — Nord[1] wins avec plus de points
  await upsertPoints(nord[1], 115, 60, 35, 210, 12); // diff +20
  await upsertPoints(nord[2], 110, 57, 33, 200, 11); // diff +10

  // Sud[0] vs Sud[3] — Sud[0] wins
  await upsertPoints(sud[0], 120, 62, 37, 219, 13); // diff +30 (baseline 189)
  await pool.query(`UPDATE series_semaine_baseline SET total_points=189 WHERE equipe_id=$1 AND saison=$2 AND semaine=1`, [sud[0], SAISON]);

  // Sud[1] vs Sud[2] — Sud[1] wins (tiebreaker PPG)
  // Même total_points mais sud[1] a moins de matchs → meilleur PPG
  await upsertPoints(sud[1], 110, 57, 33, 200, 11); // diff +15 en 3 PJ
  await upsertPoints(sud[2], 108, 56, 32, 196, 12); // diff +15 en 5 PJ
  await pool.query(`UPDATE series_semaine_baseline SET total_points=185 WHERE equipe_id=$1 AND saison=$2 AND semaine=1`, [sud[1], SAISON]);
  await pool.query(`UPDATE series_semaine_baseline SET total_points=181 WHERE equipe_id=$1 AND saison=$2 AND semaine=1`, [sud[2], SAISON]);

  const leaderboard = [...nord, ...sud].map((id, i) => ({ equipeId: id, totalPJ: i + 1 }));
  await seriesService.updateDailySeries(SAISON, 1, leaderboard);

  const r0 = await getSemaineRow(nord[0], 1);
  assertTruthy('nord[0] row semaine 1 créé', r0 !== null);
  assert('nord[0] total_points = 55', r0?.total_points, 55); // 235-180
  assert('nord[0] total_matchs = 1 (PJ leaderboard index 0)', r0?.total_matchs, 1);

  const r1 = await getSemaineRow(nord[1], 1);
  assert('nord[1] total_points = 40', r1?.total_points, 40); // 210-170 (baseline index 1)
}

// ─── Test: resolveRound(1) ────────────────────────────────────────────────────

async function testResolve1(): Promise<void> {
  console.log('\n=== resolveRound(1) — Quarts de finale ===');

  await seriesService.resolveRound(SAISON, 1);

  const rows = await getSeriesRows();
  const qf = rows.filter(r => r.ronde === 1);
  const sf = rows.filter(r => r.ronde === 2);

  // Tous les QF ont un gagnant
  const allQFHaveWinner = qf.every(r => r.gagnant_id !== null);
  assertTruthy('tous les QF ont un gagnant', allQFHaveWinner);

  // SF sont seeded avec de vraies équipes
  const sfSeeded = sf.every(r => r.equipe_a_id !== null && r.equipe_b_id !== null);
  assertTruthy('SF seeded avec vraies équipes', sfSeeded);

  // Baseline semaine 2 auto-créée
  const b2 = await getBaseline(nord[0], 2);
  assertTruthy('baseline semaine 2 auto-créée après resolve ronde 1', b2 !== null);
}

// ─── Test: updateDailySeries semaine 2 ───────────────────────────────────────

async function testDailySeries2(): Promise<void> {
  console.log('\n=== updateDailySeries — semaine 2 ===');

  // Avancer les points pour les 8 équipes après la baseline semaine 2
  const allIds = [...nord, ...sud];
  for (let i = 0; i < allIds.length; i++) {
    const b = await getBaseline(allIds[i], 2);
    if (!b) continue;
    await upsertPoints(allIds[i],
      b.attaque_points + 20 + i,
      b.defense_points + 10,
      b.gardien_points + 5,
      b.total_points   + 35 + i,
      b.total_matchs   + 5,
    );
  }

  const leaderboard = allIds.map((id, i) => ({ equipeId: id, totalPJ: i + 2 }));
  await seriesService.updateDailySeries(SAISON, 2, leaderboard);

  const r = await getSemaineRow(nord[0], 2);
  assertTruthy('row semaine 2 créé pour nord[0]', r !== null);
  assert('total_points semaine 2 = 35', r?.total_points, 35);
}

// ─── Test: resolveRound(2) ────────────────────────────────────────────────────

async function testResolve2(): Promise<void> {
  console.log('\n=== resolveRound(2) — Demi-finales ===');

  await seriesService.resolveRound(SAISON, 2);

  const rows = await getSeriesRows();
  const sf = rows.filter(r => r.ronde === 2);
  const fi = rows.filter(r => r.ronde === 3);

  const allSFHaveWinner = sf.every(r => r.gagnant_id !== null);
  assertTruthy('tous les SF ont un gagnant', allSFHaveWinner);
  assertTruthy('Finale seeded avec vraies équipes', fi[0].equipe_a_id !== null && fi[0].equipe_b_id !== null);

  const b3 = await getBaseline(nord[0], 3);
  assertTruthy('baseline semaine 3 auto-créée après resolve ronde 2', b3 !== null);
}

// ─── Test: updateDailySeries semaine 3 + resolveRound(3) ─────────────────────

async function testResolve3(): Promise<void> {
  console.log('\n=== updateDailySeries semaine 3 + resolveRound(3) — Finale ===');

  const allIds = [...nord, ...sud];
  for (let i = 0; i < allIds.length; i++) {
    const b = await getBaseline(allIds[i], 3);
    if (!b) continue;
    await upsertPoints(allIds[i],
      b.attaque_points + 25 + i,
      b.defense_points + 12,
      b.gardien_points + 6,
      b.total_points   + 43 + i,
      b.total_matchs   + 6,
    );
  }
  const leaderboard = allIds.map((id, i) => ({ equipeId: id, totalPJ: i + 3 }));
  await seriesService.updateDailySeries(SAISON, 3, leaderboard);

  await seriesService.resolveRound(SAISON, 3);

  const rows = await getSeriesRows();
  const fi = rows.filter(r => r.ronde === 3);
  assertTruthy('Finale a un gagnant', fi[0].gagnant_id !== null);
}

// ─── Test: tiebreaker PPG ─────────────────────────────────────────────────────

async function testTiebreakerPPG(): Promise<void> {
  console.log('\n=== Tiebreaker PPG (points égaux, PJ différents) ===');

  // Utiliser deux équipes réelles mais avec points semaine manuels
  const idA = nord[0];
  const idB = sud[0];

  // A: 20 pts en 5 matchs = PPG 4.0
  // B: 20 pts en 8 matchs = PPG 2.5  → A doit gagner
  await pool.query(
    `INSERT INTO equipe_semaine_points (equipe_id, saison, semaine, debut_semaine, fin_semaine, attaque_points, defense_points, gardien_points, total_points, total_matchs, last_update_at)
     VALUES ($1, 'TEST_TIE', 1, '2026-03-23', '2026-03-29', 10, 5, 5, 20, 5, NOW())
     ON CONFLICT (equipe_id, saison, semaine) DO UPDATE SET total_points=20, total_matchs=5`,
    [idA],
  );
  await pool.query(
    `INSERT INTO equipe_semaine_points (equipe_id, saison, semaine, debut_semaine, fin_semaine, attaque_points, defense_points, gardien_points, total_points, total_matchs, last_update_at)
     VALUES ($1, 'TEST_TIE', 1, '2026-03-23', '2026-03-29', 10, 5, 5, 20, 8, NOW())
     ON CONFLICT (equipe_id, saison, semaine) DO UPDATE SET total_points=20, total_matchs=8`,
    [idB],
  );

  // Seed un matchup fictif
  await pool.query(
    `INSERT INTO series_playoffs (saison, ronde, division, position, equipe_a_id, equipe_b_id, gagnant_id)
     VALUES ('TEST_TIE', 1, 'nord', 1, $1, $2, null)
     ON CONFLICT (saison, ronde, position) DO UPDATE SET equipe_a_id=$1, equipe_b_id=$2, gagnant_id=null`,
    [idA, idB],
  );

  await seriesService.resolveRound('TEST_TIE', 1);

  const res = await pool.query(`SELECT gagnant_id FROM series_playoffs WHERE saison='TEST_TIE' AND ronde=1 AND position=1`);
  assert('gagnant tiebreaker PPG = idA (meilleur PPG)', res.rows[0]?.gagnant_id, idA);

  // Cleanup
  await pool.query(`DELETE FROM equipe_semaine_points WHERE saison='TEST_TIE'`);
  await pool.query(`DELETE FROM series_playoffs       WHERE saison='TEST_TIE'`);
}

// ─── Test: tiebreaker fallback (équipe A) ─────────────────────────────────────

async function testTiebreakerFallback(): Promise<void> {
  console.log('\n=== Tiebreaker fallback (points ET PPG égaux → équipe A) ===');

  const idA = nord[0];
  const idB = sud[0];

  // A et B: mêmes points, même PPG
  for (const [id, matchs] of [[idA, 4], [idB, 4]] as [number, number][]) {
    await pool.query(
      `INSERT INTO equipe_semaine_points (equipe_id, saison, semaine, debut_semaine, fin_semaine, attaque_points, defense_points, gardien_points, total_points, total_matchs, last_update_at)
       VALUES ($1, 'TEST_FB', 1, '2026-03-23', '2026-03-29', 10, 5, 5, 20, $2, NOW())
       ON CONFLICT (equipe_id, saison, semaine) DO UPDATE SET total_points=20, total_matchs=$2`,
      [id, matchs],
    );
  }

  await pool.query(
    `INSERT INTO series_playoffs (saison, ronde, division, position, equipe_a_id, equipe_b_id, gagnant_id)
     VALUES ('TEST_FB', 1, 'nord', 1, $1, $2, null)
     ON CONFLICT (saison, ronde, position) DO UPDATE SET equipe_a_id=$1, equipe_b_id=$2, gagnant_id=null`,
    [idA, idB],
  );

  await seriesService.resolveRound('TEST_FB', 1);

  const res = await pool.query(`SELECT gagnant_id FROM series_playoffs WHERE saison='TEST_FB' AND ronde=1 AND position=1`);
  assert('fallback → équipe A gagne', res.rows[0]?.gagnant_id, idA);

  await pool.query(`DELETE FROM equipe_semaine_points WHERE saison='TEST_FB'`);
  await pool.query(`DELETE FROM series_playoffs       WHERE saison='TEST_FB'`);
}

// ─── Test: getSeriesData structure ───────────────────────────────────────────

async function testGetSeriesData(): Promise<void> {
  console.log('\n=== getSeriesData — structure de retour ===');

  const data = await seriesService.getSeriesData(SAISON);

  assert('saison correcte', data.saison, SAISON);
  assert('4 QF', data.quartsDeFinale.length, 4);
  assert('2 SF', data.demiFinales.length, 2);
  assertTruthy('finale non null', data.finale !== null);
  assertTruthy('weekPoints.1 est un array', Array.isArray(data.weekPoints[1]));
  assertTruthy('weekPoints.2 est un array', Array.isArray(data.weekPoints[2]));
  assertTruthy('weekPoints.3 est un array', Array.isArray(data.weekPoints[3]));
  assertTruthy('rondeActive est null ou 1|2|3', data.rondeActive === null || [1,2,3].includes(data.rondeActive));
}

// ─── Test: cleanup vérifié ────────────────────────────────────────────────────

async function testCleanupVerified(): Promise<void> {
  console.log('\n=== Vérification cleanup ===');
  await cleanup();

  const [sp, ssb, esp, ep] = await Promise.all([
    pool.query(`SELECT count(*) FROM series_playoffs         WHERE saison=$1`, [SAISON]),
    pool.query(`SELECT count(*) FROM series_semaine_baseline WHERE saison=$1`, [SAISON]),
    pool.query(`SELECT count(*) FROM equipe_semaine_points   WHERE saison=$1`, [SAISON]),
    pool.query(`SELECT count(*) FROM equipe_points           WHERE season=$1`, [SAISON]),
  ]);

  assert('series_playoffs nettoyé',         parseInt(sp.rows[0].count),  0);
  assert('series_semaine_baseline nettoyé', parseInt(ssb.rows[0].count), 0);
  assert('equipe_semaine_points nettoyé',   parseInt(esp.rows[0].count), 0);
  assert('equipe_points nettoyé',           parseInt(ep.rows[0].count),  0);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== test-series-full ===');

  try {
    await setup();
    await testInitialize();
    await testDailySeries1();
    await testResolve1();
    await testDailySeries2();
    await testResolve2();
    await testResolve3();
    await testTiebreakerPPG();
    await testTiebreakerFallback();
    await testGetSeriesData();
    await testCleanupVerified();
  } catch (err) {
    console.error('\nErreur fatale:', err);
    await cleanup().catch(() => {});
    await pool.end();
    process.exit(1);
  }

  await pool.end();
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Résultat : ${passed} passés, ${failed} échoués`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
