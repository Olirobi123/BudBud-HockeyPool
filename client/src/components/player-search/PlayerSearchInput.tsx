import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PlayerSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
}

export const PlayerSearchInput: React.FC<PlayerSearchInputProps> = ({
  value,
  onChange,
  onFocus,
  isLoading,
  placeholder = 'Rechercher un joueur...',
  className = '',
}) => (
  <div className={`relative ${className}`}>
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="pl-9"
      onFocus={onFocus}
    />
    {/* Le wrapper centre, l'icône tourne : animate-spin écraserait le translate s'ils étaient sur le même élément. */}
    {isLoading && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
        <Loader2 className="block w-4 h-4 text-muted-foreground animate-spin" />
      </span>
    )}
  </div>
);
