import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'neutral',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200';

  const variants = {
    primary: 'bg-primary/10 text-primary hover:bg-primary/20',
    secondary: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
    success: 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20',
    error: 'bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20',
    outline: 'border border-border text-foreground hover:bg-muted',
    neutral: 'bg-muted text-muted-foreground hover:bg-muted/80',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
