// src/components/ui/alert.tsx

import React from 'react';

import { cn } from '@/lib/utils';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'info' | 'success';
  className?: string;
  title?: string;
}

export function Alert({ children, variant = 'default', className = '', title }: AlertProps) {
  const baseClasses = 'relative w-full rounded-lg border p-4';
  
  const variants = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive bg-destructive/10',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    success: 'border-green-200 bg-green-50 text-green-800',
  };

  return (
    <div className={cn(baseClasses, variants[variant], className)}>
      {title && (
        <div className="mb-2 flex items-center">
          <h4 className="text-sm font-medium">{title}</h4>
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function AlertDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('text-sm opacity-90', className)}>{children}</div>;
}

export function AlertTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h5 className={cn('font-medium leading-none tracking-tight', className)}>{children}</h5>;
}
