import React from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

interface PieChartProps {
  title?: string;
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
  height = 300,
}) => {
  return (
    <div className="w-full flex flex-col space-y-2">
      {title && <h4 className="text-sm font-semibold text-foreground/80">{title}</h4>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default PieChart;
