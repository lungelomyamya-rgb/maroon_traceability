// src/types/user.ts
import { LucideIcon } from 'lucide-react';

export type UserRole = 'farmer' | 'inspector' | 'logistics' | 'packaging' | 'retailer' | 'viewer';

export type RoleIcon = string | LucideIcon;

export interface User {
  role: UserRole;
  address?: string;
  name?: string;
  id?: string;
  email?: string;
  permissions?: {
    canCreate: boolean;
    canVerify: boolean;
  };
}

export interface UserContextType {
  user: Omit<User, 'permissions'> & {
    permissions?: User['permissions'];
  } | null;
  setUser: (user: User | null) => void;
  updateUserRole: (role: UserRole) => void;
  loading: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, {
  canCreate: boolean;
  canVerify: boolean;
  canView: boolean;
  allowedEvents: string[];
  displayName: string;
  icon: RoleIcon;
  color: string;
  IconComponent?: LucideIcon; // For React components
}> = {
  farmer: {
    canCreate: true,
    canVerify: false,
    canView: true,
    allowedEvents: ['planting', 'growth', 'harvest'],
    displayName: 'Farmer',
    icon: '👨‍🌾',
    color: 'green',
  },
  inspector: {
    canCreate: false,
    canVerify: true,
    canView: true,
    allowedEvents: ['quality-inspection', 'compliance-check'],
    displayName: 'Inspector',
    icon: '🔍',
    color: 'blue',
  },
  logistics: {
    canCreate: false,
    canVerify: false,
    canView: true,
    allowedEvents: ['collection', 'transport', 'delivery'],
    displayName: 'Logistics',
    icon: '🚚',
    color: 'orange',
  },
  packaging: {
    canCreate: false,
    canVerify: false,
    canView: true,
    allowedEvents: ['packaging', 'labeling', 'qr-generation'],
    displayName: 'Packaging',
    icon: '📦',
    color: 'purple',
  },
  retailer: {
    canCreate: false,
    canVerify: true,
    canView: true,
    allowedEvents: ['retail-verification'],
    displayName: 'Retailer',
    icon: '🛒',
    color: 'pink',
  },
  viewer: {
    canCreate: false,
    canVerify: false,
    canView: true,
    allowedEvents: [],
    displayName: 'Viewer',
    icon: '👁️',
    color: 'gray',
  },
};