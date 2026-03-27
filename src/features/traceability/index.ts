/**
 * @fileoverview Traceability Feature - Blockchain-based product tracking
 * @version 1.0.0
 * @author Maroon Traceability Team
 * @description 
 * Complete traceability system including blockchain integration, QR code scanning,
 * product event tracking, and timeline visualization. All components are responsive,
 * accessible, and include comprehensive TypeScript support with real-time updates.
 * 
 * @example
 * ```typescript
 * import { Timeline, useTraceability, Product } from '@/features/traceability';
 * 
 * function App() {
 *   const { events, loading, error, scanQRCode } = useTraceability();
 *   
 *   return (
 *     <Timeline 
 *       events={events}
 *       onEventClick={handleEventClick}
 *       showActions={true}
 *       compact={false}
 *     />
 *   );
 * }
 * ```
 */

// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

/**
 * Interactive timeline component for product traceability
 * @component Timeline
 * @example
 * ```typescript
 * <Timeline 
 *   events={traceabilityEvents}
 *   onEventClick={handleEventClick}
 *   showActions={true}
 *   compact={false}
 *   theme="light"
 * />
 * ```
 */
export { Timeline, DashboardTimeline } from './components/Timeline';

// ============================================================================
// HOOK EXPORTS
// ============================================================================

/**
 * Traceability management hook with blockchain integration
 * @hook useTraceability
 * @returns {Object} Traceability state and management functions
 * @example
 * ```typescript
 * const { 
 *   events, 
 *   loading, 
 *   error, 
 *   currentProduct,
 *   scanQRCode, 
 *   fetchTraceabilityData,
 *   clearError,
 *   resetTraceability
 * } = useTraceability('product-123');
 * ```
 */
export { useTraceability } from './hooks/useTraceability';

/**
 * Traceability state interface for traceability hook
 * @interface TraceabilityState
 * @property {ProductEvent[]} events - Array of product events
 * @property {boolean} loading - Loading state for traceability operations
 * @property {string | null} error - Traceability error message
 * @property {Product | null} currentProduct - Currently tracked product
 */
export type { TraceabilityState } from './hooks/useTraceability';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Product interface for traceability system
 * @interface Product
 * @property {string} id - Unique product identifier
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {string} category - Product category
 * @property {number} price - Product price
 * @property {string[]} images - Product image URLs
 * @property {Object} farmer - Farmer information
 * @property {string} qrCode - QR code for product tracking
 * @property {Date} createdAt - Product creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export type { Product } from './types/traceabilityTypes';

/**
 * Product event interface for tracking product lifecycle
 * @interface ProductEvent
 * @property {string} id - Unique event identifier
 * @property {string} productId - Reference to product
 * @property {ProductEventType} type - Type of event (harvest, processing, etc.)
 * @property {Date} timestamp - Event timestamp
 * @property {string} location - Event location
 * @property {string} description - Event description
 * @property {Record<string, unknown>} metadata - Additional event data
 * @property {boolean} verified - Whether event is verified
 * @property {string} blockchainHash - Blockchain transaction hash
 */
export type { ProductEvent } from './types/traceabilityTypes';

/**
 * Traceability query interface for searching products
 * @interface TraceabilityQuery
 * @property {string} productId - Product identifier to search
 * @property {string} qrCode - QR code to scan
 * @property {string} batchNumber - Batch number to search
 * @property {DateRange} dateRange - Date range for events
 */
export type { TraceabilityQuery } from './types/traceabilityTypes';

/**
 * Traceability response interface for API responses
 * @interface TraceabilityResponse
 * @property {Product} product - Product information
 * @property {ProductEvent[]} events - Product events
 * @property {VerificationStatus} verificationStatus - Verification status
 * @property {boolean} blockchainVerified - Blockchain verification status
 */
export type { TraceabilityResponse } from './types/traceabilityTypes';

/**
 * Blockchain transaction interface for traceability
 * @interface BlockchainTransaction
 * @property {string} hash - Transaction hash
 * @property {string} from - Sender address
 * @property {string} to - Recipient address
 * @property {string} value - Transaction value
 * @property {number} timestamp - Transaction timestamp
 * @property {TransactionStatus} status - Transaction status
 * @property {number} blockNumber - Block number
 * @property {number} gasUsed - Gas used for transaction
 * @property {number} transactionFee - Transaction fee
 * @property {number} verifications - Number of verifications
 * @property {string} description - Transaction description
 */
export type { BlockchainTransaction } from './types/traceabilityTypes';

/**
 * Transaction response interface for blockchain operations
 * @interface TransactionResponse
 * @property {boolean} success - Whether transaction succeeded
 * @property {string} txHash - Transaction hash
 * @property {string} error - Error message if failed
 */
export type { TransactionResponse } from './types/traceabilityTypes';

/**
 * Send transaction parameters interface
 * @interface SendTransactionParams
 * @property {string} method - Method to call
 * @property {unknown[]} params - Method parameters
 */
export type { SendTransactionParams } from './types/traceabilityTypes';

/**
 * Blockchain event interface for event tracking
 * @interface BlockchainEvent
 * @property {string} type - Event type
 * @property {Record<string, unknown>} data - Event data
 * @property {number} timestamp - Event timestamp
 */
export type { BlockchainEvent } from './types/traceabilityTypes';

// ============================================================================
// IMPORTS FOR API OBJECT
// ============================================================================

import { Timeline, DashboardTimeline } from './components/Timeline';
import { useTraceability } from './hooks/useTraceability';
import type { TraceabilityState } from './hooks/useTraceability';
import type {
  Product,
  ProductEvent,
  TraceabilityQuery,
  TraceabilityResponse,
  BlockchainTransaction,
  TransactionResponse,
  SendTransactionParams,
  BlockchainEvent
} from './types/traceabilityTypes';

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Traceability Feature Public API
 * Provides clean, type-safe access to all traceability functionality
 * 
 * @namespace TraceabilityAPI
 * @example
 * ```typescript
 * import { traceabilityAPI } from '@/features/traceability';
 * 
 * // Use components and hooks
 * const { Timeline, useTraceability, Product } = traceabilityAPI;
 * 
 * // Render traceability timeline
 * <Timeline events={events} />
 * ```
 */
export const traceabilityAPI = {
  // Core Components
  Timeline,
  DashboardTimeline,
  
  // Hooks
  useTraceability,
  
  // Types are exported separately for tree-shaking
} as const;

// ============================================================================
// FEATURE METADATA
// ============================================================================

/**
 * Traceability feature metadata
 * @readonly
 * @enum {string}
 */
export const TRACEABILITY_FEATURE = {
  /** Feature version */
  VERSION: '1.0.0',
  /** Feature name */
  NAME: 'Traceability',
  /** Feature description */
  DESCRIPTION: 'Blockchain-based product tracking and traceability system with QR scanning',
  /** Feature dependencies */
  DEPENDENCIES: ['react', 'next', 'typescript', 'web3'],
  /** Feature tags */
  TAGS: ['traceability', 'blockchain', 'qr-code', 'tracking', 'supply-chain', 'verification'],
} as const;

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================

/**
 * Default export - Timeline component
 * @default
 * @example
 * ```typescript
 * import Timeline from '@/features/traceability';
 * 
 * <Timeline events={events} />
 * ```
 */
export { Timeline as default } from './components/Timeline';
