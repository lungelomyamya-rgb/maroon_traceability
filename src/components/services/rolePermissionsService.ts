// src/features/shared/services/rolePermissionsService.ts
// Role-based permissions service

import type { UserRole } from '@/types/types';

export interface RolePermissions {
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canVerify?: boolean;
  canExport?: boolean;
  canView?: boolean;
  canManage?: boolean;
  canApprove?: boolean;
  canReject?: boolean;
  canAudit?: boolean;
  canReport?: boolean;
  canAdmin?: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canVerify: true,
    canExport: true,
    canView: true,
    canManage: true,
    canApprove: true,
    canReject: true,
    canAudit: true,
    canReport: true,
    canAdmin: true,
  },
  government: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVerify: true,
    canExport: false,
    canView: true,
    canManage: false,
    canApprove: false,
    canReject: false,
    canAudit: true,
    canReport: true,
    canAdmin: false,
  },
  farmer: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canVerify: false,
    canExport: true,
    canView: true,
    canManage: true,
    canApprove: false,
    canReject: false,
    canAudit: false,
    canReport: false,
    canAdmin: false,
  },
  inspector: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVerify: true,
    canExport: false,
    canView: true,
    canManage: false,
    canApprove: true,
    canReject: true,
    canAudit: true,
    canReport: true,
    canAdmin: false,
  },
  logistics: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVerify: false,
    canExport: true,
    canView: true,
    canManage: true,
    canApprove: false,
    canReject: false,
    canAudit: false,
    canReport: true,
    canAdmin: false,
  },
  packaging: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVerify: false,
    canExport: true,
    canView: true,
    canManage: true,
    canApprove: false,
    canReject: false,
    canAudit: false,
    canReport: false,
    canAdmin: false,
  },
  retailer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVerify: false,
    canExport: true,
    canView: true,
    canManage: true,
    canApprove: false,
    canReject: false,
    canAudit: false,
    canReport: false,
    canAdmin: false,
  },
  public: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVerify: false,
    canExport: false,
    canView: true,
    canManage: false,
    canApprove: false,
    canReject: false,
    canAudit: false,
    canReport: false,
    canAdmin: false,
  },
  saps: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVerify: false,
    canExport: false,
    canView: true,
    canManage: false,
    canApprove: false,
    canReject: false,
    canAudit: true,
    canReport: true,
    canAdmin: false,
  },
  viewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVerify: false,
    canExport: false,
    canView: true,
    canManage: false,
    canApprove: false,
    canReject: false,
    canAudit: false,
    canReport: false,
    canAdmin: false,
  },
};

export type { UserRole } from '@/types/types';

export class RolePermissionsService {
  static getPermissions(role: UserRole): RolePermissions {
    return ROLE_PERMISSIONS[role] || {
      canView: true,
      canEdit: false,
      canDelete: false,
      canCreate: false,
      canVerify: false,
      canExport: false,
      canManage: false,
      canApprove: false,
      canReject: false,
      canAudit: false,
      canReport: false,
      canAdmin: false,
    };
  }

  static hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
    const permissions = this.getPermissions(role);
    return permissions[permission] || false;
  }

  static getNavigationItems(role: UserRole): Array<{ label: string; href: string; icon?: string }> {
    const permissions = this.getPermissions(role);
    const items = [];

    if (permissions.canView) {
      items.push({ label: 'Dashboard', href: '/dashboard' });
    }

    if (permissions.canCreate || permissions.canEdit) {
      items.push({ label: 'Products', href: '/products' });
    }

    if (permissions.canVerify) {
      items.push({ label: 'Verification', href: '/verification' });
    }

    if (permissions.canReport) {
      items.push({ label: 'Reports', href: '/reports' });
    }

    if (permissions.canAdmin) {
      items.push({ label: 'Admin', href: '/admin' });
    }

    return items;
  }
}
