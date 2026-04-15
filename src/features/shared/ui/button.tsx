// src/components/ui/button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({ 
  className = '', 
  variant = 'outline', 
  size = 'default', 
  children, 
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-blue text-white hover:bg-blue-hover',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  
  const sizes: Record<string, string> = {
    default: 'h-10 py-2 px-4 text-sm sm:text-base',
    sm: 'h-9 px-3 rounded-md text-xs sm:text-sm',
    lg: 'h-11 sm:h-12 px-6 sm:px-8 rounded-md text-base sm:text-lg',
    icon: 'h-10 w-10',
  };

  // Check if custom colors are provided in className
  const hasCustomColors = /bg-\w+-\d+|text-\w+-\d+/.test(className);
  const variantClasses = hasCustomColors ? '' : variants[variant] || variants.outline;
  const sizeClasses = sizes[size] || sizes.default;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
