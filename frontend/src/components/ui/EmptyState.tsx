import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionText,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-card/30">
      {Icon && (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted/65 text-muted-foreground/80 mb-4">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionText && onActionClick && (
        <Button variant="primary" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
