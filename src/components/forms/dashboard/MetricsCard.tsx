// src/components/dashboard/MetricsCard.tsx
// Metrics card component for dashboard displays

'use client';

import React from 'react';

export interface MetricsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'total-transactions' | 'monthly-revenue';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export function MetricsCard({
  title,
  value,
  icon,
  variant = 'default',
  trend,
  description,
  className = '',
}: MetricsCardProps) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    primary: 'bg-blue-50 border-blue-200',
    secondary: 'bg-gray-50 border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    'total-transactions': 'bg-purple-50 border-purple-200',
    'monthly-revenue': 'bg-emerald-50 border-emerald-200',
  };

  const textStyles = {
    default: 'text-gray-900',
    primary: 'text-blue-900',
    secondary: 'text-gray-900',
    success: 'text-green-900',
    warning: 'text-yellow-900',
    error: 'text-red-900',
    'total-transactions': 'text-purple-900',
    'monthly-revenue': 'text-emerald-900',
  };

  return (
    <div
      className={`
        p-6 rounded-lg border transition-all duration-200 hover:shadow-lg
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${textStyles[variant]} opacity-75`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${textStyles[variant]} mt-1`}>
            {value}
          </p>
          {description && (
            <p className={`text-sm ${textStyles[variant]} opacity-60 mt-2`}>
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div className={`ml-4 p-3 rounded-full ${variantStyles[variant]}`}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center mt-4">
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs last period</span>
        </div>
      )}
    </div>
  );
}

export default MetricsCard;
