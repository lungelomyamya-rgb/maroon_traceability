// src/core/types/registry.ts
// Registry system type definitions

/**
 * Registry item status
 */
export type RegistryItemStatus = 'active' | 'inactive' | 'error' | 'unknown';

/**
 * Registry item type
 */
export type RegistryItemType = 'adapter' | 'service' | 'repository' | 'component';

/**
 * Base registry item
 */
export interface BaseRegistryItem {
  /** Item name */
  name: string;
  /** Item type */
  type: RegistryItemType;
  /** Item status */
  status: RegistryItemStatus;
  /** Feature this item belongs to */
  feature: string;
  /** Item priority */
  priority: number;
  /** Registration timestamp */
  registeredAt: Date;
  /** Last updated timestamp */
  updatedAt: Date;
  /** Item metadata */
  metadata: Record<string, unknown>;
}

/**
 * Registry query options
 */
export interface RegistryQueryOptions {
  /** Filter by type */
  type?: RegistryItemType;
  /** Filter by feature */
  feature?: string;
  /** Filter by status */
  status?: RegistryItemStatus;
  /** Sort by field */
  sortBy?: 'name' | 'priority' | 'registeredAt' | 'updatedAt';
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Limit results */
  limit?: number;
  /** Offset results */
  offset?: number;
}

/**
 * Registry query result
 */
export interface RegistryQueryResult<T> {
  /** Query results */
  items: T[];
  /** Total count */
  total: number;
  /** Query options used */
  options: RegistryQueryOptions;
  /** Query execution time */
  executionTime: number;
}

/**
 * Registry statistics
 */
export interface RegistryStatistics {
  /** Total items */
  totalItems: number;
  /** Items by type */
  itemsByType: Record<RegistryItemType, number>;
  /** Items by status */
  itemsByStatus: Record<RegistryItemStatus, number>;
  /** Items by feature */
  itemsByFeature: Record<string, number>;
  /** Health statistics */
  healthStats: {
    healthyItems: number;
    unhealthyItems: number;
    unknownItems: number;
    overallHealth: 'healthy' | 'degraded' | 'unhealthy';
  };
  /** Performance statistics */
  performanceStats: {
    averageResponseTime: number;
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    errorRate: number;
  };
}

/**
 * Registry event types
 */
export type RegistryEventType =
  | 'item-registered'
  | 'item-unregistered'
  | 'item-updated'
  | 'health-check'
  | 'cleanup'
  | 'error';

/**
 * Registry event
 */
export interface RegistryEvent {
  /** Event type */
  type: RegistryEventType;
  /** Event timestamp */
  timestamp: Date;
  /** Item name */
  itemName?: string;
  /** Item type */
  itemType?: RegistryItemType;
  /** Event data */
  data: Record<string, unknown>;
  /** Event severity */
  severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Registry configuration
 */
export interface RegistryConfig {
  /** Health check interval in milliseconds */
  healthCheckInterval: number;
  /** Cleanup interval in milliseconds */
  cleanupInterval: number;
  /** Enable debug logging */
  enableDebugLogging: boolean;
  /** Enable metrics collection */
  enableMetrics: boolean;
  /** Maximum item age before cleanup */
  maxItemAge: number;
  /** Enable event emission */
  enableEvents: boolean;
}

/**
 * Registry health check result
 */
export interface RegistryHealthCheckResult {
  /** Overall health */
  isHealthy: boolean;
  /** Check timestamp */
  timestamp: Date;
  /** Total items checked */
  totalItems: number;
  /** Healthy items */
  healthyItems: number;
  /** Unhealthy items */
  unhealthyItems: number;
  /** Check duration */
  duration: number;
  /** Issues found */
  issues: RegistryHealthIssue[];
}

/**
 * Registry health issue
 */
export interface RegistryHealthIssue {
  /** Issue severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Issue type */
  type: string;
  /** Item name */
  itemName: string;
  /** Issue description */
  description: string;
  /** Suggested fix */
  suggestedFix?: string;
  /** Issue timestamp */
  timestamp: Date;
}

/**
 * Registry cleanup result
 */
export interface RegistryCleanupResult {
  /** Cleanup timestamp */
  timestamp: Date;
  /** Items cleaned up */
  itemsCleaned: number;
  /** Space freed (bytes) */
  spaceFreed: number;
  /** Cleanup duration */
  duration: number;
  /** Items that could not be cleaned */
  failedCleanups: Array<{
    itemName: string;
    reason: string;
  }>;
}

/**
 * Registry backup configuration
 */
export interface RegistryBackupConfig {
  /** Enable automatic backups */
  enabled: boolean;
  /** Backup interval in milliseconds */
  interval: number;
  /** Backup retention period */
  retentionPeriod: number;
  /** Backup location */
  location: string;
  /** Compression enabled */
  compression: boolean;
  /** Encryption enabled */
  encryption: boolean;
}

/**
 * Registry backup result
 */
export interface RegistryBackupResult {
  /** Backup timestamp */
  timestamp: number;
  /** Backup file path */
  filePath: string;
  /** Items backed up */
  itemsBackedUp: number;
  /** Backup size (bytes) */
  backupSize: number;
  /** Backup duration */
  duration: number;
  /** Backup successful */
  success: boolean;
  /** Error if backup failed */
  error?: string;
}

/**
 * Registry restore result
 */
export interface RegistryRestoreResult {
  /** Restore timestamp */
  timestamp: number;
  /** Backup file path */
  backupPath: string;
  /** Items restored */
  itemsRestored: number;
  /** Items skipped */
  itemsSkipped: number;
  /** Restore duration */
  duration: number;
  /** Restore successful */
  success: boolean;
  /** Error if restore failed */
  error?: string;
  /** Warnings during restore */
  warnings?: string[];
}
