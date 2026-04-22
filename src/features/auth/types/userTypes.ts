// Re-export from unified types for backward compatibility
export { USER_ROLES, ROLE_PERMISSIONS } from '@/types/types';
export type { UserRole, RoleIcon } from '@/types/types';

// Local import for type resolution
import type { UserRole as UserRoleType } from '@/types/types';

export interface UserPermissions {
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canVerify?: boolean;
  canExport?: boolean;
  [key: string]: boolean | undefined;
}

export type User = import('@/types/types').UIUser;

export interface UserContextType {
  user: Omit<User, 'permissions'> & {
    permissions?: User['permissions'];
  } | null;
  currentUser: Omit<User, 'permissions'> & {
    permissions?: User['permissions'];
  } | null;
  setUser: (user: User | null) => void;
  updateUserRole: (role: UserRoleType) => void;
  switchUser: (userId: string) => void;
  loading: boolean;
}

