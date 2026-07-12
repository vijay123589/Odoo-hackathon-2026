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
  const baseStyles = 'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 select-none';

  const variants = {
    primary: 'bg-primary/10 text-primary border border-primary/10',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/10',
    success: 'bg-green-500/8 text-green-700 dark:text-green-400 border border-green-500/10',
    warning: 'bg-amber-500/8 text-amber-700 dark:text-amber-400 border border-amber-500/10',
    error: 'bg-destructive/8 text-destructive dark:text-red-400 border border-destructive/10',
    outline: 'border border-border/80 text-foreground/80 hover:bg-muted',
    neutral: 'bg-muted text-muted-foreground border border-border/20',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
