import { Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SeriesMatchup, SeriesTeamWeek } from '@/types/ISeries';

interface TeamRowProps {
  team: SeriesTeamWeek | undefined;
  nom: string | undefined;
  isWinner: boolean;
  isLoser: boolean;
  isTied: boolean;
  isFinale: boolean;
}

function TeamRow({
  team, nom, isWinner, isLoser, isTied, isFinale,
}: TeamRowProps) {
  const displayName = team?.equipe_nom ?? nom ?? 'À déterminer';
  const hasData = team !== undefined;

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-3 transition-colors',
        isFinale && isWinner ? 'py-3.5' : 'py-2.5',
        // Finale winner : fond doré subtil
        isFinale && isWinner && 'bg-amber-500/12',
        // QF/SF : aucun fond — juste l'opacité du perdant
        isLoser && 'opacity-40',
        !hasData && 'opacity-40',
      )}
    >
      {/* Indicateur gauche */}
      <div className="w-4 shrink-0 flex items-center justify-center">
        {isFinale && isWinner && (
          <Trophy className="w-4 h-4 text-amber-400 fill-amber-400/20" />
        )}
        {!isFinale && isWinner && (
          // Petit tiret discret — "passé à la ronde suivante"
          <span className="block w-1.5 h-1.5 rounded-full bg-foreground/30" />
        )}
      </div>

      {/* Nom de l'équipe */}
      <span
        className={cn(
          'flex-1 truncate text-sm',
          isFinale && isWinner
            ? 'font-bold text-amber-300'
            : isFinale && isLoser
              ? 'font-medium text-foreground/50'
              : isWinner
                ? 'font-semibold text-foreground'
                : isLoser
                  ? 'font-medium text-foreground/50'
                  : 'font-medium text-foreground/80',
          !hasData && 'text-muted-foreground italic font-normal',
        )}
      >
        {displayName}
      </span>

      {/* Stats */}
      {hasData && team && (
        <div className="flex items-center gap-2 shrink-0">
          {isTied && team.total_matchs > 0 && (
            <span className="text-[10px] text-amber-400/70 font-medium tabular-nums">
              {`${team.ppg.toFixed(2)} moy`}
            </span>
          )}
          {team.total_matchs > 0 && (
            <span className="text-[11px] text-muted-foreground/60 tabular-nums">
              {`${team.total_matchs}PJ`}
            </span>
          )}
          <span
            className={cn(
              'font-bold tabular-nums min-w-[2rem] text-right',
              isFinale && isWinner
                ? 'text-base text-amber-400'
                : isFinale && isLoser
                  ? 'text-sm text-foreground/40'
                  : isWinner
                    ? 'text-sm text-foreground/90'
                    : isLoser
                      ? 'text-sm text-foreground/40'
                      : 'text-sm text-blue-400',
            )}
          >
            {team.total_points}
          </span>
        </div>
      )}

      {!hasData && (
        <span className="text-[11px] text-muted-foreground/40">—</span>
      )}
    </div>
  );
}

interface BracketCardProps {
  matchup: SeriesMatchup;
  label?: string;
  className?: string;
  isFinale?: boolean;
}

export function BracketCard({
  matchup, label, className, isFinale = false,
}: BracketCardProps): JSX.Element {
  const {
    equipeA, equipeB, gagnant_id, equipe_a_id, equipe_b_id, equipe_a_nom, equipe_b_nom,
  } = matchup;

  const isTied = equipeA !== undefined && equipeB !== undefined
    && equipeA.total_points === equipeB.total_points && equipeA.total_points > 0;

  const hasWinner = gagnant_id !== null;
  const isBye = hasWinner && (equipe_a_id === null || equipe_b_id === null);
  const isPending = !isBye && (equipe_a_id === null || equipe_b_id === null);

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden',
        // Finale avec gagnant : halo doré
        hasWinner && isFinale
          ? 'border-amber-500/35 bg-card shadow-[0_0_24px_-6px_rgba(245,158,11,0.18)]'
          // QF/SF résolus : juste une bordure légèrement atténuée, aucun accent coloré
          : hasWinner
            ? 'border-border/35 bg-card'
            : isPending
              ? 'border-border/25 bg-card/40'
              : 'border-border/55 bg-card',
        className,
      )}
    >
      {/* Card header */}
      {label && (
        <div
          className={cn(
            'px-3 py-1.5 border-b border-border/40',
            hasWinner && isFinale ? 'bg-amber-500/6' : 'bg-muted/20',
          )}
        >
          <span className={cn(
            'text-[10px] font-semibold uppercase tracking-wider',
            hasWinner && isFinale ? 'text-amber-400/70' : 'text-muted-foreground/70',
          )}
          >
            {label}
          </span>
        </div>
      )}

      {/* Team rows */}
      <div className="divide-y divide-border/40">
        <TeamRow
          team={equipeA}
          nom={isBye && equipe_a_id === null ? 'Bye' : equipe_a_nom}
          isWinner={gagnant_id === equipe_a_id && hasWinner}
          isLoser={!isBye && hasWinner && gagnant_id !== equipe_a_id}
          isTied={isTied}
          isFinale={isFinale}
        />
        <TeamRow
          team={equipeB}
          nom={isBye && equipe_b_id === null ? 'Bye' : equipe_b_nom}
          isWinner={gagnant_id === equipe_b_id && hasWinner}
          isLoser={!isBye && hasWinner && gagnant_id !== equipe_b_id}
          isTied={isTied}
          isFinale={isFinale}
        />
      </div>

      {/* Pending state */}
      {isPending && (
        <div className="px-3 py-1.5 border-t border-border/25 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-muted-foreground/35" />
          <span className="text-[10px] text-muted-foreground/35 uppercase tracking-wide">
            En attente
          </span>
        </div>
      )}
    </div>
  );
}
