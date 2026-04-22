// src/core/types/adapter.ts
// Core adapter interface definitions for hybrid data architecture

import type { UniversalUser, UserRole } from '@/types/types';
export { UserRole, UniversalUser };

/**
 * Base result interface for all adapter operations
 */
export interface AdapterResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Base adapter interface that all specific adapters must extend
 */
export interface BaseAdapter<_TInput = unknown, _TOutput = unknown> {
  /** Adapter identifier */
  readonly id: string;
  /** Adapter type (mock, real, hybrid) */
  readonly type: 'mock' | 'real' | 'hybrid';
  /** Whether adapter is currently available */
  readonly isAvailable: boolean;
  /** Initialize adapter */
  initialize(): Promise<void>;
  /** Cleanup adapter resources */
  cleanup(): Promise<void>;
}

/**
 * Authentication-specific adapter interface
 */
export interface AuthAdapter extends BaseAdapter {
  /** Authenticate user with email and password */
  login(email: string, password: string): Promise<AdapterResult<UniversalUser>>;
  /** Register new user */
  register(userData: RegistrationData): Promise<AdapterResult<UniversalUser>>;
  /** Logout current user */
  logout(): Promise<AdapterResult<void>>;
  /** Get current authenticated user */
  getCurrentUser(): Promise<AdapterResult<UniversalUser | null>>;
  /** Refresh authentication token */
  refreshToken(): Promise<AdapterResult<string>>;
  /** Reset password */
  resetPassword(email: string): Promise<AdapterResult<void>>;
}

/**
 * Registration-specific adapter interface
 */
export interface RegistrationAdapter extends BaseAdapter {
  /** Create new user account */
  createUser(userData: RegistrationData): Promise<AdapterResult<AuthUser>>;
  /** Verify user email */
  verifyEmail(token: string): Promise<AdapterResult<void>>;
  /** Check if email is available */
  checkEmailAvailability(email: string): Promise<AdapterResult<boolean>>;
  /** Send verification email */
  sendVerificationEmail(email: string): Promise<AdapterResult<void>>;
}

/**
 * Blockchain-specific adapter interface
 */
export interface BlockchainAdapter extends BaseAdapter {
  /** Create product record on blockchain */
  createProductRecord(
    product: Record<string, unknown>,
    farmerName: string,
    farmerAddress: string
  ): Promise<AdapterResult<BlockchainRecord>>;
  /** Get product history from blockchain */
  getProductHistory(productId: string): Promise<AdapterResult<BlockchainRecord[]>>;
  /** Verify product on blockchain */
  verifyProduct(
    productId: string,
    verifierName: string,
    verifierAddress: string
  ): Promise<AdapterResult<VerificationResult>>;
  /** Transfer product ownership */
  transferOwnership(
    productId: string,
    fromAddress: string,
    toAddress: string,
    transferData: Record<string, unknown>
  ): Promise<AdapterResult<TransactionResult>>;
  /** Get transaction details */
  getTransaction(transactionHash: string): Promise<AdapterResult<TransactionResult>>;
  /** Get blockchain status */
  getBlockchainStatus(): Promise<AdapterResult<BlockchainStatus>>;
  /** Get account balance */
  getAccountBalance(address: string): Promise<AdapterResult<string>>;
}

/**
 * Blockchain record interface
 */
export interface BlockchainRecord {
  id: string;
  productName: string;
  description: string;
  category: string;
  farmer: string;
  farmerAddress: string;
  location: string;
  harvestDate: string;
  certifications: string[];
  batchSize: number;
  photos: string[];
  blockHash: string;
  timestamp: number;
  status: 'Certified' | 'Pending' | 'Rejected';
  txHash: string;
  verified: boolean;
  verifications: number;
  transactionFee: string;
}

/**
 * Transaction result interface
 */
export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  blockHash?: string;
  gasUsed?: string;
  blockNumber?: number;
  confirmations?: number;
  error?: string;
}

/**
 * Verification result interface
 */
