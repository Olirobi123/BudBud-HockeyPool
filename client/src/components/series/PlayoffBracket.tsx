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
  isFinale?: boolean;
}

function RoundColumn({
  title, matchups, isActive, rondeNum, labelFn, isFinale = false,
}: RoundColumnProps) {
  const activeColor = isFinale
    ? { line: 'bg-gradient-to-r from-amber-500/60 to-transparent', lineR: 'bg-gradient-to-l from-amber-500/60 to-transparent', text: 'text-amber-400' }
    : { line: 'bg-gradient-to-r from-cyan-500/60 to-transparent', lineR: 'bg-gradient-to-l from-cyan-500/60 to-transparent', text: 'text-cyan-400' };

  return (
    <div className="flex flex-col gap-3">
      {/* Round header */}
      <div className="flex items-center gap-2 mb-1">
        <div className={cn('h-px flex-1', isActive ? activeColor.line : 'bg-border/30')} />
        <span
          className={cn(
            'font-bold uppercase tracking-widest px-2 shrink-0',
            isFinale ? 'text-xs' : 'text-[11px]',
            isActive ? activeColor.text : 'text-muted-foreground/60',
          )}
        >
          {title}
        </span>
        <div className={cn('h-px flex-1', isActive ? activeColor.lineR : 'bg-border/30')} />
      </div>

      {/* Matchup cards */}
      <div className="flex flex-col gap-4">
        {matchups.map((m) => (
          <BracketCard
            key={m.id}
            matchup={m}
            label={labelFn(m)}
            isFinale={isFinale && rondeNum === 3}
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

  const hasDivisions = quartsDeFinale.some((m) => m.division !== null);

  const nordQF = hasDivisions ? quartsDeFinale.filter((m) => m.division === 'nord') : quartsDeFinale;
  const sudQF = hasDivisions ? quartsDeFinale.filter((m) => m.division === 'sud') : [];

  const nordSF = hasDivisions ? demiFinales.filter((m) => m.division === 'nord') : demiFinales;
  const sudSF = hasDivisions ? demiFinales.filter((m) => m.division === 'sud') : [];

  const qfLabel = (m: SeriesMatchup) => (m.division ? `Division ${m.division === 'nord' ? 'Nord' : 'Sud'}` : '1/4 de finale');
  const sfLabel = (m: SeriesMatchup) => (m.division ? `Demi-finale ${m.division === 'nord' ? 'Nord' : 'Sud'}` : 'Demi-finale');
  const finaleLabel = () => 'Grande Finale';

  return (
    <div className="hidden lg:grid grid-cols-3 gap-8 items-center">
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

      {/* Column 2: SF */}
      <div className="flex flex-col gap-6">
        <RoundColumn
          title="Demi-finales"
          matchups={[...nordSF, ...sudSF]}
          isActive={rondeActive === 2}
          rondeNum={2}
          labelFn={sfLabel}
        />
      </div>

      {/* Column 3: Finale */}
      <div className="flex flex-col gap-6">
        <RoundColumn
          title="Grande Finale"
          matchups={finale ? [finale] : []}
          isActive={rondeActive === 3}
          rondeNum={3}
          labelFn={finaleLabel}
          isFinale
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

  const qfLabel = (m: SeriesMatchup) => (m.division ? `${m.division === 'nord' ? 'Nord' : 'Sud'} — 1/4 de finale` : '1/4 de finale');
  const sfLabel = (m: SeriesMatchup) => (m.division ? `${m.division === 'nord' ? 'Nord' : 'Sud'} — Demi-finale` : 'Demi-finale');
  const finaleLabel = () => 'Grande Finale';

  return (
    <div className="lg:hidden flex flex-col gap-8">
      <RoundColumn
        title="Grande Finale"
        matchups={finale ? [finale] : []}
        isActive={rondeActive === 3}
        rondeNum={3}
        labelFn={finaleLabel}
        isFinale
      />
      <RoundColumn
        title="Demi-finales"
        matchups={demiFinales}
        isActive={rondeActive === 2}
        rondeNum={2}
        labelFn={sfLabel}
      />
      <RoundColumn
        title="Quarts de finale"
        matchups={quartsDeFinale}
        isActive={rondeActive === 1}
        rondeNum={1}
        labelFn={qfLabel}
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
