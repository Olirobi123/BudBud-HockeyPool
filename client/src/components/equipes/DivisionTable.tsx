import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TeamDGTooltip } from '@/components/ui/team-dg-tooltip';
import type { TeamStanding } from '@/types/IEquipes';

const PLAYOFF_CUTOFF = 4;

interface DivisionTableProps {
  division: 'nord' | 'sud';
  standings: TeamStanding[];
  color: string;
}

export function DivisionTable({ division, standings, color }: DivisionTableProps) {
  const navigate = useNavigate();
  const divisionLabel = division === 'nord' ? 'NORD' : 'SUD';

  return (
    <Card
      className="overflow-hidden"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <CardHeader
        className="border-b"
        style={{ background: `linear-gradient(to right, ${color}15, transparent)` }}
      >
        <CardTitle className="text-xl font-bold uppercase tracking-wide">
          Division {divisionLabel}
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
                      className={`cursor-pointer hover:bg-muted/50 transition-colors group/row ${!isPlayoff ? 'opacity-50' : ''}`}
                      style={isPlayoff ? { boxShadow: `inset 3px 0 0 ${color}` } : undefined}
                      onClick={() => navigate(`/equipes/${team.id}`)}
                    >
                      <TableCell className="text-center">
                        {team.rank === 1 ? (
                          <Badge className="bg-yellow-500 text-yellow-950 font-bold">
                            {team.rank}
                          </Badge>
                        ) : (
                          <span className={`font-medium ${isPlayoff ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {team.rank}
                          </span>
                        )}
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
