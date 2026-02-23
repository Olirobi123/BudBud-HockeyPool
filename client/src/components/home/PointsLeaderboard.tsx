import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { TeamPointsRanking } from '@/types/IEquipes';

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */

function PointsLeaderboardSkeleton() {
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
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function PointsLeaderboardEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Trophy className="w-10 h-10 text-muted-foreground/30 mb-3" />
      <p className="text-sm text-muted-foreground">Aucun classement disponible</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rank badge                                                         */
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
/*  Team row                                                           */
/* ------------------------------------------------------------------ */

function DiffCell({ diff }: { diff: number }) {
  if (diff === 0) {
    return <span className="w-10 text-center tabular-nums text-xs text-muted-foreground/40 shrink-0">—</span>;
  }
  return (
    <span className="w-10 text-center tabular-nums text-xs text-red-400/80 shrink-0">
      {`+${diff}`}
    </span>
  );
}

function TeamRow({ team, leader }: { team: TeamPointsRanking; leader: number }) {
  const diff = leader - team.total_points;
  return (
    <Link
      to={`/equipes/${team.id}`}
      className="rounded-lg border border-border/60 transition-all duration-200 overflow-hidden hover:bg-muted/30 hover:border-border block px-2.5 py-2"
    >
      {/* sm+: single row */}
      <div className="hidden sm:flex items-center gap-2">
        <RankBadge rank={team.rank} />
        <span className="flex-1 text-sm font-semibold text-foreground min-w-0 truncate">
          {team.nom}
        </span>
        <span className="w-9 text-center tabular-nums text-xs text-muted-foreground shrink-0">
          {team.attaque_points}
        </span>
        <span className="w-9 text-center tabular-nums text-xs text-muted-foreground shrink-0">
          {team.defense_points}
        </span>
        <span className="w-9 text-center tabular-nums text-xs text-muted-foreground shrink-0">
          {team.gardien_points}
        </span>
        <span className="w-9 text-center tabular-nums text-sm font-bold text-primary shrink-0">
          {team.total_points}
        </span>
        <DiffCell diff={diff} />
      </div>

      {/* Mobile: two-line layout */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2">
          <RankBadge rank={team.rank} />
          <span className="flex-1 text-sm font-semibold text-foreground min-w-0 truncate">
            {team.nom}
          </span>
          {diff > 0 && (
            <span className="text-[10px] font-semibold tabular-nums text-red-400/80">
              {`+${diff}`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 pl-8 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground tabular-nums">
          <span>
            {'Att '}
            <span className="text-foreground">{team.attaque_points}</span>
          </span>
          <span className="w-px h-3 bg-border/60" />
          <span>
            {'Déf '}
            <span className="text-foreground">{team.defense_points}</span>
          </span>
          <span className="w-px h-3 bg-border/60" />
          <span>
            {'Gar '}
            <span className="text-foreground">{team.gardien_points}</span>
          </span>
          <span className="w-px h-3 bg-border/60" />
          <span>
            {'Pts '}
            <span className="text-sm font-bold text-primary">{team.total_points}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main list                                                          */
/* ------------------------------------------------------------------ */

function RankingsList({ teams }: { teams: TeamPointsRanking[] }) {
  const leader = teams[0]?.total_points ?? 0;
  return (
    <div className="space-y-1.5">
      {/* Column headers — visible on sm+ */}
      <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="w-6 shrink-0" />
        <span className="flex-1">Équipe</span>
        <span className="w-9 text-center shrink-0">Att</span>
        <span className="w-9 text-center shrink-0">Déf</span>
        <span className="w-9 text-center shrink-0">Gar</span>
        <span className="w-9 text-center shrink-0">Pts</span>
        <span className="w-10 text-center shrink-0">Diff</span>
      </div>

      {teams.map((team) => (
        <TeamRow key={team.id} team={team} leader={leader} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

interface PointsLeaderboardProps {
  teams: TeamPointsRanking[];
  isLoading: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export function PointsLeaderboard({ teams, isLoading }: PointsLeaderboardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Classement général</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <PointsLeaderboardSkeleton />}
        {!isLoading && teams.length === 0 && <PointsLeaderboardEmpty />}
        {!isLoading && teams.length > 0 && <RankingsList teams={teams} />}
      </CardContent>
    </Card>
  );
}
