// src/components/retailers/shippingIntegration/index.ts

/**
 * Shipping Integration Feature Module
 *
 * This module provides comprehensive shipping and logistics integration functionality with:
 * - Shipping metrics and performance analytics
 * - Shipping provider management and configuration
 * - Shipment tracking and management
 * - Package and delivery information
 * - Real-time tracking integration
 *
 * @example
 * ```tsx
 * import { ShippingIntegration } from '@/features/retailers/components/shippingIntegration';
 *
 * function ShippingPage() {
 *   return (
 *     <ShippingIntegration
 *       title="Shipping & Logistics Management"
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { ShippingIntegration } from './ShippingIntegration';

// Sub-components for granular usage
export { ShippingProviders } from './ShippingProviders';
export { ShipmentList } from './ShipmentList';
export { ShipmentDetails } from './ShipmentDetails';

// Custom hooks
export { useShippingIntegration } from './hooks/useShippingIntegration';

// Types
export type { ShippingProvider, Shipment, ShippingMetrics } from './hooks/useShippingIntegration';

// Feature metadata
export const shippingIntegrationFeature = {
  name: 'Shipping Integration',
  description: 'Comprehensive shipping and logistics management system',
  version: '1.0.0',
  components: {
    ShippingIntegration: 'Main shipping integration component',
    ShippingProviders: 'Shipping provider management',
    ShipmentList: 'Shipment tracking and management',
    ShipmentDetails: 'Detailed shipment view',
  },
  hooks: {
    useShippingIntegration: 'Shipping data management and state',
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/input', '@/components/ui/select'],
    icons: ['lucide-react'],
    types: ['@/types/shipping', '@/types/provider'],
  },
};

// Default export for convenience
export { ShippingIntegration as default } from './ShippingIntegration';
