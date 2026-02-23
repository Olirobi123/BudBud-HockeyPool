import React from 'react';
import { UserMinus } from 'lucide-react';
import { MisAuBallotage } from '@/types/IMisAuBallotage';
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
  if (entries.length === 0) return null;

  // Group by team
  const byTeam = entries.reduce<Record<string, MisAuBallotage[]>>((acc, entry) => {
    if (acc[entry.equipe_nom] === undefined) acc[entry.equipe_nom] = [];
    acc[entry.equipe_nom].push(entry);
    return acc;
  }, {});

  const teams = Object.keys(byTeam).sort();

  return (
    <div className="mt-12">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-8 bg-amber-400 rounded-full" />
          <div className="w-0.5 h-6 bg-amber-400/60 rounded-full" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Mis au ballotage
          </h2>
          <p className="text-sm text-muted-foreground">
            {typeName}
            {' '}
            ·
            {' '}
            {entries.length}
            {' '}
            joueur
            {entries.length > 1 ? 's' : ''}
            {' '}
            libéré
            {entries.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Team cards grid */}
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
    </div>
  );
}
