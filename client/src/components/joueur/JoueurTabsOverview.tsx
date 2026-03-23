import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import PlayerDetails from '@/types/IPlayerDetails';
import { formatSeason, formatAnnee } from '@/lib/utils';
import { usePlayerHistory } from '@/hooks/joueur/usePlayerHistory';


type Props = {
  player: PlayerDetails;
};

interface StatsData {
  gamesPlayed?: number | null;
  goals?: number | null;
  assists?: number | null;
  points?: number | null;
  plusMinus?: number | null;
  wins?: number | null;
  losses?: number | null;
  otLosses?: number | null;
  shutouts?: number | null;
  savePctg?: number | null;
  goalsAgainstAvg?: number | null;
}

type StatItem = { label: string; value: string | number };

function calcAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthday = (
    today.getMonth() > birth.getMonth()
    || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())
  );
  if (!hasHadBirthday) age -= 1;
  return age;
}

function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

function shootsLabel(code: string | undefined): string {
  if (code === 'L') return 'Gaucher';
  if (code === 'R') return 'Droitier';
  return '-';
}

function SecondaryStats({ cols, gridCols }: { cols: StatItem[]; gridCols: 3 | 4 }) {
  const gridClass = gridCols === 4 ? 'grid-cols-4' : 'grid-cols-3';
  return (
    <div className="border-t border-border">
      {/* header row */}
      <div className={`grid ${gridClass} divide-x divide-border/60 bg-muted/20`}>
        {cols.map(({ label }) => (
          <div key={label} className="flex justify-center py-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
      {/* values row */}
      <div className={`grid ${gridClass} divide-x divide-border`}>
        {cols.map(({ label, value }) => (
          <div key={label} className="flex justify-center py-3">
            <span className="text-lg font-black tabular-nums leading-none text-foreground">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkaterStatsContent({ s }: { s: StatsData }) {
  const pm = s.plusMinus ?? 0;
  const pmDisplay = pm > 0 ? `+${pm}` : String(pm);
  const ppm = s.gamesPlayed ? ((s.points ?? 0) / s.gamesPlayed).toFixed(2) : '0.00';
  const rythme = s.gamesPlayed
    ? Math.round(((s.points ?? 0) / s.gamesPlayed) * 82)
    : 0;

  return (
    <>
      <div className="flex flex-col items-center py-4 border-y border-border bg-muted/20 gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Points
        </span>
        <span className="text-4xl font-black tabular-nums leading-none text-foreground">
          {s.points ?? 0}
        </span>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs tabular-nums text-foreground">
            <span className="font-black">{s.gamesPlayed ?? 0}</span>
            <span className="text-muted-foreground font-semibold"> PJ</span>
          </span>
          <span className="text-xs tabular-nums text-foreground">
            <span className="font-black">{s.goals ?? 0}</span>
            <span className="text-muted-foreground font-semibold"> B</span>
          </span>
          <span className="text-xs tabular-nums text-foreground">
            <span className="font-black">{s.assists ?? 0}</span>
            <span className="text-muted-foreground font-semibold"> A</span>
          </span>
        </div>
      </div>
      <SecondaryStats
        gridCols={3}
        cols={[
          { label: '+/-', value: pmDisplay },
          { label: 'PPM', value: ppm },
          { label: 'Rythme 82', value: rythme },
        ]}
      />
    </>
  );
}

function GoalieStatsContent({ s }: { s: StatsData }) {
  return (
    <>
      <div className="flex flex-col items-center py-4 border-y border-border bg-muted/20 gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          % Arrêts
        </span>
        <span className="text-4xl font-black tabular-nums leading-none text-foreground">
          {s.savePctg ? s.savePctg.toFixed(3) : '—'}
        </span>
      </div>
      <SecondaryStats
        gridCols={4}
        cols={[
          { label: 'PJ', value: s.gamesPlayed ?? 0 },
          { label: 'V', value: s.wins ?? 0 },
          { label: 'JB', value: s.shutouts ?? 0 },
          { label: 'MOY', value: s.goalsAgainstAvg ? s.goalsAgainstAvg.toFixed(2) : '—' },
        ]}
      />
      <div className="px-4 py-2.5 border-t border-border flex items-baseline justify-between">
        <p className="text-xs text-muted-foreground">Fiche</p>
        <p className="text-sm font-bold tabular-nums">
          {s.wins ?? 0}
          {'-'}
          {s.losses ?? 0}
          {'-'}
          {s.otLosses ?? 0}
        </p>
      </div>
    </>
  );
}

export default function JoueurTabsOverview({ player }: Props) {
  const subSeason = player.featuredStats?.regularSeason?.subSeason;
  const nhlId = player.playerId?.toString() ?? '';
  const { data: history } = usePlayerHistory(nhlId);
  const poolDraftEvents = (history?.events ?? []).filter((e) => e.type === 'repechage');
  const age = player.birthDate ? calcAge(player.birthDate) : null;
  const heightDisplay = player.heightInCentimeters ? cmToFeetInches(player.heightInCentimeters) : '-';
  const birthplace = [
    player.birthCity?.default,
    player.birthStateProvince?.default,
    player.birthCountry,
  ].filter(Boolean).join(', ');

  const lastStats = (player.seasonTotals ?? [])
    .filter((s) => s.leagueAbbrev === 'NHL' || s.leagueAbbrev === 'NCAA')
    .sort((a, b) => (b.season ?? 0) - (a.season ?? 0))[0];

  const statsData: StatsData | null = (subSeason as StatsData | undefined) ?? (lastStats as StatsData | undefined) ?? null;
  const seasonLabel = subSeason
    ? formatSeason(player.featuredStats?.season)
    : lastStats
      ? `${formatSeason(lastStats.season)} · ${lastStats.leagueAbbrev}`
      : null;

  return (
    <TabsContent value="apercu">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informations Personnelles */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x divide-border border-y border-border">
              <div className="flex flex-col items-center py-4 px-2 gap-0.5">
                <span className="text-3xl font-black tabular-nums leading-none text-foreground">
                  {age ?? '-'}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                  Ans
                </span>
              </div>
              <div className="flex flex-col items-center py-4 px-2 gap-0.5">
                <span className="text-3xl font-black tabular-nums leading-none text-foreground">
                  {heightDisplay}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                  Taille
                </span>
              </div>
              <div className="flex flex-col items-center py-4 px-2 gap-0.5">
                <span className="text-3xl font-black tabular-nums leading-none text-foreground">
                  {player.weightInKilograms ? kgToLbs(player.weightInKilograms) : '-'}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                  Lbs
                </span>
              </div>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs text-muted-foreground flex-shrink-0">Naissance</p>
                <p className="text-sm font-medium text-right">
                  {player.birthDate
                    ? format(new Date(player.birthDate), 'd MMMM yyyy', { locale: fr })
                    : '-'}
                </p>
              </div>
              {birthplace && (
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs text-muted-foreground flex-shrink-0">Origine</p>
                  <p className="text-sm font-medium text-right">{birthplace}</p>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs text-muted-foreground flex-shrink-0">Tir</p>
                <p className="text-sm font-medium">{shootsLabel(player.shootsCatches)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repêchage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Repêchage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                LNH
              </p>
              {player.draftDetails ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm text-muted-foreground">Année</p>
                    <p className="font-medium">{player.draftDetails.year ?? '-'}</p>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">
                      Ronde
                      {' '}
                      {player.draftDetails.round ?? '-'}
                      ,
                      {' '}
                      {player.draftDetails.overallPick ?? '-'}
                      e
                    </p>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm text-muted-foreground">Équipe</p>
                    <p className="font-medium">{player.draftDetails.teamAbbrev ?? '-'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Non repêché</p>
              )}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Pool
              </p>
              {poolDraftEvents.length > 0 ? (
                <div className="space-y-2">
                  {poolDraftEvents.map((e) => {
                    if (e.type !== 'repechage') return null;
                    return (
                      <div
                        key={`pool-draft-${e.id}`}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {e.equipe_nom}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatAnnee(e.annee)}
                            {' · '}
                            {e.type_nom}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold tabular-nums text-foreground">
                            #
                            {e.rang}
                          </p>
                          {e.round !== null && (
                            <p className="text-xs text-muted-foreground">
                              Ronde
                              {' '}
                              {e.round}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun repêchage dans le pool</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Statistiques</CardTitle>
              {seasonLabel && (
                <span className="text-xs text-muted-foreground font-mono">
                  {seasonLabel}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {statsData ? (
              player.position === 'G'
                ? <GoalieStatsContent s={statsData} />
                : <SkaterStatsContent s={statsData} />
            ) : (
              <p className="px-4 py-6 text-sm text-muted-foreground">
                Aucune statistique NHL/NCAA disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
