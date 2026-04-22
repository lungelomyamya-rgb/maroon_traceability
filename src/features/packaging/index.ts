/**
 * @fileoverview Packaging Feature - Batch processing and inventory management
 * @version 1.0.0
 * @author Maroon Traceability Team
 * @description
 * Complete packaging system including batch processing, inventory management, quality control,
 * and QR code generation. All components are responsive, accessible, and include comprehensive
 * TypeScript support with real-time monitoring and reporting capabilities.
 *
 * @example
 * ```typescript
 * import { PackagingDashboard, BatchProcessing, Inventory } from '@/features/packaging';
 *
 * function App() {
 *   return (
 *     <div>
 *       <PackagingDashboard />
 *       <BatchProcessing />
 *       <Inventory />
 *     </div>
 *   );
 * }
 * ```
 */

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

/**
 * Packaging dashboard component with analytics and monitoring
 * @component PackagingDashboard
 * @example
 * ```typescript
 * <PackagingDashboard
 *   showAnalytics={true}
 *   showReports={true}
 *   dateRange={dateRange}
 *   theme="light"
 * />
 * ```
 */
import { PackagingDashboard as DashboardComp } from './components/PackagingDashboard';
import { PackagingEventForm as EventFormComp } from './components/PackagingEventForm';
import { BatchProcessing as BatchComp } from './components/batchProcessing';
/* eslint-disable import/order */
import { PackagingInventory as InventoryComp } from './components/inventory';

/* ============================================================================
   TYPE EXPORTS
   ============================================================================ */

/**
 * Packaging record interface for batch tracking
 * @interface PackagingRecord
 * @property {string} id - Unique record identifier
 * @property {string} batchNumber - Batch number
 * @property {string} productId - Product reference
 * @property {PackagingStatus} status - Packaging status
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {string} operator - Operator name
 * @property {Object} metadata - Additional record data
 */
export type * from './types/packagingTypes';

/**
 * Batch processing interface for workflow management
 * @interface BatchProcess
 * @property {string} id - Unique process identifier
 * @property {string} batchNumber - Batch number
 * @property {BatchStatus} status - Current batch status
 * @property {number} progress - Progress percentage (0-100)
 * @property {Date} startTime - Process start time
 * @property {Date} endTime - Process end time
 * @property {string} operator - Operator name
 * @property {Object} qualityChecks - Quality check results
 */
export type * from './types/packagingTypes';

/**
 * Inventory item interface for stock management
 * @interface InventoryItem
 * @property {string} id - Unique item identifier
 * @property {string} productId - Product reference
 * @property {string} batchNumber - Batch number
 * @property {number} quantity - Current quantity
 * @property {number} minStock - Minimum stock level
 * @property {number} maxStock - Maximum stock level
 * @property {string} location - Storage location
 * @property {Date} lastUpdated - Last update timestamp
 */
export type * from './types/packagingTypes';

/**
 * Quality check interface for quality control
 * @interface QualityCheck
 * @property {string} id - Unique check identifier
 * @property {string} type - Check type
 * @property {boolean} passed - Whether check passed
 * @property {string} result - Check result
 * @property {string} inspector - Inspector name
 * @property {Date} timestamp - Check timestamp
 * @property {Object} criteria - Check criteria
 */
export type * from './types/packagingTypes';

/* ============================================================================
   IMPORTS FOR API OBJECT
   ============================================================================ */

import * as PackagingTypes from './types/packagingTypes';

/* ============================================================================
   PUBLIC API
   ============================================================================ */

/**
 * Packaging Feature Public API
 * Provides clean, type-safe access to all packaging functionality
 *
 * @namespace PackagingAPI
 * @example
 * ```typescript
 * import { packagingAPI } from '@/features/packaging';
 *
 * // Use components
 * const { PackagingDashboard, BatchProcessing, Inventory } = packagingAPI;
 *
 * // Render packaging components
 * <PackagingDashboard />
 * <BatchProcessing />
 * <Inventory />
 * ```
 */
export const packagingAPI = {
  // Core Components
  DashboardComp,
  EventFormComp,
  BatchComp,
  InventoryComp,

  // Types are exported separately for tree-shaking
  types: PackagingTypes,
} as const;

/* ============================================================================
   FEATURE METADATA
   ============================================================================ */

/**
 * Packaging feature metadata
 * @readonly
 * @enum {string}
 */
export const PACKAGING_FEATURE = {
  /** Feature version */
  VERSION: '1.0.0',
  /** Feature name */
  NAME: 'Packaging',
  /** Feature description */
  DESCRIPTION: 'Batch processing and inventory management system with quality control',
  /** Feature dependencies */
  DEPENDENCIES: ['react', 'next', 'typescript', 'date-fns'],
  /** Feature tags */
  TAGS: ['packaging', 'batch-processing', 'inventory', 'quality-control', 'qr-code'],
} as const;

/* ============================================================================
   RE-EXPORTS FOR CONVENIENCE
   ============================================================================ */

/**
 * Default export - PackagingDashboard component
 * @default
 * @example
 * ```typescript
 * import PackagingDashboard from '@/features/packaging';
 *
 * <PackagingDashboard />
 * ```
 */
export { PackagingDashboard as default } from './components/PackagingDashboard';
export { BatchProcessing } from './components/batchProcessing';

