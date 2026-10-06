import { Fragment } from 'react';
import { Users } from 'lucide-react';
import { Link } from "react-router-dom";
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  RosterPlayerWithStats, isGoalieStats, isSkaterStats,
} from '@/types';
import { InjuryInfo } from '@/types/IInjury';
import { EtatInfo } from '@/types/IEtat';
import { TeamLogo } from '@/components/ui/team-logo';
import { InjuryBadge } from './InjuryBadge';
import { EtatBadge } from './EtatBadge';

interface TeamRosterProps {
  roster: RosterPlayerWithStats[];
  isLoading: boolean;
  injuries?: Record<number, InjuryInfo>;
  etat?: Record<number, EtatInfo>;
}

function sortByPoints(players: RosterPlayerWithStats[]): RosterPlayerWithStats[] {
  return [...players].sort((a, b) => {
    const aPoints = a.nhlStats && isSkaterStats(a.nhlStats) ? a.nhlStats.points : 0;
    const bPoints = b.nhlStats && isSkaterStats(b.nhlStats) ? b.nhlStats.points : 0;
    return bPoints - aPoints;
  });
}

interface SkaterTotals {
  gp: number;
  goals: number;
  assists: number;
  points: number;
  ppm: number;
}

/** Totals over players that count toward pool points (isActive), same rule as Pts. */
function calculateSkaterTotals(players: RosterPlayerWithStats[]): SkaterTotals {
  const totals = players.reduce((acc, p) => {
    if (p.isActive && p.nhlStats && isSkaterStats(p.nhlStats)) {
      return {
        gp: acc.gp + p.nhlStats.gamesPlayed,
        goals: acc.goals + p.nhlStats.goals,
        assists: acc.assists + p.nhlStats.assists,
        points: acc.points + p.nhlStats.points,
      };
    }
    return acc;
  }, {
    gp: 0, goals: 0, assists: 0, points: 0,
  });
  return { ...totals, ppm: totals.gp > 0 ? totals.points / totals.gp : 0 };
}

function RosterSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared badge helper                                                 */
/* ------------------------------------------------------------------ */

