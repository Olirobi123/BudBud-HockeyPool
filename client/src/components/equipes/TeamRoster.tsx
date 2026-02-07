import { Fragment } from 'react';
import { Users } from 'lucide-react';
import { Link } from 'wouter';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getPositionColor } from '@/lib/utils';
import {
  RosterPlayerWithStats, isGoalieStats, isSkaterStats,
} from '@/types';

interface TeamRosterProps {
  roster: RosterPlayerWithStats[];
  isLoading: boolean;
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
}

function SkaterGroupTable({ players, title }: SkaterGroupTableProps) {
  if (players.length === 0) return null;

  const sortedPlayers = sortByPoints(players);
  const totalPoints = calculateTotalPoints(players);

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">{title}</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Joueur</TableHead>
            <TableHead className="w-16 text-center">Pos</TableHead>
            <TableHead className="w-12 text-center">PJ</TableHead>
            <TableHead className="w-12 text-center">B</TableHead>
            <TableHead className="w-12 text-center">A</TableHead>
            <TableHead className="w-12 text-center">Pts</TableHead>
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
                  <TableCell>
                    <Link
                      href={`/joueur/${player.nhl_player_id}`}
                      className="flex items-center gap-2 font-medium hover:underline text-primary"
                    >
                      {player.teamLogo && (
                        <img
                          src={player.teamLogo}
                          alt=""
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      {player.prenom} {player.nom}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getPositionColor(player.position)}>
                      {player.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {stats?.gamesPlayed ?? '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {stats?.goals ?? '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {stats?.assists ?? '-'}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {stats?.points ?? '-'}
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
          <TableRow className="bg-muted/50 font-semibold border-t-2">
            <TableCell colSpan={5} className="text-right">
              Total
            </TableCell>
            <TableCell className="text-center text-lg font-bold text-primary">
              {totalPoints}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function GoaliesTable({ goalies }: { goalies: RosterPlayerWithStats[] }) {
  if (goalies.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">Gardiens</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Joueur</TableHead>
            <TableHead className="w-16 text-center">Pos</TableHead>
            <TableHead className="w-12 text-center">PJ</TableHead>
            <TableHead className="w-12 text-center">V</TableHead>
            <TableHead className="w-16 text-center">%ARR</TableHead>
            <TableHead className="w-16 text-center">MOY</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goalies.map((player) => {
            const stats = player.nhlStats && isGoalieStats(player.nhlStats)
              ? player.nhlStats
              : null;

            return (
              <TableRow key={player.id}>
                <TableCell>
                  <Link
                    href={`/joueur/${player.nhl_player_id}`}
                    className="flex items-center gap-2 font-medium hover:underline text-primary"
                  >
                    {player.teamLogo && (
                      <img
                        src={player.teamLogo}
                        alt=""
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    {player.prenom} {player.nom}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getPositionColor(player.position)}>
                    {player.position}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {stats?.gamesPlayed ?? '-'}
                </TableCell>
                <TableCell className="text-center">
                  {stats?.wins ?? '-'}
                </TableCell>
                <TableCell className="text-center">
                  {stats ? `.${Math.round(stats.savePctg * 1000).toString().padStart(3, '0')}` : '-'}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {stats?.goalsAgainstAvg.toFixed(2) ?? '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function TeamRoster({ roster, isLoading }: TeamRosterProps) {
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
            <SkaterGroupTable players={forwards} title="Attaquants" />
            <SkaterGroupTable players={defensemen} title="Défenseurs" />
            <GoaliesTable goalies={goalies} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
