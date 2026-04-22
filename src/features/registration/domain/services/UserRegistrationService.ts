// src/features/registration/domain/services/UserRegistrationService.ts
// Domain service for user registration business logic

import { randomUUID } from 'crypto';
import type {
  FarmInfo,
  InspectionInfo,
  LogisticsInfo,
  PackagingInfo,
  RetailInfo,
  MarketplaceInfo,
  BlockchainInfo,
} from '@/types/types';
import type { UniversalUser as User, ValidationMetadata } from '@/types/types';
import type { RegistrationData } from '@/core/types/adapter';

/**
 * User registration domain service
 * Contains business logic for user registration operations
 */
export class UserRegistrationService {
  /**
   * Validate user registration data
   */
  validateRegistrationData(data: RegistrationData): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Email validation
    if (!data.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    } else if (data.email.length > 255) {
      errors.push('Email must be less than 255 characters');
    }

    // Password validation
    if (!data.password) {
      errors.push('Password is required');
    } else {
      if (data.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      } else if (data.password.length > 128) {
        errors.push('Password must be less than 128 characters');
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
        errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
        errors.push('Password must contain at least one special character');
      }
    }

    // Name validation
    if (!data.name) {
      errors.push('Name is required');
    } else if (data.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (data.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.name)) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
    }

    // Role validation
    if (!data.role) {
      errors.push('Role is required');
    } else if (!['farmer', 'inspector', 'logistics', 'packaging', 'retailer', 'public', 'government', 'admin'].includes(data.role)) {
      errors.push('Invalid role specified');
    }

    // Additional data validation
    if (data.additionalData) {
      if (typeof data.additionalData !== 'object') {
        errors.push('Additional data must be an object');
      } else if (JSON.stringify(data.additionalData).length > 1000) {
        errors.push('Additional data is too large (max 1000 characters)');
      }
    }

    return {
      isValid: errors.length === 0 && warnings.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Create user entity from registration data
   */
  createUserFromRegistrationData(data: RegistrationData): Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'> & { _source: { type: 'mock' | 'api' | 'cache' | 'localStorage'; timestamp: string; adapterId?: string }; _validation: Record<string, unknown>; _normalized: boolean } {
    const now = new Date();

    return {
      email: data.email,
      name: data.name || '',
      role: data.role || 'farmer',
      profile: {
        bio: (typeof data.additionalData?.bio === 'string' ? data.additionalData.bio : '') || '',
        phone: (typeof data.additionalData?.phone === 'string' ? data.additionalData.phone : '') || '',
        address: (typeof data.additionalData?.address === 'string' ? data.additionalData.address : '') || '',
        avatarUrl: (typeof data.additionalData?.avatarUrl === 'string' ? data.additionalData.avatarUrl : '') || '',
        preferences: (data.additionalData?.preferences && typeof data.additionalData.preferences === 'object') ? data.additionalData.preferences as Record<string, unknown> : {},
      },
      isActive: false,
      userAccountStatus: 'pending_verification',
      emailVerified: false,
      farmInfo: data.additionalData?.farmInfo && Object.keys(data.additionalData.farmInfo).length > 0 ? data.additionalData.farmInfo as FarmInfo : undefined,
      inspectionInfo: data.additionalData?.inspectionInfo && Object.keys(data.additionalData.inspectionInfo).length > 0 ? data.additionalData.inspectionInfo as InspectionInfo : undefined,
      logisticsInfo: data.additionalData?.logisticsInfo && Object.keys(data.additionalData.logisticsInfo).length > 0 ? data.additionalData.logisticsInfo as LogisticsInfo : undefined,
      packagingInfo: data.additionalData?.packagingInfo && Object.keys(data.additionalData.packagingInfo).length > 0 ? data.additionalData.packagingInfo as PackagingInfo : undefined,
      retailInfo: data.additionalData?.retailInfo && Object.keys(data.additionalData.retailInfo).length > 0 ? data.additionalData.retailInfo as RetailInfo : undefined,
      marketplaceInfo: data.additionalData?.marketplaceInfo && Object.keys(data.additionalData.marketplaceInfo).length > 0 ? data.additionalData.marketplaceInfo as MarketplaceInfo : undefined,
      blockchainInfo: data.additionalData?.blockchainInfo && Object.keys(data.additionalData.blockchainInfo).length > 0 ? data.additionalData.blockchainInfo as BlockchainInfo : undefined,
      auditTrail: [{
        id: randomUUID(),
        action: 'user_registered',
        timestamp: now.toISOString(),
        userId: '', // Will be set after creation
        details: { registrationData: data },
      }],
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
        marketing: false,
        security: true,
        frequency: 'immediate',
      },
      securitySettings: {
        twoFactorEnabled: false,
        sessionTimeout: 30,
        allowedIPs: [],
        failedLoginAttempts: 0,
        accountLocked: false,
        lastPasswordChange: now,
        securityQuestions: [],
      },
      subscriptionInfo: {
        plan: 'basic',
        status: 'active',
        period: 'monthly',
        startDate: now,
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        autoRenew: false,
        features: ['basic_support', 'profile_visibility'],
      },
      privacySettings: {
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
      },
      _source: { type: 'mock' as const, timestamp: now.toISOString() },
      _validation: { isValid: true, validatedAt: now.toISOString() },
      _normalized: true,
    };
  }

  /**
   * Transform user entity for API response
   */
  transformUserForAPI(user: User): Omit<User, 'auditTrail' | 'notificationPreferences' | 'securitySettings' | 'subscriptionInfo' | 'privacySettings'> & { _source: { type: 'mock' | 'api' | 'cache' | 'localStorage'; timestamp: string; adapterId?: string }; _validation: Record<string, unknown>; _normalized: boolean } {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profile: user.profile,
      isActive: user.isActive,
      userAccountStatus: user.userAccountStatus,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
      farmInfo: user.farmInfo,
      inspectionInfo: user.inspectionInfo,
      logisticsInfo: user.logisticsInfo,
      packagingInfo: user.packagingInfo,
      retailInfo: user.retailInfo,
      marketplaceInfo: user.marketplaceInfo,
      blockchainInfo: user.blockchainInfo,
      _source: (user as User & { _source?: unknown })._source,
      _validation: (user as User & { _validation?: unknown })._validation as ValidationMetadata & Record<string, unknown>,
      _normalized: (user as User & { _normalized?: boolean })._normalized,
    };
  }

  /**
   * Calculate user completion percentage
   */
  calculateProfileCompletion(user: User): number {
    const profile = user.profile || {};
    const profileFields = [
      profile.bio,
      profile.phone,
      profile.address,
      profile.avatarUrl,
      profile.preferences && Object.keys(profile.preferences).length > 0,
    ].filter(Boolean);

    const totalProfileFields = 5; // bio, phone, address, avatarUrl, preferences
    return Math.round((profileFields.length / totalProfileFields) * 100);
  }

  /**
   * Check if user can access specific feature
   */
  canAccessFeature(user: User, feature: string): boolean {
    switch (user.role) {
    case 'farmer':
      return ['dashboard', 'products', 'certifications', 'inspections'].includes(feature);
    case 'inspector':
      return ['dashboard', 'inspections', 'reports', 'certifications'].includes(feature);
    case 'logistics':
      return ['dashboard', 'shipments', 'tracking', 'routes'].includes(feature);
    case 'packaging':
      return ['dashboard', 'packaging', 'quality_control', 'labeling'].includes(feature);
    case 'retailer':
      return ['dashboard', 'inventory', 'sales', 'customers'].includes(feature);
    case 'admin':
      return ['dashboard', 'users', 'system', 'analytics', 'reports'].includes(feature);
    default:
      return ['dashboard', 'profile'].includes(feature);
    }
  }

  /**
   * Get user's role display name
   */
  getRoleDisplayName(role: string): string {
    const roleNames: Record<string, string> = {
      farmer: 'Farmer',
      inspector: 'Inspector',
      logistics: 'Logistics Provider',
      packaging: 'Packaging Facility',
      retailer: 'Retailer',
      public: 'Public User',
      government: 'Government Official',
      admin: 'System Administrator',
    };
    return roleNames[role] || 'Unknown Role';
  }

  /**
   * Validate user profile update
   */
  validateProfileUpdate(user: User, updates: Partial<User>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Name validation
    if (updates.name !== undefined) {
      if (updates.name.length < 2) {
        errors.push('Name must be at least 2 characters long');
      } else if (updates.name.length > 100) {
        errors.push('Name must be less than 100 characters');
      } else if (!/^[a-zA-Z\s'-]+$/.test(updates.name)) {
        errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
      }
    }

    // Email validation (read-only for registration)
    if (updates.email !== undefined && updates.email !== user.email) {
      warnings.push('Email cannot be changed through profile update');
    }

    // Role validation (read-only for registration)
    if (updates.role !== undefined && updates.role !== user.role) {
      warnings.push('Role changes require admin approval');
    }

    // Profile validation
    if (updates.profile !== undefined) {
      if (updates.profile.bio !== undefined && updates.profile.bio.length > 500) {
        errors.push('Bio must be less than 500 characters');
      }

      if (updates.profile.phone !== undefined && !/^\+?[\d\s-]?\d[\s-]?\d$/.test(updates.profile.phone)) {
        errors.push('Invalid phone number format');
      }

      if (updates.profile.address !== undefined && updates.profile.address.length > 200) {
        errors.push('Address must be less than 200 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generate welcome message for user
   */
  generateWelcomeMessage(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>): string {
    const roleDisplayName = this.getRoleDisplayName(user.role);
    return `Welcome to Maroon Traceability, ${user.name}! You are registered as a ${roleDisplayName}. Your account has been created and is pending email verification.`;
  }

  /**
   * Check if user account is in good standing
   */
  isAccountInGoodStanding(user: User): boolean {
    const securitySettings = user.securitySettings || { accountLocked: false, failedLoginAttempts: 0 };
    return (
      user.userAccountStatus === 'active' &&
      (user.emailVerified || false) &&
      !securitySettings.accountLocked &&
      securitySettings.failedLoginAttempts < 5
    );
  }

  /**
   * Get user's subscription limits
   */
  getSubscriptionLimits(user: User): {
    maxProducts: number;
    maxTransactions: number;
    maxStorage: number;
    features: string[];
  } {
    switch (user.subscriptionInfo?.plan) {
    case 'basic':
      return {
        maxProducts: 10,
        maxTransactions: 50,
        maxStorage: 100, // MB
        features: ['basic_support', 'profile_visibility'],
      };
    case 'premium':
      return {
        maxProducts: 100,
        maxTransactions: 500,
        maxStorage: 1000, // MB
        features: ['basic_support', 'profile_visibility', 'advanced_analytics', 'priority_support'],
      };
    case 'enterprise':
      return {
        maxProducts: 1000,
        maxTransactions: 5000,
        maxStorage: 10000, // MB
        features: ['basic_support', 'profile_visibility', 'advanced_analytics', 'priority_support', 'custom_integrations', 'api_access'],
      };
    default:
      return {
        maxProducts: 10,
        maxTransactions: 50,
        maxStorage: 100,
        features: ['basic_support', 'profile_visibility'],
      };
    }
  }

  /**
   * Calculate user's account age
   */
  getAccountAge(user: User): number {
    const now = new Date();
    if (!user.createdAt) {
return 0;
}
    const created = new Date(user.createdAt);
    const diffTime = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Get user's activity status
   */
  getActivityStatus(user: User): {
    status: 'active' | 'idle' | 'inactive';
    lastActivity: Date;
    daysSinceLastActivity: number;
  } {
    const now = new Date();
    const lastActivitySource = user.lastLoginAt || user.createdAt;
    if (!lastActivitySource) {
      return {
        status: 'inactive',
        lastActivity: now,
        daysSinceLastActivity: 999,
      };
    }
    const lastActivity = new Date(lastActivitySource);
    const daysSinceLastActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'active' | 'idle' | 'inactive';
    if (daysSinceLastActivity === 0) {
      status = 'active';
    } else if (daysSinceLastActivity <= 7) {
      status = 'idle';
    } else {
      status = 'inactive';
    }

    return {
      status,
      lastActivity,
      daysSinceLastActivity,
    };
  }
}
