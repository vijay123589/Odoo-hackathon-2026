import React from 'react';
import {
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';

interface RadarChartProps {
  title?: string;
  data: any[];
  xKey: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
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
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(148, 163, 184, 0.15)" />
            <PolarAngleAxis
              dataKey={xKey}
              stroke="currentColor"
              fontSize={10}
              className="text-muted-foreground"
            />
            <PolarRadiusAxis
              stroke="currentColor"
              fontSize={10}
              angle={30}
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
            {dataKeys.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.25}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default RadarChart;
