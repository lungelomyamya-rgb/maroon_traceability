// src/components/logistics/vehicleManagement/index.ts

/**
 * Vehicle Management Feature Module
 * 
 * This module provides comprehensive vehicle management functionality with:
 * - Vehicle registration and management
 * - Vehicle status tracking and updates
 * - Maintenance scheduling and alerts
 * - Driver assignment and location tracking
 * - Fuel level monitoring
 * - Insurance and registration expiry tracking
 * - Vehicle features and specifications
 * 
 * @example
 * ```tsx
 * import { VehicleManagement } from '@/components/logistics/vehicleManagement';
 * 
 * function LogisticsPage() {
 *   return (
 *     <VehicleManagement 
 *       onVehicleSelect={(vehicle) => console.log('Selected:', vehicle)}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { VehicleManagement } from './VehicleManagement';

// Sub-components for granular usage
export { VehicleList } from './VehicleList';
export { VehicleForm } from './VehicleForm';
export { VehicleDetails } from './VehicleDetails';

// Custom hooks
export { useVehicleManagement } from './hooks/useVehicleManagement';

// Types
export type { Vehicle, NewVehicle } from './hooks/useVehicleManagement';

// Feature metadata
export const vehicleManagementFeature = {
  name: 'Vehicle Management',
  description: 'Comprehensive vehicle fleet management system',
  version: '1.0.0',
  components: {
    VehicleManagement: 'Main vehicle management component',
    VehicleList: 'Vehicle list with filtering and actions',
    VehicleForm: 'Vehicle registration and editing form',
    VehicleDetails: 'Detailed vehicle information modal'
  },
  hooks: {
    useVehicleManagement: 'Vehicle management state management'
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge', '@/components/ui/input', '@/components/ui/textarea', '@/components/ui/select', '@/components/ui/label'],
    icons: ['lucide-react']
  }
};

// Default export for convenience
export { VehicleManagement as default } from './VehicleManagement';
