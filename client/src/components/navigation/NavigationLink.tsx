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

/**
 * A link is active for its own path and anything nested beneath it, so
 * `/equipes/12` still highlights "Équipes". Exact matching used to leave
 * detail pages with no active link at all.
 */
export function isNavLinkActive(pathname: string, href: string, external = false): boolean {
  if (external) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
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
    'relative px-3 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 cursor-pointer',
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
          'flex items-center gap-1.5 text-muted-foreground hover:text-foreground',
        )}
        onClick={onClick}
      >
        <span>{label}</span>
        <ExternalLink className="h-3 w-3 opacity-50" />
      </a>
    );
  }

  return (
    <Link to={href} onClick={onClick} aria-current={active ? 'page' : undefined}>
      <span
        className={cn(
          baseStyles,
          active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {label}
        <span
          className={cn(
            'absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-foreground transition-all duration-300',
            active ? 'w-4/5 opacity-100' : 'w-0 opacity-0',
          )}
        />
      </span>
    </Link>
  );
};
