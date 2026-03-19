import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SeriesMatchup, SeriesTeamWeek } from '@/types/ISeries';

interface TeamRowProps {
  team: SeriesTeamWeek | undefined;
  nom: string | undefined;
  isWinner: boolean;
  isLoser: boolean;
  isTied: boolean;
}

function TeamRow({
  team, nom, isWinner, isLoser, isTied,
}: TeamRowProps) {
  const displayName = team?.equipe_nom ?? nom ?? 'À déterminer';
  const hasData = team !== undefined;

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-3 py-2.5 transition-colors',
        isWinner && 'bg-emerald-500/10',
        isLoser && 'opacity-50',
        !hasData && 'opacity-40',
      )}
    >
      {/* Winner checkmark */}
      <div className="w-4 shrink-0">
        {isWinner && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
      </div>

      {/* Team name */}
      <span
        className={cn(
          'flex-1 text-sm font-semibold truncate',
          isWinner ? 'text-foreground' : 'text-foreground/80',
          !hasData && 'text-muted-foreground italic',
        )}
      >
        {displayName}
      </span>

      {/* Stats */}
      {hasData && team && (
        <div className="flex items-center gap-2 shrink-0">
          {isTied && team.total_matchs > 0 && (
            <span className="text-[10px] text-amber-400/80 font-medium tabular-nums">
              {`${team.ppg.toFixed(2)} moy`}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {`${team.total_buts}B`}
          </span>
          <span
            className={cn(
              'text-sm font-bold tabular-nums min-w-[2rem] text-right',
              isWinner ? 'text-emerald-400' : 'text-blue-400',
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
}

export function BracketCard({ matchup, label, className }: BracketCardProps): JSX.Element {
  const {
    equipeA, equipeB, gagnant_id, equipe_a_id, equipe_b_id, equipe_a_nom, equipe_b_nom,
  } = matchup;

  const isTied = equipeA !== undefined && equipeB !== undefined
    && equipeA.total_points === equipeB.total_points && equipeA.total_points > 0;

  const isPending = equipe_a_id === null || equipe_b_id === null;

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden',
        gagnant_id !== null
          ? 'border-emerald-500/20 bg-card'
          : isPending
            ? 'border-border/30 bg-card/40'
            : 'border-border/60 bg-card',
        className,
      )}
    >
      {/* Card header */}
      {label && (
        <div className="px-3 py-1.5 border-b border-border/40 bg-muted/20">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
      )}

      {/* Team rows */}
      <div className="divide-y divide-border/40">
        <TeamRow
          team={equipeA}
          nom={equipe_a_nom}
          isWinner={gagnant_id === equipe_a_id && gagnant_id !== null}
          isLoser={gagnant_id !== null && gagnant_id !== equipe_a_id}
          isTied={isTied}
        />
        <TeamRow
          team={equipeB}
          nom={equipe_b_nom}
          isWinner={gagnant_id === equipe_b_id && gagnant_id !== null}
          isLoser={gagnant_id !== null && gagnant_id !== equipe_b_id}
          isTied={isTied}
        />
      </div>

      {/* Pending state */}
      {isPending && (
        <div className="px-3 py-1.5 border-t border-border/30 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-muted-foreground/40" />
          <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wide">
            En attente
          </span>
        </div>
      )}
    </div>
  );
}
