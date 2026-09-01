import { RankBadge } from '@/components/ui/rank-badge';
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
                <RankBadge rank={rowIdx + 1} />
                <span className="font-semibold text-foreground text-sm">{nomLong}</span>
              </div>
              <span className="text-base font-bold tabular-nums text-foreground">
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
