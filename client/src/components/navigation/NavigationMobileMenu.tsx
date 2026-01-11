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
  handlePlayerSelect: (player: any) => void;
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
      <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-900 border-slate-700">
      <div className="flex flex-col space-y-4 mt-8">
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
            className="text-lg font-medium"
          />
        ))}
      </div>
    </SheetContent>
  </Sheet>
);
