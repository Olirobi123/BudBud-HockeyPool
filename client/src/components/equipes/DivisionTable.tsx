import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RankBadge } from '@/components/ui/rank-badge';
import { TeamDGTooltip } from '@/components/ui/team-dg-tooltip';
import { cn } from '@/lib/utils';
import type { TeamStanding } from '@/types/IEquipes';

const PLAYOFF_CUTOFF = 4;

/*
 * Nord is blue, Sud is red. Written out rather than interpolated so Tailwind's
 * scanner sees whole class names.
 */
const DIVISION = {
  nord: {
    label: 'NORD',
    rule: 'border-t-[3px] border-t-division-nord',
    wash: 'bg-gradient-to-r from-division-nord/10 to-transparent',
    spine: 'shadow-[inset_3px_0_0_hsl(var(--division-nord))]',
  },
  sud: {
    label: 'SUD',
    rule: 'border-t-[3px] border-t-division-sud',
    wash: 'bg-gradient-to-r from-division-sud/10 to-transparent',
    spine: 'shadow-[inset_3px_0_0_hsl(var(--division-sud))]',
  },
} as const;

interface DivisionTableProps {
  division: 'nord' | 'sud';
  standings: TeamStanding[];
}

export function DivisionTable({ division, standings }: DivisionTableProps) {
  const navigate = useNavigate();
  const theme = DIVISION[division];

  return (
    <Card className={cn('overflow-hidden', theme.rule)}>
      <CardHeader className={cn('border-b', theme.wash)}>
        <CardTitle className="text-xl font-bold uppercase tracking-wide">
          Division {theme.label}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>Équipe</TableHead>
              <TableHead className="text-right">Pts</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {standings.map((team) => {
              const isPlayoff = team.rank <= PLAYOFF_CUTOFF;
              const isLastPlayoffSpot = team.rank === PLAYOFF_CUTOFF;

              return (
                <Fragment key={team.id}>
                  <TeamDGTooltip dgName={team.dg_name} division={division}>
                    <TableRow
                      className={cn(
                        'cursor-pointer hover:bg-muted/50 transition-colors group/row',
                        !isPlayoff && 'opacity-50',
                        isPlayoff && theme.spine,
                      )}
                      onClick={() => navigate(`/equipes/${team.id}`)}
                    >
                      <TableCell>
                        <div className="flex justify-center">
                          <RankBadge rank={team.rank} className={!isPlayoff ? 'opacity-70' : undefined} />
                        </div>
                      </TableCell>

                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-2">
                          {team.nom}
                          <UserCircle className="w-4 h-4 text-muted-foreground opacity-0 group-hover/row:opacity-100 transition-opacity duration-75" />
                        </div>
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {team.total_points}
                      </TableCell>
                    </TableRow>
                  </TeamDGTooltip>

                  {isLastPlayoffSpot && standings.length > PLAYOFF_CUTOFF && (
                    <TableRow className="pointer-events-none">
                      <TableCell colSpan={3} className="py-0 px-0">
                        <div className="border-t-2 border-dashed border-muted-foreground/30" />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}

            {standings.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Aucune équipe dans cette division
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {standings.length > PLAYOFF_CUTOFF && (
          <div className="px-4 py-2 border-t text-xs text-muted-foreground">
            Les {PLAYOFF_CUTOFF} premières équipes se qualifient pour les séries.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
