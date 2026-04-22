// src/types/types/user.ts
// Unified User interface architecture for type robustness

import { LucideIcon, Briefcase, Shield, UserCheck, Users, Package, Truck, Eye } from 'lucide-react';
// Import domain-specific extensions
import type {
  FarmInfo,
  InspectionInfo,
  LogisticsInfo,
  PackagingInfo,
  RetailInfo,
  MarketplaceInfo,
  BlockchainInfo,
  AuditTrail,
  NotificationPreferences,
  SecuritySettings,
  SubscriptionInfo,
  PrivacySettings,
  UserAccountStatus,
  Profile,
} from './user-domain-extensions';

export const USER_ROLES = [
  'farmer',
  'inspector',
  'logistics',
  'packaging',
  'retailer',
  'public',
  'government',
  'admin',
  'saps',
  'viewer',
] as const;

export type UserRole = typeof USER_ROLES[number];
export type RoleIcon = string | LucideIcon;

// Color constants for user avatars and status
export const USER_AVATAR_COLORS: Record<string, string> = {
  admin: '#ef4444',
  government: '#3b82f6',
  farmer: '#22c55e',
  inspector: '#f59e0b',
  logistics: '#8b5cf6',
  packaging: '#06b6d4',
  retailer: '#ec4899',
  public: '#6b7280',
  saps: '#dc2626',
};

export const USER_STATUS_COLORS = {
  active: '#22c55e',
  inactive: '#ef4444',
  unknown: '#6b7280',
};

// ===== BASE USER INTERFACES =====

/**
 * Core user fields that are always present
 * This is the minimal contract for any user object
 */
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * User interface with all optional fields
 * Serves as the intermediate interface for all user types
 */
export interface User extends BaseUser {
  // Optional profile fields
  avatar?: string;
  address?: Address; // Always use Address object, never string
  phone?: string;

  // System fields
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  emailVerified?: boolean;

  // Permission fields - optional for compatibility with mock data
  permissions?: UserPermissions;

  // Extensibility
  metadata?: Record<string, unknown>;
}

/**
 * Complete user interface with all possible fields
 * Use this for full user objects from API or database
 */
export interface CompleteUser extends User {
  // Required system fields (making required what was optional in User)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User interface for authentication contexts
 * Excludes sensitive data like permissions that are added separately
 */
export interface AuthUser extends BaseUser {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified?: boolean;
}

// ===== UI USER INTERFACE =====

/**
 * UIUser interface - designed for UI components
 * Includes computed properties for display purposes
 */
export interface UIUser extends BaseUser {
  // Display properties
  displayName: string;
  initials: string;
  roleDisplay: string;
  roleColor: string;
  status: 'active' | 'inactive' | 'unknown';
  statusColor: string;

  // Optional profile fields
  avatar?: string;
  address?: Address;
  phone?: string;

  // System fields
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  emailVerified?: boolean;

  // Permission fields
  permissions?: UserPermissions;

  // Extensibility
  metadata?: Record<string, unknown>;
}

// ===== SOURCE TRACKING TYPES =====

export type DataSourceType = 'mock' | 'api' | 'cache' | 'localStorage';

export interface SourceMetadata {
  type: DataSourceType;
  timestamp: string;
  adapterId?: string;
  version?: string;
  latency?: number; // Response time in ms
  retryCount?: number;
  transformTime?: number; // Transformation time in ms (debug only)
}

export interface ValidationMetadata {
  isValid: boolean;
  validatedAt: string;
  missingFields?: string[];
  invalidFields?: string[];
  warnings?: string[];
}

// ===== USER INTERFACES =====

/**
 * Universal User interface - works with any data source
 * Ensures UI components don't care about data origin (mock vs real API)
 * Now includes all domain-specific extensions from registration system
 */
export interface UniversalUser extends User {
  // Profile information (from registration system)
  profile?:Profile;

  // User account status (from registration system)
  userAccountStatus?: UserAccountStatus;

  // Email verification status (from registration system)
  emailVerified?: boolean;

  // Domain-specific information (conditional based on role)
  farmInfo?: FarmInfo;
  inspectionInfo?: InspectionInfo;
  logisticsInfo?: LogisticsInfo;
  packagingInfo?: PackagingInfo;
  retailInfo?: RetailInfo;
  marketplaceInfo?: MarketplaceInfo;
  blockchainInfo?: BlockchainInfo;

  // System-wide information
  auditTrail?: AuditTrail[];
  notificationPreferences?: NotificationPreferences;
  securitySettings?: SecuritySettings;
  subscriptionInfo?: SubscriptionInfo;
  privacySettings?: PrivacySettings;

