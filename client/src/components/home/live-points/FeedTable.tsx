import type { LivePlayerPoints } from '@/types/ILivePoints';
import { FeedPlayerRow } from './FeedPlayerRow';

interface FeedTableProps {
  players: LivePlayerPoints[];
}

export function FeedTable({ players }: FeedTableProps) {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="w-5 shrink-0" />
        <div className="w-8 shrink-0" />
        <span className="flex-1" />
        <div className="flex items-center gap-2 shrink-0 tabular-nums">
          <span className="w-[1.75rem] text-center">B</span>
          <span className="w-[1.75rem] text-center">A</span>
          <span className="min-w-[1.5rem] text-right">Pts</span>
        </div>
      </div>

      {players.map((player, index) => (
        <FeedPlayerRow
          key={player.nhlPlayerId}
          player={player}
          rank={index + 1}
          animationDelay={`${index * 0.04}s`}
        />
      ))}
    </div>
  );
}
