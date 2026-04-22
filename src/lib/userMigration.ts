// src/lib/userMigration.ts
// Migration utilities for transitioning from registration User entity to UniversalUser

import { randomUUID } from 'crypto';
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
} from '@/types/types';
import type {
  UniversalUser,
  SourceMetadata,
  ValidationMetadata,
  UserRole,
} from '@/types/types';

/**
 * Database record interface (from old registration system)
 */
interface DatabaseRecord {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  profile?: Record<string, unknown>;
  status?: string;
  is_active?: boolean;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
  farm_info?: Record<string, unknown>;
  inspection_info?: Record<string, unknown>;
  logistics_info?: Record<string, unknown>;
  packaging_info?: Record<string, unknown>;
  retail_info?: Record<string, unknown>;
  marketplace_info?: Record<string, unknown>;
  blockchain_info?: Record<string, unknown>;
  audit_trail?: Array<unknown>;
  notification_preferences?: Record<string, unknown>;
  security_settings?: Record<string, unknown>;
  subscription_info?: Record<string, unknown>;
  privacy_settings?: Record<string, unknown>;
}

/**
 * Registration data interface (from old registration system)
 */
interface RegistrationData {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  bio?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  preferences?: Record<string, unknown>;
  farm_info?: Record<string, unknown>;
  inspection_info?: Record<string, unknown>;
  logistics_info?: Record<string, unknown>;
  packaging_info?: Record<string, unknown>;
  retail_info?: Record<string, unknown>;
  marketplace_info?: Record<string, unknown>;
  blockchain_info?: Record<string, unknown>;
}

/**
 * Migration utilities for transitioning to UniversalUser
 */
export class UserMigration {
  /**
   * Create a UniversalUser from database record (old registration system)
   */
  static fromDatabaseRecord(
    record: DatabaseRecord,
    sourceType: 'api' | 'cache' | 'localStorage' = 'api',
  ): UniversalUser {
    const sourceMetadata: SourceMetadata = {
      type: sourceType,
      timestamp: new Date().toISOString(),
      adapterId: 'migration-adapter',
      version: '1.0.0',
    };

    const validationMetadata: ValidationMetadata = {
      isValid: true,
      validatedAt: new Date().toISOString(),
    };

    return {
      // Core user fields
      id: record.id || '',
      email: record.email || '',
      name: record.name || '',
      role: (record.role as UserRole) || 'farmer',

      // Profile
      profile: this.createProfile(record.profile),

      // Account status
      userAccountStatus: (record.status as UserAccountStatus) || 'pending_verification',
      isActive: record.is_active || false,
      emailVerified: record.email_verified || false,

      // Timestamps
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      lastLoginAt: record.last_login_at,

      // Domain-specific information
      farmInfo: record.farm_info as unknown as FarmInfo,
      inspectionInfo: record.inspection_info as unknown as InspectionInfo,
      logisticsInfo: record.logistics_info as unknown as LogisticsInfo,
      packagingInfo: record.packaging_info as unknown as PackagingInfo,
      retailInfo: record.retail_info as unknown as RetailInfo,
      marketplaceInfo: record.marketplace_info as unknown as MarketplaceInfo,
      blockchainInfo: record.blockchain_info as unknown as BlockchainInfo,

      // System-wide information
      auditTrail: (record.audit_trail as AuditTrail[]) || [],
      notificationPreferences: this.createDefaultNotificationPreferences(record.notification_preferences),
      securitySettings: this.createDefaultSecuritySettings(record.security_settings),
      subscriptionInfo: record.subscription_info as unknown as SubscriptionInfo,
      privacySettings: this.createDefaultPrivacySettings(record.privacy_settings),

      // Metadata
      metadata: {
        migratedFrom: 'registration-system',
        migrationDate: new Date().toISOString(),
      },

      // Source tracking
      _source: sourceMetadata,
      _validation: validationMetadata,
      _normalized: true,
    };
  }

  /**
   * Create a UniversalUser from registration data (old registration system)
   */
  static fromRegistrationData(
    data: RegistrationData,
    sourceType: 'mock' | 'api' = 'mock',
  ): UniversalUser {
    const sourceMetadata: SourceMetadata = {
      type: sourceType,
      timestamp: new Date().toISOString(),
      adapterId: 'migration-adapter',
      version: '1.0.0',
    };

    const validationMetadata: ValidationMetadata = {
      isValid: true,
      validatedAt: new Date().toISOString(),
    };

    const now = new Date().toISOString();

    return {
      // Core user fields
      id: data.id || randomUUID(),
      email: data.email,
      name: data.name || '',
      role: (data.role as UserRole) || 'farmer',

      // Profile
      profile: {
        bio: data.bio || '',
        phone: data.phone || '',
        address: data.address || '',
        avatarUrl: data.avatar_url || '',
        preferences: data.preferences || {},
      },

      // Account status
      userAccountStatus: 'pending_verification',
      isActive: false,
      emailVerified: false,

      // Timestamps
      createdAt: now,
      updatedAt: now,
      lastLoginAt: undefined,

      // Domain-specific information
      farmInfo: data.farm_info as unknown as FarmInfo,
      inspectionInfo: data.inspection_info as unknown as InspectionInfo,
      logisticsInfo: data.logistics_info as unknown as LogisticsInfo,
      packagingInfo: data.packaging_info as unknown as PackagingInfo,
      retailInfo: data.retail_info as unknown as RetailInfo,
      marketplaceInfo: data.marketplace_info as unknown as MarketplaceInfo,
      blockchainInfo: data.blockchain_info as unknown as BlockchainInfo,

      // System-wide information
      auditTrail: [{
        id: randomUUID(),
        action: 'user_registered',
        timestamp: now,
        userId: data.id || randomUUID(),
        details: { registrationData: data },
      }],
      notificationPreferences: this.createDefaultNotificationPreferences(),
      securitySettings: this.createDefaultSecuritySettings(),
      privacySettings: this.createDefaultPrivacySettings(),

      // Subscription info
      subscriptionInfo: {
        plan: 'basic',
        status: 'active',
        period: 'monthly',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        autoRenew: false,
        features: ['basic_support', 'profile_visibility'],
      },

      // Metadata
      metadata: {
        migratedFrom: 'registration-system',
        migrationDate: now,
      },

      // Source tracking
      _source: sourceMetadata,
      _validation: validationMetadata,
      _normalized: true,
    };
  }

