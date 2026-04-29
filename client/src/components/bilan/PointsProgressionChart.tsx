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

const MONTH_LABELS: Record<number, string> = {
  1: 'Oct',
  2: 'Nov',
  3: 'Déc',
  4: 'Jan',
  5: 'Fév',
  6: 'Mar',
  7: 'Avr',
};

const TEAM_COLORS = [
  '#38bdf8', // sky-400
  '#f97316', // orange-500
  '#a78bfa', // violet-400
  '#34d399', // emerald-400
  '#fb7185', // rose-400
  '#facc15', // yellow-400
  '#60a5fa', // blue-400
  '#f472b6', // pink-400
  '#4ade80', // green-400
  '#c084fc', // purple-400
  '#2dd4bf', // teal-400
  '#fbbf24', // amber-400
];

interface ChartDataPoint {
  mois: string;
  [teamName: string]: string | number;
}

interface Props {
  data: PointsMensuelEntry[];
}

export function PointsProgressionChart({ data }: Props): JSX.Element {
  const teams = Array.from(new Map(data.map((d) => [d.equipe_id, d.equipe_nom])).entries()).map(
    ([id, nom]) => ({ id, nom }),
  );

  const chartData: ChartDataPoint[] = [1, 2, 3, 4, 5, 6, 7]
    .filter((mois) => data.some((d) => d.mois === mois))
    .map((mois) => {
      const point: ChartDataPoint = { mois: MONTH_LABELS[mois] };
      teams.forEach(({ id, nom }) => {
        const entry = data.find((d) => d.equipe_id === id && d.mois === mois);
        if (entry) point[nom] = entry.cumul_points;
      });
      return point;
    });

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
          formatter={(value, name) => {
            const label = typeof name === 'string' ? (name.split(' de ').pop() ?? name) : String(name ?? '');
            return [`${value} pts`, label];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}
          formatter={(value: string) => value.split(' de ').pop() ?? value}
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
