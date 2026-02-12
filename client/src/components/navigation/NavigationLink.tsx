import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationLinkProps {
  href: string;
  label: string;
  external?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  label,
  external = false,
  active = false,
  onClick,
  className = '',
}) => {
  const baseStyles = cn(
    'relative px-3 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-200',
    'font-display',
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          baseStyles,
          'flex items-center gap-1.5 text-slate-400 hover:text-white',
        )}
        onClick={onClick}
      >
        <span>{label}</span>
        <ExternalLink className="w-3 h-3 opacity-50" />
      </a>
    );
  }

  return (
    <Link to={href} onClick={onClick}>
      <span
        className={cn(
          baseStyles,
          active
            ? 'text-white'
            : 'text-slate-400 hover:text-white',
        )}
      >
        {label}
        {/* Active indicator — underline bar */}
        <span
          className={cn(
            'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300',
            'bg-cyan-400',
            active ? 'w-4/5 opacity-100' : 'w-0 opacity-0',
          )}
        />
      </span>
    </Link>
  );
};
