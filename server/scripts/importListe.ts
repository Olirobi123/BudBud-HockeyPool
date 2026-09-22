/**
 * Importe une liste de classement publique (Pronman U23, top 200 fantasy, ...).
 *
 *   npm run import:liste -w server -- data/listes/<fichier>.json
 *
 * Le nhl_player_id de chaque joueur est résolu d'abord dans la table `joueurs`,
 * puis, pour les restants seulement, via la recherche NHL — par lots de 10 avec
 * une pause entre les lots pour ne pas se faire limiter. Les joueurs introuvables
 * sont importés avec nhl_player_id = NULL et listés à la fin.
 */
import { readFileSync } from 'node:fs';
import pool from '../config/database';

interface ListeJoueurInput {
  rang: number;
  nom: string;
  position: 'C' | 'LW' | 'RW' | 'D' | 'G';
  equipe?: string;
  tier?: string;
}

interface ListeInput {
  nom: string;
  auteur?: string;
  publieLe?: string;
  ordre?: number;
  joueurs: ListeJoueurInput[];
}

interface NhlSearchHit {
  playerId: string;
  name: string;
  positionCode: string;
  active: boolean;
  lastTeamAbbrev: string | null;
}

interface NhlMatch {
  id: number;
  // Nom NHL retenu par le plan B (nom de famille) — à vérifier à l'œil.
  approxName?: string;
}

const BATCH_SIZE = 10;
const BATCH_PAUSE_MS = 1000;
const MAX_RETRIES = 3;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

// Sans accents, mais avec apostrophes et traits d'union : la recherche NHL en a besoin (O'Brien).
const stripAccents = (name: string): string => name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ø/gi, 'o');

const normalize = (name: string): string => stripAccents(name)
  .replace(/-/g, ' ')
  .replace(/[^a-zA-Z ]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

// La recherche NHL code les ailiers « L » / « R ».
const toNhlPosition = (position: string): string => (position === 'LW' ? 'L' : position === 'RW' ? 'R' : position);

async function searchNhl(nom: string): Promise<NhlSearchHit[]> {
  const url = `https://search.d3.nhle.com/api/v1/search/player?culture=fr-ca&limit=20&q=${encodeURIComponent(stripAccents(nom))}`;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'nhl-api-client' },
    });
    if (response.ok) return (await response.json() as NhlSearchHit[]) ?? [];
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Recherche NHL « ${nom} » : statut ${response.status}`);
    }
    await sleep(2000 * 2 ** attempt);
  }
  throw new Error(`Recherche NHL « ${nom} » : trop de tentatives`);
}

const lastName = (nom: string): string => normalize(nom).split(' ').slice(1).join(' ');

// Un seul candidat après filtrage par position, sinon un seul tout court.
const pickUnique = (hits: NhlSearchHit[], position: string): NhlSearchHit | null => {
  const samePosition = hits.filter((h) => h.positionCode === toNhlPosition(position));
  if (samePosition.length === 1) return samePosition[0];
  return hits.length === 1 ? hits[0] : null;
};

async function resolveViaNhl(joueur: ListeJoueurInput): Promise<NhlMatch | null> {
  const exact = pickUnique(
    (await searchNhl(joueur.nom)).filter((h) => normalize(h.name) === normalize(joueur.nom)),
    joueur.position,
  );
  if (exact) return { id: Number(exact.playerId) };

  // Plan B : le prénom diffère souvent à la NHL (Yegor/Egor, Ike/Isaac, Ben/Benjamin).
  // On cherche le nom de famille et on garde l'unique joueur actif qui correspond.
  const nomFamille = lastName(joueur.nom);
  const approx = pickUnique(
    (await searchNhl(nomFamille)).filter((h) => h.active && lastName(h.name) === nomFamille),
    joueur.position,
  );
  return approx ? { id: Number(approx.playerId), approxName: `${approx.name} (${approx.lastTeamAbbrev ?? '?'})` } : null;
}

async function main(): Promise<void> {
  const file = process.argv[2];
  if (!file) throw new Error('Usage : npm run import:liste -w server -- <fichier.json>');
  const liste = JSON.parse(readFileSync(file, 'utf-8')) as ListeInput;

  const existing = await pool.query<{ nhl_player_id: number; nom_complet: string }>(
    "SELECT nhl_player_id, prenom || ' ' || nom AS nom_complet FROM joueurs",
  );
  const byName = new Map<string, number>();
  for (const row of existing.rows) byName.set(normalize(row.nom_complet), row.nhl_player_id);

  const resolved = new Map<number, number | null>();
  const approximations: string[] = [];
  const remaining: ListeJoueurInput[] = [];
  for (const joueur of liste.joueurs) {
    const id = byName.get(normalize(joueur.nom));
    if (id !== undefined) resolved.set(joueur.rang, id);
    else remaining.push(joueur);
  }
  console.log(`${resolved.size} trouvés dans joueurs, ${remaining.length} à chercher via l'API NHL`);

  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    const batch = remaining.slice(i, i + BATCH_SIZE);
    const ids = await Promise.all(batch.map((j) => resolveViaNhl(j)));
    batch.forEach((j, idx) => {
      const match = ids[idx];
      resolved.set(j.rang, match?.id ?? null);
      if (match?.approxName) approximations.push(`  #${j.rang} ${j.nom} → ${match.approxName} [${match.id}]`);
    });
    if (i + BATCH_SIZE < remaining.length) await sleep(BATCH_PAUSE_MS);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query<{ id: number }>(
      'INSERT INTO listes_classement (nom, auteur, publie_le, ordre) VALUES ($1, $2, $3, $4) RETURNING id',
      [liste.nom, liste.auteur ?? null, liste.publieLe ?? null, liste.ordre ?? 0],
    );
    const listeId = rows[0].id;
    for (const j of liste.joueurs) {
      await client.query(
        `INSERT INTO liste_classement_joueurs (liste_id, rang, nom, position, equipe_nhl, tier, nhl_player_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [listeId, j.rang, j.nom, j.position, j.equipe ?? null, j.tier ?? null, resolved.get(j.rang) ?? null],
      );
    }
    await client.query('COMMIT');
    console.log(`Liste « ${liste.nom} » importée (id ${listeId}, ${liste.joueurs.length} joueurs)`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  if (approximations.length > 0) {
    console.log(`\n${approximations.length} correspondance(s) par nom de famille — à vérifier :`);
    for (const line of approximations) console.log(line);
  }

  const unresolved = liste.joueurs.filter((j) => resolved.get(j.rang) == null);
  if (unresolved.length > 0) {
    console.log(`\n${unresolved.length} joueur(s) sans nhl_player_id :`);
    for (const j of unresolved) console.log(`  #${j.rang} ${j.nom} (${j.position}, ${j.equipe ?? '?'})`);
  }
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => { void pool.end(); });
