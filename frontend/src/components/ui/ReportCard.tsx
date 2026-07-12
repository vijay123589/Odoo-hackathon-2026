import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Calendar, Eye, Download, Pin } from 'lucide-react';

interface ReportCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  date: string;
  isPinned?: boolean;
  onView: (id: string) => void;
  onExport: (id: string) => void;
  className?: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  id,
  name,
  category,
  description,
  date,
  isPinned = false,
  onView,
  onExport,
  className = '',
}) => {
  return (
    <Card interactive className={`p-5 flex flex-col justify-between relative overflow-hidden ${className}`}>
      {isPinned && (
        <div className="absolute top-3 right-3 text-primary/40" title="Pinned Report">
          <Pin className="h-3.5 w-3.5 fill-current" />
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Badge
            variant={
              category.toLowerCase() === 'environmental'
                ? 'success'
                : category.toLowerCase() === 'social'
                ? 'secondary'
                : 'primary'
            }
            className="scale-90"
          >
            {category}
          </Badge>
          <span className="text-[10px] text-muted-foreground font-semibold flex items-center space-x-1">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{date}</span>
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-foreground/90 leading-tight truncate pr-6">
            {name}
          </h4>
          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(id)}
          className="h-8 px-2 text-xs font-bold inline-flex items-center space-x-1"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Open Workspace</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport(id)}
          className="h-8 px-2 text-xs font-bold inline-flex items-center space-x-1"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Options</span>
        </Button>
      </div>
    </Card>
  );
};
export default ReportCard;
