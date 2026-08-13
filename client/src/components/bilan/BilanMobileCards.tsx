import { MONTH_LABELS } from './bilanUtils';

interface TeamRow {
  id: number;
  nomLong: string;
}

interface Props {
  sortedTeams: TeamRow[];
  availableMonths: number[];
  getMonthlyPoints: (equipe_id: number, mois: number) => number;
  getCategoryTotal: (equipe_id: number) => number;
}

const RANK_BASE = 'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold tabular-nums shrink-0';

function rankClass(rank: number): string {
  if (rank === 1) return `${RANK_BASE} bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30`;
  if (rank === 2) return `${RANK_BASE} bg-slate-400/15 text-slate-300 ring-1 ring-slate-400/20`;
  if (rank === 3) return `${RANK_BASE} bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/20`;
  return `${RANK_BASE} text-muted-foreground`;
}

export default function BilanMobileCards({
  sortedTeams,
  availableMonths,
  getMonthlyPoints,
  getCategoryTotal,
}: Props): JSX.Element {
  const monthMax: Record<number, number> = {};
  availableMonths.forEach((m) => {
    monthMax[m] = Math.max(...sortedTeams.map((t) => getMonthlyPoints(t.id, m)), 0);
  });

  return (
    <div className="flex flex-col gap-3 sm:hidden">
      {sortedTeams.map(({ id, nomLong }, rowIdx) => {
        const total = getCategoryTotal(id);
        const monthPts = availableMonths.map((m) => getMonthlyPoints(id, m));
        const cardMax = Math.max(...monthPts, 1);

        return (
          <div key={id} className="rounded-lg border border-border/60 bg-background p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={rankClass(rowIdx + 1)}>{rowIdx + 1}</span>
                <span className="font-semibold text-foreground text-sm">{nomLong}</span>
              </div>
              <span className="text-base font-bold tabular-nums text-blue-400">
                {total > 0 ? total : <span className="text-muted-foreground font-normal">—</span>}
              </span>
            </div>

            <div className="flex items-end gap-1">
              {availableMonths.map((m, i) => {
                const pts = monthPts[i];
                const isTopMonth = pts > 0 && pts === monthMax[m];
                const heightPct = pts > 0 ? (pts / cardMax) * 100 : 0;
                return (
                  <div key={m} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <span
                      className="text-[9px] tabular-nums leading-none h-3 flex items-end font-bold"
                      style={{ color: isTopMonth ? '#2563eb' : undefined }}
                    >
                      {pts > 0 ? pts : ''}
                    </span>
                    <div className="relative w-full h-6">
                      {pts > 0 ? (
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded-sm"
                          style={{
                            height: `${heightPct}%`,
                            backgroundColor: '#2563eb',
                            opacity: isTopMonth ? 0.9 : 0.5,
                          }}
                        />
                      ) : (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-px rounded-sm"
                          style={{ backgroundColor: '#60a5fa', opacity: 0.2 }}
                        />
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground/50 leading-none">
                      {MONTH_LABELS[m]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