  /**
   * Create profile from legacy profile data
   */
  private static createProfile(
    legacyProfile?: Record<string, unknown>,
  ): Profile {
    if (!legacyProfile) {
      return {
        bio: '',
        phone: '',
        address: '',
        avatarUrl: '',
        preferences: {},
      };
    }

    return {
      bio: (legacyProfile.bio as string) || '',
      phone: (legacyProfile.phone as string) || '',
      address: (legacyProfile.address as string) || '',
      avatarUrl: (legacyProfile.avatar_url as string) || '',
      preferences: (legacyProfile.preferences as Record<string, unknown>) || {},
    };
  }

  /**
   * Create default notification preferences
   */
  private static createDefaultNotificationPreferences(
    existing?: Record<string, unknown>,
  ): NotificationPreferences {
    return {
      email: true,
      sms: false,
      push: true,
      marketing: false,
      security: true,
      frequency: 'immediate',
      ...existing,
    } as NotificationPreferences;
  }

  /**
   * Create default security settings
   */
  private static createDefaultSecuritySettings(
    existing?: Record<string, unknown>,
  ): SecuritySettings {
    return {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      allowedIPs: [],
      failedLoginAttempts: 0,
      accountLocked: false,
      lastPasswordChange: new Date(),
      securityQuestions: [],
      ...existing,
    } as SecuritySettings;
  }

  /**
   * Create default privacy settings
   */
  private static createDefaultPrivacySettings(
    existing?: Record<string, unknown>,
  ): PrivacySettings {
    return {
      profileVisibility: 'public',
      dataSharing: {
        shareWithPartners: false,
        shareWithPublic: false,
        shareWithResearchers: false,
        anonymizeData: true,
      },
      marketingConsent: false,
      analyticsConsent: true,
      thirdPartyConsent: false,
      ...existing,
    } as PrivacySettings;
  }

  /**
   * Validate migrated user data
   */
  static validateMigratedUser(user: UniversalUser): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Core validation
    if (!user.id) {
errors.push('User ID is required');
}
    if (!user.email) {
errors.push('Email is required');
}
    if (!user.name) {
errors.push('Name is required');
}
    if (!user.role) {
errors.push('Role is required');
}

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (user.email && !emailRegex.test(user.email)) {
      errors.push('Invalid email format');
    }

    // Role validation
    const validRoles = ['farmer', 'inspector', 'logistics', 'packaging', 'retailer', 'public', 'government', 'admin', 'saps', 'viewer'];
    if (user.role && !validRoles.includes(user.role)) {
      errors.push('Invalid user role');
    }

    // Warnings for missing optional data
    if (!user.profile?.bio) {
warnings.push('User bio is missing');
}
    if (!user.profile?.phone) {
warnings.push('User phone is missing');
}
    if (!user.emailVerified) {
warnings.push('Email is not verified');
}
    if (user.userAccountStatus === 'pending_verification') {
      warnings.push('User account is pending verification');
    }

    // Domain-specific validation
    if (user.role === 'farmer' && !user.farmInfo) {
      warnings.push('Farmer role requires farm information');
    }
    if (user.role === 'inspector' && !user.inspectionInfo) {
      warnings.push('Inspector role requires inspection information');
    }
    if (user.role === 'logistics' && !user.logisticsInfo) {
      warnings.push('Logistics role requires logistics information');
    }
    if (user.role === 'packaging' && !user.packagingInfo) {
      warnings.push('Packaging role requires packaging information');
    }
    if (user.role === 'retailer' && !user.retailInfo) {
      warnings.push('Retailer role requires retail information');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get migration summary
   */
  static getMigrationSummary(): {
    totalUsers: number;
    migratedUsers: number;
    failedMigrations: number;
    errors: string[];
  } {
    // This would typically query your database
    // For now, return a placeholder
    return {
      totalUsers: 0,
      migratedUsers: 0,
      failedMigrations: 0,
      errors: [],
    };
  }
}
