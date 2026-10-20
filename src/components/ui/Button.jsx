import React from 'react';
import { cn } from '../../lib/utils.js';

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';
    
    const variants = {
      primary: 'bg-[#721224] text-[#f5eedf] hover:bg-[#520815] focus:ring-[#c5a059] shadow-xs active:bg-[#3d040e]',
      secondary: 'bg-white text-stone-900 border border-stone-200 hover:bg-stone-50 hover:border-stone-300 focus:ring-[#c5a059] shadow-xs',
      outline: 'bg-transparent text-[#721224] border border-[#721224] hover:bg-[#721224]/5 focus:ring-[#c5a059]',
      danger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c] focus:ring-red-300 shadow-xs active:bg-[#991b1b]',
      ghost: 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:ring-stone-300',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs min-h-[36px] gap-1.5',
      md: 'px-4 py-2 text-sm min-h-[42px] gap-2',
      lg: 'px-6 py-2.5 text-base min-h-[48px] gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
