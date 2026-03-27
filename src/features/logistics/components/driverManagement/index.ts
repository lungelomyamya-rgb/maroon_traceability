// src/components/logistics/driverManagement/index.ts

/**
 * Driver Management Feature Module
 * 
 * This module provides comprehensive driver management functionality with:
 * - Driver list with filtering and status tracking
 * - Driver form for adding and editing drivers
 * - Driver details with comprehensive information
 * - License expiry alerts and certification tracking
 * - Vehicle assignment and status management
 * 
 * @example
 * ```tsx
 * import { DriverManagement } from '@/components/logistics/driverManagement';
 * 
 * function DriverPage() {
 *   return (
 *     <DriverManagement 
 *       onDriverSelect={(driver) => console.log('Selected:', driver)}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { DriverManagement } from './DriverManagement';

// Sub-components for granular usage
export { DriverList } from './DriverList';
export { DriverForm } from './DriverForm';
export { DriverDetails } from './DriverDetails';

// Custom hooks
export { useDriverManagement } from './hooks/useDriverManagement';

// Types
export type { Driver, NewDriver } from './hooks/useDriverManagement';

// Feature metadata
export const driverManagementFeature = {
  name: 'Driver Management',
  description: 'Comprehensive driver management system',
  version: '1.0.0',
  components: {
    DriverManagement: 'Main driver management component',
    DriverList: 'Driver directory with status tracking',
    DriverForm: 'Driver creation and editing form',
    DriverDetails: 'Detailed driver information view'
  },
  hooks: {
    useDriverManagement: 'Driver data management and state'
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/input', '@/components/ui/textarea'],
    icons: ['lucide-react'],
    types: ['@/types/logistics']
  }
};

// Default export for convenience
export { DriverManagement as default } from './DriverManagement';
