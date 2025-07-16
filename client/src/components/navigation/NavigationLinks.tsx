import React from 'react';
import { NavigationLink } from './NavigationLink';

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

interface NavigationLinksProps {
  navLinks: NavLink[];
  location: string;
}

export const NavigationLinks: React.FC<NavigationLinksProps> = ({ navLinks, location }) => (
  <div className="flex items-baseline space-x-8">
    {navLinks.map((link) => (
      <NavigationLink
        key={link.href}
        href={link.href}
        label={link.label}
        external={link.external}
        active={location === link.href}
      />
    ))}
  </div>
); 