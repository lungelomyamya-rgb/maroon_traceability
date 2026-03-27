// src/components/dashboard/metricsCard.tsx
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cardColors } from '@/lib/theme/colors';

interface MetricsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'total-transactions' | 'monthly-revenue' | 'active-farms' | 'retailers' | 'avg-fee' | 'primary-card' | 'secondary-card';
  compact?: boolean;
}

export function MetricsCard({ 
  icon, 
  label, 
  value, 
  variant = 'primary',
  compact = false 
}: MetricsCardProps) {
  // Use colors from the centralized color file
  const colorScheme = cardColors[variant as keyof typeof cardColors] || cardColors['total-transactions'];

  if (compact) {
    return (
      <div className={cn(
        colorScheme.bg,
        'p-3 rounded-xl border shadow-sm hover:shadow-md transition-shadow h-full',
        colorScheme.border
      )}>
        <div className="flex items-start">
          <div className={cn(
            colorScheme.bg,
            'p-2 rounded-lg border shadow-sm mr-3',
            colorScheme.border
          )}>
            <div className={cn('h-4 w-4 flex items-center justify-center', colorScheme.icon)}>
              {icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-500">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        colorScheme.bg,
        'p-4 rounded-xl border shadow-sm hover:shadow-md transition-all',
        colorScheme.border
      )}
    >
      <div className="flex items-center">
        <div className={cn(
          colorScheme.bg,
          'p-2 rounded-lg border shadow-sm mr-4',
          colorScheme.border
        )}
        >
          <div className={cn('h-6 w-6 flex items-center justify-center', colorScheme.icon)}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className={cn('text-2xl font-bold', colorScheme.icon)}>{value}</p>
        </div>
      </div>
    </div>
  );
}
