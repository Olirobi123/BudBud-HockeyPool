import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavigationScroll } from '@/hooks/navigation/useNavigationScroll';
import { NavigationLogo } from './navigation/NavigationLogo';
import { NavigationLinks } from './navigation/NavigationLinks';
import { NavigationMobileMenu } from './navigation/NavigationMobileMenu';
import PlayerSearch from '@/components/PlayerSearch';
import type { NHLPlayer } from '@/types';
import { cn, SCROLL_LOCK_FIXED_WIDTH } from '@/lib/utils';

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
        'fixed top-0 left-0 right-0 z-50 duration-500 ease-out',
        // Keeps the nav the same width when a Radix dropdown removes the scrollbar
        SCROLL_LOCK_FIXED_WIDTH,
        isScrolled
          ? 'nav-glass-scrolled'
          : 'nav-glass',
      )}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-10">
            <NavigationLogo />
            <div className="hidden lg:block">
              <NavigationLinks navLinks={navLinks} location={location.pathname} />
            </div>
          </div>

          <div className="hidden md:block">
            <PlayerSearch onPlayerSelect={handlePlayerSelect} className="w-64" />
          </div>

          <div className="md:hidden">
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

      {/* Bottom edge — only visible when not scrolled, dissolves into hero */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500',
          isScrolled ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div className="h-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>
    </nav>
  );
}
