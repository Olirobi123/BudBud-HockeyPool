import type {
  ListeClassementJoueur,
  ListeOwnershipFilter,
  ListePositionFilter,
} from '@/types/IDraftDay';

export const RANKING_LIST_PAGE_SIZE = 25;

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
    if (position !== 'ALL' && j.position !== position) return false;
    if (ownership === 'AVAILABLE' && j.proprietaire !== null) return false;
    if (ownership === 'OWNED' && j.proprietaire === null) return false;
    return query === '' || normalizeSearch(j.nom).includes(query);
  });
}
