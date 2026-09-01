import React from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NavigationLink, isNavLinkActive } from './NavigationLink';
import PlayerSearch from '@/components/PlayerSearch';

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

interface NavigationMobileMenuProps {
  navLinks: NavLink[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handlePlayerSelect: (player: import('@/types/IPlayerDetails').NHLPlayer) => void;
  location: string;
}

export const NavigationMobileMenu: React.FC<NavigationMobileMenuProps> = ({
  navLinks,
  isOpen,
  setIsOpen,
  handlePlayerSelect,
  location,
}) => (
  <Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
        <Menu className="h-7 w-7" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-[300px] bg-background sm:w-[400px]">
      <div className="mt-8 flex flex-col space-y-2">
        <div className="mb-6">
          <PlayerSearch onPlayerSelect={handlePlayerSelect} className="w-full" />
        </div>
        {navLinks.map((link) => (
          <NavigationLink
            key={link.href}
            href={link.href}
            label={link.label}
            external={link.external}
            active={isNavLinkActive(location, link.href, link.external)}
            onClick={() => setIsOpen(false)}
            className="py-3 text-lg"
          />
        ))}
      </div>
    </SheetContent>
  </Sheet>
);
