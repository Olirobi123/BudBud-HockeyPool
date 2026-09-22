import { JSX } from 'react';

interface SectionHeadingProps {
  id: string;
  title: string;
  // eslint-disable-next-line react/require-default-props
  meta?: string;
}

// eslint-disable-next-line import/prefer-default-export
export function SectionHeading({ id, title, meta }: SectionHeadingProps): JSX.Element {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 id={id} className="font-display text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {meta !== undefined && (
        <span className="text-sm tabular-nums text-muted-foreground">{meta}</span>
      )}
    </div>
  );
}
