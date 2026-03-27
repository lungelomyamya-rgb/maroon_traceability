// src/components/logistics/transportScheduling/index.ts

/**
 * Transport Scheduling Feature Module
 * 
 * This module provides comprehensive transport scheduling functionality with:
 * - Schedule creation and management
 * - Vehicle and driver assignment
 * - Route planning and tracking
 * - Priority and status management
 * - Special handling requirements
 * 
 * @example
 * ```tsx
 * import { TransportScheduling } from '@/components/logistics/transportScheduling';
 * 
 * function LogisticsPage() {
 *   return (
 *     <TransportScheduling
 *       onScheduleSelect={(schedule) => console.log(schedule)}
 *       vehicles={vehicles}
 *       drivers={drivers}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { TransportScheduling } from './TransportScheduling';

// Sub-components for granular usage
export { ScheduleHeader } from './ScheduleHeader';
export { ScheduleForm } from './ScheduleForm';
export { ScheduleCard } from './ScheduleCard';
export { ScheduleList } from './ScheduleList';

// Custom hooks
export { useScheduling } from './hooks/useScheduling';

// Types re-exported for convenience
export type { 
  TransportSchedule, 
  Vehicle, 
  Driver,
  TransportStatus 
} from '@/types/logistics';

// Feature metadata
export const transportSchedulingFeature = {
  name: 'Transport Scheduling',
  description: 'Comprehensive transport scheduling and management system',
  version: '1.0.0',
  components: {
    TransportScheduling: 'Main scheduling component',
    ScheduleHeader: 'Header with add button',
    ScheduleForm: 'Form for creating/editing schedules',
    ScheduleCard: 'Individual schedule display card',
    ScheduleList: 'List of schedule cards'
  },
  hooks: {
    useScheduling: 'Schedule management logic and state'
  },
  dependencies: {
    ui: ['@/components/ui/card', '@/components/ui/button', '@/components/ui/badge'],
    icons: ['lucide-react'],
    types: ['@/types/logistics'],
    data: ['@/constants/logisticsMockData']
  }
};

// Default export for convenience
export { TransportScheduling as default } from './TransportScheduling';
