import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { PointsMensuelEntry } from '@/hooks/bilan/usePointsMensuel';
import { TEAM_COLORS } from './bilanUtils';

interface ChartDataPoint {
  nom: string;
  total: number;
  color: string;
}

interface Props {
  data: PointsMensuelEntry[];
}

export function PointsBarChart({ data }: Props): JSX.Element {
  const chartData: ChartDataPoint[] = Array.from(
    new Map(data.map((d) => [d.equipe_id, d.equipe_nom_court])).entries(),
  )
    .map(([id, nom], i) => ({
      nom,
      total: data.filter((d) => d.equipe_id === id).reduce((s, d) => s + d.monthly_points, 0),
      color: TEAM_COLORS[i % TEAM_COLORS.length],
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart
        data={chartData}
        margin={{
          top: 8, right: 16, left: 0, bottom: 48,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
        <XAxis
          dataKey="nom"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
          angle={-35}
          textAnchor="end"
          interval={0}
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
          formatter={(value) => [`${value} pts`, 'Total']}
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {chartData.map(({ nom, color }) => (
            <Cell key={nom} fill={color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
