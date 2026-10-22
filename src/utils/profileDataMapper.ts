// src/utils/profileDataMapper.ts
// Utility functions for mapping between different user data structures

import type { UniversalUser, User } from '@/types/user';

/**
 * Union type for user objects that can be User or UniversalUser
 */
type UserUnion = User | UniversalUser | null;

type LooseRecord = Record<string, unknown>;

type LooseProfileSource = {
  profile?: LooseRecord;
  additional_data?: LooseRecord;
  metadata?: LooseRecord;
  farmInfo?: LooseRecord;
  retailInfo?: LooseRecord;
  address?: string | LooseRecord;
  city?: string;
  province?: string;
  postal_code?: string;
  avatar?: string;
  bio?: string;
}

type ProfileFormData = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  companyName?: string;
  registrationNumber?: string;
  taxNumber?: string;
  vatNumber?: string;
  businessType?: string;
  numberOfEmployees?: string;
  annualRevenue?: string;
  farmSize?: string;
  farmName?: string;
  livestockType?:string;
  avatarUrl?: string;
};

function asProfileSource(user: UserUnion): LooseProfileSource {
  return (user ?? {}) as LooseProfileSource;
}

function readText(source: LooseRecord | undefined, key: string): string {
  const value = source?.[key];
  return typeof value === 'string' ? value : '';
}

function asStringRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return{};
}

/**
 * Extract profile information from User with multiple data sources
 */
export function extractProfileData(user: UserUnion) {
  if (!user) {
    return null;
  }

  const source = asProfileSource(user);
  const profile = source.profile ?? {};
  const additionalData = source.additional_data ?? {};
  const metadata = source.metadata ?? {};
  const farmInfo = source.farmInfo ?? {};
  const retailInfo = source.retailInfo ?? {};

  // Handle address object vs string
  const addressObj = source.address;
  let addressString = '';
  let cityString = '';
  let provinceString = '';
  let postalCodeString = '';

  if (addressObj && typeof addressObj === 'object') {
    addressString = readText(addressObj, 'street');
    cityString = readText(addressObj, 'city');
    provinceString = readText(addressObj, 'state');
    postalCodeString = readText(addressObj, 'postalCode');
  } else {
    addressString = (typeof addressObj === 'string' ? addressObj : '')
      || readText(additionalData, 'address')
      || readText(profile, 'address')
      || readText(metadata, 'address');
    cityString = source.city || readText(additionalData, 'city') || readText(metadata, 'city');
    provinceString = source.province || readText(additionalData, 'province') || readText(metadata, 'province');
    postalCodeString = source.postal_code || readText(additionalData, 'postalCode') || readText(metadata, 'postalCode');
  }

  const farmSizeValue = farmInfo.size;
  const farmSizeText = typeof farmSizeValue === 'number' || typeof farmSizeValue === 'string'
    ? String(farmSizeValue)
    : readText(additionalData, 'farmSize') ||readText(metadata, 'farmSize');

  return {
    // Basic info
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || readText(profile, 'phone') || readText(additionalData, 'phone') || readText(metadata, 'phone'),

    // Address
    address: addressString,
    city: cityString,
    province: provinceString,
    postal_code: postalCodeString,

    // Business info - check all possible sources including metadata
    companyName: readText(retailInfo, 'storeName') || readText(additionalData, 'companyName') || readText(metadata, 'companyName'),
    registrationNumber: readText(additionalData, 'registrationNumber') || readText(metadata, 'registrationNumber'),
    taxNumber: readText(additionalData, 'taxNumber') || readText(metadata, 'taxNumber'),
    vatNumber: readText(additionalData, 'vatNumber') || readText(metadata, 'vatNumber'),
    businessType: readText(additionalData, 'businessType') || readText(metadata, 'businessType'),
    numberOfEmployees: readText(additionalData, 'numberOfEmployees') || readText(metadata, 'numberOfEmployees'),
    annualRevenue: readText(additionalData, 'annualRevenue') || readText(metadata, 'annualRevenue'),

    // Farm info - check all possible sources including metadata
    farmSize: farmSizeText,
    farmName: readText(farmInfo, 'name') || readText(additionalData, 'farmName') || readText(metadata, 'farmName'),
    livestockType: readText(additionalData, 'livestockType') || readText(metadata, 'livestockType'),

    // Profile metadata - check additional_data first for real users
    preferences: (profile.preferences && typeof profile.preferences === 'object' ? profile.preferences : undefined)
    || (metadata.preferences && typeof metadata.preferences ==='object' ? metadata.preferences: undefined)
    || (additionalData.preferences && typeof additionalData.preferences === 'object' ? additionalData.preferences : undefined)
    || {},

    // Avatar URL - check all possible sources
    avatarUrl: source.avatar || readText(profile, 'avatarUrl') || readText(additionalData, 'avatarUrl') || readText(metadata, 'avatarUrl'),

    // Bio/description - check all possible sources
    bio: readText(profile, 'bio') || readText(additionalData, 'bio') || readText(metadata, 'bio') || source.bio || '',
  };
}

