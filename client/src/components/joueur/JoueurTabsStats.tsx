import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatTooltip } from '@/components/ui/stat-tooltip';
import PlayerDetails from '@/types/IPlayerDetails';
import { formatSeasonShort } from '@/lib/utils';

type Props = {
  player: PlayerDetails;
};

type SeasonEntry = NonNullable<PlayerDetails['seasonTotals']>[number];

interface StatsTotals {
  gamesPlayed: number;
  goals?: number;
  assists?: number;
  points?: number;
  wins?: number;
  losses?: number;
  otLosses?: number;
  shutouts?: number;
  savePctg?: number;
  goalsAgainstAvg?: number;
}

interface StatsAccumulator {
  regular: StatsTotals;
  playoffs: StatsTotals;
}

type StatCol = { label: string; value: string | number };

function TotalsCard({
  title,
  cols,
  gridCols,
  variant,
}: {
  title: string;
  cols: StatCol[];
  gridCols: 4 | 5;
  variant: 'primary' | 'amber';
}) {
  const gridClass = gridCols === 5 ? 'grid-cols-5' : 'grid-cols-4';
  const borderClass = variant === 'amber' ? 'border-amber-500/25' : 'border-primary/20';
  const headerBg = variant === 'amber' ? 'bg-amber-500/5' : 'bg-primary/5';
  const titleColor = variant === 'amber' ? 'text-amber-500' : 'text-primary';

  return (
    <Card className={`overflow-hidden border ${borderClass}`}>
      <CardHeader className="py-2.5 px-4 border-b border-border/60">
        <CardTitle className={`text-[10px] font-bold uppercase tracking-widest ${titleColor}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`grid ${gridClass} divide-x divide-border/60 ${headerBg}`}>
          {cols.map(({ label }) => (
            <div key={label} className="flex justify-center py-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className={`grid ${gridClass} divide-x divide-border/60 border-t border-border/40`}>
          {cols.map(({ label, value }) => (
            <div key={label} className="flex justify-center py-3">
              <span className="text-lg font-black tabular-nums leading-none text-foreground">
                {value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SkaterSeasonRow({ season }: { season: SeasonEntry }) {
  const isPlayoffs = season.gameTypeId === 3;
  const isNHL = season.leagueAbbrev === 'NHL';
  const rowBg = isNHL
    ? isPlayoffs ? 'bg-amber-500/5' : 'bg-primary/5'
    : '';

  return (
    <div className={`flex items-start gap-3 px-4 py-2.5 border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors ${rowBg}`}>
      {/* season */}
      <div className="w-[52px] flex-shrink-0">
        <p className={`text-xs font-bold tabular-nums whitespace-nowrap ${isPlayoffs ? 'text-amber-500' : 'text-foreground'}`}>
          {formatSeasonShort(season.season)}
        </p>
        <p className="text-[9px] text-muted-foreground uppercase tracking-wide">
          {isPlayoffs ? 'Séries' : season.leagueAbbrev}
        </p>
      </div>

      {/* team */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">
          {season.teamName?.default ?? '—'}
        </p>
      </div>

      {/* stats */}
      <div className="flex items-start gap-3 flex-shrink-0 pt-0.5">
        <span className="text-sm font-bold tabular-nums text-foreground w-[28px] flex-none text-center">
          {season.gamesPlayed ?? '—'}
        </span>
        <span className="text-sm font-bold tabular-nums text-foreground w-[28px] flex-none text-center">
          {season.goals ?? '—'}
        </span>
        <span className="text-sm font-bold tabular-nums text-foreground w-[28px] flex-none text-center">
          {season.assists ?? '—'}
        </span>
        <span className="text-sm font-black tabular-nums text-primary w-[28px] flex-none text-center">
          {season.points ?? '—'}
        </span>
        <span className="hidden sm:block text-sm font-bold tabular-nums text-muted-foreground w-[36px] flex-none text-center">
          {season.gamesPlayed && season.points
            ? (season.points / season.gamesPlayed).toFixed(2)
            : '—'}
        </span>
        <span className="hidden md:block text-sm font-bold tabular-nums text-muted-foreground w-[36px] flex-none text-center">
          {season.shots ?? '—'}
        </span>
        <span className="hidden md:block text-sm font-bold tabular-nums text-muted-foreground w-[36px] flex-none text-center">
          {season.shootingPctg != null
            ? `${(season.shootingPctg * 100).toFixed(1)}%`
            : '—'}
        </span>
        <span className="hidden md:block text-sm font-bold tabular-nums text-muted-foreground w-[36px] flex-none text-center">
          {season.powerPlayGoals ?? '—'}
        </span>
        <span className="hidden md:block text-sm font-bold tabular-nums text-muted-foreground w-[36px] flex-none text-center">
          {season.avgToi ?? '—'}
        </span>
      </div>
    </div>
  );
}

function GoalieSeasonRow({ season }: { season: SeasonEntry }) {
  const isPlayoffs = season.gameTypeId === 3;
  const isNHL = season.leagueAbbrev === 'NHL';
  const rowBg = isNHL
    ? isPlayoffs ? 'bg-amber-500/5' : 'bg-primary/5'
    : '';

  return (
    <div className={`flex items-start gap-3 px-4 py-2.5 border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors ${rowBg}`}>
      {/* season */}
      <div className="w-[52px] flex-shrink-0">
        <p className={`text-xs font-bold tabular-nums whitespace-nowrap ${isPlayoffs ? 'text-amber-500' : 'text-foreground'}`}>
          {formatSeasonShort(season.season)}
        </p>
        <p className="text-[9px] text-muted-foreground uppercase tracking-wide">
          {isPlayoffs ? 'Séries' : season.leagueAbbrev}
        </p>
      </div>

      {/* team */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">
          {season.teamName?.default ?? '—'}
        </p>
      </div>

      {/* stats */}
      <div className="flex items-start gap-3 flex-shrink-0 pt-0.5">
        <span className="text-sm font-bold tabular-nums text-muted-foreground w-[28px] flex-none text-center">
          {season.gamesPlayed ?? '—'}
        </span>
        <span className="text-sm font-bold tabular-nums text-foreground w-[28px] flex-none text-center">
          {season.wins ?? '—'}
        </span>
        <span className="hidden sm:block text-sm font-bold tabular-nums text-muted-foreground w-[28px] flex-none text-center">
          {season.losses ?? '—'}
        </span>
        <span className="hidden sm:block text-sm font-bold tabular-nums text-muted-foreground w-[28px] flex-none text-center">
          {season.otLosses ?? '—'}
        </span>
        <span className="hidden sm:block text-sm font-bold tabular-nums text-muted-foreground w-[28px] flex-none text-center">
          {season.shutouts ?? '—'}
        </span>
        <span className="text-sm font-black tabular-nums text-primary w-[44px] flex-none text-center">
          {season.savePctg ? season.savePctg.toFixed(3) : '—'}
        </span>
        <span className="text-sm font-bold tabular-nums text-foreground w-[36px] flex-none text-center">
          {season.goalsAgainstAvg ? season.goalsAgainstAvg.toFixed(2) : '—'}
        </span>
        <span className="hidden md:block text-sm font-bold tabular-nums text-muted-foreground w-[36px] flex-none text-center">
          {season.shotsAgainst ?? '—'}
        </span>
        <span className="hidden md:block text-sm font-bold tabular-nums text-muted-foreground w-[36px] flex-none text-center">
          {season.avgToi ?? '—'}
        </span>
      </div>
    </div>
  );
}

export default function JoueurTabsStats({ player }: Props) {
  const isGoalie = player.position === 'G';

  const initial: StatsAccumulator = {
    regular: { gamesPlayed: 0 },
    playoffs: { gamesPlayed: 0 },
  };

  const totals = (player.seasonTotals ?? []).reduce((acc, curr) => {
    if (curr.leagueAbbrev !== 'NHL') return acc;
    const key = curr.gameTypeId === 3 ? 'playoffs' : 'regular';
    if (isGoalie) {
      const prevGP = acc[key].gamesPlayed;
      const currGP = curr.gamesPlayed ?? 0;
      acc[key] = {
        gamesPlayed: prevGP + currGP,
        wins: (acc[key].wins ?? 0) + (curr.wins ?? 0),
        losses: (acc[key].losses ?? 0) + (curr.losses ?? 0),
        otLosses: (acc[key].otLosses ?? 0) + (curr.otLosses ?? 0),
        shutouts: (acc[key].shutouts ?? 0) + (curr.shutouts ?? 0),
        savePctg: acc[key].savePctg
          ? (acc[key].savePctg! * prevGP + (curr.savePctg ?? 0) * currGP) / (prevGP + currGP)
          : curr.savePctg,
        goalsAgainstAvg: acc[key].goalsAgainstAvg
          ? (acc[key].goalsAgainstAvg! * prevGP + (curr.goalsAgainstAvg ?? 0) * currGP) / (prevGP + currGP)
          : curr.goalsAgainstAvg,
      };
    } else {
      acc[key] = {
        gamesPlayed: acc[key].gamesPlayed + (curr.gamesPlayed ?? 0),
        goals: (acc[key].goals ?? 0) + (curr.goals ?? 0),
        assists: (acc[key].assists ?? 0) + (curr.assists ?? 0),
        points: (acc[key].points ?? 0) + (curr.points ?? 0),
      };
    }
    return acc;
  }, initial);

  const sortedSeasons = [...(player.seasonTotals ?? [])].sort((a, b) => {
    const diff = (b.season ?? 0) - (a.season ?? 0);
    if (diff !== 0) return diff;
    return (b.gameTypeId ?? 0) - (a.gameTypeId ?? 0);
  });

  const skaterTotalCols = (t: StatsTotals): StatCol[] => [
    { label: 'PJ', value: t.gamesPlayed },
    { label: 'B', value: t.goals ?? 0 },
    { label: 'A', value: t.assists ?? 0 },
    { label: 'PTS', value: t.points ?? 0 },
    {
      label: 'PPM',
      value: t.gamesPlayed ? ((t.points ?? 0) / t.gamesPlayed).toFixed(2) : '0.00',
    },
  ];

  const goalieTotalCols = (t: StatsTotals): StatCol[] => [
    { label: 'PJ', value: t.gamesPlayed },
    { label: 'V', value: t.wins ?? 0 },
    { label: 'BL', value: t.shutouts ?? 0 },
    { label: '%ARR', value: t.savePctg ? t.savePctg.toFixed(3) : '—' },
    { label: 'MOY', value: t.goalsAgainstAvg ? t.goalsAgainstAvg.toFixed(2) : '—' },
  ];

  return (
    <TabsContent value="stats">
      <div className="space-y-4">

        {/* Totals */}
        {(totals.regular.gamesPlayed > 0 || totals.playoffs.gamesPlayed > 0) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {totals.regular.gamesPlayed > 0 && (
              <TotalsCard
                title="Saison régulière · NHL"
                cols={isGoalie ? goalieTotalCols(totals.regular) : skaterTotalCols(totals.regular)}
                gridCols={5}
                variant="primary"
              />
            )}
            {totals.playoffs.gamesPlayed > 0 && (
              <TotalsCard
                title="Séries éliminatoires · NHL"
                cols={isGoalie ? goalieTotalCols(totals.playoffs) : skaterTotalCols(totals.playoffs)}
                gridCols={5}
                variant="amber"
              />
            )}
          </div>
        )}

        {/* Season list */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Statistiques par saison</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            {/* column headers */}
            <div className="flex items-center gap-3 px-4 py-2 bg-muted/20 border-y border-border/60">
              <div className="w-[52px] flex-shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Saison</span>
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Équipe</span>
              </div>
              {isGoalie ? (
                <div className="flex items-start gap-3 flex-shrink-0 pt-0.5">
                  {[
                    { label: 'PJ', desc: 'Parties jouées', cls: 'w-[28px]' },
                    { label: 'V', desc: 'Victoires', cls: 'w-[28px]' },
                    { label: 'D', desc: 'Défaites', cls: 'w-[28px] hidden sm:block' },
                    { label: 'DP', desc: 'Défaites en prolongation', cls: 'w-[28px] hidden sm:block' },
                    { label: 'BL', desc: 'Jeux blancs', cls: 'w-[28px] hidden sm:block' },
                    { label: '%ARR', desc: 'Pourcentage d\'arrêts', cls: 'w-[44px]' },
                    { label: 'MOY', desc: 'Moyenne de buts alloués par partie', cls: 'w-[36px]' },
                    { label: 'TSC', desc: 'Tirs subis', cls: 'w-[36px] hidden md:block' },
                    { label: 'TJ/P', desc: 'Temps de jeu par partie', cls: 'w-[36px] hidden md:block' },
                  ].map(({ label, desc, cls }) => (
                    <StatTooltip key={label} description={desc}>
                      <span className={`text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex-none text-center cursor-help ${cls}`}>
                        {label}
                      </span>
                    </StatTooltip>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3 flex-shrink-0 pt-0.5">
                  {[
                    { label: 'PJ', desc: 'Parties jouées', cls: 'w-[28px]' },
                    { label: 'B', desc: 'Buts', cls: 'w-[28px]' },
                    { label: 'A', desc: 'Aides (passes décisives)', cls: 'w-[28px]' },
                    { label: 'PTS', desc: 'Points (buts + aides)', cls: 'w-[28px]' },
                    { label: 'PPM', desc: 'Points par match', cls: 'w-[36px] hidden sm:block' },
                    { label: 'Tirs', desc: 'Tirs au but', cls: 'w-[36px] hidden md:block' },
                    { label: 'T%', desc: 'Pourcentage de tirs cadrés', cls: 'w-[36px] hidden md:block' },
                    { label: 'AN', desc: 'Buts en avantage numérique', cls: 'w-[36px] hidden md:block' },
                    { label: 'TJ/P', desc: 'Temps de jeu par partie', cls: 'w-[36px] hidden md:block' },
                  ].map(({ label, desc, cls }) => (
                    <StatTooltip key={label} description={desc}>
                      <span className={`text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex-none text-center cursor-help ${cls}`}>
                        {label}
                      </span>
                    </StatTooltip>
                  ))}
                </div>
              )}
            </div>

            {sortedSeasons.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">Aucune statistique disponible</p>
            ) : (
              sortedSeasons.map((season) => (
                isGoalie
                  ? (
                    <GoalieSeasonRow
                      key={`${season.season}-${season.leagueAbbrev}-${season.gameTypeId}`}
                      season={season}
                    />
                  )
                  : (
                    <SkaterSeasonRow
                      key={`${season.season}-${season.leagueAbbrev}-${season.gameTypeId}`}
                      season={season}
                    />
                  )
              ))
            )}
          </CardContent>
        </Card>

      </div>
    </TabsContent>
  );
}
