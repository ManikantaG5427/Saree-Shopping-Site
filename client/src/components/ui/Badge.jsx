import React from 'react';
import { cn } from '../../lib/utils.js';

export const Badge = React.forwardRef(
  ({ className, variant = 'default', size = 'sm', children, ...props }, ref) => {
    const variants = {
      default: 'bg-slate-100 text-slate-800 border-slate-200',
      success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warning: 'bg-amber-50 text-amber-700 border-amber-200',
      info: 'bg-blue-50 text-blue-700 border-blue-200',
      danger: 'bg-red-50 text-red-700 border-red-200',
      neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    
    const sizes = {
      sm: 'px-2.5 py-0.5 text-xs font-medium',
      md: 'px-3 py-1 text-sm font-medium',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full border',
          variants[variant] || variants.default,
          sizes[size] || sizes.sm,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
