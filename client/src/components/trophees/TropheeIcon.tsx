import {
  Trophy,
  Crosshair,
  Shield,
  CircleDot,
  Flame,
  LucideIcon,
} from 'lucide-react';
import { TropheeType } from '@/types';
import { cn } from '@/lib/utils';

interface TropheeIconProps {
  type: TropheeType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Général: Trophy,
  Attaque: Crosshair,
  Défense: Shield,
  Gardien: CircleDot,
  Playoffs: Flame,
};

const colorMap: Record<string, string> = {
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

export function TropheeIcon({ type, size = 'md', className }: TropheeIconProps) {
  const Icon = iconMap[type] || Trophy;
  const color = colorMap[type] || 'text-gray-500';
  const sizeClass = sizeMap[size];

  return (
    <Icon className={cn(sizeClass, color, className)} />
  );
}
