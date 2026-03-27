// src/components/ui/button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Button({ className = '', variant = 'outline', size = 'default', children, ...props }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-blue text-white hover:bg-blue-hover', // Matching GitHub repo
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4 text-sm sm:text-base',
    sm: 'h-9 px-3 rounded-md text-xs sm:text-sm',
    lg: 'h-11 sm:h-12 px-6 sm:px-8 rounded-md text-base sm:text-lg',
  };

  // Check if custom colors are provided in className
  const hasCustomColors = /bg-\w+-\d+|text-\w+-\d+/.test(className);
  const variantClasses = hasCustomColors ? '' : variants[variant];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
