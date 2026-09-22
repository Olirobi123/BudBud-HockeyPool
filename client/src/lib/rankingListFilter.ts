import type {
  ListeClassementJoueur,
  ListeOwnershipFilter,
  ListePositionFilter,
} from '@/types/IDraftDay';

export const RANKING_LIST_PAGE_SIZE = 25;

const FORWARD_POSITIONS = ['C', 'LW', 'RW', 'F'];

function matchesPosition(position: string, filter: ListePositionFilter): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'F') return FORWARD_POSITIONS.includes(position);
  return position === filter;
}

/** Minuscules, sans accents : « slafkovsky » trouve « Slafkovský ». */
export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ø/gi, 'o')
    .toLowerCase()
    .trim();
}

export interface RankingListFilters {
  position: ListePositionFilter;
  ownership: ListeOwnershipFilter;
  search: string;
}

export function filterRankingList(
  joueurs: ListeClassementJoueur[],
  { position, ownership, search }: RankingListFilters,
): ListeClassementJoueur[] {
  const query = normalizeSearch(search);
  return joueurs.filter((j) => {
    if (!matchesPosition(j.position, position)) return false;
    if (ownership === 'AVAILABLE' && j.proprietaire !== null) return false;
    if (ownership === 'OWNED' && j.proprietaire === null) return false;
    return query === '' || normalizeSearch(j.nom).includes(query);
  });
}
