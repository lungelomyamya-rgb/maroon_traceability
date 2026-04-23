// src/__tests__/utils/profileDataMapper.test.ts
// Tests for profile data mapping utilities

import { 
  extractProfileData, 
  createUpdateData, 
  hasBusinessInfo, 
  hasFarmInfo, 
  formatFarmSize, 
  getDisplayValue 
} from '@/utils/profileDataMapper';
import type { UniversalUser, User } from '@/types/user';

describe('Profile Data Mapper', () => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'farmer',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'Cape Town',
      state: 'Western Cape',
      postalCode: '8001',
      formatted: '123 Main St, Cape Town, Western Cape 8001'
    },
    isActive: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockUniversalUser: UniversalUser = {
    ...mockUser,
    profile: {
      bio: 'Farmer and entrepreneur',
      phone: '+1234567890',
      address: '123 Main St',
      avatarUrl: 'https://example.com/avatar.jpg',
      preferences: { theme: 'dark' },
    },
    farmInfo: {
      name: 'Test Farm',
      location: { latitude: -33.9249, longitude: 18.4241, address: '123 Farm Rd', city: 'Cape Town', country: 'South Africa' },
      size: 100,
      certifications: [
        { type: 'organic', issuedBy: 'Organic Cert Board', issuedDate: '2023-01-01', expiryDate: '2025-01-01' },
        { type: 'sustainable', issuedBy: 'Green Cert Board', issuedDate: '2023-02-01', expiryDate: '2026-02-01' }
      ],
      products: [],
    },
    _source: {
      type: 'mock',
      timestamp: '2023-01-01T00:00:00.000Z',
    },
    _validation: {
      isValid: true,
      validatedAt: '2023-01-01T00:00:00.000Z',
    },
    _normalized: true,
  };

  const mockRetailer: UniversalUser = {
    ...mockUser,
    role: 'retailer',
    retailInfo: {
      storeId: 'STORE123',
      storeName: 'Green Grocers',
      location: {
        address: '456 Market St',
        city: 'Cape Town',
        country: 'South Africa',
        coordinates: { latitude: -33.9249, longitude: 18.4241 }
      },
      contact: {
        phone: '+27211234567',
        email: 'info@greengrocers.co.za',
        manager: 'John Smith'
      },
      salesHistory: [],
    },
    _source: {
      type: 'mock',
      timestamp: '2023-01-01T00:00:00.000Z',
    },
    _validation: {
      isValid: true,
      validatedAt: '2023-01-01T00:00:00.000Z',
    },
    _normalized: true,
  };

  describe('extractProfileData', () => {
    it('should extract data from UniversalUser', () => {
      const result = extractProfileData(mockUniversalUser);
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('John Doe');
      expect(result?.email).toBe('john@example.com');
      expect(result?.phone).toBe('+1234567890');
      expect(result?.address).toBe('123 Main St');
      expect(result?.city).toBe('Cape Town');
      expect(result?.province).toBe('Western Cape');
      expect(result?.postal_code).toBe('8001');
      expect(result?.bio).toBe('Farmer and entrepreneur');
      expect(result?.avatarUrl).toBe('https://example.com/avatar.jpg');
    });

    it('should extract data from User with address object', () => {
      const result = extractProfileData(mockUser);
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('John Doe');
      expect(result?.email).toBe('john@example.com');
      expect(result?.phone).toBe('+1234567890');
      expect(result?.address).toBe('123 Main St');
      expect(result?.city).toBe('Cape Town');
      expect(result?.province).toBe('Western Cape');
      expect(result?.postal_code).toBe('8001');
    });

    it('should return null for null user', () => {
      const result = extractProfileData(null);
      expect(result).toBeNull();
    });

    it('should handle missing fields gracefully', () => {
      const minimalUser: User = {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'public',
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      const result = extractProfileData(minimalUser);
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Jane Doe');
      expect(result?.email).toBe('jane@example.com');
      expect(result?.phone).toBe('');
      expect(result?.address).toBe('');
      expect(result?.city).toBe('');
      expect(result?.province).toBe('');
      expect(result?.postal_code).toBe('');
    });
  });

  describe('hasBusinessInfo', () => {
    it('should return true for retailer with business data', () => {
      expect(hasBusinessInfo(mockRetailer)).toBe(true);
    });

    it('should return true for user with additional_data company', () => {
      const userWithCompany = {
        ...mockUser,
        additional_data: {
          companyName: 'Test Company',
        },
      };
      expect(hasBusinessInfo(userWithCompany)).toBe(true);
    });

    it('should return false for regular user', () => {
      expect(hasBusinessInfo(mockUser)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(hasBusinessInfo(null)).toBe(false);
    });
  });

  describe('hasFarmInfo', () => {
    it('should return true for farmer with farm data', () => {
      expect(hasFarmInfo(mockUniversalUser)).toBe(true);
    });

    it('should return true for user with additional_data farm', () => {
      const userWithFarm = {
        ...mockUser,
        additional_data: {
          farmSize: '50',
        },
      };
      expect(hasFarmInfo(userWithFarm)).toBe(true);
    });

    it('should return false for regular user', () => {
      expect(hasFarmInfo(mockRetailer)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(hasFarmInfo(null)).toBe(false);
    });
  });

  describe('formatFarmSize', () => {
    it('should format number correctly', () => {
      expect(formatFarmSize(100)).toBe('100 hectares');
    });

    it('should format string correctly', () => {
      expect(formatFarmSize('150')).toBe('150 hectares');
    });

    it('should return Not provided for undefined', () => {
      expect(formatFarmSize(undefined)).toBe('Not provided');
    });

    it('should return Not provided for invalid string', () => {
      expect(formatFarmSize('invalid')).toBe('Not provided');
    });
  });

  describe('getDisplayValue', () => {
    it('should return first available value', () => {
      const result = getDisplayValue(mockUniversalUser, 'phone', 'profile.phone', 'additional_data.phone');
      expect(result).toBe('+1234567890');
    });

    it('should return Not provided for null user', () => {
      const result = getDisplayValue(null, 'phone');
      expect(result).toBe('Not provided');
    });

    it('should return Not provided for missing fields', () => {
      const result = getDisplayValue(mockUser, 'nonexistent.field');
      expect(result).toBe('Not provided');
    });

    it('should handle nested properties', () => {
      const result = getDisplayValue(mockUniversalUser, 'address.street');
      expect(result).toBe('123 Main St');
    });
  });

  describe('createUpdateData', () => {
    it('should create update data structure', () => {
      const formData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '+9876543210',
        address: '456 New St',
        city: 'Johannesburg',
        province: 'Gauteng',
        postal_code: '2000',
        companyName: 'New Company',
        farmSize: '200',
        livestockType: 'sheep',
        farmName: 'Updated Farm',
      };

      const result = createUpdateData(formData, mockUniversalUser);

      expect(result.name).toBe('Updated Name');
      expect(result.email).toBe('updated@example.com');
      expect(result.phone).toBe('+9876543210');
      expect(result.address).toBe('456 New St');
      expect(result.city).toBe('Johannesburg');
      expect(result.province).toBe('Gauteng');
      expect(result.postal_code).toBe('2000');
      expect(result.companyName).toBe('New Company');
      expect(result.farmSize).toBe('200');
      expect(result.livestockType).toBe('sheep');
      expect(result.profile?.phone).toBe('+9876543210');
      expect(result.profile?.address).toBe('456 New St');
    });

    it('should preserve existing profile data', () => {
      const formData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const result = createUpdateData(formData, mockUniversalUser);

      expect(result.profile?.bio).toBe('Farmer and entrepreneur');
      expect(result.profile?.avatarUrl).toBe('https://example.com/avatar.jpg');
    });

    it('should create farmInfo for farmers', () => {
      const formData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        farmSize: '250',
        livestockType: 'goats',
        farmName: 'Updated Farm',
      };

      const result = createUpdateData(formData, mockUniversalUser);

      expect(result.farmInfo).toBeDefined();
      expect(result.farmInfo?.name).toBe('Updated Farm');
      expect(result.farmInfo?.size).toBe(250);
    });

    it('should create retailInfo for businesses', () => {
      const formData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        companyName: 'Test Business',
        registrationNumber: 'REG123',
        taxNumber: 'TAX456',
        businessType: 'retail',
        numberOfEmployees: '25',
        annualRevenue: '500000',
      };

      const result = createUpdateData(formData, mockRetailer);

      expect(result.retailInfo).toBeDefined();
      expect(result.retailInfo?.storeName).toBe('Test Business');
      expect(result.retailInfo?.storeId).toBe('STORE123');
    });
  });
});
