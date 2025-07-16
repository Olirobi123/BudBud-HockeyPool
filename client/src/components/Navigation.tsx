import { useState } from 'react';
import { useLocation } from 'wouter';
import { useNavigationScroll } from '@/hooks/navigation/useNavigationScroll';
import { NavigationLogo } from './navigation/NavigationLogo';
import { NavigationLinks } from './navigation/NavigationLinks';
import { NavigationMobileMenu } from './navigation/NavigationMobileMenu';
import PlayerSearch from '@/components/PlayerSearch';

const navLinks = [
  { href: '/equipes', label: 'Équipes' },
  { href: '/echanges', label: 'Échanges' },
  { href: '/draft', label: 'Repêchage' },
  {
    href: 'https://www.marqueur.com/hockey/mbr/tools/pool/index.php?nyx=190707',
    label: 'Marqueur',
    external: true,
  },
];

export default function Navigation() {
  const isScrolled = useNavigationScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const handlePlayerSelect = (player: any) => {
    setIsMobileMenuOpen(false);
    setLocation(`/joueur/${player.playerId}`);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-slate-700'
          : 'bg-slate-900 shadow-lg border-b border-slate-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavigationLogo />
            </div>
            <div className="hidden lg:block ml-10">
              <NavigationLinks navLinks={navLinks} location={location} />
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
              location={location}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
