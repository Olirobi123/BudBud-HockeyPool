import { Link } from 'wouter';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlayerOwnership } from '@/hooks/joueur/usePlayerOwnership';
import PlayerDetails from '@/types/IPlayerDetails';

type Props = {
  player: PlayerDetails;
};
export default function JoueurHeader({ player }: Props) {
  const nhlId = player.playerId?.toString() ?? '';
  const { data: ownership, isLoading: ownershipLoading } = usePlayerOwnership(nhlId);

  return (
    <div className="relative h-64 rounded-xl overflow-hidden mb-8 md:h-80">
      <img
        src={player.heroImage}
        alt={`${player.firstName?.default ?? ''} ${player.lastName?.default ?? ''}`}
        className="w-full object-cover h-full md:object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end space-x-4">
        <Avatar className="w-24 h-24 border-4 border-white">
          <img src={player.headshot} alt={`${player.firstName?.default ?? ''} ${player.lastName?.default ?? ''}`} />
        </Avatar>
        <div className="flex-1 text-white">
          <h1 className="text-3xl font-bold mb-2">
            {player.firstName?.default ?? ''}
            {' '}
            {player.lastName?.default ?? ''}
          </h1>
          <div className="flex items-center space-x-3">
            <img src={player.teamLogo} alt={player.fullTeamName?.default ?? ''} className="h-8" />
            <Badge variant="outline" className="text-white border-white">
              #
              {player.sweaterNumber}
            </Badge>
            <Badge variant="outline" className="text-white border-white">
              {player.position}
            </Badge>
            {ownershipLoading && <Skeleton className="h-6 w-24 rounded-full" />}
            {ownership != null && (
              <Link href={`/equipe/${ownership.id}`}>
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                  {ownership.nom}
                </Badge>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
