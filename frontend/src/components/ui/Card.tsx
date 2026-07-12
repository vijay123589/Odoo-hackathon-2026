import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = false, interactive = false, ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-border/60 bg-card text-card-foreground shadow-premium transition-all duration-350 ease-out ${
        interactive ? 'hover:shadow-[0_16px_44px_-10px_rgba(28,38,30,0.06)] dark:hover:shadow-[0_16px_44px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:border-border cursor-pointer' : ''
      } ${
        glass ? 'glass' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-2 p-7 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3
      className={`text-base font-semibold leading-none tracking-tight text-foreground/90 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p className={`text-xs text-muted-foreground leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`p-7 pt-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center p-7 pt-2 border-t border-border/10 ${className}`} {...props}>
      {children}
    </div>
  );
};
