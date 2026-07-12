import React from 'react';
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface AreaChartProps {
  title?: string;
  data: any[];
  xKey: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  title,
  data,
  xKey,
  dataKeys,
  colors = ['#10b981', '#3b82f6'],
  height = 300,
}) => {
  return (
    <div className="w-full flex flex-col space-y-2">
      {title && <h4 className="text-sm font-semibold text-foreground/80">{title}</h4>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {dataKeys.map((key, index) => {
                const color = colors[index % colors.length];
                return (
                  <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                );
              })}
            </defs>
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
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fillOpacity={1}
                fill={`url(#gradient-${key})`}
                strokeWidth={2}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default AreaChart;
