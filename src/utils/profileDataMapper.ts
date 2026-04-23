// src/utils/profileDataMapper.ts
// Utility functions for mapping between different user data structures

import type { UniversalUser, User } from '@/types/user';

/**
 * Union type for user objects that can be User or UniversalUser
 */
type UserUnion = User | UniversalUser | null;

/**
 * Extract profile information from User with multiple data sources
 */
export function extractProfileData(user: UserUnion) {
  if (!user) return null;

  // Extract data from multiple possible sources
  const profile = (user as any).profile || {};
  const additionalData = (user as any).additional_data || {};
  const metadata = (user as any).metadata || {};
  const farmInfo = (user as any).farmInfo || {};
  const retailInfo = (user as any).retailInfo || {};
  
  // Handle address object vs string
  const addressObj = (user as any).address;
  let addressString = '';
  let cityString = '';
  let provinceString = '';
  let postalCodeString = '';
  
  if (addressObj && typeof addressObj === 'object') {
    addressString = addressObj.street || '';
    cityString = addressObj.city || '';
    provinceString = addressObj.state || '';
    postalCodeString = addressObj.postalCode || '';
  } else {
    addressString = addressObj || additionalData.address || profile.address || metadata.address || '';
    cityString = (user as any).city || additionalData.city || metadata.city || '';
    provinceString = (user as any).province || additionalData.province || metadata.province || '';
    postalCodeString = (user as any).postal_code || additionalData.postalCode || metadata.postalCode || '';
  }

  return {
    // Basic info
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || profile.phone || additionalData.phone || metadata.phone || '',
    
    // Address
    address: addressString,
    city: cityString,
    province: provinceString,
    postal_code: postalCodeString,
    
    // Business info - check all possible sources including metadata
    companyName: retailInfo.storeName || additionalData.companyName || metadata.companyName || '',
    registrationNumber: additionalData.registrationNumber || metadata.registrationNumber || '',
    taxNumber: additionalData.taxNumber || metadata.taxNumber || '',
    vatNumber: additionalData.vatNumber || metadata.vatNumber || '',
    businessType: additionalData.businessType || metadata.businessType || '',
    numberOfEmployees: additionalData.numberOfEmployees || metadata.numberOfEmployees || '',
    annualRevenue: additionalData.annualRevenue || metadata.annualRevenue || '',
    
    // Farm info - check all possible sources including metadata
    farmSize: farmInfo.size ? farmInfo.size.toString() : additionalData.farmSize || metadata.farmSize || '',
    farmName: farmInfo.name || additionalData.farmName || metadata.farmName || '',
    livestockType: additionalData.livestockType || metadata.livestockType || '',
    
    // Profile metadata - check additional_data first for real users
    preferences: profile.preferences || metadata.preferences || additionalData.preferences || {},
    
    // Avatar URL - check all possible sources
    avatarUrl: (user as any).avatar || profile.avatarUrl || additionalData.avatarUrl || metadata.avatarUrl || '',
    
    // Bio/description - check all possible sources
    bio: profile.bio || additionalData.bio || metadata.bio || (user as any).bio || '',
  };
}

/**
 * Create rich user data structure from form data for updates
 */
export function createUpdateData(formData: any, currentUser: UserUnion) {
  return {
    name: formData.name,
    email: formData.email,
    phone: formData.phone || undefined,
    address: formData.address || undefined,
    city: formData.city || undefined,
    province: formData.province || undefined,
    postal_code: formData.postal_code || undefined,
    
    // Profile structure
    profile: {
      bio: (currentUser as any)?.profile?.bio || '',
      phone: formData.phone || '',
      address: formData.address || '',
      avatarUrl: (currentUser as any)?.profile?.avatarUrl || '',
      preferences: (currentUser as any)?.profile?.preferences || {},
    },
    
    // Business information
    companyName: formData.companyName || undefined,
    registrationNumber: formData.registrationNumber || undefined,
    taxNumber: formData.taxNumber || undefined,
    vatNumber: formData.vatNumber || undefined,
    businessType: formData.businessType || undefined,
    numberOfEmployees: formData.numberOfEmployees || undefined,
    annualRevenue: formData.annualRevenue || undefined,
    
    // Farm information
    farmSize: formData.farmSize || undefined,
    livestockType: formData.livestockType || undefined,
    
    // Domain-specific information
    farmInfo: formData.farmSize || formData.farmName ? {
      name: formData.farmName || '',
      size: parseFloat(formData.farmSize || '0'),
      location: (currentUser as any)?.farmInfo?.location || { latitude: 0, longitude: 0, address: '', city: '', country: '' },
      certifications: (currentUser as any)?.farmInfo?.certifications || [],
      products: (currentUser as any)?.farmInfo?.products || [],
    } : undefined,
    
    retailInfo: formData.companyName ? {
      storeId: (currentUser as any)?.retailInfo?.storeId || '',
      storeName: formData.companyName,
      location: (currentUser as any)?.retailInfo?.location || { address: '', city: '', country: '', coordinates: { latitude: 0, longitude: 0 } },
      contact: (currentUser as any)?.retailInfo?.contact || { phone: '', email: '', manager: '' },
      salesHistory: (currentUser as any)?.retailInfo?.salesHistory || [],
    } : undefined,
    
    // Legacy additional_data for compatibility
    additional_data: {
      ...(currentUser as any)?.additional_data,
      companyName: formData.companyName,
      farmName: formData.farmName,
      farmSize: formData.farmSize,
      livestockType: formData.livestockType,
      businessType: formData.businessType,
      numberOfEmployees: formData.numberOfEmployees,
      annualRevenue: formData.annualRevenue,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postal_code,
      avatarUrl: formData.avatarUrl,
    },
  };
}

/**
 * Check if user has business information
 */
export function hasBusinessInfo(user: UserUnion): boolean {
  if (!user) return false;
  
  return !!(
    user.role === 'retailer' ||
    (user as any).retailInfo?.companyName ||
    (user as any).additional_data?.companyName
  );
}

/**
 * Check if user has farm information
 */
export function hasFarmInfo(user: UserUnion): boolean {
  if (!user) return false;
  
  return !!(
    user.role === 'farmer' ||
    (user as any).farmInfo?.farmSize ||
    (user as any).additional_data?.farmSize
  );
}

/**
 * Format farm size for display
 */
export function formatFarmSize(farmSize: number | string | undefined): string {
  if (!farmSize) return 'Not provided';
  const size = typeof farmSize === 'string' ? parseFloat(farmSize) : farmSize;
  return isNaN(size) ? 'Not provided' : `${size} hectares`;
}

/**
 * Get display value with fallback from multiple sources
 */
export function getDisplayValue(user: UserUnion, ...sources: string[]): string {
  if (!user) return 'Not provided';
  
  for (const source of sources) {
    const value = getNestedProperty(user, source);
    if (value && value !== '') return value;
  }
  
  return 'Not provided';
}

/**
 * Get nested property from object using dot notation
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
