/**
 * @fileoverview Logistics Feature - Transport and logistics management
 * @version 1.0.0
 * @author Maroon Traceability Team
 * @description 
 * Complete logistics management system including driver management, vehicle tracking,
 * transport scheduling, and documentation. All components are responsive, accessible,
 * and include comprehensive TypeScript support with real-time tracking capabilities.
 * 
 * @example
 * ```typescript
 * import { DriverManagement, VehicleManagement, TransportScheduling } from '@/features/logistics';
 * 
 * function App() {
 *   return (
 *     <div>
 *       <DriverManagement onDriverSelect={handleDriverSelect} />
 *       <VehicleManagement onVehicleSelect={handleVehicleSelect} />
 *       <TransportScheduling onSchedule={handleSchedule} />
 *     </div>
 *   );
 * }
 * ```
 */

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

/**
 * Driver management component with tracking and assignment
 * @component DriverManagement
 * @example
 * ```typescript
 * <DriverManagement 
 *   onDriverSelect={handleDriverSelect}
 *   showActiveOnly={false}
 *   allowAssignment={true}
 *   theme="light"
 * />
 * ```
 */
export { DriverManagement } from './components/DriverManagement';
export { EventForm } from './components/EventForm';
export { TransportDocumentation } from './components/TransportDocumentation';
export { TransportScheduling } from './components/transportScheduling';
export { VehicleManagement } from './components/VehicleManagement';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Driver interface for logistics management
 * @interface Driver
 * @property {string} id - Unique driver identifier
 * @property {string} name - Driver's full name
 * @property {string} license - Driver's license number
 * @property {string} phone - Driver's phone number
 * @property {string} email - Driver's email address
 * @property {DriverStatus} status - Current driver status
 * @property {Vehicle[]} assignedVehicles - Assigned vehicles
 * @property {Transport[]} activeTransports - Active transports
 */
export type * from './types/logisticsTypes';

/**
 * Vehicle interface for logistics management
 * @interface Vehicle
 * @property {string} id - Unique vehicle identifier
 * @property {string} make - Vehicle make
 * @property {string} model - Vehicle model
 * @property {string} licensePlate - License plate number
 * @property {VehicleType} type - Vehicle type
 * @property {VehicleStatus} status - Current vehicle status
 * @property {number} capacity - Vehicle capacity
 * @property {Driver[]} assignedDrivers - Assigned drivers
 */
export type * from './types/logisticsTypes';

/**
 * Transport interface for logistics operations
 * @interface Transport
 * @property {string} id - Unique transport identifier
 * @property {string} origin - Transport origin
 * @property {string} destination - Transport destination
 * @property {TransportStatus} status - Transport status
 * @property {Driver} driver - Assigned driver
 * @property {Vehicle} vehicle - Assigned vehicle
 * @property {Date} scheduledDate - Scheduled date
 * @property {Date} estimatedDelivery - Estimated delivery date
 */
export type * from './types/logisticsTypes';

/**
 * Logistics event interface for tracking
 * @interface LogisticsEvent
 * @property {string} id - Unique event identifier
 * @property {string} transportId - Transport reference
 * @property {EventType} type - Event type
 * @property {string} location - Event location
 * @property {Date} timestamp - Event timestamp
 * @property {string} description - Event description
 * @property {Object} metadata - Additional event data
 */
export type * from './types/logisticsInterfaces';

// ============================================================================
// IMPORTS FOR API OBJECT
// ============================================================================

import { DriverManagement } from './components/DriverManagement';
import { EventForm } from './components/EventForm';
import { TransportDocumentation } from './components/TransportDocumentation';
import { TransportScheduling } from './components/transportScheduling';
import { VehicleManagement } from './components/VehicleManagement';
import * as LogisticsInterfaces from './types/logisticsInterfaces';
import * as LogisticsTypes from './types/logisticsTypes';

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Logistics Feature Public API
 * Provides clean, type-safe access to all logistics functionality
 * 
 * @namespace LogisticsAPI
 * @example
 * ```typescript
 * import { logisticsAPI } from '@/features/logistics';
 * 
 * // Use components
 * const { DriverManagement, VehicleManagement, TransportScheduling } = logisticsAPI;
 * 
 * // Render logistics components
 * <DriverManagement />
 * <VehicleManagement />
 * <TransportScheduling />
 * ```
 */
export const logisticsAPI = {
  // Core Components
  DriverManagement,
  EventForm,
  TransportDocumentation,
  TransportScheduling,
  VehicleManagement,
  
  // Types are exported separately for tree-shaking
  types: {
    ...LogisticsTypes,
    ...LogisticsInterfaces,
  },
} as const;

// ============================================================================
// FEATURE METADATA
// ============================================================================

/**
 * Logistics feature metadata
 * @readonly
 * @enum {string}
 */
export const LOGISTICS_FEATURE = {
  /** Feature version */
  VERSION: '1.0.0',
  /** Feature name */
  NAME: 'Logistics',
  /** Feature description */
  DESCRIPTION: 'Transport and logistics management system with driver and vehicle tracking',
  /** Feature dependencies */
  DEPENDENCIES: ['react', 'next', 'typescript', 'date-fns'],
  /** Feature tags */
  TAGS: ['logistics', 'transport', 'tracking', 'scheduling', 'vehicles', 'drivers'],
} as const;

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================

/**
 * Default export - DriverManagement component
 * @default
 * @example
 * ```typescript
 * import DriverManagement from '@/features/logistics';
 * 
 * <DriverManagement />
 * ```
 */
export { DriverManagement as default } from './components/DriverManagement';
