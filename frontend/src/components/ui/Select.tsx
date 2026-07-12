import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, helperText, id, options, children, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-foreground/90 select-none"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer ${
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-border'
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p className="text-xs text-destructive font-medium mt-0.5">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-muted-foreground mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
