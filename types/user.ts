// src/types/user.ts
import { LucideIcon, User as UserIcon, Briefcase, Shield, UserCheck, Users, Package, Truck, Eye } from 'lucide-react';

export const USER_ROLES = [
  'farmer',
  'inspector',
  'logistics',
  'packaging',
  'retailer',
  'public',
  'government',
  'admin'
] as const;

export type UserRole = typeof USER_ROLES[number];

export type RoleIcon = string | LucideIcon;

export interface UserPermissions {
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canVerify?: boolean;
  canExport?: boolean;
  [key: string]: boolean | undefined;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  permissions?: UserPermissions;
}

export interface UserContextType {
  user: Omit<User, 'permissions'> & {
    permissions?: User['permissions'];
  } | null;
  currentUser: Omit<User, 'permissions'> & {
    permissions?: User['permissions'];
  } | null;
  setUser: (user: User | null) => void;
  updateUserRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
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
  IconComponent?: LucideIcon;
}> = {
  admin: {
    canCreate: true,
    canVerify: true,
    canView: true,
    allowedEvents: ['*'],
    displayName: 'Administrator',
    icon: '👑',
    color: 'role-admin',
    IconComponent: Users,
  },
  government: {
    canCreate: false,
    canVerify: true,
    canView: true,
    allowedEvents: ['compliance-check', 'audit', 'inspection'],
    displayName: 'Government',
    icon: '🏛️',
    color: 'role-government',
    IconComponent: Shield,
  },
  farmer: {
    canCreate: true,
    canVerify: false,
    canView: true,
    allowedEvents: ['planting', 'growth', 'harvest'],
    displayName: 'Farmer',
    icon: '👨\u200d🌾',
    color: 'role-farmer',
    IconComponent: UserCheck,
  },
  inspector: {
    canCreate: false,
    canVerify: true,
    canView: true,
    allowedEvents: ['quality-inspection', 'compliance-check'],
    displayName: 'Inspector',
    icon: '🔍',
    color: 'role-inspector',
    IconComponent: Shield,
  },
  logistics: {
    canCreate: false,
    canVerify: false,
    canView: true,
    allowedEvents: ['collection', 'transport', 'delivery'],
    displayName: 'Logistics',
    icon: '🚚',
    color: 'role-logistics',
    IconComponent: Truck,
  },
  packaging: {
    canCreate: true,
    canVerify: false,
    canView: true,
    allowedEvents: ['packaging', 'labeling', 'qr-generation'],
    displayName: 'Packaging',
    icon: '📦',
    color: 'role-packaging',
    IconComponent: Package,
  },
  retailer: {
    canCreate: false,
    canVerify: true,
    canView: true,
    allowedEvents: ['retail-verification', 'sale'],
    displayName: 'Retailer',
    icon: '🛒',
    color: 'role-retailer',
    IconComponent: Briefcase,
  },
  public: {
    canCreate: false,
    canVerify: false,
    canView: true,
    allowedEvents: ['browse-marketplace', 'view-traceability', 'purchase'],
    displayName: 'Public',
    icon: '👁️',
    color: 'role-public',
    IconComponent: Eye,
  },
};