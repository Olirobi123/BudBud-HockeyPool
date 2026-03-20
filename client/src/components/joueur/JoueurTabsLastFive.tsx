import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatTooltip } from '@/components/ui/stat-tooltip';
import PlayerDetails from '@/types/IPlayerDetails';

type Props = { player: PlayerDetails };

type Game = NonNullable<PlayerDetails['last5Games']>[number];

function StatBlock({ label, value, accent, showLabel = true }: { label: string; value: string | number; accent?: boolean; showLabel?: boolean }) {
  return (
    <div className="flex flex-col items-center min-w-[36px]">
      <span className={`text-xl font-black tabular-nums leading-none ${accent ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </span>
      {showLabel && (
        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
          {label}
        </span>
      )}
    </div>
  );
}

function OpponentPill({ game }: { game: Game }) {
  const isHome = game.homeRoadFlag === 'H';
  return (
    <div className="flex flex-col items-start gap-0.5 min-w-[52px]">
      <span className={`text-[9px] font-bold uppercase tracking-widest ${isHome ? 'text-blue-500' : 'text-muted-foreground'}`}>
        {isHome ? 'DOM' : 'ÉTR'}
      </span>
      <span className="text-sm font-bold text-foreground">{game.opponentAbbrev}</span>
    </div>
  );
}

function SkaterRow({ game }: { game: Game }) {
  const pts = game.points ?? 0;
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
      <div className="w-[40px] flex-shrink-0">
        <p className="text-xs font-semibold text-foreground">
          {game.gameDate ? format(new Date(game.gameDate), 'd MMM', { locale: fr }) : '—'}
        </p>
      </div>

      <OpponentPill game={game} />

      <div className="flex items-center gap-3 flex-1 justify-center">
        <StatBlock label="B" value={game.goals ?? 0} showLabel={false} />
        <StatBlock label="A" value={game.assists ?? 0} showLabel={false} />
        <StatBlock label="PTS" value={pts} accent={pts > 0} showLabel={false} />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <span className={`hidden sm:block text-sm font-bold tabular-nums w-[28px] flex-none text-center ${(game.plusMinus ?? 0) > 0 ? 'text-green-500' : (game.plusMinus ?? 0) < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
          {(game.plusMinus ?? 0) > 0 ? '+' : ''}
          {game.plusMinus ?? 0}
        </span>
        <span className="text-xs sm:text-sm font-bold tabular-nums text-muted-foreground w-[36px] flex-none text-center">{game.toi ?? '—'}</span>
      </div>
    </div>
  );
}

function GoalieRow({ game }: { game: Game }) {
  const dec = game.decision;
  const decColor = dec === 'W' ? 'text-green-500' : dec === 'L' ? 'text-red-500' : dec === 'O' ? 'text-amber-500' : 'text-muted-foreground';
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
      <div className="w-[40px] flex-shrink-0">
        <p className="text-xs font-semibold text-foreground">
          {game.gameDate ? format(new Date(game.gameDate), 'd MMM', { locale: fr }) : '—'}
        </p>
      </div>

      <OpponentPill game={game} />

      <div className="flex items-center gap-3 flex-1 justify-center">
        <span className={`text-xl font-black tabular-nums leading-none w-[48px] flex-none text-center ${decColor}`}>
          {dec ?? '—'}
        </span>
        <span className={`text-xl font-black tabular-nums leading-none w-[44px] flex-none text-center ${game.savePctg && game.savePctg > 0.9 ? 'text-primary' : 'text-foreground'}`}>
          {game.savePctg ? game.savePctg.toFixed(3) : '—'}
        </span>
        <span className="text-xl font-black tabular-nums leading-none w-[28px] flex-none text-center text-foreground">
          {game.goalsAgainst ?? 0}
        </span>
      </div>
    </div>
  );
}

function SkaterTotals({ games }: { games: Game[] }) {
  const g = games.reduce((s, x) => s + (x.goals ?? 0), 0);
  const a = games.reduce((s, x) => s + (x.assists ?? 0), 0);
  const pts = g + a;
  const pm = games.reduce((s, x) => s + (x.plusMinus ?? 0), 0);
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-muted/40 border-t border-border">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-[40px]">Total</span>
      <div className="w-[52px]" />
      <div className="flex items-center gap-3 flex-1 justify-center">
        <span className="text-sm font-black tabular-nums text-foreground w-[36px] flex-none text-center">{g}</span>
        <span className="text-sm font-black tabular-nums text-foreground w-[36px] flex-none text-center">{a}</span>
        <span className="text-sm font-black tabular-nums text-primary w-[36px] flex-none text-center">{pts}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <span className={`hidden sm:block text-sm font-black tabular-nums w-[28px] flex-none text-center ${pm > 0 ? 'text-green-500' : pm < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
          {pm > 0 ? '+' : ''}
          {pm}
        </span>
        <span className="w-[36px]" />
      </div>
    </div>
  );
}

function GoalieTotals({ games }: { games: Game[] }) {
  const wins = games.filter((g) => g.decision === 'W').length;
  const losses = games.filter((g) => g.decision === 'L').length;
  const ot = games.filter((g) => g.decision === 'O').length;
  const gamesWithSv = games.filter((g) => g.savePctg != null);
  const avgSv = gamesWithSv.reduce((s, x) => s + (x.savePctg ?? 0), 0) / (gamesWithSv.length || 1);
  const totalGA = games.reduce((s, x) => s + (x.goalsAgainst ?? 0), 0);
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-muted/40 border-t border-border">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-[40px]">Moy.</span>
      <div className="w-[52px]" />
      <div className="flex items-center gap-3 flex-1 justify-center">
        <span className="text-sm font-black tabular-nums text-foreground w-[48px] flex-none text-center">
          {wins}-{losses}-{ot}
        </span>
        <span className="text-sm font-black tabular-nums text-primary w-[44px] flex-none text-center">
          {gamesWithSv.length > 0 ? avgSv.toFixed(3) : '—'}
        </span>
        <span className="text-sm font-black tabular-nums text-foreground w-[28px] flex-none text-center">
          {totalGA}
        </span>
      </div>
    </div>
  );
}

export default function JoueurTabsLastFive({ player }: Props) {
  const games = player.last5Games ?? [];
  const isGoalie = player.position === 'G';

  return (
    <TabsContent value="derniers-matchs">
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-lg">5 derniers matchs</CardTitle>
        </CardHeader>

        {games.length === 0 ? (
          <CardContent className="py-16 text-center">
            <p className="text-sm text-muted-foreground">Aucun match récent disponible</p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            {/* column headers */}
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-muted/20 border-b border-border/60">
              <div className="w-[40px]">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Date</span>
              </div>
              <div className="w-[52px]">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Adv.</span>
              </div>
              <div className="flex items-center gap-3 flex-1 justify-center">
                {isGoalie ? (
                  <>
                    {[
                      { label: 'DÉC', desc: 'Décision (V / D / Prol.)', cls: 'w-[48px]' },
                      { label: '%ARR', desc: "Pourcentage d'arrêts", cls: 'w-[44px]' },
                      { label: 'BC', desc: 'Buts contre', cls: 'w-[28px]' },
                    ].map(({ label, desc, cls }) => (
                      <StatTooltip key={label} description={desc}>
                        <span className={`text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex-none text-center cursor-help ${cls}`}>
                          {label}
                        </span>
                      </StatTooltip>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { label: 'B', desc: 'Buts' },
                      { label: 'A', desc: 'Aides (passes décisives)' },
                      { label: 'PTS', desc: 'Points (buts + aides)' },
                    ].map(({ label, desc }) => (
                      <StatTooltip key={label} description={desc}>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground w-[36px] flex-none text-center cursor-help">
                          {label}
                        </span>
                      </StatTooltip>
                    ))}
                  </>
                )}
              </div>
              {!isGoalie && (
                <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                  <StatTooltip description="Différentiel">
                    <span className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-muted-foreground w-[28px] flex-none text-center cursor-help">
                      +/-
                    </span>
                  </StatTooltip>
                  <StatTooltip description="Temps de jeu">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground w-[36px] flex-none text-center cursor-help">
                      TJ
                    </span>
                  </StatTooltip>
                </div>
              )}
            </div>

            {games.map((game) => (
              isGoalie
                ? <GoalieRow key={game.gameDate} game={game} />
                : <SkaterRow key={game.gameDate} game={game} />
            ))}

            {isGoalie ? <GoalieTotals games={games} /> : <SkaterTotals games={games} />}
          </CardContent>
        )}
      </Card>
    </TabsContent>
  );
}
