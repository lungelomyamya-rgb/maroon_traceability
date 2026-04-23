// src/constants/users.ts

import { User } from '@/types/types';

export const DEMO_USERS: User[] = [
  {
    id: 'user_1',
    name: 'John Farmer',
    email: 'john@farm.com',
    role: 'farmer',
    phone: '+27 21 555 0101',
    address: {
      street: '123 Farm Road',
      city: 'Stellenbosch',
      state: 'Western Cape',
      postalCode: '7600',
      formatted: '123 Farm Road, Stellenbosch, Western Cape 7600'
    },
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-04-20T14:30:00Z',
    lastLoginAt: '2024-04-22T09:15:00Z',
    emailVerified: true,
    // Extended data for demo - using metadata for additional fields
    metadata: {
      bio: 'Passionate organic farmer with 10 years of experience in sustainable agriculture.',
      farmSize: '50',
      farmName: 'Green Valley Farm',
      livestockType: 'None',
      companyName: '',
      registrationNumber: '',
      taxNumber: '',
      vatNumber: '',
      businessType: '',
      numberOfEmployees: '',
      annualRevenue: '',
      phone: '+27 21 555 0101',
      address: '123 Farm Road',
      city: 'Stellenbosch',
      province: 'Western Cape',
      postalCode: '7600'
    }
  },
  {
    id: 'user_2',
    name: 'Jane Inspector',
    email: 'jane@inspect.com',
    role: 'inspector',
    phone: '+27 12 555 0202',
    address: {
      street: '456 Quality Avenue',
      city: 'Pretoria',
      state: 'Gauteng',
      postalCode: '0001',
      formatted: '456 Quality Avenue, Pretoria, Gauteng 0001'
    },
    isActive: true,
    createdAt: '2024-02-10T10:30:00Z',
    updatedAt: '2024-04-18T16:45:00Z',
    lastLoginAt: '2024-04-21T11:20:00Z',
    emailVerified: true,
    metadata: {
      bio: 'Certified agricultural inspector with 8 years of experience in quality control.',
      phone: '+27 12 555 0202',
      address: '456 Quality Avenue',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0001'
    }
  },
  {
    id: 'user_3',
    name: 'Bob Retailer',
    email: 'bob@retail.com',
    role: 'retailer',
    phone: '+27 11 555 0303',
    address: {
      street: '789 Market Street',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2000',
      formatted: '789 Market Street, Johannesburg, Gauteng 2000'
    },
    isActive: true,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-04-19T12:00:00Z',
    lastLoginAt: '2024-04-22T08:30:00Z',
    emailVerified: true,
    metadata: {
      bio: 'Retail store owner specializing in fresh produce and organic products.',
      companyName: 'Fresh Market',
      registrationNumber: 'REG-2024-001',
      taxNumber: 'TAX-123456',
      vatNumber: 'VAT-789012',
      businessType: 'Retail Store',
      numberOfEmployees: '15',
      annualRevenue: '2500000',
      phone: '+27 11 555 0303',
      address: '789 Market Street',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2000'
    }
  },
  {
    id: 'user_4',
    name: 'Mike Logistics',
    email: 'mike@logistics.com',
    role: 'logistics',
    phone: '+27 31 555 0404',
    address: {
      street: '321 Transport Way',
      city: 'Durban',
      state: 'KwaZulu-Natal',
      postalCode: '4001',
      formatted: '321 Transport Way, Durban, KwaZulu-Natal 4001'
    },
    isActive: true,
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-04-20T10:15:00Z',
    lastLoginAt: '2024-04-21T14:45:00Z',
    emailVerified: true,
    metadata: {
      bio: 'Logistics coordinator specializing in cold chain transportation for agricultural products.',
      phone: '+27 31 555 0404',
      address: '321 Transport Way',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001'
    }
  },
  {
    id: 'user_5',
    name: 'Sarah Packaging',
    email: 'sarah@packaging.com',
    role: 'packaging',
    phone: '+27 21 555 0505',
    address: {
      street: '654 Packaging Boulevard',
      city: 'Cape Town',
      state: 'Western Cape',
      postalCode: '8000',
      formatted: '654 Packaging Boulevard, Cape Town, Western Cape 8000'
    },
    isActive: true,
    createdAt: '2024-02-15T13:30:00Z',
    updatedAt: '2024-04-18T15:20:00Z',
    lastLoginAt: '2024-04-22T07:45:00Z',
    emailVerified: true,
    metadata: {
      bio: 'Packaging specialist focused on sustainable and eco-friendly packaging solutions.',
      companyName: 'EcoPack Solutions',
      registrationNumber: 'REG-2024-002',
      taxNumber: 'TAX-234567',
      vatNumber: 'VAT-345678',
      businessType: 'Packaging Manufacturing',
      numberOfEmployees: '50',
      annualRevenue: '5000000',
      phone: '+27 21 555 0505',
      address: '654 Packaging Boulevard',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8000'
    }
  },
  {
    id: 'user_6',
    name: 'Tom Public',
    email: 'tom@public.com',
    role: 'public',
    phone: '+27 83 555 0606',
    address: {
      street: '987 Consumer Lane',
      city: 'Port Elizabeth',
      state: 'Eastern Cape',
      postalCode: '6001',
      formatted: '987 Consumer Lane, Port Elizabeth, Eastern Cape 6001'
    },
    isActive: true,
    createdAt: '2024-03-10T16:00:00Z',
    updatedAt: '2024-04-19T09:30:00Z',
    lastLoginAt: '2024-04-21T18:15:00Z',
    emailVerified: false,
    metadata: {
      bio: 'Consumer interested in traceability and sustainable agriculture.',
      phone: '+27 83 555 0606',
      address: '987 Consumer Lane',
      city: 'Port Elizabeth',
      province: 'Eastern Cape',
      postalCode: '6001'
    }
  },
  {
    id: 'user_7',
    name: 'Lisa Government',
    email: 'lisa@gov.za',
    role: 'government',
    phone: '+27 12 555 0707',
    address: {
      street: '147 Government Plaza',
      city: 'Pretoria',
      state: 'Gauteng',
      postalCode: '0002',
      formatted: '147 Government Plaza, Pretoria, Gauteng 0002'
    },
    isActive: true,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-04-20T11:00:00Z',
    lastLoginAt: '2024-04-22T09:00:00Z',
    emailVerified: true,
    metadata: {
      bio: 'Government official overseeing agricultural policy and food safety regulations.',
      phone: '+27 12 555 0707',
      address: '147 Government Plaza',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0002'
    }
  },
  {
    id: 'user_8',
    name: 'James SAPS',
    email: 'james@saps.gov.za',
    role: 'saps',
    phone: '+27 12 555 0808',
    address: {
      street: '258 Security Street',
      city: 'Pretoria',
      state: 'Gauteng',
      postalCode: '0003',
      formatted: '258 Security Street, Pretoria, Gauteng 0003'
    },
    isActive: true,
    createdAt: '2024-02-20T08:30:00Z',
    updatedAt: '2024-04-19T13:45:00Z',
    lastLoginAt: '2024-04-21T16:30:00Z',
    emailVerified: true,
    metadata: {
      bio: 'South African Police Service officer specializing in agricultural crime investigation.',
      phone: '+27 12 555 0808',
      address: '258 Security Street',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0003'
    }
  },
];
