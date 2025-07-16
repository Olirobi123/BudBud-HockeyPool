import React from 'react';
import { Link } from 'wouter';
import { ExternalLink } from 'lucide-react';

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
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${className} text-gray-300 hover:text-white hover:bg-slate-800`}
        onClick={onClick}
      >
        <span>{label}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }
  return (
    <Link href={href}>
      <span
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
          active ? 'text-white bg-primary' : 'text-gray-300 hover:text-white hover:bg-slate-800'
        } ${className}`}
        onClick={onClick}
      >
        {label}
      </span>
    </Link>
  );
}; 