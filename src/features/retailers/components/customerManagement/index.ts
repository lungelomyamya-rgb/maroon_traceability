// src/components/retailers/customerManagement/index.ts

/**
 * Customer Management Feature Module
 *
 * This module provides comprehensive customer management functionality with:
 * - Customer metrics and analytics
 * - Customer directory with filtering
 * - Customer details and communication
 * - Loyalty tier management
 * - Communication tools
 *
 * @example
 * ```tsx
 * import { CustomerManagement } from '@/features/retailers/components/customerManagement';
 *
 * function CustomersPage() {
 *   return (
 *     <CustomerManagement
 *       title="Customer Relationship Management"
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { CustomerManagement } from './CustomerManagement';

// Sub-components for granular usage
export { CustomerList } from './CustomerList';
export { CustomerDetails } from './CustomerDetails';
export { CommunicationForm } from './CommunicationForm';

// Custom hooks
export { useCustomerManagement } from './hooks/useCustomerManagement';

// Types
export type { Customer, CustomerMetrics, CommunicationMessage } from './hooks/useCustomerManagement';

// Feature metadata
export const customerManagementFeature = {
  name: 'Customer Management',
  description: 'Comprehensive customer relationship management system',
  version: '1.0.0',
  components: {
    CustomerManagement: 'Main customer management component',
    CustomerList: 'Customer directory with filtering',
    CustomerDetails: 'Detailed customer view',
    CommunicationForm: 'Customer communication form',
  },
  hooks: {
    useCustomerManagement: 'Customer data management and state',
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/input', '@/components/ui/select', '@/components/ui/textarea'],
    icons: ['lucide-react'],
    types: ['@/types/customer', '@/types/communication'],
  },
};

// Default export for convenience
export { CustomerManagement as default } from './CustomerManagement';
