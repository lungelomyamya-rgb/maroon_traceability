// src/components/farmer/fertiliserLog/index.ts

/**
 * Fertiliser Log Module
 * 
 * This barrel file exports all fertiliser log components and utilities.
 * The component has been refactored from a 416-line monolithic structure
 * into smaller, focused components with proper separation of concerns.
 * 
 * @example
 * ```tsx
 * // Import the main component
 * import { FertiliserLog } from './fertiliserLog';
 * 
 * // Import individual components
 * import { 
 *   FertiliserLog,
 *   FertiliserOverview,
 *   FertiliserList,
 *   FertiliserForm,
 *   useFertiliserLog
 * } from './fertiliserLog';
 * ```
 */

// Main component
export { FertiliserLog } from './FertiliserLog';

// Sub-components for granular usage
export { FertiliserOverview } from './FertiliserOverview';
export { FertiliserList } from './FertiliserList';
export { FertiliserForm } from './FertiliserForm';

// Custom hook
export { useFertiliserLog } from './hooks/useFertiliserLog';

// Types
export type { 
  FertiliserApplication,
  NewFertiliserApplication,
  FertiliserLogState,
  FertiliserLogActions,
  FertiliserLogComputed
} from './hooks/useFertiliserLog';

// Feature metadata
export const fertiliserLogFeature = {
  name: 'Fertiliser Application Management',
  description: 'Comprehensive fertilizer application tracking and management system',
  version: '1.0.0',
  refactored: true,
  originalLines: 416,
  newMainLines: 159,
  reduction: '61.8%',
  components: [
    'FertiliserLog (159 lines) - Main orchestrator',
    'FertiliserOverview (372 lines) - Metrics and stats dashboard',
    'FertiliserList (318 lines) - Application list with filtering',
    'FertiliserForm (278 lines) - Application creation form',
    'useFertiliserLog (410 lines) - Business logic hook'
  ],
  benefits: [
    'Separation of concerns - UI and business logic separated',
    'Reusable components - Each sub-component can be used independently',
    'Better testing - Isolated logic and UI components',
    'Enhanced maintainability - Smaller, focused files',
    'Type safety - Comprehensive TypeScript interfaces',
    'Performance - Optimized re-renders and state management',
    'Fertilizer tracking - Complete application tracking system',
    'NPK ratio analysis - Nutrient management',
    'Safety precautions - Safety tracking and compliance',
    'Organic vs conventional - Organic farming support',
    'Application methods - Multiple application method support',
    'Weather and soil data - Environmental condition tracking',
    'Search and filtering - Advanced filtering capabilities',
    'Modal dialogs - Clean modal management',
    'Statistics dashboard - Comprehensive analytics'
  ]
};

// Default export for convenience
export { FertiliserLog as default } from './FertiliserLog';
