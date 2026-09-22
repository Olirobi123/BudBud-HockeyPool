import { JSX } from 'react';
import { Link } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getPositionLabel } from '@/lib/positionLabel';
import type { ListeClassementJoueur } from '@/types/IDraftDay';

interface RankingListTableProps {
  joueurs: ListeClassementJoueur[];
}

// eslint-disable-next-line import/prefer-default-export
export function RankingListTable({ joueurs }: RankingListTableProps): JSX.Element {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Joueur</TableHead>
          <TableHead className="hidden w-12 sm:table-cell">Pos</TableHead>
          <TableHead className="hidden md:table-cell">Équipe LNH</TableHead>
          <TableHead className="text-right">Pool</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {joueurs.map((j) => (
          <TableRow key={j.rang} className={cn(j.proprietaire !== null && 'text-muted-foreground')}>
            <TableCell className="font-display tabular-nums text-muted-foreground">{j.rang}</TableCell>
            <TableCell className="min-w-0">
              {j.nhlPlayerId !== null ? (
                <Link
                  to={`/joueur/${j.nhlPlayerId}`}
                  className={cn('font-medium hover:underline', j.proprietaire === null && 'text-foreground')}
                >
                  {j.nom}
                </Link>
              ) : (
                <span className={cn('font-medium', j.proprietaire === null && 'text-foreground')}>{j.nom}</span>
              )}
              <span className="block text-[11px] text-muted-foreground md:hidden">
                <span className="sm:hidden">
                  {getPositionLabel(j.position)}
                  {j.equipeNhl !== null && ' · '}
                </span>
                {j.equipeNhl}
              </span>
            </TableCell>
            <TableCell className="hidden text-xs sm:table-cell">{getPositionLabel(j.position)}</TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">{j.equipeNhl ?? '—'}</TableCell>
            <TableCell className="text-right">
              {j.proprietaire !== null ? (
                <Link
                  to={`/equipes/${j.proprietaire.id}`}
                  className="inline-block max-w-[7.5rem] truncate align-bottom text-xs hover:underline sm:max-w-[14rem]"
                  title={j.proprietaire.nom}
                >
                  {j.proprietaire.nom}
                </Link>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Disponible</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
