import { Link } from 'react-router-dom';
import type { LivePlayerPoints } from '@/types/ILivePoints';
import { TeamLogo } from '@/components/ui/team-logo';

interface FeedPlayerRowProps {
  player: LivePlayerPoints;
  rank: number;
  animationDelay: string;
}

export function FeedPlayerRow({ player, rank, animationDelay }: FeedPlayerRowProps) {
  return (
    <Link
      to={`/joueur/${player.nhlPlayerId}`}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors animate-fade-in"
      style={{ animationDelay, animationFillMode: 'both' }}
    >
      {/* Rank */}
      <span className="w-5 text-center tabular-nums text-xs text-muted-foreground font-medium shrink-0">
        {rank}
      </span>

      {/* Headshot + Team logo overlay */}
      <div className="relative shrink-0">
        <img
          src={player.headshot}
          alt=""
          className="w-8 h-8 rounded-full object-cover bg-muted"
        />
        <TeamLogo
          src={player.nhlTeamLogo}
          alt={player.nhlTeamAbbrev}
          className="w-6 h-6 object-contain absolute -bottom-0.5 -right-1.5"
        />
      </div>

      {/* Name + Pool team */}
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-primary truncate block leading-tight">
          {`${player.firstName} ${player.lastName}`}
        </span>
        {player.poolTeam && (
          <span className="text-[10px] text-muted-foreground truncate block leading-tight">
            {player.poolTeam.nom}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 shrink-0 tabular-nums text-xs">
        {player.position === 'G' ? (
          <>
            <span className="w-[1.75rem] text-center text-muted-foreground">{player.wins ?? 0}</span>
            <span className="w-[1.75rem] text-center text-muted-foreground">{player.shutouts ?? 0}</span>
          </>
        ) : (
          <>
            <span className="w-[1.75rem] text-center text-muted-foreground">{player.goals}</span>
            <span className="w-[1.75rem] text-center text-muted-foreground">{player.assists}</span>
          </>
        )}
        <span className="font-bold text-primary min-w-[1.5rem] text-right">{player.points}</span>
      </div>
    </Link>
  );
}
