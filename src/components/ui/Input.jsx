import React from 'react';
import { cn } from '../../lib/utils.js';

export const Input = React.forwardRef(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#0f172a] mb-1.5 uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3.5 py-2.5 border rounded-lg bg-white text-sm text-[#0f172a]',
            'focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-[#2563eb]',
            'transition-colors duration-150',
            'placeholder:text-[#94a3b8]',
            error ? 'border-red-500 focus:ring-red-200' : 'border-[#e2e8f0] hover:border-slate-300',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-[#b91c1c] font-medium" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-xs text-[#64748b]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
