import { SeriesData, SeriesMatchup } from '@/types/ISeries';
import { BracketCard } from './BracketCard';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Round column                                                        */
/* ------------------------------------------------------------------ */

interface RoundColumnProps {
  title: string;
  matchups: SeriesMatchup[];
  isActive: boolean;
  rondeNum: 1 | 2 | 3;
  labelFn: (m: SeriesMatchup) => string;
}

function RoundColumn({
  title, matchups, isActive, labelFn,
}: RoundColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Round header */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className={cn(
            'h-px flex-1',
            isActive ? 'bg-gradient-to-r from-cyan-500/60 to-transparent' : 'bg-border/30',
          )}
        />
        <span
          className={cn(
            'text-[11px] font-bold uppercase tracking-widest px-2 shrink-0',
            isActive ? 'text-cyan-400' : 'text-muted-foreground/60',
          )}
        >
          {title}
        </span>
        <div
          className={cn(
            'h-px flex-1',
            isActive ? 'bg-gradient-to-l from-cyan-500/60 to-transparent' : 'bg-border/30',
          )}
        />
      </div>

      {/* Matchup cards */}
      <div className="flex flex-col gap-4">
        {matchups.map((m) => (
          <BracketCard
            key={m.id}
            matchup={m}
            label={labelFn(m)}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop 3-column bracket                                           */
/* ------------------------------------------------------------------ */

function DesktopBracket({ data }: { data: SeriesData }) {
  const {
    quartsDeFinale, demiFinales, finale, rondeActive,
  } = data;

  const nordQF = quartsDeFinale.filter((m) => m.division === 'nord');
  const sudQF = quartsDeFinale.filter((m) => m.division === 'sud');

  const nordSF = demiFinales.filter((m) => m.division === 'nord');
  const sudSF = demiFinales.filter((m) => m.division === 'sud');

  const qfLabel = (m: SeriesMatchup) => `Division ${m.division === 'nord' ? 'Nord' : 'Sud'}`;
  const sfLabel = (m: SeriesMatchup) => `Demi-finale ${m.division === 'nord' ? 'Nord' : 'Sud'}`;
  const finaleLabel = () => 'Grande Finale';

  return (
    <div className="hidden lg:grid grid-cols-3 gap-8 items-start">
      {/* Column 1: QF */}
      <div className="flex flex-col gap-6">
        <RoundColumn
          title="Quarts de finale"
          matchups={[...nordQF, ...sudQF]}
          isActive={rondeActive === 1}
          rondeNum={1}
          labelFn={qfLabel}
        />
      </div>

      {/* Column 2: SF — vertically centered relative to QF */}
      <div className="flex flex-col gap-6 mt-8">
        <RoundColumn
          title="Demi-finales"
          matchups={[...nordSF, ...sudSF]}
          isActive={rondeActive === 2}
          rondeNum={2}
          labelFn={sfLabel}
        />
      </div>

      {/* Column 3: Final — vertically centered */}
      <div className="flex flex-col gap-6 mt-16">
        <RoundColumn
          title="Grande Finale"
          matchups={finale ? [finale] : []}
          isActive={rondeActive === 3}
          rondeNum={3}
          labelFn={finaleLabel}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile stacked layout                                              */
/* ------------------------------------------------------------------ */

function MobileBracket({ data }: { data: SeriesData }) {
  const {
    quartsDeFinale, demiFinales, finale, rondeActive,
  } = data;

  const qfLabel = (m: SeriesMatchup) => `${m.division === 'nord' ? 'Nord' : 'Sud'} — 1/4 de finale`;
  const sfLabel = (m: SeriesMatchup) => `${m.division === 'nord' ? 'Nord' : 'Sud'} — Demi-finale`;
  const finaleLabel = () => 'Grande Finale';

  return (
    <div className="lg:hidden flex flex-col gap-8">
      <RoundColumn
        title="Quarts de finale"
        matchups={quartsDeFinale}
        isActive={rondeActive === 1}
        rondeNum={1}
        labelFn={qfLabel}
      />
      <RoundColumn
        title="Demi-finales"
        matchups={demiFinales}
        isActive={rondeActive === 2}
        rondeNum={2}
        labelFn={sfLabel}
      />
      <RoundColumn
        title="Grande Finale"
        matchups={finale ? [finale] : []}
        isActive={rondeActive === 3}
        rondeNum={3}
        labelFn={finaleLabel}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

interface PlayoffBracketProps {
  data: SeriesData;
}

export function PlayoffBracket({ data }: PlayoffBracketProps): JSX.Element {
  return (
    <>
      <DesktopBracket data={data} />
      <MobileBracket data={data} />
    </>
  );
}
