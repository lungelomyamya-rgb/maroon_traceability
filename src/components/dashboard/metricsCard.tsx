// src/components/dashboard/MetricsCard.tsx
'use client';

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
    bg: 'bg-success/10',
    border: 'border-success/20',
    icon: 'text-success',
    text: 'text-success',
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    icon: 'text-warning',
    text: 'text-warning',
  },
  error: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    icon: 'text-destructive',
    text: 'text-destructive',
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
            <div className="text-xs font-medium text-muted-foreground">{label}</div>
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
          <div className="text-sm font-medium text-muted-foreground">{label}</div>
          <div className={cn('text-2xl font-bold', styles.text)}>{value}</div>
        </div>
      </div>
    </div>
  );
}