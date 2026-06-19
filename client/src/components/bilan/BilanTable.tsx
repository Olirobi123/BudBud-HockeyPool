import { PointsMensuelEntry } from '@/hooks/bilan/usePointsMensuel';
import { MONTH_LABELS } from './bilanUtils';

const RANK_BASE = 'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold tabular-nums shrink-0';

function rankClass(rank: number): string {
  if (rank === 1) return `${RANK_BASE} bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30`;
  if (rank === 2) return `${RANK_BASE} bg-slate-400/15 text-slate-300 ring-1 ring-slate-400/20`;
  if (rank === 3) return `${RANK_BASE} bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/20`;
  return `${RANK_BASE} text-muted-foreground`;
}
import type { BilanCategory } from './BilanCategoryToggle';
import BilanMobileCards from './BilanMobileCards';

interface Props {
  data: PointsMensuelEntry[];
  category: BilanCategory;
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7];

const CATEGORY_LABELS: Record<BilanCategory, string> = {
  general: 'Total',
  attaque: 'Att',
  defense: 'Déf',
  gardiens: 'Gar',
};

export default function BilanTable({ data, category }: Props): JSX.Element {
  const availableMonths = MONTHS.filter((m) => data.some((d) => d.mois === m));

  const teams = Array.from(new Map(data.map((d) => [d.equipe_id, d])).entries())
    .map(([id, d]) => ({ id, nomLong: d.equipe_nom }));

  const getMonthlyPoints = (equipe_id: number, mois: number): number => {
    const entry = data.find((d) => d.equipe_id === equipe_id && d.mois === mois);
    if (!entry) return 0;
    if (category === 'attaque') return entry.attaque_monthly ?? 0;
    if (category === 'defense') return entry.defense_monthly ?? 0;
    if (category === 'gardiens') return entry.gardien_monthly ?? 0;
    return entry.monthly_points;
  };

  const getCategoryTotal = (equipe_id: number): number => {
    const row = data.find((d) => d.equipe_id === equipe_id);
    if (!row) return 0;
    if (category === 'attaque') return row.attaque_saison ?? 0;
    if (category === 'defense') return row.defense_saison ?? 0;
    if (category === 'gardiens') return row.gardien_saison ?? 0;
    return row.total_saison
      ?? data.filter((d) => d.equipe_id === equipe_id).reduce((s, d) => s + d.monthly_points, 0);
  };

  const teamPts = (mois: number) => teams.map((t) => getMonthlyPoints(t.id, mois));
  const colMax = (mois: number): number => Math.max(...teamPts(mois));

  const sortedTeams = [...teams].sort((a, b) => getCategoryTotal(b.id) - getCategoryTotal(a.id));

  return (
    <>
      <BilanMobileCards
        sortedTeams={sortedTeams}
        availableMonths={availableMonths}
        getMonthlyPoints={getMonthlyPoints}
        getCategoryTotal={getCategoryTotal}
      />

      {/* Desktop: table with sticky first column + heat-map cells */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 bg-card text-left py-3 pr-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs min-w-[140px]">
                Équipe
              </th>
              {availableMonths.map((m) => (
                <th key={m} className="text-center py-3 px-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                  {MONTH_LABELS[m]}
                </th>
              ))}
              <th className="text-center py-3 pl-4 font-semibold uppercase tracking-wider text-xs text-blue-600" >
                {CATEGORY_LABELS[category]}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map(({ id, nomLong }, rowIdx) => {
              const total = getCategoryTotal(id);
              return (
                <tr
                  key={id}
                  className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                >
                  <td className="sticky left-0 bg-card py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={rankClass(rowIdx + 1)}>{rowIdx + 1}</span>
                      <span className="text-foreground">{nomLong}</span>
                    </div>
                  </td>
                  {availableMonths.map((m) => {
                    const pts = getMonthlyPoints(id, m);
                    const max = colMax(m);
                    const intensity = max > 0 ? pts / max : 0;
                    const isTop = pts > 0 && pts === max;
                    return (
                      <td key={m} className="text-center py-3 px-3 tabular-nums relative">
                        <span
                          className="absolute inset-0"
                          style={{ backgroundColor: '#2563eb', opacity: pts > 0 ? intensity * 0.65 : 0 }}
                        />
                        <span
                          className={`relative ${isTop ? 'font-bold text-white' : 'text-foreground'}`}
                          style={isTop ? { textShadow: '0 0 8px rgba(255,255,255,0.6)' } : undefined}
                        >
                          {pts > 0 ? pts : <span className="opacity-30">—</span>}
                        </span>
                      </td>
                    );
                  })}
                  <td className="text-center py-3 pl-4 font-bold tabular-nums text-blue-600" >
                    {total > 0 ? total : <span className="opacity-30 font-normal">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
