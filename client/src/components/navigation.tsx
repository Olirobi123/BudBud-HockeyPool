import { useState, useEffect } from 'react';
import { Menu, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import PlayerSearch from '@/components/player-search';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handlePlayerSelect = (player: any) => {
    console.log('Joueur sélectionné:', player);
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
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">38</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">38BudBud</h1>
                </div>
              </Link>
            </div>
            <div className="hidden lg:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                          location === link.href
                            ? 'text-white bg-primary'
                            : 'text-gray-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <PlayerSearch
              onPlayerSelect={handlePlayerSelect}
              className="w-64"
            />
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-900 border-slate-700">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="mb-6">
                    <PlayerSearch
                      onPlayerSelect={handlePlayerSelect}
                      className="w-full"
                    />
                  </div>
                  {navLinks.map((link) => (
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-lg font-medium text-gray-300 hover:text-white transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link key={link.href} href={link.href}>
                        <span
                          className="text-lg font-medium text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </span>
                      </Link>
                    )
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
