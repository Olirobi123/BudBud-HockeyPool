import { Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { getPositionColor } from '@/lib/utils';
import type { LivePlayerPoints } from '@/types/ILivePoints';

interface LivePointsFeedProps {
  players: LivePlayerPoints[];
  liveGamesCount: number;
  isLoading: boolean;
}

function FeedSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="flex items-center gap-3 px-2 py-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  );
}

function FeedEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Target className="w-10 h-10 text-muted-foreground/30 mb-3" />
      <p className="text-sm text-muted-foreground">
        Aucun point marqué ce soir
      </p>
    </div>
  );
}

function FeedTable({ players }: { players: LivePlayerPoints[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8 px-1 text-center">#</TableHead>
          <TableHead className="px-2">Joueur</TableHead>
          <TableHead className="w-10 text-center px-1 hidden sm:table-cell">Pos</TableHead>
          <TableHead className="w-10 text-center px-1">B</TableHead>
          <TableHead className="w-10 text-center px-1">A</TableHead>
          <TableHead className="w-10 text-center px-1">Pts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => (
          <TableRow
            key={player.nhlPlayerId}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.04}s`, animationFillMode: 'both' }}
          >
            <TableCell className="px-1 text-center tabular-nums text-xs text-muted-foreground font-medium">
              {index + 1}
            </TableCell>
            <TableCell className="px-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={player.headshot}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover shrink-0 bg-muted"
                />
                <img
                  src={player.nhlTeamLogo}
                  alt={player.nhlTeamAbbrev}
                  className="w-5 h-5 object-contain shrink-0"
                />
                <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                  <Link
                    to={`/joueur/${player.nhlPlayerId}`}
                    className="text-sm font-medium hover:underline text-primary truncate"
                  >
                    {`${player.firstName} ${player.lastName}`}
                  </Link>
                  {player.poolTeam && (
                    <Badge
                      variant="outline"
                      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0 bg-amber-500/10 text-amber-500 border-amber-500/20 shrink-0"
                    >
                      {player.poolTeam.nom}
                    </Badge>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center px-1 hidden sm:table-cell">
              <Badge className={`text-[10px] ${getPositionColor(player.position)}`}>
                {player.position}
              </Badge>
            </TableCell>
            <TableCell className="text-center px-1 tabular-nums text-sm">
              {player.goals}
            </TableCell>
            <TableCell className="text-center px-1 tabular-nums text-sm">
              {player.assists}
            </TableCell>
            <TableCell className="text-center px-1 tabular-nums text-sm font-bold text-primary">
              {player.points}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function FeedContent({ players, isLoading }: { players: LivePlayerPoints[]; isLoading: boolean }) {
  if (isLoading) return <FeedSkeleton />;
  if (players.length === 0) return <FeedEmpty />;
  return <FeedTable players={players} />;
}

// eslint-disable-next-line import/prefer-default-export
export function LivePointsFeed({ players, liveGamesCount, isLoading }: LivePointsFeedProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Marqueurs</span>
          </div>
          {liveGamesCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                {`${liveGamesCount} en cours`}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FeedContent players={players} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
