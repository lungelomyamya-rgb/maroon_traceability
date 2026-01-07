// src/components/dashboard/DashboardLayout.tsx
import React from 'react';
import { Navigation } from '../layout/navigation';
import { getRoleColors } from '@/lib/theme/colors';
import { MetricsCard } from './metricsCard';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  welcomeMessage?: string;
  description?: string;
  cards?: any[];
}

interface MetricsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  variant?: string;
}

function MetricsCardWrapper({ title, value, icon, color, variant = 'primary' }: MetricsCardProps) {
  return (
    <MetricsCard
      icon={icon as any}
      label={title}
      value={value}
      variant={variant as any}
    />
  );
}

export function DashboardLayout({ children, title, subtitle, actions, welcomeMessage, description, cards }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        {(title || subtitle || actions) && (
          <div className="text-center mb-8">
            {title && <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>}
            {subtitle && <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
            {actions && <div className="flex justify-center mt-4 space-x-3">{actions}</div>}
          </div>
        )}
        
        {/* Render metrics cards if provided */}
        {cards && cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
              <MetricsCardWrapper
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                variant={card.variant}
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
