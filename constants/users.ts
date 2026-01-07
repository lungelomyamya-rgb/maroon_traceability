// src/constants/users.ts

import { User, UserRole } from '@/types/user';

export const DEMO_USERS: User[] = [
  {
    id: 'user_1',
    name: 'John Farmer',
    email: 'john@farm.com',
    role: 'farmer',
    permissions: {
      canCreate: true,
      canVerify: false
    }
  },
  {
    id: 'user_2',
    name: 'Jane Inspector',
    email: 'jane@inspect.com',
    role: 'inspector',
    permissions: {
      canCreate: false,
      canVerify: true
    }
  },
  {
    id: 'user_3',
    name: 'Bob Retailer',
    email: 'bob@retail.com',
    role: 'retailer',
    permissions: {
      canCreate: false,
      canVerify: true
    }
  },
  {
    id: 'user_4',
    name: 'Alice Logistics',
    email: 'alice@logistics.com',
    role: 'logistics',
    permissions: {
      canCreate: false,
      canVerify: false
    }
  },
  {
    id: 'user_5',
    name: 'Charlie Packaging',
    email: 'charlie@packaging.com',
    role: 'packaging',
    permissions: {
      canCreate: true,
      canVerify: false
    }
  },
  {
    id: 'user_6',
    name: 'Dana Viewer',
    email: 'dana@viewer.com',
    role: 'viewer',
    permissions: {
      canCreate: false,
      canVerify: false
    }
  },
  {
    id: 'user_7',
    name: 'Eve Government',
    email: 'eve@gov.com',
    role: 'government',
    permissions: {
      canCreate: false,
      canVerify: true
    }
  }
];
