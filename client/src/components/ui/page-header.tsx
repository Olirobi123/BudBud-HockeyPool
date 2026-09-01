import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  /** Optional slot under the subtitle — a count pill, a filter, a season picker. */
  children?: ReactNode;
}

/**
 * The standard page header: accent rule, display title, subtitle. It renders
 * from props the page already holds, so it paints immediately while the page's
 * data is still in flight.
 */
export function PageHeader({ title, subtitle, children }: PageHeaderProps): JSX.Element {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <div className="w-0.5 h-6 bg-primary/60 rounded-full" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
      </div>

      {subtitle !== undefined && (
        <p className="text-base text-muted-foreground ml-6 pl-2">{subtitle}</p>
      )}

      {children !== undefined && <div className="ml-6 pl-2 mt-5">{children}</div>}
    </div>
  );
}
