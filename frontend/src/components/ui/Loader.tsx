import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  fullScreen = false,
  text = 'Loading...',
}) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={`animate-spin rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent ${sizes[size]}`}
        style={{ borderColor: 'hsl(var(--primary))', borderRightColor: 'transparent' }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="text-sm font-medium text-muted-foreground">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {loaderContent}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-6">{loaderContent}</div>;
};
