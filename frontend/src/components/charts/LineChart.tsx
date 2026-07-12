import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface LineChartProps {
  title?: string;
  data: any[];
  xKey: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  xKey,
  dataKeys,
  colors = ['#1A3B2B', '#8D7A68', '#8FA89B', '#C69B7B', '#475569'],
  height = 300,
}) => {
  return (
    <div className="w-full flex flex-col space-y-2">
      {title && <h4 className="text-sm font-semibold text-foreground/80">{title}</h4>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
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
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default LineChart;
