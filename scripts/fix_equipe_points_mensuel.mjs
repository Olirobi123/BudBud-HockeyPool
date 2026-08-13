/**
 * Reads "Stats all time.xlsx" and corrects equipe_points_mensuel.
 *
 * Rules:
 *  - 22-23 : DELETE all, re-insert from Excel
 *  - 23-24 : DELETE all EXCEPT Forestville (equipe_id=12), re-insert from Excel + keep Forestville
 *  - 24-25 : Add missing Arvida rows; validate/update existing rows against Excel
 *  - 25-26 : Validate/update against Excel
 */

import { readFileSync } from 'fs';
import { config } from 'dotenv';
import pg from 'pg';
import xlsx from 'xlsx';

config({ path: './server/.env' });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// Excel team name → equipe_id
const TEAM_MAP = {
  'Rivières-aux-Graines': 1,
  'Latterière': 2,    // typo for Laterrière
  'Kuujjuaq': 2,
  'Granby': 3,
  'Port-Cartier': 3,
  'Sorel-Tracy': 4,
  'St-Pie-X': 4,
  'Rimouski': 5,
  'Westmount': 7,
  'Arvida': 8,
  'Listiguj': 9,
  'Lisitguj': 9,      // typo
  'Verdun': 10,
  'Trois-Rivières': 11,
  'Forestville': 12,
  'Sherbrooke': 13,
  'Beauport': 14,
  'Limoilou': 15,
};

// Octobre/Novembre/Décembre: year X → saison X(X+1)
// Janvier/Février/Mars/Avril: year X → saison (X-1)X
const SHEET_CONFIG = {
  'Octobre':  { mois: 1, autumnal: true },
  'Novembre': { mois: 2, autumnal: true },
  'Décembre': { mois: 3, autumnal: true },
  'Janvier':  { mois: 4, autumnal: false },
  'Février':  { mois: 5, autumnal: false },
  'Mars':     { mois: 6, autumnal: false },
  'Avril':    { mois: 7, autumnal: false },
};

function yearToSaison(year, autumnal) {
  return autumnal ? `${year}${year + 1}` : `${year - 1}${year}`;
}

function parseExcel(filePath) {
  const wb = xlsx.readFile(filePath);
  const entries = []; // { saison, mois, equipe_id, total_points }

  for (const [sheet, cfg] of Object.entries(SHEET_CONFIG)) {
    const ws = wb.Sheets[sheet];
    const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });

    // Columns 0-3: Rang, Année, Équipe, Points (Général ranking)
    rows.slice(2).forEach((r) => {
      const rang = r[0], year = r[1], team = r[2], pts = r[3];
      if (typeof rang !== 'number' || !year || !team || pts == null) return;

      const equipe_id = TEAM_MAP[team];
      if (!equipe_id) {
        console.warn(`  ⚠ Unmapped team: "${team}" (${sheet} ${year})`);
        return;
      }

      const saison = yearToSaison(year, cfg.autumnal);
      entries.push({ saison, mois: cfg.mois, equipe_id, total_points: Number(pts) });
    });
  }

  return entries;
}

async function main() {
  const entries = parseExcel('./docs_for_claude/Stats all time.xlsx');

  // Group by saison
  const bySaison = {};
  for (const e of entries) {
    (bySaison[e.saison] ??= []).push(e);
  }

  console.log('\n=== Parsed from Excel ===');
  for (const [saison, rows] of Object.entries(bySaison).sort()) {
    const teams = [...new Set(rows.map(r => r.equipe_id))].sort((a,b)=>a-b);
    console.log(`  ${saison}: ${rows.length} rows, equipe_ids: [${teams}]`);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // --- 22-23: DELETE all, re-insert ---
    console.log('\n=== Fixing 20222023 ===');
    const del2223 = await client.query(`DELETE FROM equipe_points_mensuel WHERE saison = '20222023'`);
    console.log(`  Deleted ${del2223.rowCount} rows`);

    const rows2223 = bySaison['20222023'] ?? [];
    for (const r of rows2223) {
      await client.query(
        `INSERT INTO equipe_points_mensuel (equipe_id, saison, mois, total_points) VALUES ($1,$2,$3,$4)`,
        [r.equipe_id, r.saison, r.mois, r.total_points]
      );
    }
    console.log(`  Inserted ${rows2223.length} rows`);

    // --- 23-24: DELETE all except Forestville, re-insert Excel rows ---
    console.log('\n=== Fixing 20232024 ===');
    const del2324 = await client.query(
      `DELETE FROM equipe_points_mensuel WHERE saison = '20232024' AND equipe_id != 12`
    );
    console.log(`  Deleted ${del2324.rowCount} rows (kept Forestville)`);

    const rows2324 = bySaison['20232024'] ?? [];
    for (const r of rows2324) {
      await client.query(
        `INSERT INTO equipe_points_mensuel (equipe_id, saison, mois, total_points)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (equipe_id, saison, mois) DO UPDATE SET total_points = EXCLUDED.total_points`,
        [r.equipe_id, r.saison, r.mois, r.total_points]
      );
    }
    console.log(`  Upserted ${rows2324.length} rows`);

    // --- 24-25: UPSERT all Excel rows (adds Arvida, validates others) ---
    console.log('\n=== Fixing 20242025 ===');
    const rows2425 = bySaison['20242025'] ?? [];
    let updated = 0;
    for (const r of rows2425) {
      const res = await client.query(
        `INSERT INTO equipe_points_mensuel (equipe_id, saison, mois, total_points)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (equipe_id, saison, mois) DO UPDATE
           SET total_points = EXCLUDED.total_points
         RETURNING (xmax = 0) AS inserted`,
        [r.equipe_id, r.saison, r.mois, r.total_points]
      );
      if (res.rows[0]?.inserted) updated++;
    }
    console.log(`  Upserted ${rows2425.length} rows (${updated} new inserts)`);

    // --- 25-26: UPSERT all Excel rows ---
    console.log('\n=== Fixing 20252026 ===');
    const rows2526 = bySaison['20252026'] ?? [];
    let updated2526 = 0;
    for (const r of rows2526) {
      const res = await client.query(
        `INSERT INTO equipe_points_mensuel (equipe_id, saison, mois, total_points)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (equipe_id, saison, mois) DO UPDATE
           SET total_points = EXCLUDED.total_points
         RETURNING (xmax = 0) AS inserted`,
        [r.equipe_id, r.saison, r.mois, r.total_points]
      );
      if (res.rows[0]?.inserted) updated2526++;
    }
    console.log(`  Upserted ${rows2526.length} rows (${updated2526} new inserts)`);

    await client.query('COMMIT');
    console.log('\n✅ Done');

    // --- Verification ---
    console.log('\n=== Final state in DB ===');
    const verify = await client.query(`
      SELECT epm.saison, epm.equipe_id, e.nom_court, COUNT(*) as mois_count, SUM(epm.total_points) as total
      FROM equipe_points_mensuel epm
      JOIN equipes e ON e.id = epm.equipe_id
      GROUP BY epm.saison, epm.equipe_id, e.nom_court
      ORDER BY epm.saison, epm.equipe_id
    `);
    for (const r of verify.rows) {
      console.log(`  ${r.saison} | id=${r.equipe_id} ${r.nom_court.padEnd(22)} | ${r.mois_count} mois | total=${r.total}`);
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
