import { JSX, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useProspectSearch } from '@/hooks/draft-day/useProspectSearch';
import { normalizeSearch } from '@/lib/rankingListFilter';
import type { DraftProspectSearchResult } from '@/types/IDraftDay';

interface RegiePlayerPickerProps {
  onPick: (player: DraftProspectSearchResult) => void;
  disabled: boolean;
  /** Grand champ pour le choix en cours, compact dans la liste. */
  // eslint-disable-next-line react/require-default-props
  size?: 'large' | 'compact';
  // eslint-disable-next-line react/require-default-props
  autoFocus?: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export function RegiePlayerPicker({
  onPick, disabled, size = 'compact', autoFocus = false,
}: RegiePlayerPickerProps): JSX.Element {
  const [query, setQuery] = useState('');
  const { data: results = [], isFetching, error } = useProspectSearch(query);
  const showResults = query.trim().length >= 2;

  // Entrée ne valide que si le premier résultat contient tous les mots tapés : pas de choix au hasard.
  const firstIsMatch = results.length > 0 && normalizeSearch(query).split(/\s+/)
    .every((w) => normalizeSearch(results[0].nom).includes(w));

  const pick = (player: DraftProspectSearchResult) => {
    setQuery('');
    onPick(player);
  };

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && firstIsMatch) pick(results[0]);
          if (e.key === 'Escape') setQuery('');
        }}
        placeholder="Rechercher un joueur LNH…"
        aria-label="Rechercher le joueur choisi"
        disabled={disabled}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        className={cn('pl-9', size === 'large' && 'h-12 text-base')}
      />
      {isFetching && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden="true" />
      )}
      {showResults && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-card shadow-lg">
          {error !== null && <li className="p-3 text-sm text-destructive">Recherche NHL indisponible</li>}
          {error === null && !isFetching && results.length === 0 && (
            <li className="p-3 text-sm text-muted-foreground">Aucun joueur trouvé</li>
          )}
          {results.map((player) => (
            <li key={player.nhlPlayerId}>
              <button
                type="button"
                onClick={() => pick(player)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent focus:bg-accent focus:outline-none"
              >
                <span className="flex-1 truncate text-sm font-medium text-foreground">{player.nom}</span>
                <span className="w-6 text-xs text-muted-foreground">{player.position}</span>
                <span className="w-10 text-xs text-muted-foreground">{player.equipe ?? '—'}</span>
                <span className="w-14 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {!player.actif && 'Inactif'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
