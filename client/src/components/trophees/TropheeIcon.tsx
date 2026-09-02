import {
  Trophy,
  Swords,
  Shield,
  Flame,
  LucideIcon,
} from 'lucide-react';
import { TropheeType } from '@/types';
import { cn } from '@/lib/utils';
import { GoalieIcon } from '@/components/ui/GoalieIcon';

interface TropheeIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const lucideIconMap: Partial<Record<TropheeType, LucideIcon>> = {
  Général: Trophy,
  Attaque: Swords,
  Défense: Shield,
  Playoffs: Flame,
};

const colorMap: Record<TropheeType, string> = {
  Général: 'text-amber-500',
  Attaque: 'text-red-500',
  Défense: 'text-blue-500',
  Gardien: 'text-purple-500',
  Playoffs: 'text-orange-500',
};

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5 md:w-6 md:h-6',
  lg: 'w-8 h-8 md:w-10 md:h-10',
};

const goaliePixelSizeMap = {
  sm: 28,
  md: 38,
  lg: 56,
};

const goalieResponsiveClassMap = {
  sm: 'w-[22px] h-[22px] md:w-[28px] md:h-[28px]',
  md: 'w-[30px] h-[30px] md:w-[38px] md:h-[38px]',
  lg: 'w-[44px] h-[44px] md:w-[56px] md:h-[56px]',
};

function isTropheeType(type: string): type is TropheeType {
  return type in colorMap;
}

export function TropheeIcon({ type, size = 'md', className }: TropheeIconProps) {
  const color = isTropheeType(type) ? colorMap[type] : 'text-gray-500';
  const sizeClass = sizeMap[size];

  if (type === 'Gardien') {
    return (
      <GoalieIcon
        size={goaliePixelSizeMap[size]}
        className={cn(goalieResponsiveClassMap[size], color, className)}
      />
    );
  }

  const Icon = isTropheeType(type) && lucideIconMap[type] ? lucideIconMap[type]! : Trophy;
  return (
    <Icon className={cn(sizeClass, color, className)} />
  );
}
