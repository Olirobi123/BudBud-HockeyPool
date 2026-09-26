import { CalendarDays } from 'lucide-react';
import { TeamDraftPick } from '@/types';

interface TeamDraftPicksProps {
  picks: TeamDraftPick[];
  /** Les trois dernières années de choix_repechage, triées en ordre croissant */
  years: number[];
  isLoading: boolean;
}

export function TeamDraftPicks({ picks, years, isLoading }: TeamDraftPicksProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              {[0, 1, 2, 3, 4].map((j) => (
                <div key={j} className="h-8 bg-gray-100 dark:bg-gray-800 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <CalendarDays className="w-5 h-5" />
        Choix de repêchage
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {years.map((year) => {
          const yearPicks = [...picks.filter((p) => p.annee === year)].sort(
            (a, b) => a.round - b.round,
          );

          return (
            <div key={year}>
              <div className="text-xs font-semibold text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                {year}
              </div>

              {yearPicks.length === 0 ? (
                <div className="text-center text-gray-400 dark:text-gray-600 text-sm py-2">
                  —
                </div>
              ) : (
                <div className="space-y-1">
                  {yearPicks.map((pick) => {
                    const key = `${pick.annee}-${pick.round}-${pick.equipe_source_nom ?? 'own'}`;
                    const isTraded = pick.equipe_source_nom !== null;
                    return (
                      <div
                        key={key}
                        className={`rounded px-2 py-1 text-xs ${
                          isTraded
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30'
                            : 'bg-gray-50 dark:bg-gray-800/50'
                        }`}
                      >
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {'Ronde '}
                          {pick.round}
                        </div>
                        {isTraded && (
                          <div className="text-blue-500 dark:text-blue-400 text-[10px] leading-tight mt-0.5 break-words">
                            {'de '}
                            {pick.equipe_source_nom}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
