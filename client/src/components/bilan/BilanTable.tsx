import { PointsMensuelEntry } from '@/hooks/bilan/usePointsMensuel';
import { MONTH_LABELS, TEAM_COLORS } from './bilanUtils';

interface Props {
  data: PointsMensuelEntry[];
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7];

export function BilanTable({ data }: Props): JSX.Element {
  const availableMonths = MONTHS.filter((m) => data.some((d) => d.mois === m));

  const teams = Array.from(new Map(data.map((d) => [d.equipe_id, d.equipe_nom_court])).entries())
    .map(([id, nom], i) => ({ id, nom, color: TEAM_COLORS[i % TEAM_COLORS.length] }));

  const getPoints = (equipe_id: number, mois: number): number => {
    const entry = data.find((d) => d.equipe_id === equipe_id && d.mois === mois);
    return entry?.monthly_points ?? 0;
  };

  const getTotal = (equipe_id: number): number => {
    const row = data.find((d) => d.equipe_id === equipe_id);
    return row?.total_saison
      ?? data.filter((d) => d.equipe_id === equipe_id).reduce((s, d) => s + d.monthly_points, 0);
  };

  const colMax = (mois: number): number => Math.max(...teams.map((t) => getPoints(t.id, mois)));

  const sortedTeams = [...teams].sort((a, b) => getTotal(b.id) - getTotal(a.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 pr-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs min-w-[140px]">
              Équipe
            </th>
            {availableMonths.map((m) => (
              <th key={m} className="text-right py-3 px-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                {MONTH_LABELS[m]}
              </th>
            ))}
            <th className="text-right py-3 pl-4 font-semibold text-foreground uppercase tracking-wider text-xs">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map(({ id, nom, color }, rowIdx) => {
            const total = getTotal(id);
            return (
              <tr
                key={id}
                className="border-b border-border/40 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium text-foreground">
                      {`${rowIdx + 1}.`}
                    </span>
                    <span className="text-foreground">{nom}</span>
                  </div>
                </td>
                {availableMonths.map((m) => {
                  const pts = getPoints(id, m);
                  const isTopCol = pts > 0 && pts === colMax(m);
                  return (
                    <td
                      key={m}
                      className={`text-right py-3 px-3 tabular-nums ${isTopCol ? 'text-cyan-400 font-semibold' : 'text-muted-foreground'}`}
                    >
                      {pts > 0 ? pts : <span className="opacity-30">—</span>}
                    </td>
                  );
                })}
                <td className="text-right py-3 pl-4 font-bold text-foreground tabular-nums">
                  {total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
