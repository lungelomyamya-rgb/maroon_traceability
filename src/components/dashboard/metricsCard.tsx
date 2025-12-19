// src/components/dashboard/MetricsCard.tsx
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricLabel, MetricValue } from '@/components/ui/typography';
import { getColorScheme, cardColors } from '@/lib/theme/colors';

interface MetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'total-transactions' | 'monthly-revenue' | 'active-farms' | 'retailers' | 'avg-fee';
  compact?: boolean;
}

export function MetricsCard({ 
  icon: Icon, 
  label, 
  value, 
  variant = 'primary',
  compact = false 
}: MetricsCardProps) {
  // Use centralized color scheme
  const styles = cardColors[variant as keyof typeof cardColors] || getColorScheme(variant as keyof typeof getColorScheme);

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
