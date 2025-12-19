// src/constants/users.ts
import { User, UserRole } from '@/types/user';

export const DEMO_USERS: ReadonlyArray<User> = [
  { id: 'maroon-farmer', name: 'Farmer Joe', role: 'farmer' },
  { id: 'maroon-retailer', name: 'Retailer Mary', role: 'retailer' },
  { id: 'maroon-inspector', name: 'Inspector Alex', role: 'inspector' },
  { id: 'maroon-logistics', name: 'Logistics Team', role: 'logistics' },
  { id: 'maroon-packaging', name: 'Packaging Team', role: 'packaging' },
] as const;