export interface VerificationResult {
  success: boolean;
  newVerificationCount: number;
  timestamp: string;
  verifiedBy: string;
  transactionHash?: string;
  verificationScore?: number;
}

/**
 * Blockchain status interface
 */
export interface BlockchainStatus {
  network: string;
  blockNumber: number;
  gasPrice: string;
  isConnected: boolean;
  contractAddress?: string;
  lastBlockTime?: number;
}

/**
 * Data adapter interface for CRUD operations
 */
export interface DataAdapter<T = unknown> extends BaseAdapter {
  /** Create new record */
  create(data: Partial<T>): Promise<AdapterResult<T>>;
  /** Read record by ID */
  read(id: string): Promise<AdapterResult<T | null>>;
  /** Update record */
  update(id: string, data: Partial<T>): Promise<AdapterResult<T>>;
  /** Delete record */
  delete(id: string): Promise<AdapterResult<void>>;
  /** List records with optional filtering */
  list(filters?: Record<string, unknown>): Promise<AdapterResult<T[]>>;
  /** Search records */
  search(query: string, options?: SearchOptions): Promise<AdapterResult<T[]>>;
}

/**
 * Configuration for adapter operations
 */
export interface AdapterConfig {
  /** Adapter type */
  type: 'mock' | 'real' | 'hybrid' | 'memory' | 'indexeddb';
  /** Adapter name */
  name?: string;
  /** Feature this adapter serves */
  feature?: string;
  /** Priority for adapter selection */
  priority?: number;
  /** Whether adapter is active */
  isActive?: boolean;
  /** Timeout for operations in milliseconds */
  timeout?: number;
  /** Retry attempts for failed operations */
  retryAttempts?: number;
  /** Whether to cache results */
  enableCache?: boolean;
  /** Custom configuration options */
  options?: Record<string, unknown>;
  /** Feature-specific configuration */
  featureConfig?: Record<string, boolean>;
  /** Base URL for real adapters */
  baseUrl?: string;
  /** RPC URL for blockchain adapters */
  rpcUrl?: string;
  /** Network name for blockchain adapters */
  network?: string;
  /** Contract address for blockchain adapters */
  contractAddress?: string;
  /** Gas price for blockchain adapters */
  gasPrice?: string;
  /** Block time for simulated blockchain adapters */
  blockTime?: number;
  /** Endpoint for analytics adapters */
  endpoint?: string;
}

/**
 * Search options for data adapters
 */
export interface SearchOptions {
  /** Fields to search in */
  fields?: string[];
  /** Limit results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Sort order */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Authentication user data - imported from unified types
 */
export type AuthUser = import('@/types/types').AuthUser;


/**
 * User registration data
 */
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  additionalData?: Record<string, unknown>;
}

/**
 * User roles enumeration
 * Import from unified types to ensure consistency
 */

/**
 * Adapter factory interface for creating adapters
 */
export interface AdapterFactory {
  /** Create adapter by type and name */
  create<T extends BaseAdapter>(type: string, name: string, config?: AdapterConfig): Promise<T>;
  /** Register adapter implementation */
  register<T extends BaseAdapter>(type: string, name: string, implementation: new (config?: AdapterConfig) => T): void;
  /** Get available adapters */
  getAvailableAdapters(): Record<string, string[]>;
}

/**
 * Data source configuration
 */
export interface DataSourceConfig {
  /** Data source name */
  name: string;
  /** Data source type */
  type: 'mock' | 'real' | 'hybrid';
  /** Priority for hybrid sources */
  priority?: number;
  /** Whether this source is active */
  active: boolean;
  /** Configuration options */
  config: AdapterConfig;
}

/**
 * Hybrid adapter configuration
 */
export interface HybridAdapterConfig extends AdapterConfig {
  /** Primary adapter to use */
  primaryAdapter: string;
  /** Fallback adapter to use */
  fallbackAdapter?: string;
  /** Whether to failover automatically */
  autoFailover: boolean;
  /** Health check interval in milliseconds */
  healthCheckInterval?: number;
}