  // Source tracking (for debugging/monitoring)
  readonly _source: SourceMetadata;
  _validation: ValidationMetadata; // Mutable for validation updates
  readonly _normalized: true; // Flag indicating data has been normalized
}

/**
 * UniversalUser with generic constraints for extensibility
 */
export interface universalUser<T extends Record<string, unknown> = Record<string, unknown>> extends UniversalUser {
  _extensions?: T; // Allow domain-specific extensions
}

/**
 * Domain-specific user extensions
 */
export interface DomainExtensions extends Record<string, unknown> {
  farmer?: {
    farmSize: number;
    certifications: string[];
    location: {
      latitude: number;
      longitude: number;
    };
  };
  retailer?: {
    storeType: 'physical' | 'online' | 'hybrid';
    customerBase: number;
    productCategories: string[];
  };
  inspector?: {
    certificationLevel: 'basic' | 'advanced' | 'expert';
    inspectionCount: number;
    specialties: string[];
  };
  logistics?: {
    fleetSize: number;
    serviceArea: string[];
    transportModes: string[];
  };
}

/**
 * Domain-specific user interface
 */
export interface DomainUser extends universalUser<DomainExtensions> {
  readonly _domain: {
    type: UserRole;
    permissions: string[];
    customFields: Record<string, unknown>;
    lastActivity: string;
  };
}

/**
 * API response interface for type safety
 * Handles both single users and collections
 * With additional API-specific fields
 * With standardized error handling and metadata
 */
export interface APIUserResponse {
  user: CompleteUser;
  token?: string;
  permissions?: UserPermissions;
  sessionExpiresAt?: string;
  requiresEmailVerification?: boolean;
  refreshToken?: string;
  // Metadata
  responseTime?: number;
  apiVersion?: string;
  requestId?: string;
  rateLimit?: {
    remaining: number;
    reset: number;
  };
}

/**
 * API error response interface
 */
export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * API response with union type
 */
export type APIResponse<T = APIUserResponse> =
  | { success: true; data: T; metadata?: Record<string, unknown> }
  | { success: false; error: APIErrorResponse; metadata?: Record<string, unknown> };

/**
 * User interface for mock/simulated data
 * Includes password field and mock-specific authentication fields
 * Consolidated from MockAuthAdapter and other implementations
 * With security and performance tracking
 */
export interface MockUser extends InternalUser {
  password: string;

  // Mock-specific authentication fields (inherited from InternalUser)
  // failedLoginAttempts?: number;
  // accountLocked?: boolean;
  // lockoutUntil?: string;
  // preferences?: Record<string, any>;
  // additionalData?: Record<string, any>;
  // verificationToken?: string;

  // Mock-specific fields
  isMockUser: true;
  mockDataQuality?: 'high' | 'medium' | 'low';
  lastUpdated?: string;
  testScenario?: string;
}

// ===== SUPPORTING INTERFACES =====

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  formatted?: string;
}

export interface UserPermissions {
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canVerify?: boolean;
  canExport?: boolean;
  canView?: boolean;
  [key: string]: boolean | undefined;
}

// ===== ARCHITECTURAL ENHANCEMENTS =====

/**
 * Shared validation interface for all user validators
 */
export interface IUserValidator {
  validateUser(data: unknown): ValidationResult;
  sanitizeUser(user: InternalUser): User;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: unknown;
}

/**
 * Validation warning details
 */
export interface ValidationWarning {
  field: string;
  code: string;
  message: string;
  recommendation?: string;
}

/**
 * Standardized authentication error codes
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TRANSFORMATION_ERROR = 'TRANSFORMATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  // Error codes
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_ROLE = 'INVALID_ROLE',
  VALIDATION_CACHE_EXPIRED = 'VALIDATION_CACHE_EXPIRED',
  USER_LOAD_FAILED = 'USER_LOAD_FAILED',
  DOMAIN_EXTENSION_INVALID = 'DOMAIN_EXTENSION_INVALID'
}

/**
 * Validation error details
 */
export interface validationError extends ValidationError {
  severity: 'error' | 'warning' | 'info';
  category: 'format' | 'business' | 'security' | 'performance';
  suggestion?: string;
  fieldPath?: string; // For nested field errors
}

/**
 * Detailed error response for better debugging
 */
export interface DetailedErrorResponse {
  code: AuthErrorCode;
  message: string;
  details: {
    field?: string;
    value?: unknown;
    expectedType?: string;
    actualType?: string;
    constraints?: Record<string, unknown>;
  };
  context: {
    userId?: string;
    operation: string;
    timestamp: string;
    requestId?: string;
  };
  metadata: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    retryable: boolean;
    userActionRequired: boolean;
  };
}

/**
 * Standardized authentication error class
 */
export class AuthAdapterError extends Error {
  constructor(
    message: string,
    public readonly code: AuthErrorCode,
    public readonly adapterId: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AuthAdapterError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      adapterId: this.adapterId,
      details: this.details,
      stack: this.stack,
    };
  }
}

/**
 * Security metadata for compliance and auditing
 */
export interface SecurityMetadata {
  dataClassification: 'public' | 'sensitive' | 'restricted';
  retentionPolicy?: string;
  complianceFlags?: string[];
  auditRequired?: boolean;
  gdprSensitive?: boolean;
}

/**
 * UniversalUser with security metadata
 */
export interface SecureUniversalUser extends UniversalUser {
  readonly _security?: SecurityMetadata;
}

/**
 * Internal user interface for adapters (standardized)
 */
export interface InternalUser extends User {
  // Adapter-specific fields (not exposed in UniversalUser)
  password?: string; // Only for mock/internal storage
  failedLoginAttempts?: number;
  accountLocked?: boolean;
  lockoutUntil?: string;
  preferences?: Record<string, unknown>;
  additionalData?: Record<string, unknown>;
  verificationToken?: string;
  // Security fields
  lastLoginIP?: string;
  loginMethod?: 'password' | 'oauth' | 'sso' | 'mfa';
  mfaEnabled?: boolean;
}

