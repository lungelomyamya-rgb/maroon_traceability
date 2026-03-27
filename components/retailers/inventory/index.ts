// src/components/retailers/inventory/index.ts

/**
 * Inventory Management Feature Module
 * 
 * This module provides comprehensive inventory management functionality with:
 * - Real-time stock tracking and monitoring
 * - Low stock and out-of-stock alerts
 * - Expiry date tracking and notifications
 * - Reorder recommendations and automation
 * - Sales velocity analysis and forecasting
 * - Multi-location inventory management
 * - Quality grade tracking
 * - Financial analysis and reporting
 * - Supplier and batch code management
 * 
 * @example
 * ```tsx
 * import { Inventory } from '@/components/retailers/inventory';
 * 
 * function RetailerPage() {
 *   return (
 *     <Inventory 
 *       onItemSelect={(item) => console.log('Selected:', item)}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { Inventory } from './Inventory';

// Sub-components for granular usage
export { InventoryOverview } from './InventoryOverview';
export { InventoryList } from './InventoryList';
export { InventoryDetails } from './InventoryDetails';

// Custom hooks
export { useInventory } from './hooks/useInventory';

// Types
export type { InventoryItem } from './hooks/useInventory';

// Feature metadata
export const inventoryFeature = {
  name: 'Inventory Management',
  description: 'Comprehensive inventory tracking and management system',
  version: '1.0.0',
  components: {
    Inventory: 'Main inventory management component',
    InventoryOverview: 'Inventory overview with key metrics',
    InventoryList: 'Inventory list with filtering and actions',
    InventoryDetails: 'Detailed item information modal'
  },
  hooks: {
    useInventory: 'Inventory state management and calculations'
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/input', '@/components/ui/select'],
    icons: ['lucide-react']
  }
};

// Default export for convenience
export { Inventory as default } from './Inventory';
