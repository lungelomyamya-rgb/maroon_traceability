// src/components/retailers/orders/index.ts

/**
 * Order Management Feature Module
 * 
 * This module provides comprehensive order management functionality with:
 * - Real-time order tracking and status management
 * - Payment status monitoring and collection
 * - Shipping and tracking information management
 * - Customer order history and analytics
 * - Order fulfillment workflow automation
 * - Multi-channel order processing
 * - Revenue and performance analytics
 * - Customer communication and notifications
 * 
 * @example
 * ```tsx
 * import { Orders } from '@/features/retailers/components/orders';
 * 
 * function RetailerPage() {
 *   return (
 *     <Orders 
 *       onOrderSelect={(order) => console.log('Selected:', order)}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { Orders } from './Orders';

// Sub-components for granular usage
export { OrdersOverview } from './OrdersOverview';
export { OrdersList } from './OrdersList';
export { OrderDetails } from './OrderDetails';

// Custom hooks
export { useOrders } from './hooks/useOrders';

// Types
export type { Order, OrderItem } from './hooks/useOrders';

// Feature metadata
export const ordersFeature = {
  name: 'Order Management',
  description: 'Comprehensive order processing and fulfillment system',
  version: '1.0.0',
  components: {
    Orders: 'Main order management component',
    OrdersOverview: 'Order overview with key metrics',
    OrdersList: 'Order list with filtering and actions',
    OrderDetails: 'Detailed order information modal'
  },
  hooks: {
    useOrders: 'Order state management and calculations'
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/input', '@/components/ui/label', '@/components/ui/select'],
    icons: ['lucide-react']
  }
};

// Default export for convenience
export { Orders as default } from './Orders';