/**
 * Performance metrics for user operations
 */
export interface UserOperationMetrics {
  operationType: 'login' | 'register' | 'transformation' | 'validation';
  duration: number; // in milliseconds
  source: DataSourceType;
  adapterId: string;
  success: boolean;
  errorType?: string;
  timestamp: string;
}

/**
 * Memoization cache interface for performance optimization
 */
export interface UserTransformationCache {
  get(key: string): UniversalUser | null;
  set(key: string, user: UniversalUser, ttl?: number): void;
  clear(): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  size(): number;
}

/**
 * Validation cache interface with TTL support
 */
export interface UserValidationCache {
  get(userId: string): ValidationMetadata | null;
  set(userId: string, validation: ValidationMetadata, ttl?: number): void;
  has(userId: string): boolean;
  delete(userId: string): boolean;
  clear(): void;
  size(): number;
  cleanup(): void; // Remove expired entries
}

/**
 * Implementation of validation cache with TTL support
 */
export class UserValidationCacheImpl implements UserValidationCache {
  private cache = new Map<string, { validation: ValidationMetadata; expires: number }>();
  private defaultTtl = 300000; // 5 minutes in milliseconds

  get(userId: string): ValidationMetadata | null {
    const cached = this.cache.get(userId);
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expires) {
      this.cache.delete(userId);
      return null;
    }

    return cached.validation;
  }

  set(userId: string, validation: ValidationMetadata, ttl: number = this.defaultTtl): void {
    this.cache.set(userId, {
      validation,
      expires: Date.now() + ttl,
    });
  }

  has(userId: string): boolean {
    return this.get(userId) !== null;
  }

  delete(userId: string): boolean {
    return this.cache.delete(userId);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [userId, cached] of this.cache.entries()) {
      if (now > cached.expires) {
        this.cache.delete(userId);
      }
    }
  }
}

/**
 * Global validation cache instance
 */
export const validationCache = new UserValidationCacheImpl();

/**
 * Lazy user loader interface for memory optimization
 */
export interface LazyUserLoader {
  register(id: string, loader: () => Promise<User>): void;
  get(id: string): Promise<User | null>;
  has(id: string): boolean;
  clear(): void;
  preload(ids: string[]): Promise<void>;
}

/**
 * Implementation of lazy user loader with memory optimization
 */
export class LazyUserLoaderImpl implements LazyUserLoader {
  private loaders = new Map<string, () => Promise<User>>();
  private loading = new Map<string, Promise<User | null>>();
  private cache = new Map<string, User | null>();

  register(id: string, loader: () => Promise<User>): void {
    this.loaders.set(id, loader);
  }

  async get(id: string): Promise<User | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id) || null;
    }

    // Check if already loading
    const existingLoadingPromise = this.loading.get(id);
    if (existingLoadingPromise) {
      return existingLoadingPromise;
    }

    // Get loader and start loading
    const loader = this.loaders.get(id);
    if (!loader) {
      return null;
    }

    const newLoadingPromise = this.loadUser(loader, id);
    this.loading.set(id, newLoadingPromise);

    try {
      const user = await newLoadingPromise;
      this.cache.set(id, user);
      return user;
    } finally {
      this.loading.delete(id);
    }
  }

  private async loadUser(loader: () => Promise<User>, id: string): Promise<User | null> {
    try {
      return await loader();
    } catch (error) {
      console.warn(`Failed to load user ${id}:`, error);
      return null;
    }
  }

  has(id: string): boolean {
    return this.loaders.has(id);
  }

  clear(): void {
    this.loaders.clear();
    this.cache.clear();
    this.loading.clear();
  }

  async preload(ids: string[]): Promise<void> {
    const promises = ids.map(id => this.get(id));
    await Promise.allSettled(promises);
  }

  // Memory management
  getCacheSize(): number {
    return this.cache.size;
  }

  evictFromCache(id: string): boolean {
    return this.cache.delete(id);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Global lazy user loader instance
 */
export const lazyUserLoader = new LazyUserLoaderImpl();

export interface UserContextType {
  user: UniversalUser | null;
  currentUser: UniversalUser | null;
  setUser: (user: UniversalUser | null) => void;
  setUserWithPersistence: (user: UniversalUser | null) => void;
  updateUserRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  loading: boolean;
}

// ===== RUNTIME TYPE GUARDS =====

/**
 * Type guard with comprehensive validation for BaseUser
 * Includes format validation and stricter type checking
 */
export function isBaseUser(obj: unknown): obj is BaseUser {
  // Quick type check
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }

  const user = obj as unknown as Record<string, unknown>;

  // Validate required fields with type and format checking
  return (
    // ID validation
    typeof user.id === 'string' &&
    user.id.length > 0 &&
    user.id.length <= 255 &&

    // Name validation
    typeof user.name === 'string' &&
    user.name.trim().length > 0 &&
    user.name.length <= 100 &&

    // Email validation with format check
    typeof user.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) &&
    user.email.length <= 254 &&

    // Role validation
    typeof user.role === 'string' &&
    USER_ROLES.includes(user.role as UserRole)
  );
}

