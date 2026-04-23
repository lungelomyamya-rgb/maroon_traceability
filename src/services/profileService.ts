// src/services/profileService.ts
// Profile service for managing user profile data

import { UniversalUser } from '@/types/user';
import { getAuthHeader } from '@/lib/authClient';

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  // Profile information from registration system
  profile?: {
    bio?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
    preferences?: Record<string, unknown>;
  };
  // Business information
  companyName?: string;
  registrationNumber?: string;
  taxNumber?: string;
  vatNumber?: string;
  businessType?: string;
  numberOfEmployees?: string;
  annualRevenue?: string;
  // Farm information
  farmSize?: string;
  livestockType?: string;
  // Domain-specific information
  farmInfo?: any;
  inspectionInfo?: any;
  logisticsInfo?: any;
  packagingInfo?: any;
  retailInfo?: any;
  marketplaceInfo?: any;
  blockchainInfo?: any;
  // Legacy additional_data support
  additional_data?: Record<string, unknown>;
}

/**
 * Profile Service
 * Handles profile updates for both demo and real accounts
 */
export class ProfileService {
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

  /**
   * Update user profile
   * For demo accounts: simulates the update
   * For real accounts: makes actual API call
   */
  static async updateProfile(
    userId: string, 
    updateData: ProfileUpdateData,
    isDemoAccount: boolean = false,
    authToken?: string
  ): Promise<UniversalUser> {
    const payload = {
      ...updateData,
      updatedAt: new Date().toISOString(),
      // Ensure profile structure is maintained
      profile: {
        bio: updateData.profile?.bio || '',
        phone: updateData.profile?.phone || updateData.phone || '',
        address: updateData.profile?.address || updateData.address || '',
        avatarUrl: updateData.profile?.avatarUrl || '',
        preferences: updateData.profile?.preferences || {},
      },
      // Map business and farm info to additional_data for legacy support
      additional_data: {
        ...updateData.additional_data,
        companyName: updateData.companyName,
        registrationNumber: updateData.registrationNumber,
        taxNumber: updateData.taxNumber,
        vatNumber: updateData.vatNumber,
        businessType: updateData.businessType,
        numberOfEmployees: updateData.numberOfEmployees,
        annualRevenue: updateData.annualRevenue,
        farmSize: updateData.farmSize,
        livestockType: updateData.livestockType,
        phone: updateData.phone,
        address: updateData.address,
        city: updateData.city,
        province: updateData.province,
        postalCode: updateData.postal_code,
      },
    };

    if (isDemoAccount) {
      // Simulate API call for demo accounts
      console.log('Demo: Simulating profile update for user', userId, payload);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock updated user with rich data structure
      return {
        id: userId,
        name: updateData.name || '',
        email: updateData.email || '',
        role: 'farmer', // This would come from the current user context
        phone: updateData.phone,
        address: updateData.address ? {
          street: updateData.address,
          city: updateData.city,
          state: updateData.province,
          postalCode: updateData.postal_code,
          formatted: `${updateData.address}, ${updateData.city}, ${updateData.province} ${updateData.postal_code}`
        } : undefined,
        profile: {
          bio: updateData.profile?.bio || '',
          phone: updateData.profile?.phone || updateData.phone || '',
          address: updateData.profile?.address || updateData.address || '',
          avatarUrl: updateData.profile?.avatarUrl || '',
          preferences: updateData.profile?.preferences || {},
        },
        farmInfo: updateData.farmSize || updateData.livestockType ? {
          farmSize: parseFloat(updateData.farmSize || '0'),
          livestockType: updateData.livestockType,
          location: { latitude: 0, longitude: 0 },
          certifications: [],
        } : undefined,
        retailInfo: updateData.companyName ? {
          companyName: updateData.companyName,
          registrationNumber: updateData.registrationNumber,
          taxNumber: updateData.taxNumber,
          vatNumber: updateData.vatNumber,
          businessType: updateData.businessType,
          numberOfEmployees: parseInt(updateData.numberOfEmployees || '0'),
          annualRevenue: parseFloat(updateData.annualRevenue || '0'),
        } : undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _source: {
          type: 'mock',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      } as unknown as UniversalUser;
    } else {
      // For real accounts, use the provided auth token or skip if no token
      if (!authToken) {
        console.log('No auth token provided for real account, skipping API call');
        throw new Error('Authentication required for profile updates');
      }
      
      // Real API call for production accounts
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        };

        const response = await fetch(`${this.API_BASE_URL}/users/${userId}/profile`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const apiResponse = await response.json();
        
        // Return just the data field from the API response
        const updatedUser = apiResponse.data || apiResponse;
        return updatedUser;
      } catch (error) {
        console.error('Profile update API error:', error);
        
        // Re-throw with more user-friendly message
        if (error instanceof Error) {
          throw new Error(`Failed to update profile: ${error.message}`);
        }
        throw new Error('Failed to update profile. Please try again.');
      }
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: string, isDemoAccount: boolean = false, authToken?: string): Promise<UniversalUser> {
    if (isDemoAccount) {
      // Return demo user data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id: userId,
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'farmer',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _source: {
          type: 'mock',
          timestamp: new Date().toISOString(),
        },
        _validation: {
          isValid: true,
          validatedAt: new Date().toISOString(),
        },
        _normalized: true,
      } as unknown as UniversalUser;
    } else {
      // For real accounts, use the provided auth token or skip if no token
      if (!authToken) {
        console.log('No auth token provided for real account, skipping API call');
        throw new Error('Authentication required for profile access');
      }
      
      // Real API call
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${authToken}`,
      };

      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/profile`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      return await response.json();
    }
  }

  /**
   * Validate profile data before submission
   */
  static validateProfileData(data: ProfileUpdateData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (data.name && data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }

    // Phone validation (optional but if provided, must be valid)
    if (data.phone && !/^[+]?[\d\s\-()]+$/.test(data.phone)) {
      errors.push('Please enter a valid phone number');
    }

    // Postal code validation (optional but if provided, must be reasonable)
    if (data.postal_code && !/^[a-zA-Z0-9\s-]{3,10}$/.test(data.postal_code)) {
      errors.push('Please enter a valid postal code');
    }

    // Business validation
    if (data.companyName && data.companyName.trim().length < 2) {
      errors.push('Company name must be at least 2 characters long');
    }

    // Farm size validation
    if (data.farmSize && isNaN(parseFloat(data.farmSize))) {
      errors.push('Farm size must be a valid number');
    }

    // Number of employees validation
    if (data.numberOfEmployees && isNaN(parseInt(data.numberOfEmployees))) {
      errors.push('Number of employees must be a valid number');
    }

    // Annual revenue validation
    if (data.annualRevenue && isNaN(parseFloat(data.annualRevenue))) {
      errors.push('Annual revenue must be a valid number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
