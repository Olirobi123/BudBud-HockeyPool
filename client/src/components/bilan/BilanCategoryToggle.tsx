import { cn } from '@/lib/utils';

export type BilanCategory = 'general' | 'attaque' | 'defense' | 'gardiens';

interface CategoryConfig {
  key: BilanCategory;
  label: string;
  mobileLabel: string;
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'general',  label: 'Général',  mobileLabel: 'Gén' },
  { key: 'attaque',  label: 'Attaque',  mobileLabel: 'Att' },
  { key: 'defense',  label: 'Défense',  mobileLabel: 'Déf' },
  { key: 'gardiens', label: 'Gardiens', mobileLabel: 'Gar' },
];

interface Props {
  active: BilanCategory;
  onChange: (cat: BilanCategory) => void;
}

export function BilanCategoryToggle({ active, onChange }: Props): JSX.Element {
  return (
    <div className="grid grid-cols-4 sm:inline-flex gap-1 p-1 rounded-lg bg-muted/40 border border-border/40 w-full sm:w-auto">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onChange(cat.key)}
            className={cn(
              'px-1.5 sm:px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide transition-colors cursor-pointer',
              isActive
                ? 'bg-blue-600/90 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
            )}
          >
            <span className="sm:hidden">{cat.mobileLabel}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
