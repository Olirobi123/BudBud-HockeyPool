import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavigationScroll } from '@/hooks/navigation/useNavigationScroll';
import PlayerSearch from '@/components/PlayerSearch';
import type { NHLPlayer } from '@/types';
import { cn, SCROLL_LOCK_FIXED_WIDTH } from '@/lib/utils';
import { NavigationLogo } from './navigation/NavigationLogo';
import { NavigationLinks } from './navigation/NavigationLinks';
import { NavigationMobileMenu } from './navigation/NavigationMobileMenu';

const navLinks = [
  { href: '/equipes', label: 'Équipes' },
  { href: '/echanges', label: 'Échanges' },
  { href: '/draft', label: 'Repêchage' },
  { href: '/series', label: 'Séries' },
  { href: '/bilan', label: 'Bilan' },
  {
    href: 'https://www.marqueur.com/hockey/mbr/tools/pool/index.php?nyx=190707',
    label: 'Marqueur',
    external: true,
  },
];

export default function Navigation() {
  const isScrolled = useNavigationScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePlayerSelect = (player: NHLPlayer) => {
    setIsMobileMenuOpen(false);
    navigate(`/joueur/${player.playerId}`);
  };

  return (
    <nav
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b bg-background/90 backdrop-blur-md',
        'transition-shadow duration-300',
        // Keeps the nav the same width when a Radix dropdown removes the scrollbar
        SCROLL_LOCK_FIXED_WIDTH,
        isScrolled ? 'border-border shadow-sm' : 'border-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-10">
            <NavigationLogo />
            <div className="hidden lg:block">
              <NavigationLinks navLinks={navLinks} location={location.pathname} />
            </div>
          </div>

          <div className="hidden md:block">
            <PlayerSearch onPlayerSelect={handlePlayerSelect} className="w-64" />
          </div>

          {/*
            Hamburger covers everything below `lg`, where the inline links are
            hidden. It previously stopped at `md`, leaving 768–1023px with no
            navigation at all.
          */}
          <div className="lg:hidden">
            <NavigationMobileMenu
              navLinks={navLinks}
              isOpen={isMobileMenuOpen}
              setIsOpen={setIsMobileMenuOpen}
              handlePlayerSelect={handlePlayerSelect}
              location={location.pathname}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
