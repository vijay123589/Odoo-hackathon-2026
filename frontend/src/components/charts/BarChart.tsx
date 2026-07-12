import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface BarChartProps {
  title?: string;
  data: any[];
  xKey: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  xKey,
  dataKeys,
  colors = ['#10b981', '#3b82f6', '#f59e0b'],
  height = 300,
}) => {
  return (
    <div className="w-full flex flex-col space-y-2">
      {title && <h4 className="text-sm font-semibold text-foreground/80">{title}</h4>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey={xKey}
              stroke="currentColor"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              stroke="currentColor"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default BarChart;
