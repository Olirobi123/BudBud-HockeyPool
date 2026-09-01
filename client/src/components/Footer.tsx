import { Link } from 'react-router-dom';
import logoIcon from '@/images/icon-blanc.png';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="group flex items-center gap-2.5">
            {/* White source mark, inverted to black for the light shell. */}
            <img
              src={logoIcon}
              alt="38BudBud"
              className="h-8 w-8 opacity-60 invert transition-opacity duration-300 group-hover:opacity-100"
            />
            <span className="font-display text-xl font-bold tracking-wide text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              38BUDBUD
            </span>
          </Link>

          <p className="text-xs text-muted-foreground">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            38BudBud — Pool de Hockey
          </p>
        </div>
      </div>
    </footer>
  );
}