/**
 * Type guard for CompleteUser with comprehensive validation
 * Validates all fields including optional ones for completeness
 */
export function isCompleteUser(obj: unknown): obj is CompleteUser {
  if (!isAuthUser(obj)) {
    return false;
  }

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }

  const user = obj as unknown as Record<string, unknown>;

  // CompleteUser should have most optional fields populated
  return (
    // Avatar validation
    (user.avatar === undefined || (
      typeof user.avatar === 'string' &&
      user.avatar.length > 0 &&
      user.avatar.length <= 500
    )) &&

    // Address validation (string or object)
    (user.address === undefined || (
      (typeof user.address === 'string' && user.address.trim().length > 0) ||
      (typeof user.address === 'object' && user.address !== null && !Array.isArray(user.address))
    )) &&

    // Phone validation
    (user.phone === undefined || (
      typeof user.phone === 'string' &&
      (user.phone.length === 0 || /^[+]?[\d\s\-()]+$/.test(user.phone))
    )) &&

    // Permissions validation
    (user.permissions === undefined || (
      typeof user.permissions === 'object' &&
      user.permissions !== null &&
      !Array.isArray(user.permissions)
    )) &&

    // Metadata validation
    (user.metadata === undefined || (
      typeof user.metadata === 'object' &&
      user.metadata !== null &&
      !Array.isArray(user.metadata)
    ))
  );
}

/**
 * Type guard for AuthUser with timestamp validation
 * Includes ISO date format validation and boolean checks
 */
export function isAuthUser(obj: unknown): obj is AuthUser {
  if (!isBaseUser(obj)) {
    return false;
  }

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }

  const user = obj as unknown as Record<string, unknown>;

  // Validate required AuthUser fields
  const isActiveValid = typeof user.isActive === 'boolean';

  // Validate ISO 8601 timestamp format
  const isValidISODate = (dateStr: unknown): boolean => {
    if (typeof dateStr !== 'string') {
      return false;
    }
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  const createdAtValid = isValidISODate(user.createdAt);
  const updatedAtValid = isValidISODate(user.updatedAt);

  // Validate optional timestamp fields
  const lastLoginAtValid = user.lastLoginAt === undefined || isValidISODate(user.lastLoginAt);
  const emailVerifiedValid = user.emailVerified === undefined || typeof user.emailVerified === 'boolean';

  return (
    isActiveValid &&
    createdAtValid &&
    updatedAtValid &&
    lastLoginAtValid &&
    emailVerifiedValid
  );
}

/**
 * Type guard for MockUser with comprehensive validation
 * Validates all mock-specific fields and security properties
 */
export function isMockUser(obj: unknown): obj is MockUser {
  if (!isBaseUser(obj)) {
    return false;
  }

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }

  const user = obj as unknown as Record<string, unknown>;

  // Required mock field validation
  const passwordValid = typeof user.password === 'string' && user.password.length > 0;
  const isMockUserValid = user.isMockUser === true;

  // Optional mock fields validation
  const mockDataQualityValid = user.mockDataQuality === undefined ||
    (typeof user.mockDataQuality === 'string' &&
    ['high', 'medium', 'low'].includes(user.mockDataQuality));

  const testScenarioValid = user.testScenario === undefined ||
    (typeof user.testScenario === 'string' && user.testScenario.length > 0);

  const lastUpdatedValid = user.lastUpdated === undefined ||
    (typeof user.lastUpdated === 'string' && !isNaN(new Date(user.lastUpdated).getTime()));

  // Security fields validation
  const failedAttemptsValid = user.failedLoginAttempts === undefined ||
    (typeof user.failedLoginAttempts === 'number' &&
    user.failedLoginAttempts >= 0 &&
    user.failedLoginAttempts <= 10);

  const accountLockedValid = user.accountLocked === undefined || typeof user.accountLocked === 'boolean';
  const lockoutUntilValid = user.lockoutUntil === undefined ||
    (typeof user.lockoutUntil === 'string' &&
    (user.lockoutUntil === '' || !isNaN(new Date(user.lockoutUntil).getTime())));

  const mfaEnabledValid = user.mfaEnabled === undefined || typeof user.mfaEnabled === 'boolean';
  const loginMethodValid = user.loginMethod === undefined ||
    (typeof user.loginMethod === 'string' &&
    ['password', 'oauth', 'sso', 'mfa'].includes(user.loginMethod));

  return (
    passwordValid &&
    isMockUserValid &&
    mockDataQualityValid &&
    testScenarioValid &&
    lastUpdatedValid &&
    failedAttemptsValid &&
    accountLockedValid &&
    lockoutUntilValid &&
    mfaEnabledValid &&
    loginMethodValid
  );
}

// ===== TRANSFORMATION UTILITIES =====

/**
 * Transform MockUser to AuthUser (removes sensitive mock fields)
 * Updated to handle MockUser interface
 */
