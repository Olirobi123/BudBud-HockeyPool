import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useInjuries } from '@/hooks/useInjuries';
import { useEtat } from '@/hooks/useEtat';
import { InjuryBadge } from '@/components/equipes/InjuryBadge';
import { EtatBadge } from '@/components/equipes/EtatBadge';
import PlayerDetails from '@/types/IPlayerDetails';

type Props = {
  player: PlayerDetails;
};
export default function JoueurHeader({ player }: Props) {
  const { ownership } = player;
  const { data: injuries } = useInjuries();
  const { data: etats } = useEtat();
  const injury = player.playerId !== undefined ? injuries?.[player.playerId] : undefined;
  const etatInfo = player.playerId !== undefined ? etats?.[player.playerId] : undefined;

  return (
    <div className="relative h-64 rounded-xl overflow-hidden mb-8 md:h-80">
      <img
        src={player.heroImage}
        alt={`${player.firstName?.default ?? ''} ${player.lastName?.default ?? ''}`}
        className="w-full object-cover h-full md:object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 flex items-end space-x-3 sm:space-x-4">
        <Avatar className="w-16 h-16 sm:w-24 sm:h-24 border-2 sm:border-4 border-white">
          <img src={player.headshot} alt={`${player.firstName?.default ?? ''} ${player.lastName?.default ?? ''}`} />
        </Avatar>
        <div className="flex-1 text-white">
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
            {player.firstName?.default ?? ''}
            {' '}
            {player.lastName?.default ?? ''}
          </h1>
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-3">
            <img src={player.teamLogo} alt={player.fullTeamName?.default ?? ''} className="h-6 sm:h-8" />
            <Badge variant="outline" className="text-white border-white">
              #
              {player.sweaterNumber}
            </Badge>
            <Badge variant="outline" className="text-white border-white">
              {player.position}
            </Badge>
            {ownership != null && (
              <Link to={`/equipes/${ownership.id}`}>
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                  {ownership.nom}
                </Badge>
              </Link>
            )}
            {ownership == null && (
              <Badge className="bg-secondary text-primary-foreground hover:bg-slate-500 cursor-pointer">Agent libre</Badge>
            )}
            {injury && <InjuryBadge injury={injury} />}
            {!injury && etatInfo && etatInfo.etat !== 'normal' && (
              <EtatBadge etat={etatInfo} position={player.position ?? 'C'} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