function PlayerBadge({
  nhlId, injuries, etat, position,
}: {
  nhlId: number;
  injuries?: Record<number, InjuryInfo>;
  etat?: Record<number, EtatInfo>;
  position: string;
}) {
  if (injuries?.[nhlId]) return <InjuryBadge injury={injuries[nhlId]} />;
  if (etat?.[nhlId] && etat[nhlId].etat !== 'normal') {
    return <EtatBadge etat={etat[nhlId]} position={position} />;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Mobile row — div-based, full control                               */
/* ------------------------------------------------------------------ */

interface MobileSkaterRowProps {
  player: RosterPlayerWithStats;
  injuries?: Record<number, InjuryInfo>;
  etat?: Record<number, EtatInfo>;
}

function MobileSkaterRow({ player, injuries, etat }: MobileSkaterRowProps) {
  const stats = player.nhlStats && isSkaterStats(player.nhlStats) ? player.nhlStats : null;

  return (
    <div className={`flex items-center px-1 py-2 ${player.isActive === false ? 'opacity-50' : ''}`}>
      {player.teamLogo
        ? <TeamLogo src={player.teamLogo} alt="" className="w-7 h-7 object-contain shrink-0 mr-2" />
        : <span className="w-7 shrink-0 mr-2" />}
      <div className="flex-1 min-w-0">
        <Link to={`/joueur/${player.nhl_player_id}`} className="text-sm font-medium text-primary hover:underline leading-snug">
          {player.prenom} {player.nom}
        </Link>
      </div>
      <span className="inline-flex items-center shrink-0">
        <PlayerBadge nhlId={player.nhl_player_id} injuries={injuries} etat={etat} position={player.position} />
      </span>
      <span className="w-8 text-center text-xs text-muted-foreground tabular-nums shrink-0">{stats?.gamesPlayed ?? '-'}</span>
      <span className="w-8 text-center text-xs font-bold text-primary tabular-nums shrink-0">{stats?.points ?? '-'}</span>
      <span className="w-9 text-center text-xs text-muted-foreground tabular-nums shrink-0">{stats ? stats.ppm.toFixed(2) : '-'}</span>
    </div>
  );
}

function MobileGoalieRow({ player, injuries, etat }: MobileSkaterRowProps) {
  const stats = player.nhlStats && isGoalieStats(player.nhlStats) ? player.nhlStats : null;
  const poolPts = player.nhlStats && isGoalieStats(player.nhlStats)
    ? player.nhlStats.wins * 2 + player.nhlStats.shutouts * 3
    : 0;

  return (
    <div className={`flex items-center px-1 py-2 ${player.isActive === false ? 'opacity-50' : ''}`}>
      {player.teamLogo
        ? <TeamLogo src={player.teamLogo} alt="" className="w-7 h-7 object-contain shrink-0 mr-2" />
        : <span className="w-7 shrink-0 mr-2" />}
      <div className="flex-1 min-w-0">
        <Link to={`/joueur/${player.nhl_player_id}`} className="text-sm font-medium text-primary hover:underline leading-snug">
          {player.prenom} {player.nom}
        </Link>
      </div>
      <span className="inline-flex items-center shrink-0">
        <PlayerBadge nhlId={player.nhl_player_id} injuries={injuries} etat={etat} position={player.position} />
      </span>
      <span className="w-8 text-center text-xs text-muted-foreground tabular-nums shrink-0">{stats?.gamesPlayed ?? '-'}</span>
      <span className="w-8 text-center text-xs font-bold text-primary tabular-nums shrink-0">{poolPts}</span>
      <span className="w-9 text-center text-xs text-muted-foreground tabular-nums shrink-0">{stats ? stats.ppm.toFixed(2) : '-'}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skater group — table on desktop, div list on mobile               */
/* ------------------------------------------------------------------ */

interface SkaterGroupTableProps {
  players: RosterPlayerWithStats[];
  title: string;
  injuries?: Record<number, InjuryInfo>;
  etat?: Record<number, EtatInfo>;
}

function SkaterGroupTable({ players, title, injuries, etat }: SkaterGroupTableProps) {
  if (players.length === 0) return null;

  const sortedPlayers = sortByPoints(players);
  const totals = calculateSkaterTotals(players);

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">{title}</h4>

      {/* ── Mobile list ── */}
      <div className="min-[480px]:hidden divide-y divide-border/40">
        <div className="flex items-center px-1 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/40">
          <span className="w-7 shrink-0 mr-2" />
          <span className="flex-1 min-w-0">Joueur</span>
          <span className="w-8 text-center shrink-0">PJ</span>
          <span className="w-8 text-center shrink-0 text-primary">Pts</span>
          <span className="w-9 text-center shrink-0">PPM</span>
        </div>
        {sortedPlayers.map((player, index) => (
          <Fragment key={player.id}>
            {player.isActive === false && index > 0 && sortedPlayers[index - 1].isActive === true && (
              <div className="border-t-2 border-dashed border-muted-foreground/30 my-0.5" />
            )}
            <MobileSkaterRow player={player} injuries={injuries} etat={etat} />
          </Fragment>
        ))}
        <div className="flex items-center px-1 py-2 border-t-2 bg-muted/40">
          <span className="w-7 shrink-0 mr-2" />
          <span className="flex-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</span>
          <span className="w-8 text-center text-xs font-semibold text-muted-foreground tabular-nums shrink-0">{totals.gp}</span>
          <span className="w-8 text-center shrink-0">
            <span className="inline-flex items-center justify-center min-w-[2rem] rounded-md bg-primary/15 text-primary text-base font-bold px-2 py-0.5 tabular-nums">
              {totals.points}
            </span>
          </span>
          <span className="w-9 text-center text-xs font-semibold text-muted-foreground tabular-nums shrink-0">{totals.ppm.toFixed(2)}</span>
        </div>
      </div>

      {/* ── Desktop table ── */}
      <Table className="hidden min-[480px]:table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-full px-2 sm:px-4">Joueur</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-1 sm:px-4">PJ</TableHead>
            <TableHead className="w-12 text-center px-4 hidden md:table-cell">B</TableHead>
            <TableHead className="w-12 text-center px-4 hidden md:table-cell">A</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-1 sm:px-4 text-primary font-semibold">Pts</TableHead>
            <TableHead className="w-12 sm:w-16 text-center px-1 sm:px-4">PPM</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.map((player, index) => {
            const stats = player.nhlStats && isSkaterStats(player.nhlStats) ? player.nhlStats : null;
            const showSeparator = player.isActive === false
              && index > 0
              && sortedPlayers[index - 1].isActive === true;

            return (
              <Fragment key={player.id}>
                {showSeparator && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-1 px-0">
                      <div className="border-t-2 border-dashed border-muted-foreground/30" />
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className={player.isActive === false ? 'opacity-50' : ''}>
                  <TableCell className="max-w-0 px-2 sm:px-4 py-1.5 sm:py-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Link
                        to={`/joueur/${player.nhl_player_id}`}
                        className="flex items-center gap-1.5 sm:gap-2 font-medium hover:underline text-primary min-w-0 flex-1"
                      >
                        {player.teamLogo && (
                          <TeamLogo src={player.teamLogo} alt="" className="w-7 h-7 sm:w-9 sm:h-9 object-contain shrink-0" />
                        )}
                        <span className="truncate">{player.prenom} {player.nom}</span>
                      </Link>
                      <PlayerBadge nhlId={player.nhl_player_id} injuries={injuries} etat={etat} position={player.position} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-1 sm:px-4 py-1.5 sm:py-2">{stats?.gamesPlayed ?? '-'}</TableCell>
                  <TableCell className="text-center px-4 py-2 hidden md:table-cell">{stats?.goals ?? '-'}</TableCell>
                  <TableCell className="text-center px-4 py-2 hidden md:table-cell">{stats?.assists ?? '-'}</TableCell>
                  <TableCell className="text-center px-1 sm:px-4 py-1.5 sm:py-2 font-semibold text-primary tabular-nums">{stats?.points ?? '-'}</TableCell>
                  <TableCell className="text-center px-1 sm:px-4 py-1.5 sm:py-2">{stats ? stats.ppm.toFixed(2) : '-'}</TableCell>
                </TableRow>
              </Fragment>
            );
          })}
          <TableRow className="bg-muted/50 font-semibold border-t-2">
            <TableCell className="px-2 sm:px-4">Total</TableCell>
            <TableCell className="text-center px-1 sm:px-4 tabular-nums">{totals.gp}</TableCell>
            <TableCell className="text-center px-4 hidden md:table-cell tabular-nums">{totals.goals}</TableCell>
            <TableCell className="text-center px-4 hidden md:table-cell tabular-nums">{totals.assists}</TableCell>
            <TableCell className="text-center px-1 sm:px-4">
              <span className="inline-flex items-center justify-center min-w-[2.5rem] rounded-md bg-primary/15 text-primary text-lg font-bold px-2 py-0.5 tabular-nums">
                {totals.points}
              </span>
            </TableCell>
            <TableCell className="text-center px-1 sm:px-4 tabular-nums">{totals.ppm.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Goalies group                                                       */
/* ------------------------------------------------------------------ */

function getGoaliePoolPoints(player: RosterPlayerWithStats): number {
  if (player.nhlStats && isGoalieStats(player.nhlStats)) {
    return player.nhlStats.wins * 2 + player.nhlStats.shutouts * 3;
  }
  return 0;
}

interface GoalieTotals {
  gp: number;
  wins: number;
  shutouts: number;
  points: number;
  ppm: number;
}

/** Totals over goalies that count toward pool points (isActive), same rule as Pts. */
function calculateGoalieTotals(goalies: RosterPlayerWithStats[]): GoalieTotals {
  const totals = goalies.reduce((acc, p) => {
    if (p.isActive && p.nhlStats && isGoalieStats(p.nhlStats)) {
      return {
        gp: acc.gp + p.nhlStats.gamesPlayed,
        wins: acc.wins + p.nhlStats.wins,
        shutouts: acc.shutouts + p.nhlStats.shutouts,
        points: acc.points + getGoaliePoolPoints(p),
      };
    }
    return acc;
  }, {
    gp: 0, wins: 0, shutouts: 0, points: 0,
  });
  return { ...totals, ppm: totals.gp > 0 ? totals.points / totals.gp : 0 };
}

function GoaliesTable({ goalies, injuries, etat }: {
  goalies: RosterPlayerWithStats[];
  injuries?: Record<number, InjuryInfo>;
  etat?: Record<number, EtatInfo>;
}) {
  if (goalies.length === 0) return null;

  const sorted = [...goalies].sort((a, b) => getGoaliePoolPoints(b) - getGoaliePoolPoints(a));
  const totals = calculateGoalieTotals(goalies);

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">Gardiens</h4>

      {/* ── Mobile list ── */}
      <div className="min-[480px]:hidden divide-y divide-border/40">
        <div className="flex items-center px-1 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/40">
          <span className="w-7 shrink-0 mr-2" />
          <span className="flex-1 min-w-0">Joueur</span>
          <span className="w-8 text-center shrink-0">PJ</span>
          <span className="w-8 text-center shrink-0 text-primary">Pts</span>
          <span className="w-9 text-center shrink-0">PPM</span>
        </div>
        {sorted.map((player, index) => (
          <Fragment key={player.id}>
            {player.isActive === false && index > 0 && sorted[index - 1].isActive === true && (
              <div className="border-t-2 border-dashed border-muted-foreground/30 my-0.5" />
            )}
            <MobileGoalieRow player={player} injuries={injuries} etat={etat} />
          </Fragment>
        ))}
        <div className="flex items-center px-1 py-2 border-t-2 bg-muted/40">
          <span className="w-7 shrink-0 mr-2" />
          <span className="flex-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</span>
          <span className="w-8 text-center text-xs font-semibold text-muted-foreground tabular-nums shrink-0">{totals.gp}</span>
          <span className="w-8 text-center shrink-0">
            <span className="inline-flex items-center justify-center min-w-[2rem] rounded-md bg-primary/15 text-primary text-base font-bold px-2 py-0.5 tabular-nums">
              {totals.points}
            </span>
          </span>
          <span className="w-9 text-center text-xs font-semibold text-muted-foreground tabular-nums shrink-0">{totals.ppm.toFixed(2)}</span>
        </div>
      </div>

      {/* ── Desktop table ── */}
      <Table className="hidden min-[480px]:table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-full px-2 sm:px-4">Joueur</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-1 sm:px-4">PJ</TableHead>
            <TableHead className="w-12 text-center px-4 hidden md:table-cell">V</TableHead>
            <TableHead className="w-12 text-center px-4 hidden md:table-cell">BL</TableHead>
            <TableHead className="w-10 sm:w-16 text-center px-1 sm:px-4 text-primary font-semibold">Pts</TableHead>
            <TableHead className="w-12 sm:w-16 text-center px-1 sm:px-4">PPM</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((player, index) => {
            const stats = player.nhlStats && isGoalieStats(player.nhlStats) ? player.nhlStats : null;
            const poolPts = getGoaliePoolPoints(player);
            const showSeparator = player.isActive === false
              && index > 0
              && sorted[index - 1].isActive === true;

            return (
              <Fragment key={player.id}>
                {showSeparator && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-1 px-0">
                      <div className="border-t-2 border-dashed border-muted-foreground/30" />
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className={player.isActive === false ? 'opacity-50' : ''}>
                  <TableCell className="max-w-0 px-2 sm:px-4 py-1.5 sm:py-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Link
                        to={`/joueur/${player.nhl_player_id}`}
                        className="flex items-center gap-1.5 sm:gap-2 font-medium hover:underline text-primary min-w-0 flex-1"
                      >
                        {player.teamLogo && (
                          <TeamLogo src={player.teamLogo} alt="" className="w-7 h-7 sm:w-9 sm:h-9 object-contain shrink-0" />
                        )}
                        <span className="truncate">{player.prenom} {player.nom}</span>
                      </Link>
                      <PlayerBadge nhlId={player.nhl_player_id} injuries={injuries} etat={etat} position={player.position} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-1 sm:px-4 py-1.5 sm:py-2">{stats?.gamesPlayed ?? '-'}</TableCell>
                  <TableCell className="text-center px-4 py-2 hidden md:table-cell">{stats?.wins ?? '-'}</TableCell>
                  <TableCell className="text-center px-4 py-2 hidden md:table-cell">{stats?.shutouts ?? '-'}</TableCell>
                  <TableCell className="text-center px-1 sm:px-4 py-1.5 sm:py-2 font-semibold text-primary tabular-nums">{poolPts}</TableCell>
                  <TableCell className="text-center px-1 sm:px-4 py-1.5 sm:py-2">{stats ? stats.ppm.toFixed(2) : '-'}</TableCell>
                </TableRow>
              </Fragment>
            );
          })}
          <TableRow className="bg-muted/50 font-semibold border-t-2">
            <TableCell className="px-2 sm:px-4">Total</TableCell>
            <TableCell className="text-center px-1 sm:px-4 tabular-nums">{totals.gp}</TableCell>
            <TableCell className="text-center px-4 hidden md:table-cell tabular-nums">{totals.wins}</TableCell>
            <TableCell className="text-center px-4 hidden md:table-cell tabular-nums">{totals.shutouts}</TableCell>
            <TableCell className="text-center px-1 sm:px-4">
              <span className="inline-flex items-center justify-center min-w-[2.5rem] rounded-md bg-primary/15 text-primary text-lg font-bold px-2 py-0.5 tabular-nums">
                {totals.points}
              </span>
            </TableCell>
            <TableCell className="text-center px-1 sm:px-4 tabular-nums">{totals.ppm.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Export                                                              */
/* ------------------------------------------------------------------ */

export function TeamRoster({ roster, isLoading, injuries, etat }: TeamRosterProps) {
  const forwards = roster.filter((p) => ['C', 'L', 'R'].includes(p.position));
  const defensemen = roster.filter((p) => p.position === 'D');
  const goalies = roster.filter((p) => p.position === 'G');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Effectif Actuel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <RosterSkeleton />
        ) : roster.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Effectif à venir</h3>
            <p className="max-w-sm mt-1">
              L&apos;effectif de cette équipe n&apos;est pas encore disponible. Il sera affiché ici dès que les données seront importées.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <SkaterGroupTable players={forwards} title="Attaquants" injuries={injuries} etat={etat} />
            <SkaterGroupTable players={defensemen} title="Défenseurs" injuries={injuries} etat={etat} />
            <GoaliesTable goalies={goalies} injuries={injuries} etat={etat} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
