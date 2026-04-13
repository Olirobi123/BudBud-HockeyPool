import { useState } from 'react';
import { Trophy, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { LiveTeamPoints, LivePlayerPoints } from '@/types/ILivePoints';

interface LivePointsLeaderboardProps {
  teams: LiveTeamPoints[];
  isLoading: boolean;
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                          */
/* ------------------------------------------------------------------ */

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="rounded-lg border border-border/40 p-3 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 flex-1 max-w-[200px]" />
          </div>
          <div className="flex gap-3 pl-8">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Expanded roster                                                   */
/* ------------------------------------------------------------------ */

function PlayerRow({ player }: { player: LivePlayerPoints }) {
  const hasPoints = player.points > 0;
  const isGoalie = player.position === 'G';
  return (
    <Link
      to={`/joueur/${player.nhlPlayerId}`}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors"
    >
      {/* Headshot + Team logo overlay */}
      <div className="relative shrink-0">
        <img
          src={player.headshot}
          alt=""
          className="w-8 h-8 rounded-full object-cover bg-muted"
        />
        <img
          src={player.nhlTeamLogo}
          alt={player.nhlTeamAbbrev}
          className="w-6 h-6 object-contain absolute -bottom-0.5 -right-1.5"
        />
      </div>

      {/* Name */}
      <span className={cn(
        'text-sm font-medium truncate flex-1 min-w-0',
        hasPoints ? 'text-primary' : 'text-muted-foreground',
      )}
      >
        {`${player.firstName} ${player.lastName}`}
      </span>

      {/* Stats */}
      <div className="flex items-center gap-2 shrink-0 tabular-nums text-xs">
        {isGoalie ? (
          <>
            <span className="w-[1.75rem] text-center text-muted-foreground">{player.wins ?? 0}</span>
            <span className="w-[1.75rem] text-center text-muted-foreground">{player.shutouts ?? 0}</span>
          </>
        ) : (
          <>
            <span className="w-[1.75rem] text-center text-muted-foreground">{player.goals}</span>
            <span className="w-[1.75rem] text-center text-muted-foreground">{player.assists}</span>
          </>
        )}
        <span className="font-bold min-w-[1.5rem] text-right text-primary">
          {player.points}
        </span>
      </div>
    </Link>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 rounded">
      {label}
    </div>
  );
}

function TeamExpandedRoster({ team }: { team: LiveTeamPoints }) {
  const forwards = [...team.players]
    .filter((p) => p.position !== 'D' && p.position !== 'G')
    .sort((a, b) => b.points - a.points || b.goals - a.goals);

  const defensemen = [...team.players]
    .filter((p) => p.position === 'D')
    .sort((a, b) => b.points - a.points || b.goals - a.goals);

  const goalies = [...team.players]
    .filter((p) => p.position === 'G')
    .sort((a, b) => b.points - a.points);

  return (
    <div className="px-1 pb-3 space-y-1">
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <div className="w-8 shrink-0" />
        <span className="flex-1" />
        <div className="flex items-center gap-2 shrink-0 tabular-nums">
          <span className="w-[1.75rem] text-center">B/V</span>
          <span className="w-[1.75rem] text-center">A/BL</span>
          <span className="min-w-[1.5rem] text-right">Pts</span>
        </div>
      </div>

      {forwards.length > 0 && <SectionLabel label="Attaque" />}
      {forwards.map((player) => (
        <PlayerRow key={player.nhlPlayerId} player={player} />
      ))}
      {defensemen.length > 0 && <SectionLabel label="Défense" />}
      {defensemen.map((player) => (
        <PlayerRow key={player.nhlPlayerId} player={player} />
      ))}
      {goalies.length > 0 && <SectionLabel label="Gardiens" />}
      {goalies.map((player) => (
        <PlayerRow key={player.nhlPlayerId} player={player} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                       */
/* ------------------------------------------------------------------ */

function LeaderboardEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Trophy className="w-10 h-10 text-muted-foreground/30 mb-3" />
      <p className="text-sm text-muted-foreground">
        {'Aucune équipe n\'a marqué ce soir'}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rank badge                                                        */
/* ------------------------------------------------------------------ */

function RankBadge({ rank }: { rank: number }) {
  const base = 'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold tabular-nums shrink-0';
  if (rank === 1) {
    return <span className={cn(base, 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30')}>{rank}</span>;
  }
  if (rank === 2) {
    return <span className={cn(base, 'bg-slate-400/15 text-slate-300 ring-1 ring-slate-400/20')}>{rank}</span>;
  }
  if (rank === 3) {
    return <span className={cn(base, 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/20')}>{rank}</span>;
  }
  return <span className={cn(base, 'text-muted-foreground')}>{rank}</span>;
}

/* ------------------------------------------------------------------ */
/*  Team row — single-line table layout                               */
/* ------------------------------------------------------------------ */

function TeamRow({
  team, rank, isExpanded, onToggle,
}: {
  team: LiveTeamPoints;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border/60 transition-all duration-200 overflow-hidden',
        isExpanded && 'border-border bg-muted/30',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-2.5 py-2 hover:bg-muted/40 transition-colors text-left cursor-pointer"
      >
        {/* Mobile: two lines — name then stats. sm+: single row */}
        <div className="flex items-center gap-2">
          <RankBadge rank={rank} />
          <span className="flex-1 text-sm font-semibold text-foreground min-w-0 truncate sm:hidden">
            {team.equipeNom}
          </span>
          {/* sm+ single-row layout */}
          <span className="hidden sm:block flex-1 text-sm font-semibold text-foreground min-w-0 truncate">
            {team.equipeNom}
          </span>
          <span className="hidden sm:block w-8 text-center tabular-nums text-xs text-muted-foreground shrink-0">
            {team.totalPJ ?? 0}
          </span>
          <span className="hidden sm:block w-9 text-center tabular-nums text-sm font-bold text-primary shrink-0">
            {team.totalPoints}
          </span>
          <span className="hidden sm:block w-10 text-center tabular-nums text-xs text-muted-foreground shrink-0">
            {team.totalPJ > 0 ? (team.totalPoints / team.totalPJ).toFixed(2) : '—'}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0',
              isExpanded && 'rotate-180',
            )}
          />
        </div>

        {/* Mobile stats row */}
        <div className="flex items-center gap-3 mt-1 pl-8 sm:hidden text-[10px] font-semibold uppercase tracking-wider text-muted-foreground tabular-nums">
          <span>
            {'PJ '}
            <span className="text-foreground">{team.totalPJ ?? 0}</span>
          </span>
          <span className="w-px h-3 bg-border/60" />
          <span>
            {'Pts '}
            <span className="text-sm font-bold text-primary">{team.totalPoints}</span>
          </span>
          <span className="w-px h-3 bg-border/60" />
          <span>
            {'PPM '}
            <span className="text-foreground">
              {team.totalPJ > 0 ? (team.totalPoints / team.totalPJ).toFixed(2) : '—'}
            </span>
          </span>
        </div>
      </button>

      {isExpanded && <TeamExpandedRoster team={team} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main list                                                         */
/* ------------------------------------------------------------------ */

function LeaderboardList({ teams, expandedTeamId, onToggle }: {
  teams: LiveTeamPoints[];
  expandedTeamId: number | null;
  onToggle: (teamId: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      {/* Column headers — visible on sm+ */}
      <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="w-6 shrink-0" />
        <span className="flex-1">Équipe</span>
        <span className="w-8 text-center shrink-0">PJ</span>
        <span className="w-9 text-center shrink-0">Pts</span>
        <span className="w-10 text-center shrink-0">PPM</span>
        <span className="w-4 shrink-0" />
      </div>

      {teams.map((team, index) => (
        <TeamRow
          key={team.equipeId}
          team={team}
          rank={index + 1}
          isExpanded={expandedTeamId === team.equipeId}
          onToggle={() => onToggle(team.equipeId)}
        />
      ))}
    </div>
  );
}

function LeaderboardContent({
  teams, expandedTeamId, isLoading, onToggle,
}: {
  teams: LiveTeamPoints[];
  expandedTeamId: number | null;
  isLoading: boolean;
  onToggle: (teamId: number) => void;
}) {
  if (isLoading) return <LeaderboardSkeleton />;
  if (teams.length === 0) return <LeaderboardEmpty />;
  return (
    <LeaderboardList
      teams={teams}
      expandedTeamId={expandedTeamId}
      onToggle={onToggle}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line import/prefer-default-export
export function LivePointsLeaderboard({ teams, isLoading }: LivePointsLeaderboardProps) {
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

  const toggleTeam = (teamId: number) => {
    setExpandedTeamId((prev) => (prev === teamId ? null : teamId));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Classement quotidien</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LeaderboardContent
          teams={teams}
          expandedTeamId={expandedTeamId}
          isLoading={isLoading}
          onToggle={toggleTeam}
        />
      </CardContent>
    </Card>
  );
}
