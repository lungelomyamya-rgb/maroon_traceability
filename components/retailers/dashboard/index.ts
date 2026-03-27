// src/components/retailers/dashboard/index.ts

/**
 * Retailer Dashboard Feature Module
 * 
 * This module provides comprehensive retailer dashboard functionality with:
 * - Sales metrics and analytics
 * - Recent orders tracking
 * - Inventory management alerts
 * - Top products performance
 * - Sales visualization
 * 
 * @example
 * ```tsx
 * import { RetailerDashboard } from '@/components/retailers/dashboard';
 * 
 * function RetailerPage() {
 *   return (
 *     <RetailerDashboard 
 *       title="My Store Dashboard"
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { RetailerDashboard } from './RetailerDashboard';

// Sub-components for granular usage
export { MetricsCards } from './MetricsCards';
export { RecentOrders } from './RecentOrders';
export { TopProducts } from './TopProducts';
export { SalesChart } from './SalesChart';
export { InventoryAlerts } from './InventoryAlerts';

// Custom hooks
export { useRetailerDashboard } from './hooks/useRetailerDashboard';

// Feature metadata
export const retailerDashboardFeature = {
  name: 'Retailer Dashboard',
  description: 'Comprehensive retailer analytics and management dashboard',
  version: '1.0.0',
  components: {
    RetailerDashboard: 'Main dashboard component',
    MetricsCards: 'Key performance metrics display',
    RecentOrders: 'Recent orders list',
    TopProducts: 'Best performing products',
    SalesChart: 'Sales visualization',
    InventoryAlerts: 'Low stock notifications'
  },
  hooks: {
    useRetailerDashboard: 'Dashboard data management and state'
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge'],
    icons: ['lucide-react'],
    types: ['@/types/product', '@/types/order']
  }
};

// Default export for convenience
export { RetailerDashboard as default } from './RetailerDashboard';
