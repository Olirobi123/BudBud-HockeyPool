import { Link } from 'react-router-dom';
import logoIcon from '@/images/icon-blanc.png';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <img
              src={logoIcon}
              alt="38BudBud"
              className="w-8 h-8 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            />
            <span className="font-display text-xl font-bold tracking-wide text-white/80 group-hover:text-white transition-colors duration-300">
              38
              <span className="text-cyan-400">BUD</span>
              BUD
            </span>
          </Link>

<p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} 38BudBud — Pool de Hockey
          </p>
        </div>
      </div>
    </footer>
  );
}
