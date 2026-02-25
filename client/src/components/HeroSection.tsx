import { Link } from 'react-router-dom';
import {
  Trophy, Users, Zap, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActiveTeams } from '@/hooks/useActiveTeams';
import { useEchanges } from '@/hooks/echanges/useEchanges';
import { usePageLoading } from '@/hooks/usePageLoading';

function StatPill({
  icon: Icon, value, label, delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  delay: string;
}) {
  return (
    <div
      className="group relative flex items-center gap-3 bg-white/[0.04] rounded-xl px-5 py-4 backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300 animate-slide-up"
      style={{ animationDelay: delay, animationFillMode: 'both' }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-300">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div>
        <div className="font-display text-2xl font-bold text-white tracking-wide leading-none">
          {value}
        </div>
        <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400 mt-0.5 font-medium">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection(): JSX.Element {
  const { data: equipesActives = [], isLoading } = useActiveTeams();
  const { data: echanges = [] } = useEchanges();
  const now = new Date();
  const seasonStartYear = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  const SEASON_START = `${seasonStartYear}-09-01`;
  const echangesCetteSaison = echanges.filter((e) => e.date >= SEASON_START).length;

  usePageLoading({ dependencies: [isLoading] });

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center bg-slate-950">
      {/* Background photo — flipped so player appears on right */}
      <img
        src="/images/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-[25%_20%] -scale-x-100 pointer-events-none select-none"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 hero-gradient-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">

          {/* Left: Copy */}
          <div className="lg:col-span-7">
            <div className="animate-slide-up">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 mb-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span className="text-emerald-300 text-xs font-semibold tracking-wide uppercase">
                  En direct &mdash; Saison 2025-26
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.95]">
                POOL DE
                <br />
                HOCKEY
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 text-glow-cyan">
                  38BUDBUD
                </span>
              </h1>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/equipes">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 font-display text-base tracking-wide uppercase font-semibold px-8 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Classement
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/echanges">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/[0.03] text-slate-200 border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-cyan-400/30 backdrop-blur-sm font-display text-base tracking-wide uppercase font-semibold px-8 transition-all duration-300"
                  >
                    Échanges
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="lg:col-span-5 mt-16 lg:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <StatPill
                icon={Users}
                value={equipesActives.length || 0}
                label="Équipes actives"
                delay="0.15s"
              />
              <StatPill
                icon={Zap}
                value={echangesCetteSaison}
                label="Échanges cette saison"
                delay="0.25s"
              />
              <StatPill
                icon={Trophy}
                value="2025-26"
                label="Saison en cours"
                delay="0.35s"
              />
            </div>

            {/* Decorative scoreboard accent */}
            <div
              className="mt-6 border border-white/[0.06] rounded-xl p-4 bg-white/[0.02] backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: '0.45s', animationFillMode: 'both' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                    Mise à jour quotidienne
                  </span>
                </div>
                <div className="h-px flex-1 mx-4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="font-display text-xs text-slate-500 tracking-wider">LIVE</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom edge gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-[5]" />
    </section>
  );
}
