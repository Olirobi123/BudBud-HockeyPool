import { useState } from 'react';
import { Users } from 'lucide-react';
import { getTeamImage } from '@/lib/teamImages';

const sizeMap = {
  sm: { outer: 'w-10 h-10', icon: 'w-5 h-5', padding: 'p-1' },
  md: { outer: 'w-16 h-16', icon: 'w-8 h-8', padding: 'p-1.5' },
  lg: { outer: 'w-24 h-24', icon: 'w-12 h-12', padding: 'p-2' },
  xl: { outer: 'w-36 h-36', icon: 'w-16 h-16', padding: 'p-1' },
};

interface TeamAvatarProps {
  teamId: number;
  teamName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bordered?: boolean;
  className?: string;
}

export function TeamAvatar({ teamId, teamName, size = 'md', bordered = true, className = '' }: TeamAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const teamImage = getTeamImage(teamId);

  const { outer, icon, padding } = sizeMap[size];
  const border = bordered ? 'border-4 border-white' : '';

  if (!teamImage || imgError) {
    return (
      <div className={`${outer} rounded-full bg-slate-100 flex items-center justify-center ${border} ${className}`}>
        <Users className={`${icon} text-slate-400`} />
      </div>
    );
  }

  if (teamImage.format === 'png') {
    return (
      <div className={`${outer} rounded-full bg-white flex items-center justify-center ${border} ${className}`}>
        <img
          src={teamImage.src}
          alt={teamName}
          className={`${outer} rounded-full object-contain ${padding}`}
          fetchPriority="high"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${outer} rounded-full overflow-hidden ${border} ${className}`}>
      <img
        src={teamImage.src}
        alt={teamName}
        className="w-full h-full object-cover"
        fetchPriority="high"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
