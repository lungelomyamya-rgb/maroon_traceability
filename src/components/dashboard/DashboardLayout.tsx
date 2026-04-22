// src/features/shared/dashboard/DashboardLayoutUnified.tsx
// Unified DashboardLayout component - combines functionality from both versions
'use client';

import React from 'react';
import { Navigation } from '@/components/layout/navigation';
import { MetricsCard } from '@/components/forms/dashboard/MetricsCard';


// ===== INTERFACES =====

/**
 * Legacy interface for backward compatibility
 * From components/dashboard/DashboardLayout.tsx
 */
interface LegacyDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  welcomeMessage?: string;
  description?: string;
  _welcomeMessage?: string;
  _description?: string;
  cards?: Array<{
    title: string;
    value: number;
    icon: React.ReactNode;
    variant?: string;
  }>;
}

/**
 * Modern interface with metrics
 * From src/features/shared/dashboard.tsx
 */
interface ModernDashboardLayoutProps {
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

/**
 * Unified interface that supports both legacy and modern card formats
 */
export interface UnifiedDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  description?: string;
  _description?: string; // Legacy support
  cards?: Array<{
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    variant?: string;
    // Modern metrics properties
    change?: string;
    trend?: 'up' | 'down';
  }>;
}

// ===== TYPE GUARDS =====

/**
 * Check if card is in modern format (has change and trend)
 */
function _isModernCard(card: { title: string; value: string | number; icon?: React.ReactNode; variant?: string; change?: string; trend?: 'up' | 'down' }): card is {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: string;
  change: string;
  trend: 'up' | 'down'
} {
  return typeof card.change === 'string' && (card.trend === 'up' || card.trend === 'down');
}


// ===== COMPONENTS =====

/**
 * Metrics card wrapper that handles both legacy and modern card formats
 */
function MetricsCardWrapper({ card }: { card: NonNullable<UnifiedDashboardLayoutProps['cards']>[0] }) {
  // Both formats use the same MetricsCard interface
  // Modern cards may have additional metadata but MetricsCard only uses basic properties
  return (
    <MetricsCard
      title={card.title}
      value={card.value}
      icon={card.icon}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variant={card.variant as any}
    />
  );
}

/**
 * Unified DashboardLayout component
 * Supports both legacy and modern interfaces
 */
export function DashboardLayoutUnified(props: UnifiedDashboardLayoutProps) {
  const { children, title, subtitle, actions, description, _description, cards } = props;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        {(title || subtitle || actions) && (
          <div className="text-center mb-8">
            {title && <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>}
            {subtitle && <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
            {(description || _description) && (
              <p className="mt-2 text-base text-gray-500 max-w-2xl mx-auto">
                {description || _description}
              </p>
            )}
            {actions && <div className="flex justify-center mt-4 space-x-3">{actions}</div>}
          </div>
        )}

        {/* Metrics cards section */}
        {cards && cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {cards.map((card, index) => (
              <MetricsCardWrapper key={index} card={card} />
            ))}
          </div>
        )}

        {/* Main content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ===== LEGACY COMPATIBILITY =====

/**
 * Legacy DashboardLayout for backward compatibility
 * @deprecated Use DashboardLayoutUnified instead
 */
export function DashboardLayout(props: LegacyDashboardLayoutProps) {
  // Convert legacy props to unified format
  const unifiedProps: UnifiedDashboardLayoutProps = {
    ...props,
    description: props.description || props._description,
    cards: props.cards?.map(card => ({
      ...card,
      value: card.value,
    })),
  };

  return <DashboardLayoutUnified {...unifiedProps} />;
}

/**
 * Modern DashboardLayout with metrics
 * @deprecated Use DashboardLayoutUnified instead
 */
export function DashboardLayoutModern(props: ModernDashboardLayoutProps) {
  // Convert modern props to unified format
  const unifiedProps: UnifiedDashboardLayoutProps = {
    ...props,
    cards: props.cards?.map(card => ({
      ...card,
      value: card.value,
    })),
  };

  return <DashboardLayoutUnified {...unifiedProps} />;
}

// ===== CONVENIENCE EXPORTS =====

/**
 * Default export - use this for new implementations
 */
export default DashboardLayoutUnified;

/**
 * Type exports for consumers
 */
export type {
  LegacyDashboardLayoutProps,
  ModernDashboardLayoutProps,
};
