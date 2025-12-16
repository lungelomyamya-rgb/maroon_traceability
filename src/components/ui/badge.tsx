// src/components/ui/badge.tsx
'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

    const variants = {
      default: 'bg-primary/10 text-primary hover:bg-primary/20',
      secondary: 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20',
      success: 'bg-success/10 text-success-foreground hover:bg-success/20',
      warning: 'bg-warning/10 text-warning-foreground hover:bg-warning/20',
      error: 'bg-error/10 text-error-foreground hover:bg-error/20',
      outline: 'border border-border',
    };

    return (
      <span
        className={cn(
          baseStyles,
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';