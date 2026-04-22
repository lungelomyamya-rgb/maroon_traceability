// src/core/interfaces/services.ts
// Core service interfaces for the decoupled architecture

import type { UniversalUser } from '@/types/types';
import type { ServiceHealth } from './IHybridService';

/**
 * Base interface for all services
 */
export interface IService {
  readonly name: string;
  readonly version: string;
}

/**
 * User repository interface for data access
 */
export interface IUserRepository {
  findByEmail(email: string): Promise<UniversalUser | null>;
  findById(id: string): Promise<UniversalUser | null>;
  create(userData: Partial<UniversalUser>): Promise<UniversalUser>;
  update(id: string, updates: Partial<UniversalUser>): Promise<UniversalUser>;
  delete(id: string): Promise<boolean>;
}

/**
 * Identity service interface for authentication and user management
 */
export interface IIdentityService extends IService {
  authenticate(email: string, password: string): Promise<UniversalUser | null>;
  register(userData: Partial<UniversalUser>): Promise<UniversalUser>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
  updateProfile(userId: string, updates: Partial<UniversalUser>): Promise<UniversalUser>;
  deactivateAccount(userId: string): Promise<void>;
  initialize?(): Promise<void>;
  cleanup?(): Promise<void>;
}

/**
 * Token provider interface for JWT management
 */
export interface ITokenProvider extends IService {
  generateTokens(user: UniversalUser): Promise<TokenPair>;
  refreshToken(refreshToken: string): Promise<TokenPair>;
  revokeToken(tokenId: string): Promise<void>;
  revokeCurrentToken(): Promise<void>;
  getCurrentUserFromToken(): Promise<UniversalUser | null>;
  initialize?(): Promise<void>;
  cleanup?(): Promise<void>;
}

/**
 * Encryption engine interface for data protection
 */
export interface IEncryptionEngine {
  encryptSensitiveData(data: string): Promise<string>;
  decryptSensitiveData(encryptedData: string): Promise<string>;
  hashData(data: string): Promise<string>;
  verifyHash(data: string, hash: string): Promise<boolean>;
}

/**
 * Storage service interface for secure data persistence
 */
export interface IStorageService extends IService {
  setSecureCookie(name: string, value: string, options?: CookieOptions): Promise<void>;
  getSecureCookie(name: string): Promise<string | null>;
  removeSecureCookie(name: string): Promise<void>;
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  initialize?(): Promise<void>;
  cleanup?(): Promise<void>;
}

/**
 * Token pair interface
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Cookie options interface
 */
export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  expires?: Date;
  path?: string;
}

/**
 * Authentication result interface
 */
export interface AuthResult {
  user: UniversalUser;
  tokens: TokenPair;
}

/**
 * Service orchestrator interface for managing service lifecycle
 */
export interface IServiceOrchestrator extends IService {
  /**
   * Initialize all services
   */
  initialize(): Promise<void>;

  /**
   * Shutdown all services
   */
  shutdown(): Promise<void>;

  /**
   * Get service status
   */
  getStatus(): Record<string, 'running' | 'stopped' | 'error'>;

  /**
   * Execute operation on service
   */
  executeOperation<T>(
    serviceName: string,
    operation: string,
    params?: Record<string, unknown>,
  ): Promise<T>;

  /**
   * Register service
   */
  registerService(name: string, service: IService): void;

  /**
   * Cleanup service
   */
  cleanup?(): Promise<void>;

  /**
   * Get service health
   */
  getHealth?(): Promise<Record<string, ServiceHealth>>;
}
