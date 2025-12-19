// src/components/ui/button.tsx
'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { buttonVariants, sizes, radius } from '@/lib/colors';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    children, 
    isLoading, 
    fullWidth,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
      'focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      sizes[size],
      radius.md,
      fullWidth && 'w-full',
      className
    );

    const variantStyles = {
      primary: buttonVariants.primary.base,
      secondary: buttonVariants.secondary.base,
      outline: buttonVariants.primary.outline,
      ghost: 'hover:bg-neutral-light',
      link: 'text-blue hover:underline p-0 h-auto',
      warning: buttonVariants.warning.base,
    }[variant];

    return (
      <button
        className={cn(baseStyles, variantStyles)}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';