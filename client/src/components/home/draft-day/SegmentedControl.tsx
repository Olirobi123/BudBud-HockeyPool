import { JSX } from 'react';
import { cn } from '@/lib/utils';

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Même style que le sélecteur de catégorie du classement de la home. */
// eslint-disable-next-line import/prefer-default-export
export function SegmentedControl<T extends string>({
  label, options, value, onChange,
}: SegmentedControlProps<T>): JSX.Element {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex w-full gap-1 rounded-lg border border-border/40 bg-muted/40 p-1 sm:w-auto"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors sm:flex-none',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
