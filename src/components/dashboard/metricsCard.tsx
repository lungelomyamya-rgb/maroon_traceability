// src/components/dashboard/MetricsCard.tsx
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricLabel, MetricValue } from '@/components/ui/typography';

interface MetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  compact?: boolean;
}

const variantStyles = {
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    icon: 'text-primary',
    text: 'text-primary',
  },
  secondary: {
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
    icon: 'text-secondary-foreground',
    text: 'text-secondary-foreground',
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-500',
    text: 'text-green-500',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: 'text-yellow-500',
    text: 'text-yellow-500',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-500',
    text: 'text-red-500',
  },
};

export function MetricsCard({ 
  icon: Icon, 
  label, 
  value, 
  variant = 'primary',
  compact = false 
}: MetricsCardProps) {
  const styles = variantStyles[variant] || variantStyles.primary;

  if (compact) {
    return (
      <div className={cn(
        styles.bg,
        'p-3 rounded-xl border shadow-sm hover:shadow-md transition-shadow h-full',
        styles.border
      )}>
        <div className="flex items-start">
          <div className={cn(
            styles.bg,
            'p-2 rounded-lg border shadow-sm mr-3',
            styles.border
          )}>
            <Icon className={cn('h-4 w-4', styles.icon)} />
          </div>
          <div className="flex-1 min-w-0">
            <MetricLabel className={cn(styles.text)}>{label}</MetricLabel>
            <div className={cn('text-xl font-bold', styles.text)}>{value}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      styles.bg,
      'p-4 rounded-xl border shadow-sm hover:shadow-md transition-all',
      styles.border
    )}>
      <div className="flex items-center">
        <div className={cn(
          styles.bg,
          'p-2 rounded-lg border shadow-sm mr-4',
          styles.border
        )}>
          <Icon className={cn('h-6 w-6', styles.icon)} />
        </div>
        <div>
          <MetricLabel>{label}</MetricLabel>
          <div className={cn('text-2xl font-bold', styles.text)}>{value}</div>
        </div>
      </div>
    </div>
  );
}
