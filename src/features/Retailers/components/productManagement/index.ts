// src/components/retailers/productManagement/index.ts

/**
 * Product Management Feature Module
 * 
 * This module provides comprehensive product management functionality with:
 * - Product catalog management
 * - Inventory tracking and alerts
 * - Pricing and quality grade management
 * - Sales performance analytics
 * - Customer ratings and reviews
 * - Supplier information tracking
 * - Batch code and quality control
 * - Stock level monitoring
 * 
 * @example
 * ```tsx
 * import { ProductManagement } from '@/features/retailers/components/productManagement';
 * 
 * function RetailerPage() {
 *   return (
 *     <ProductManagement 
 *       onProductSelect={(product) => console.log('Selected:', product)}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { ProductManagement } from './ProductManagement';

// Sub-components for granular usage
export { ProductList } from './ProductList';
export { ProductForm } from './ProductForm';
export { ProductDetails } from './ProductDetails';

// Custom hooks
export { useProductManagement } from './hooks/useProductManagement';

// Types
export type { Product, NewProduct } from './hooks/useProductManagement';

// Feature metadata
export const productManagementFeature = {
  name: 'Product Management',
  description: 'Comprehensive product catalog and inventory management system',
  version: '1.0.0',
  components: {
    ProductManagement: 'Main product management component',
    ProductList: 'Product list with filtering and actions',
    ProductForm: 'Product creation and editing form',
    ProductDetails: 'Detailed product information modal',
  },
  hooks: {
    useProductManagement: 'Product management state management',
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/input', '@/components/ui/textarea', '@/components/ui/select', '@/components/ui/label'],
    icons: ['lucide-react'],
  },
};

// Default export for convenience
export { ProductManagement as default } from './ProductManagement';
