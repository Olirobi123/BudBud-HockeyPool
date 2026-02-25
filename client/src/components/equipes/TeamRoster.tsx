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
import { InjuryBadge } from './InjuryBadge';

interface TeamRosterProps {
  roster: RosterPlayerWithStats[];
  isLoading: boolean;
  injuries?: Record<number, InjuryInfo>;
}

function sortByPoints(players: RosterPlayerWithStats[]): RosterPlayerWithStats[] {
  return [...players].sort((a, b) => {
    const aPoints = a.nhlStats && isSkaterStats(a.nhlStats) ? a.nhlStats.points : 0;
    const bPoints = b.nhlStats && isSkaterStats(b.nhlStats) ? b.nhlStats.points : 0;
    return bPoints - aPoints;
  });
}

function calculateTotalPoints(players: RosterPlayerWithStats[]): number {
  return players.reduce((sum, p) => {
    if (p.isActive && p.nhlStats && isSkaterStats(p.nhlStats)) {
      return sum + p.nhlStats.points;
    }
    return sum;
  }, 0);
}

function RosterSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

interface SkaterGroupTableProps {
  players: RosterPlayerWithStats[];
  title: string;
  injuries?: Record<number, InjuryInfo>;
}

function SkaterGroupTable({ players, title, injuries }: SkaterGroupTableProps) {
  if (players.length === 0) return null;

  const sortedPlayers = sortByPoints(players);
  const totalPoints = calculateTotalPoints(players);

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">{title}</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full px-2 sm:px-4">Joueur</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-1 sm:px-4">PJ</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-1 sm:px-4 hidden sm:table-cell">B</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-0 sm:px-4 hidden sm:table-cell">A</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-0 sm:px-4 text-primary font-semibold">Pts</TableHead>
            <TableHead className="w-10 sm:w-16 text-center px-0 sm:px-4">PPM</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.map((player, index) => {
            const stats = player.nhlStats && isSkaterStats(player.nhlStats)
              ? player.nhlStats
              : null;

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
                  <TableCell className="max-w-0 px-2 sm:px-4">
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/joueur/${player.nhl_player_id}`}
                        className="flex items-center gap-1.5 sm:gap-2 font-medium hover:underline text-primary min-w-0"
                      >
                        {player.teamLogo && (
                          <img
                            src={player.teamLogo}
                            alt=""
                            className="w-8 h-8 sm:w-11 sm:h-11 object-contain shrink-0"
                          />
                        )}
                        <span className="break-words leading-tight">{player.prenom} {player.nom}</span>
                      </Link>
                      {injuries?.[player.nhl_player_id] && (
                        <InjuryBadge injury={injuries[player.nhl_player_id]} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-1 sm:px-4">
                    {stats?.gamesPlayed ?? '-'}
                  </TableCell>
                  <TableCell className="text-center px-1 sm:px-4 hidden sm:table-cell">
                    {stats?.goals ?? '-'}
                  </TableCell>
                  <TableCell className="text-center px-0 sm:px-4 hidden sm:table-cell">
                    {stats?.assists ?? '-'}
                  </TableCell>
                  <TableCell className="text-center px-0 sm:px-4 font-semibold text-primary tabular-nums">
                    {stats?.points ?? '-'}
                  </TableCell>
                  <TableCell className="text-center px-0 sm:px-4">
                    {stats ? stats.ppm.toFixed(2) : '-'}
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
          <TableRow className="bg-muted/50 font-semibold border-t-2">
            <TableCell className="text-right">Total</TableCell>
            <TableCell />
            <TableCell className="hidden sm:table-cell" />
            <TableCell className="hidden sm:table-cell" />
            <TableCell className="text-center">
              <span className="inline-flex items-center justify-center min-w-[2.5rem] rounded-md bg-primary/15 text-primary text-lg font-bold px-2 py-0.5 tabular-nums">
                {totalPoints}
              </span>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function getGoaliePoolPoints(player: RosterPlayerWithStats): number {
  if (player.nhlStats && isGoalieStats(player.nhlStats)) {
    return player.nhlStats.wins * 2 + player.nhlStats.shutouts * 3;
  }
  return 0;
}

function GoaliesTable({ goalies, injuries }: { goalies: RosterPlayerWithStats[]; injuries?: Record<number, InjuryInfo> }) {
  if (goalies.length === 0) return null;

  const sorted = [...goalies].sort((a, b) => getGoaliePoolPoints(b) - getGoaliePoolPoints(a));
  const totalPoints = sorted
    .filter((p) => p.isActive)
    .reduce((sum, p) => sum + getGoaliePoolPoints(p), 0);

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">Gardiens</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full px-2 sm:px-4">Joueur</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-1 sm:px-4">PJ</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-1 sm:px-4 hidden sm:table-cell">V</TableHead>
            <TableHead className="w-10 sm:w-12 text-center px-1 sm:px-4 hidden sm:table-cell">BL</TableHead>
            <TableHead className="w-10 sm:w-16 text-center px-1 sm:px-4 text-primary font-semibold">Pts</TableHead>
            <TableHead className="w-10 sm:w-16 text-center px-1 sm:px-4">PPM</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((player, index) => {
            const stats = player.nhlStats && isGoalieStats(player.nhlStats)
              ? player.nhlStats
              : null;
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
                  <TableCell className="max-w-0 px-2 sm:px-4">
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/joueur/${player.nhl_player_id}`}
                        className="flex items-center gap-1.5 sm:gap-2 font-medium hover:underline text-primary min-w-0"
                      >
                        {player.teamLogo && (
                          <img
                            src={player.teamLogo}
                            alt=""
                            className="w-8 h-8 sm:w-11 sm:h-11 object-contain shrink-0"
                          />
                        )}
                        <span className="break-words leading-tight">{player.prenom} {player.nom}</span>
                      </Link>
                      {injuries?.[player.nhl_player_id] && (
                        <InjuryBadge injury={injuries[player.nhl_player_id]} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-1 sm:px-4">
                    {stats?.gamesPlayed ?? '-'}
                  </TableCell>
                  <TableCell className="text-center px-1 sm:px-4 hidden sm:table-cell">
                    {stats?.wins ?? '-'}
                  </TableCell>
                  <TableCell className="text-center px-1 sm:px-4 hidden sm:table-cell">
                    {stats?.shutouts ?? '-'}
                  </TableCell>
                  <TableCell className="text-center px-1 sm:px-4 font-semibold text-primary tabular-nums">
                    {poolPts}
                  </TableCell>
                  <TableCell className="text-center px-1 sm:px-4">
                    {stats ? stats.ppm.toFixed(2) : '-'}
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
          <TableRow className="bg-muted/50 font-semibold border-t-2">
            <TableCell className="text-right">Total</TableCell>
            <TableCell />
            <TableCell className="hidden sm:table-cell" />
            <TableCell className="hidden sm:table-cell" />
            <TableCell className="text-center">
              <span className="inline-flex items-center justify-center min-w-[2.5rem] rounded-md bg-primary/15 text-primary text-lg font-bold px-2 py-0.5 tabular-nums">
                {totalPoints}
              </span>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export function TeamRoster({ roster, isLoading, injuries }: TeamRosterProps) {
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
              L'effectif de cette équipe n'est pas encore disponible. Il sera affiché ici dès que les données seront importées.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <SkaterGroupTable players={forwards} title="Attaquants" injuries={injuries} />
            <SkaterGroupTable players={defensemen} title="Défenseurs" injuries={injuries} />
            <GoaliesTable goalies={goalies} injuries={injuries} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
