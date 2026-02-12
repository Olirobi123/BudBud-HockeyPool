import React from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NavigationLink } from './NavigationLink';
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
      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent
      side="right"
      className="w-[300px] sm:w-[400px] border-white/[0.06]"
      style={{
        background: 'linear-gradient(180deg, rgba(12, 18, 34, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex flex-col space-y-2 mt-8">
        <div className="mb-6">
          <PlayerSearch onPlayerSelect={handlePlayerSelect} className="w-full" />
        </div>
        {navLinks.map((link) => (
          <NavigationLink
            key={link.href}
            href={link.href}
            label={link.label}
            external={link.external}
            active={location === link.href}
            onClick={() => setIsOpen(false)}
            className="text-lg py-3"
          />
        ))}
      </div>
    </SheetContent>
  </Sheet>
);
