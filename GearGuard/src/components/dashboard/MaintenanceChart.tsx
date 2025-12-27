import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MaintenanceChartProps {
  data: {
    new: number;
    in_progress: number;
    repaired: number;
    scrap: number;
  };
  isLoading?: boolean;
}

const COLORS = {
  new: 'hsl(217, 91%, 60%)', // primary blue
  in_progress: 'hsl(38, 92%, 50%)', // warning amber
  repaired: 'hsl(142, 76%, 36%)', // success green
  scrap: 'hsl(220, 9%, 46%)', // muted gray
};

export function MaintenanceChart({ data, isLoading }: MaintenanceChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="animate-pulse">
          <div className="h-4 w-40 rounded bg-muted mb-6" />
          <div className="h-48 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'New', value: data.new, color: COLORS.new },
    { name: 'In Progress', value: data.in_progress, color: COLORS.in_progress },
    { name: 'Repaired', value: data.repaired, color: COLORS.repaired },
    { name: 'Scrap', value: data.scrap, color: COLORS.scrap },
  ].filter(item => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Maintenance Status</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No maintenance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-semibold text-foreground mb-4">Maintenance Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value} requests`, '']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
