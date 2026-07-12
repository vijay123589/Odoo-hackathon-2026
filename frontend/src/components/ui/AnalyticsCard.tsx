import React from 'react';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react';
import { Badge } from './Badge';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className = '',
}) => {
  return (
    <Card interactive className={`p-6 flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
            {title}
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight text-foreground/90">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center space-x-1.5 mt-1">
              <Badge
                variant={
                  trend.direction === 'up'
                    ? 'success'
                    : trend.direction === 'down'
                    ? 'neutral'
                    : 'primary'
                }
                className="scale-90"
              >
                {trend.value}
              </Badge>
              {description && (
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/5 shadow-sm">
            <Icon className="h-5 w-5 shrink-0" />
          </div>
        )}
      </div>
    </Card>
  );
};
export default AnalyticsCard;