export function mockUserToAuthUser(mockUser: MockUser): AuthUser {
  const {
    password: _password,
    failedLoginAttempts: _failedLoginAttempts,
    accountLocked: _accountLocked,
    lockoutUntil: _lockoutUntil,
    preferences: _preferences,
    additionalData: _additionalData,
    verificationToken: _verificationToken,
    ...authUserFields
  } = mockUser;

  return {
    id: authUserFields.id,
    email: authUserFields.email,
    name: authUserFields.name,
    role: authUserFields.role,
    isActive: authUserFields.isActive ?? true,
    createdAt: authUserFields.createdAt || new Date().toISOString(),
    updatedAt: authUserFields.updatedAt || new Date().toISOString(),
    lastLoginAt: authUserFields.lastLoginAt,
    emailVerified: authUserFields.emailVerified ?? true,
  };
}

// Transformation functions are now centralized in UIUserAdapter.ts
// Use UIAdapter.toUI() for all user transformations
// This provides better type safety and consistency

/**
 * Create default permissions based on user role
 * Ensures permissions field is always populated with sensible defaults
 */
export function createDefaultPermissions(role: UserRole): UserPermissions {
  const roleConfig = ROLE_PERMISSIONS[role];

  return {
    canCreate: roleConfig?.canCreate || false,
    canEdit: roleConfig?.canCreate || false, // Use canCreate as canEdit for now
    canDelete: false, // No delete permissions by default
    canVerify: roleConfig?.canVerify || false,
    canExport: roleConfig?.canVerify || false, // Use canVerify as canExport for now
    canView: roleConfig?.canView || true,
  };
}

/**
 * Transform any user data source to UniversalUser
 * This ensures UI components work with any data source (mock, API, cache, etc.)
 */
export function toUniversalUser(
  user: unknown,
  source: DataSourceType = 'api',
  options?: {
    adapterId?: string;
    version?: string;
    latency?: number;
    retryCount?: number;
  },
): UniversalUser | null {
  // Direct transformation since UIAdapter was removed
  const normalized = user as CompleteUser; // Type assertion for transformation

  // Create source metadata
  const sourceMetadata: SourceMetadata = {
    type: source,
    timestamp: new Date().toISOString(),
    adapterId: options?.adapterId,
    version: options?.version,
    latency: options?.latency,
    retryCount: options?.retryCount,
  };

  // Create validation metadata
  const validationMetadata: ValidationMetadata = {
    isValid: true,
    validatedAt: new Date().toISOString(),
  };

  // Transform to UniversalUser with tracking
  const universalUser: UniversalUser = {
    ...normalized,
    _source: sourceMetadata,
    _validation: validationMetadata,
    _normalized: true,
    // Ensure permissions is always provided with defaults
    permissions: normalized.permissions || createDefaultPermissions(normalized.role),
  };

  // Validate the created user
  universalUser._validation = validateUniversalUser(universalUser);

  return universalUser;
}

/**
 * Universal user validator for runtime type checking
 * Works with any user data source with comprehensive validation
 */