/**
 * Create rich user data structure from form data for updates
 */
export function createUpdateData(formData: ProfileFormData, currentUser: UserUnion) {
  const source = asProfileSource(currentUser);
  const currentFarmInfo = source.farmInfo ?? {};
  const currentRetailInfo = source.retailInfo ?? {};

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
      bio: readText(source.profile, 'bio'),
      phone: formData.phone || '',
      address: formData.address || '',
      avatarUrl: readText(source.profile, 'avatarUrl'),
      preferences: asStringRecord(source.profile?.preferences),
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
      location: currentFarmInfo.location || { latitude: 0, longitude: 0, address: '', city: '', country: '' },
      certifications: Array.isArray(currentFarmInfo.certifications) ? currentFarmInfo.certifications : [],
      products: Array.isArray(currentFarmInfo.products) ? currentFarmInfo.products : [],
    } : undefined,

    retailInfo: formData.companyName ? {
      storeId: readText(currentRetailInfo, 'storeId'),
      storeName: formData.companyName,
      location: currentRetailInfo.location || { address: '', city: '', country: '', coordinates: { latitude: 0, longitude: 0 } },
      contact: currentRetailInfo.contact || { phone: '', email: '', manager: '' },
      salesHistory: Array.isArray(currentRetailInfo.salesHistory) ? currentRetailInfo.salesHistory : [],
    } : undefined,

    // Legacy additional_data for compatibility
    additional_data: {
      ...source.additional_data,
      companyName: formData.companyName,
      farmName: formData.farmName,
      farmSize: formData.farmSize,
      livestockType: formData.livestockType,
      businessType: formData.businessType,
      numberOfEmployees: formData.numberOfEmployees,
      annualRevenue: formData.annualRevenue,
      avatarUrl: formData.avatarUrl,
    },
  };
}

/**
 * Check if user has business information
 */
export function hasBusinessInfo(user: UserUnion): boolean {
  if (!user) {
    return false;
  }

  const source = asProfileSource(user);
  return !!(
    user.role === 'retailer'
    || readText(source.retailInfo, 'companyName')
    || readText(source.additional_data, 'companyName')
  );
}

/**
 * Check if user has farm information
 */
export function hasFarmInfo(user: UserUnion): boolean {
  if (!user) {
    return false;
  }

  const source = asProfileSource(user);
  return !!(
    user.role === 'farmer'
    || readText(source.farmInfo, 'farmSize')
    || source.farmInfo?.size
    ||readText(source.additional_data, 'farmSize')
  );
}

/**
 * Format farm size for display
 */
export function formatFarmSize(farmSize: number | string | undefined): string {
  if (!farmSize) {
    return 'Not provided';
  }

  const size = typeof farmSize === 'string' ? parseFloat(farmSize) : farmSize;
  return isNaN(size) ? 'Not provided' : `${size} hectares`;
}

/**
 * Get display value with fallback from multiple sources
 */
export function getDisplayValue(user: UserUnion, ...sources: string[]): string {
  if (!user) {
    return 'Not provided';
  }

  for (const source of sources) {
    const value = getNestedProperty(user, source);
    if (value && value !== '') {
      return value;
    }
  }

  return 'Not provided';
}

/**
 * Get nested property from object using dot notation
 */
function getNestedProperty(obj: unknown, path: string): string {
  const value = path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as LooseRecord)[key];
    }
    return undefined;
  }, obj);

  return typeof value === 'string' ? value : '';
}
