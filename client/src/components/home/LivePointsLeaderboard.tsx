import { useState } from 'react';
import { Trophy, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { getPositionColor, cn } from '@/lib/utils';
import type { LiveTeamPoints } from '@/types/ILivePoints';

interface LivePointsLeaderboardProps {
  teams: LiveTeamPoints[];
  isLoading: boolean;
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="flex items-center gap-3 px-2 py-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-10" />
        </div>
      ))}
    </div>
  );
}

function TeamExpandedRoster({ team }: { team: LiveTeamPoints }) {
  const sorted = [...team.players].sort(
    (a, b) => b.points - a.points || b.goals - a.goals,
  );

  return (
    <div className="px-2 pb-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-2 text-xs">Joueur</TableHead>
            <TableHead className="w-8 text-center px-1 text-xs hidden sm:table-cell">Pos</TableHead>
            <TableHead className="w-8 text-center px-1 text-xs">B</TableHead>
            <TableHead className="w-8 text-center px-1 text-xs">A</TableHead>
            <TableHead className="w-8 text-center px-1 text-xs">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((player) => (
            <TableRow key={player.nhlPlayerId}>
              <TableCell className="px-2 py-1.5">
                <Link
                  to={`/joueur/${player.nhlPlayerId}`}
                  className="flex items-center gap-1.5 text-xs font-medium hover:underline text-primary min-w-0"
                >
                  <img
                    src={player.nhlTeamLogo}
                    alt={player.nhlTeamAbbrev}
                    className="w-4 h-4 object-contain shrink-0"
                  />
                  <span className="truncate">
                    {`${player.firstName} ${player.lastName}`}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-center px-1 py-1.5 hidden sm:table-cell">
                <Badge className={`text-[9px] ${getPositionColor(player.position)}`}>
                  {player.position}
                </Badge>
              </TableCell>
              <TableCell className="text-center px-1 py-1.5 tabular-nums text-xs">
                {player.goals}
              </TableCell>
              <TableCell className="text-center px-1 py-1.5 tabular-nums text-xs">
                {player.assists}
              </TableCell>
              <TableCell className="text-center px-1 py-1.5 tabular-nums text-xs font-bold text-primary">
                {player.points}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

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

function LeaderboardList({ teams, expandedTeamId, onToggle }: {
  teams: LiveTeamPoints[];
  expandedTeamId: number | null;
  onToggle: (teamId: number) => void;
}) {
  return (
    <div className="space-y-1">
      {teams.map((team, index) => {
        const isExpanded = expandedTeamId === team.equipeId;

        return (
          <div
            key={team.equipeId}
            className={cn(
              'rounded-lg border border-border/60 transition-all duration-200 overflow-hidden',
              isExpanded && 'border-border bg-muted/30',
            )}
          >
            <button
              type="button"
              onClick={() => onToggle(team.equipeId)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 transition-colors text-left"
            >
              <span className="text-xs font-bold text-muted-foreground tabular-nums w-5 text-center">
                {index + 1}
              </span>
              <span className="flex-1 text-sm font-semibold text-foreground truncate">
                {team.equipeNom}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {`${team.totalGoals}B ${team.totalAssists}A`}
              </span>
              <span className="text-sm font-bold text-primary tabular-nums min-w-[2ch] text-right">
                {team.totalPoints}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-muted-foreground transition-transform duration-200',
                  isExpanded && 'rotate-180',
                )}
              />
            </button>
            {isExpanded && <TeamExpandedRoster team={team} />}
          </div>
        );
      })}
    </div>
  );
}

function LeaderboardContent({ teams, expandedTeamId, isLoading, onToggle }: {
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
          <span>Classement en direct</span>
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
