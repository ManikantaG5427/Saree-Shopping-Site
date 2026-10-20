import React from 'react';
import { cn } from '../../lib/utils.js';

export const Card = React.forwardRef(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white rounded-xl shadow-xs border border-[#e2e8f0]',
      hover: 'bg-white rounded-xl shadow-xs border border-[#e2e8f0] hover:shadow-md hover:border-slate-300 transition-all duration-200',
    };
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant] || variants.default, paddings[padding] || paddings.md, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mb-4', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-lg font-semibold text-[#0f172a] tracking-tight', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-[#475569] mt-1', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-4 pt-4 border-t border-[#e2e8f0] flex items-center', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';
