import React from 'react';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NHLPlayer } from '@/types/IPlayerDetails';
import { getPositionColor } from '@/lib/utils';

interface PlayerSearchResultItemProps {
  player: NHLPlayer;
  onClick: () => void;
}

export const PlayerSearchResultItem: React.FC<PlayerSearchResultItemProps> = ({ player, onClick }) => (
  <div
    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-500" />
        </div>
        <div>
          <div className="font-medium text-gray-900">{player.name}</div>
          {player.teamAbbrev && (
            <div className="text-sm text-gray-500">
              {player.teamAbbrev}
              {player.sweaterNumber && ` #${player.sweaterNumber}`}
            </div>
          )}
        </div>
      </div>
      <Badge className={getPositionColor(player.positionCode)}>
        {player.positionCode}
      </Badge>
    </div>
  </div>
); 