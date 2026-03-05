import { useState } from 'react';
import { Users } from 'lucide-react';

const sizeMap = {
  sm: { outer: 'w-10 h-10', icon: 'w-5 h-5' },
  md: { outer: 'w-16 h-16', icon: 'w-8 h-8' },
  lg: { outer: 'w-24 h-24', icon: 'w-12 h-12' },
  xl: { outer: 'w-36 h-36', icon: 'w-16 h-16' },
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

  const { outer, icon } = sizeMap[size];
  const border = bordered ? 'border-4 border-white' : '';

  if (imgError) {
    return (
      <div className={`${outer} rounded-full bg-slate-100 flex items-center justify-center ${border} ${className}`}>
        <Users className={`${icon} text-slate-400`} />
      </div>
    );
  }

  return (
    <div className={`${outer} rounded-full overflow-hidden ${border} ${className}`}>
      <img
        src={`/images/teams/${teamId}.jpg`}
        alt={teamName}
        className="w-full h-full object-cover"
        fetchPriority="high"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