export function isUniversalUser(obj: unknown): obj is UniversalUser {
  if (!isBaseUser(obj)) {
    return false;
  }

  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const user = obj as unknown as Record<string, unknown>;

  // Validate source metadata
  const source = user._source;
  if (!source || typeof source !== 'object') {
    return false;
  }

  const sourceRecord = source as Record<string, unknown>;
  const validSources: DataSourceType[] = ['mock', 'api', 'cache', 'localStorage'];

  if (
    !sourceRecord.type ||
    !validSources.includes(sourceRecord.type as DataSourceType) ||
    !sourceRecord.timestamp ||
    typeof sourceRecord.timestamp !== 'string'
  ) {
    return false;
  }

  // Validate validation metadata
  const validation = user._validation;
  if (!validation || typeof validation !== 'object') {
    return false;
  }

  const validationRecord = validation as Record<string, unknown>;
  if (
    typeof validationRecord.isValid !== 'boolean' ||
    !validationRecord.validatedAt ||
    typeof validationRecord.validatedAt !== 'string'
  ) {
    return false;
  }

  // Validate normalized flag
  if (typeof user._normalized !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Validate UniversalUser data integrity with caching support
 */
export function validateUniversalUser(user: UniversalUser, useCache: boolean = true): ValidationMetadata {
  // Check cache first if enabled
  if (useCache && user.id) {
    const cached = validationCache.get(user.id);
    if (cached) {
      return cached;
    }
  }

  const missingFields: string[] = [];
  const invalidFields: string[] = [];
  const warnings: string[] = [];

  // Check required base fields
  if (!user.id) {
    missingFields.push('id');
  }
  if (!user.name) {
    missingFields.push('name');
  }
  if (!user.email) {
    missingFields.push('email');
  }
  if (!user.role) {
    missingFields.push('role');
  }

  // Validate email format
  if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    invalidFields.push('email');
  }

  // Validate role
  if (user.role && !USER_ROLES.includes(user.role as UserRole)) {
    invalidFields.push('role');
  }

  // Warnings for recommended fields
  if (!user.createdAt) {
    warnings.push('Missing createdAt timestamp');
  }
  if (!user.isActive) {
    warnings.push('Missing isActive status');
  }

  const isValid = missingFields.length === 0 && invalidFields.length === 0;

  const validation: ValidationMetadata = {
    isValid,
    validatedAt: new Date().toISOString(),
    missingFields: missingFields.length > 0 ? missingFields : undefined,
    invalidFields: invalidFields.length > 0 ? invalidFields : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };

  // Cache the result if enabled and user has an ID
  if (useCache && user.id) {
    validationCache.set(user.id, validation);
  }

  return validation;
}

// ===== RUNTIME VALIDATION UTILITIES =====

/**
 * Safe type guard with detailed validation reporting
 * Returns detailed validation result instead of boolean
 */
export function validateUserType<T>(
  obj: unknown,
  userType: 'BaseUser' | 'AuthUser' | 'CompleteUser' | 'MockUser' | 'UniversalUser',
  options?: {
    strict?: boolean;
    includeWarnings?: boolean;
  },
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: T;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const strict = options?.strict ?? false;
  const includeWarnings = options?.includeWarnings ?? true;

  try {
    let data: T | undefined;

    switch (userType) {
    case 'BaseUser':
      if (isBaseUser(obj)) {
        data = obj as T;
      } else {
        errors.push('Object does not match BaseUser interface');
      }
      break;

    case 'AuthUser':
      if (isAuthUser(obj)) {
        data = obj as T;
      } else {
        errors.push('Object does not match AuthUser interface');
      }
      break;

    case 'CompleteUser':
      if (isCompleteUser(obj)) {
        data = obj as T;
      } else {
        errors.push('Object does not match CompleteUser interface');
      }
      break;

    case 'MockUser':
      if (isMockUser(obj)) {
        data = obj as T;
      } else {
        errors.push('Object does not match MockUser interface');
      }
      break;

    case 'UniversalUser':
      if (isUniversalUser(obj)) {
        data = obj as T;
      } else {
        errors.push('Object does not match UniversalUser interface');
      }
      break;

    default:
      errors.push(`Unknown user type: ${userType}`);
    }

    // Additional strict validation
    if (strict && data) {
      const user = data as Record<string, unknown>;
      if (user.email && typeof user.email === 'string' && user.email.length > 254) {
        errors.push('Email length exceeds maximum allowed (254 characters)');
      }
      if (user.name && typeof user.name === 'string' && user.name.trim().length === 0) {
        errors.push('Name cannot be empty or whitespace only');
      }
    }

    // Warnings
    if (includeWarnings && data) {
      const user = data as Record<string, unknown>;
      if (!user.createdAt && userType !== 'BaseUser') {
        warnings.push('Missing createdAt timestamp - recommended for production use');
      }
      if (!user.isActive && userType === 'BaseUser') {
        warnings.push('Missing isActive status - recommended for user management');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data,
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
    };
  }
}

/**
 * Runtime type guard with performance monitoring
 * Tracks validation performance for optimization
 */
export function isUserTypeWithPerformance<T>(
  obj: unknown,
  validator: (obj: unknown) => obj is T,
  typeName: string,
): { isValid: boolean; data?: T; performance: ValidationPerformance } {
  const startTime = performance.now();
  const startMemory = (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize ?? 0;

  const isValid = validator(obj);

  const endTime = performance.now();
  const endMemory = (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize ?? 0;

  return {
    isValid,
    data: isValid ? obj as T : undefined,
    performance: {
      typeName,
      duration: endTime - startTime,
      memoryDelta: endMemory - startMemory,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Validation performance metrics interface
 */
export interface ValidationPerformance {
  typeName: string;
  duration: number;
  memoryDelta: number;
  timestamp: string;
}

/**
 * Comprehensive user data validator with business rules
 * Validates against both type and business logic
 */
export function validateUserBusinessRules(
  user: UniversalUser | BaseUser | AuthUser,
): BusinessRuleValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Email business rules
  if (user.email) {
    const emailLower = user.email.toLowerCase();
    if (emailLower !== user.email) {
      warnings.push('Email contains uppercase characters - should be lowercase');
    }

    const blockedDomains = ['tempmail.com', 'throwaway.email'];
    const domain = emailLower.split('@')[1];
    if (blockedDomains.includes(domain)) {
      errors.push('Email domain is blocked for registration');
    }
  }

  // Role business rules
  if (user.role) {
    const restrictedRoles = ['admin', 'government'];
    if (restrictedRoles.includes(user.role) && !user.email?.endsWith('.gov')) {
      warnings.push(`Role '${user.role}' typically requires official email domain`);
    }
  }

  // Account status business rules
  if ('isActive' in user && !user.isActive && 'lastLoginAt' in user) {
    const lastLogin = new Date(user.lastLoginAt as string);
    const daysSinceLastLogin = (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastLogin > 365) {
      warnings.push('Inactive account for over 1 year - consider cleanup');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: calculateBusinessRuleScore(errors, warnings),
  };
}

/**
 * Business rule validation result interface
 */
export interface BusinessRuleValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100, higher is better
}

/**
 * Calculate business rule compliance score
 */
function calculateBusinessRuleScore(errors: string[], warnings: string[]): number {
  const errorPenalty = errors.length * 25;
  const warningPenalty = warnings.length * 5;
  return Math.max(0, 100 - errorPenalty - warningPenalty);
}

/**
 * Batch validator for multiple user objects
 * Efficiently validates arrays of user data
 */
export function validateUserBatch<T>(
  users: unknown[],
  validator: (obj: unknown) => obj is T,
  options?: {
    stopOnFirstError?: boolean;
    maxConcurrency?: number;
  },
): BatchValidationResult<T> {
  const results: T[] = [];
  const errors: Array<{ index: number; error: string }> = [];
  const stopOnFirstError = options?.stopOnFirstError ?? false;
  const _maxConcurrency = options?.maxConcurrency ?? 10;

  for (let i = 0; i < users.length; i++) {
    try {
      if (validator(users[i])) {
        results.push(users[i] as T);
      } else {
        errors.push({ index: i, error: `Invalid user object at index ${i}` });
        if (stopOnFirstError) {
          break;
        }
      }
    } catch (error) {
      errors.push({
        index: i,
        error: `Validation error at index ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      if (stopOnFirstError) {
        break;
      }
    }
  }

  return {
    totalProcessed: users.length,
    validCount: results.length,
    invalidCount: errors.length,
    results,
    errors,
    successRate: users.length > 0 ? results.length / users.length : 0,
  };
}

/**
 * Batch validation result interface
 */
export interface BatchValidationResult<T> {
  totalProcessed: number;
  validCount: number;
  invalidCount: number;
  results: T[];
  errors: Array<{ index: number; error: string }>;
  successRate: number;
}

/**
 * Create a UniversalUser from any partial user data
 * Useful for building user objects from fragmented data sources
 */
export function createUniversalUser(
  baseData: Partial<BaseUser>,
  additionalData?: Partial<Omit<UniversalUser, keyof BaseUser>>,
  source: DataSourceType = 'api',
  options?: {
    adapterId?: string;
    version?: string;
    latency?: number;
    retryCount?: number;
  },
): UniversalUser | null {
  // Validate required base fields
  if (!baseData.id || !baseData.name || !baseData.email || !baseData.role) {
    return null;
  }

  // Validate role
  if (!USER_ROLES.includes(baseData.role as UserRole)) {
    return null;
  }

  // Create source metadata
  const sourceMetadata: SourceMetadata = {
    type: source,
    timestamp: new Date().toISOString(),
    adapterId: options?.adapterId,
    version: options?.version,
    latency: options?.latency,
    retryCount: options?.retryCount,
  };

  // Create validation metadata
  const validationMetadata: ValidationMetadata = {
    isValid: true,
    validatedAt: new Date().toISOString(),
  };

  const universalUser: UniversalUser = {
    id: baseData.id,
    name: baseData.name,
    email: baseData.email,
    role: baseData.role as UserRole,
    ...additionalData,
    _source: sourceMetadata,
    _validation: validationMetadata,
    _normalized: true,
    // Ensure permissions is always provided with defaults
    permissions: (additionalData as { permissions?: UserPermissions })?.permissions || createDefaultPermissions(baseData.role as UserRole),
  };

  // Validate the created user
  universalUser._validation = validateUniversalUser(universalUser);

  return universalUser;
}

// ===== ROLE DEFINITIONS =====

export const ROLE_PERMISSIONS: Record<UserRole, {
  canCreate: boolean;
  canVerify: boolean;
  canView: boolean;
  allowedEvents: string[];
  displayName: string;
  icon: RoleIcon;
  color: string;
  IconComponent?: LucideIcon;
}> = {
  admin: {
    canCreate: true,
    canVerify: true,
    canView: true,
    allowedEvents: ['*'],
    displayName: 'Administrator',
    icon: 'admin',
    color: 'role-admin',
    IconComponent: Users,
  },
  government: {
    canCreate: false,
    canVerify: true,
    canView: true,
    allowedEvents: ['compliance-check', 'audit', 'inspection'],
    displayName: 'Government',
    icon: 'shield',
    color: 'role-government',
    IconComponent: Shield,
  },
  farmer: {
    canCreate: true,
    canVerify: false,
    canView: true,
    allowedEvents: ['planting', 'growth', 'harvest'],
    displayName: 'Farmer',
    icon: 'farmer',
    color: 'role-farmer',
    IconComponent: UserCheck,
  },
  inspector: {
    canCreate: false,
    canVerify: true,
    canView: true,
    allowedEvents: ['quality-inspection', 'compliance-check'],
    displayName: 'Inspector',
    icon: 'inspector',
    color: 'role-inspector',
    IconComponent: Shield,
  },
  logistics: {
    canCreate: false,
    canVerify: false,
    canView: true,
    allowedEvents: ['collection', 'transport', 'delivery'],
    displayName: 'Logistics',
    icon: 'logistics',
    color: 'role-logistics',
    IconComponent: Truck,
  },
  packaging: {
    canCreate: true,
    canVerify: false,
    canView: true,
    allowedEvents: ['packaging', 'labeling', 'qr-generation'],
    displayName: 'Packaging',
    icon: 'packaging',
    color: 'role-packaging',
    IconComponent: Package,
  },
  retailer: {
    canCreate: false,
    canVerify: true,
    canView: true,
    allowedEvents: ['retail-verification', 'sale'],
    displayName: 'Retailer',
    icon: 'retailer',
    color: 'role-retailer',
    IconComponent: Briefcase,
  },
  public: {
    canCreate: false,
    canVerify: false,
    canView: true,
    allowedEvents: ['browse-marketplace', 'view-traceability', 'purchase'],
    displayName: 'Public',
    icon: 'public',
    color: 'role-public',
    IconComponent: Eye,
  },
  saps: {
    canCreate: false,
    canVerify: true,
    canView: true,
    allowedEvents: ['roadside-inspection', 'asset-recovery', 'scan-verification', 'theft-report', 'inspection-log'],
    displayName: 'SAPS Officer',
    icon: 'saps',
    color: 'role-saps',
    IconComponent: Shield,
  },
  viewer: {
    canCreate: false,
    canVerify: false,
    canView: true,
    allowedEvents: ['view-traceability', 'browse-marketplace'],
    displayName: 'Viewer',
    icon: 'viewer',
    color: 'role-viewer',
    IconComponent: Eye,
  },
};

// ===== UI USER TYPES AND ADAPTER =====

/**
 * UI-optimized user type for frontend components
 * Contains only the fields needed for UI rendering
 */
export interface UIUserType {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive?: boolean;
  displayName?: string;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
  emailVerified?: boolean;
  roleInfo?: {
    displayName: string;
    icon: string | LucideIcon;
    color: string;
  };
  permissions?: UserPermissions;
  lastLoginAt?: string;
  // UniversalUser metadata properties
  _source?: {
    type: string;
    timestamp: string;
    adapterId?: string;
  };
  _validation?: {
    isValid: boolean;
    validatedAt: string;
    errors?: string[];
  };
  _normalized?: boolean;
  initials?: string;
  roleDisplay?: string;
  roleColor?: string;
  status?: string;
  statusColor?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

// UIUser alias for backward compatibility
// export type UIUserType = UIUser; // Already defined above

/**
 * Transform any user data to UIUser for UI components
 */
export function toUIUser(user: BaseUser | User | AuthUser | CompleteUser | UniversalUser): UIUser {
  // Generate display name
  const displayName = user.name || user.email || 'Unknown User';

  // Generate initials
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
  };

  const initials = getInitials(displayName);

  // Get role display and color
  const roleDisplay = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const roleColor = USER_AVATAR_COLORS[user.role] || '#6b7280';

  // Determine status and color
  const isActive = (user as { isActive?: boolean }).isActive !== false; // BaseUser doesn't have isActive
  const status = isActive ? 'active' : 'inactive';
  const statusColor = USER_STATUS_COLORS[status] || '#6b7280';

  // Transform to UIUser
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    displayName,
    initials,
    roleDisplay,
    roleColor,
    status,
    statusColor,
    avatar: (user as { avatar?: string }).avatar,
    address: typeof (user as { address?: unknown }).address === 'string' ? undefined : (user as { address?: Address }).address,
    phone: (user as { phone?: string }).phone,
    isActive: (user as { isActive?: boolean }).isActive,
    createdAt: (user as { createdAt?: string }).createdAt,
    updatedAt: (user as { updatedAt?: string }).updatedAt,
    lastLoginAt: (user as { lastLoginAt?: string }).lastLoginAt,
    emailVerified: (user as { emailVerified?: boolean }).emailVerified,
    permissions: (user as { permissions?: UserPermissions }).permissions || createDefaultPermissions(user.role),
    metadata: (user as { metadata?: Record<string, unknown> }).metadata,
  };
}

/**
 * Transformation options for UI adapter
 */
export interface UIAdapterOptions {
  includePermissions?: boolean;
  includeRoleInfo?: boolean;
  includeLastLogin?: boolean;
  displayNameFormat?: 'name' | 'email' | 'name-email';
}

/**
 * UI Adapter for transforming users to UI-optimized format
 */
export class UIAdapter {
  /**
   * Transform any user type to UIUserType
   */
  static toUI(
    user: UniversalUser | CompleteUser | User,
    sourceType?: DataSourceType,
    options: UIAdapterOptions = {},
  ): UIUserType {
    const {
      includePermissions = true,
      includeRoleInfo = true,
      includeLastLogin = true,
      displayNameFormat = 'name',
    } = options;

    // Extract base user info - UniversalUser extends User directly
    const baseUser: User = user as User;

    // Create display name
    let displayName = baseUser.name;
    if (displayNameFormat === 'email') {
      displayName = baseUser.email;
    } else if (displayNameFormat === 'name-email') {
      displayName = `${baseUser.name} (${baseUser.email})`;
    }

    // Build UI user
    const uiUser: UIUserType = {
      id: baseUser.id,
      name: baseUser.name,
      email: baseUser.email,
      role: baseUser.role,
      avatar: baseUser.avatar,
      isActive: baseUser.isActive ?? true,
      displayName,
    };

    // Add role info if requested
    if (includeRoleInfo) {
      const rolePermissions = ROLE_PERMISSIONS[baseUser.role as UserRole];
      if (rolePermissions) {
        uiUser.roleInfo = rolePermissions;
      }
    }

    // Add permissions if requested
    if (includePermissions && 'permissions' in user && user.permissions) {
      uiUser.permissions = user.permissions;
    }

    // Add last login if requested
    if (includeLastLogin && baseUser.lastLoginAt) {
      uiUser.lastLoginAt = baseUser.lastLoginAt;
    }

    return uiUser;
  }

  /**
   * Transform multiple users to UI format
   */
  static toUIList(
    users: (UniversalUser | CompleteUser | User)[],
    sourceType?: DataSourceType,
    options: UIAdapterOptions = {},
  ): UIUserType[] {
    return users.map(user => UIAdapter.toUI(user, sourceType, options));
  }
}
