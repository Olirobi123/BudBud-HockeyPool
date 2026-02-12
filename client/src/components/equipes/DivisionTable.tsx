import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { TeamStanding } from '@/types/IEquipes';

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
            </TableRow>
          </TableHeader>

          <TableBody>
            {standings.map((team) => (
              <TableRow
                key={team.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/equipes/${team.id}`)}
              >
                <TableCell className="text-center">
                  {team.rank === 1 ? (
                    <Badge className="bg-yellow-500 text-yellow-950 font-bold">
                      {team.rank}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground font-medium">
                      {team.rank}
                    </span>
                  )}
                </TableCell>

                <TableCell className="font-semibold">
                  {team.nom}
                </TableCell>
              </TableRow>
            ))}

            {standings.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                  Aucune équipe dans cette division
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
