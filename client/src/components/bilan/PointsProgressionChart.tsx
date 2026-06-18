import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PointsMensuelEntry } from '@/hooks/bilan/usePointsMensuel';
import { MONTH_LABELS, TEAM_COLORS } from './bilanUtils';

interface ChartDataPoint {
  mois: string;
  [teamName: string]: string | number;
}

interface Props {
  data: PointsMensuelEntry[];
}

export function PointsProgressionChart({ data }: Props): JSX.Element {
  const teamMap = new Map(data.map((d) => [d.equipe_id, d.equipe_nom_court]));
  const teams = Array.from(teamMap.entries()).map(([id, nom]) => ({ id, nom }));

  // Each label represents the cumulative total entering that month.
  // Oct = 0 (season start), Nov = after Oct, …, Fin = after Apr.
  const availableMonths = [1, 2, 3, 4, 5, 6, 7].filter((m) => data.some((d) => d.mois === m));
  const endLabels = [...availableMonths.map((m) => MONTH_LABELS[m]), 'Fin'];

  const startPoint: ChartDataPoint = { mois: endLabels[0] };
  teams.forEach(({ nom }) => { startPoint[nom] = 0; });

  const chartData: ChartDataPoint[] = [
    startPoint,
    ...availableMonths.map((mois, idx) => {
      const point: ChartDataPoint = { mois: endLabels[idx + 1] };
      teams.forEach(({ id, nom }) => {
        const entry = data.find((d) => d.equipe_id === id && d.mois === mois);
        if (entry) point[nom] = entry.cumul_points;
      });
      return point;
    }),
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{
          top: 8, right: 16, left: 0, bottom: 8,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis
          dataKey="mois"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))',
            fontSize: 13,
          }}
          formatter={(value, name) => [`${value} pts`, name]}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}
          formatter={(value: string) => value}
        />
        {teams.map(({ nom }, i) => (
          <Line
            key={nom}
            type="monotone"
            dataKey={nom}
            stroke={TEAM_COLORS[i % TEAM_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
