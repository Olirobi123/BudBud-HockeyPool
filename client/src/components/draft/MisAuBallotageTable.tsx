import { useState } from 'react';
import { UserMinus, ChevronDown } from 'lucide-react';
import { MisAuBallotage } from '@/types/IMisAuBallotage';
import { Badge } from '@/components/ui/badge';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';

interface MisAuBallotageTableProps {
  entries: MisAuBallotage[];
  typeName: string;
}

export function MisAuBallotageTable(
  { entries, typeName }: MisAuBallotageTableProps,
): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(false);

  if (entries.length === 0) return null;

  // Group by team
  const byTeam = entries.reduce<Record<string, MisAuBallotage[]>>((acc, entry) => {
    if (acc[entry.equipe_nom] === undefined) acc[entry.equipe_nom] = [];
    acc[entry.equipe_nom].push(entry);
    return acc;
  }, {});

  const teams = Object.keys(byTeam).sort();

  return (
    <Card className="border-amber-400/30">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-6 bg-amber-400 rounded-full" />
              <div className="w-0.5 h-4 bg-amber-400/60 rounded-full" />
            </div>
            <div>
              <span className="text-lg font-bold text-foreground tracking-tight">
                Mis au ballotage
              </span>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">
                {typeName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-400/50 text-amber-600 dark:text-amber-400">
              {entries.length}
            </Badge>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </CardTitle>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-4 border-t border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Card key={team} className="border-border/50 shadow-sm">
                <CardHeader className="bg-muted/30 border-b border-border/50 py-3 px-4">
                  <CardTitle className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <UserMinus className="w-4 h-4" />
                    {team}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-3 px-4">
                  <ul className="space-y-1.5">
                    {byTeam[team].map((entry) => (
                      <li key={entry.id} className="text-sm text-foreground">
                        {entry.joueur_nom}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
