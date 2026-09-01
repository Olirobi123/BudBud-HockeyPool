import { useState, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { TeamPointsRanking } from '@/types/IEquipes';

/* ------------------------------------------------------------------ */
/*  Ranking category                                                   */
/* ------------------------------------------------------------------ */

type RankingCategory = 'general' | 'attaque' | 'defense' | 'gardiens';

interface CategoryConfig {
  key: RankingCategory;
  label: string;
  mobileLabel: string;
  colLabel: string;
  pointsKey: keyof TeamPointsRanking;
  matchsKey: keyof TeamPointsRanking;
  activeClass: string;
  valueClass: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'general',
    label: 'Général',
    mobileLabel: 'Gén',
    colLabel: 'Pts',
    pointsKey: 'total_points',
    matchsKey: 'total_matchs',
    activeClass: 'bg-primary text-primary-foreground shadow-sm',
    valueClass: 'text-foreground',
  },
  {
    key: 'attaque',
    label: 'Attaque',
    mobileLabel: 'Att',
    colLabel: 'Att',
    pointsKey: 'attaque_points',
    matchsKey: 'attaque_matchs',
    activeClass: 'bg-primary text-primary-foreground shadow-sm',
    valueClass: 'text-foreground',
  },
  {
    key: 'defense',
    label: 'Défense',
    mobileLabel: 'Déf',
    colLabel: 'Déf',
    pointsKey: 'defense_points',
    matchsKey: 'defense_matchs',
    activeClass: 'bg-primary text-primary-foreground shadow-sm',
    valueClass: 'text-foreground',
  },
  {
    key: 'gardiens',
    label: 'Gardiens',
    mobileLabel: 'Gar',
    colLabel: 'Gar',
    pointsKey: 'gardien_points',
    matchsKey: 'gardien_matchs',
    activeClass: 'bg-primary text-primary-foreground shadow-sm',
    valueClass: 'text-foreground',
  },
];

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
/*  Category toggle group                                              */
/* ------------------------------------------------------------------ */

interface CategoryToggleProps {
  active: RankingCategory;
  onChange: (cat: RankingCategory) => void;
}

function CategoryToggle({ active, onChange }: CategoryToggleProps) {
  return (
    <div className="grid grid-cols-4 sm:inline-flex gap-1 p-1 rounded-lg bg-muted/40 border border-border/40 w-full sm:w-auto">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onChange(cat.key)}
            className={cn(
              'px-1.5 sm:px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-normal sm:tracking-wide transition-colors cursor-pointer',
              isActive
                ? cat.activeClass
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
            )}
          >
            <span className="sm:hidden">{cat.mobileLabel}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rank badge                                                         */
/* ------------------------------------------------------------------ */

function RankBadge({ rank }: { rank: number }) {
  const base = 'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold tabular-nums shrink-0';
  if (rank === 1) {
    return <span className={cn(base, 'bg-foreground text-background')}>{rank}</span>;
  }
  if (rank === 2) {
    return <span className={cn(base, 'bg-muted text-foreground ring-1 ring-border')}>{rank}</span>;
  }
  if (rank === 3) {
    return <span className={cn(base, 'bg-muted text-muted-foreground ring-1 ring-border')}>{rank}</span>;
  }
  return <span className={cn(base, 'text-muted-foreground')}>{rank}</span>;
}

/* ------------------------------------------------------------------ */
/*  Diff cell                                                          */
/* ------------------------------------------------------------------ */

function DiffCell({ diff }: { diff: number }) {
  if (diff === 0) {
    return <span className="w-10 text-center tabular-nums text-xs text-muted-foreground/40 shrink-0">—</span>;
  }
  return (
    <span className="w-10 text-center tabular-nums text-xs text-muted-foreground shrink-0">
      {`−${diff}`}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Team row                                                           */
/* ------------------------------------------------------------------ */

interface TeamRowProps {
  team: TeamPointsRanking;
  leader: number;
  activeCategory: RankingCategory;
}

function TeamRow({ team, leader, activeCategory }: TeamRowProps) {
  const activeCfg = CATEGORIES.find((c) => c.key === activeCategory)!;
  const activePoints = team[activeCfg.pointsKey] as number;
  const activeMatchs = team[activeCfg.matchsKey] as number;
  const diff = leader - activePoints;

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
          {activeMatchs}
        </span>
        <span className={cn('w-9 text-center tabular-nums text-sm font-bold shrink-0', activeCfg.valueClass)}>
          {activePoints}
        </span>
        <span className="w-10 text-center tabular-nums text-xs text-muted-foreground shrink-0">
          {activeMatchs > 0 ? (activePoints / activeMatchs).toFixed(2) : '—'}
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
            <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
              {`−${diff}`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 pl-8 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground tabular-nums">
          <span>
            {'PJ '}
            <span className="text-foreground">{activeMatchs}</span>
          </span>
          <span className="w-px h-3 bg-border/60" />
          <span>
            {`${activeCfg.colLabel} `}
            <span className={cn('font-bold', activeCfg.valueClass)}>{activePoints}</span>
          </span>
          <span className="w-px h-3 bg-border/60" />
          <span>
            {'PPM '}
            <span className="text-foreground">
              {activeMatchs > 0 ? (activePoints / activeMatchs).toFixed(2) : '—'}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main list                                                          */
/* ------------------------------------------------------------------ */

interface RankingsListProps {
  teams: TeamPointsRanking[];
  activeCategory: RankingCategory;
}

function RankingsList({ teams, activeCategory }: RankingsListProps) {
  const activeCfg = CATEGORIES.find((c) => c.key === activeCategory)!;
  const leader = (teams[0]?.[activeCfg.pointsKey] as number) ?? 0;

  return (
    <div className="space-y-1.5">
      {/* Column headers — visible on sm+ */}
      <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="w-6 shrink-0" />
        <span className="flex-1">Équipe</span>
        <span className="w-9 text-center shrink-0">PJ</span>
        <span className={cn('w-9 text-center shrink-0', activeCfg.valueClass)}>
          {activeCfg.colLabel}
        </span>
        <span className="w-10 text-center shrink-0">PPM</span>
        <span className="w-10 text-center shrink-0">Diff</span>
      </div>

      {teams.map((team) => (
        <TeamRow
          key={team.id}
          team={team}
          leader={leader}
          activeCategory={activeCategory}
        />
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
export function PointsLeaderboard({ teams, isLoading }: PointsLeaderboardProps): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<RankingCategory>('general');

  const sortedTeams = useMemo<TeamPointsRanking[]>(() => {
    const activeCfg = CATEGORIES.find((c) => c.key === activeCategory)!;
    return [...teams]
      .sort((a, b) => {
        const aVal = a[activeCfg.pointsKey] as number;
        const bVal = b[activeCfg.pointsKey] as number;
        return bVal - aVal;
      })
      .map((team, i) => ({ ...team, rank: i + 1 }));
  }, [teams, activeCategory]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-muted-foreground" />
            <span>Classement général</span>
          </CardTitle>
          <CategoryToggle active={activeCategory} onChange={setActiveCategory} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <PointsLeaderboardSkeleton />}
        {!isLoading && teams.length === 0 && <PointsLeaderboardEmpty />}
        {!isLoading && teams.length > 0 && (
          <RankingsList teams={sortedTeams} activeCategory={activeCategory} />
        )}
      </CardContent>
    </Card>
  );
}
