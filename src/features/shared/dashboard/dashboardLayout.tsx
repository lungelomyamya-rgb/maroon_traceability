// src/components/dashboard/DashboardLayout.tsx
import React from 'react';

import { Navigation } from '../layout/navigation';

import { MetricsCard } from './metricsCard';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  cards?: {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    variant?: string;
    icon?: React.ReactNode;
  }[];
}

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  variant?: string;
  icon?: React.ReactNode;
}

function MetricsCardWrapper({ title, value, variant = 'primary', icon }: MetricsCardProps) {
  return (
    <MetricsCard
      icon={icon}
      label={title}
      value={value}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variant={variant as any}
    />
  );
}

export function DashboardLayout({ children, title, subtitle, actions, cards }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="px-4 sm:px-6 lg:px-8">
        {(title || subtitle || actions) && (
          <div className="text-center mb-8">
            {title && <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>}
            {subtitle && <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
            {actions && <div className="flex justify-center mt-4 space-x-3">{actions}</div>}
          </div>
        )}
        
        {/* Render metrics cards if provided */}
        {cards && cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {cards.map((card, index) => (
              <MetricsCardWrapper
                key={index}
                title={card.title}
                value={card.value}
                change={card.change}
                trend={card.trend}
                variant={card.variant}
                icon={card.icon}
              />
            ))}
          </div>
        )}
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
