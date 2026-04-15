// src/components/ui/badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'info' | 'success' | 'warning';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'outline', size = 'default', className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  };

  const sizes: Record<string, string> = {
    sm: 'px-1.5 py-0.5 text-xs',
    default: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  // Check if custom colors are provided in className
  const hasCustomColors = /bg-\w+-\d+|text-\w+-\d+/.test(className);
  const variantClasses = hasCustomColors ? '' : variants[variant] || variants.outline;
  const sizeClasses = sizes[size] || sizes.default;

  return (
    <div 
      className={`inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses} ${sizeClasses} ${className}`}
      role="status"
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </div>
  );
}
