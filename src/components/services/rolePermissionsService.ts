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

    // Add Profile for all authenticated users
    items.push({ label: 'Profile', href: '/profile', icon: 'user' });

    // Role-specific navigation items
    const roleSpecificItems: Record<UserRole, Array<{ label: string; href: string; icon?: string }>> = {
      farmer: [
        { label: 'Overview', href: '/farmer', icon: 'home' },
        { label: 'Growth Monitoring', href: '/farmer/growth', icon: 'trending-up' },
        { label: 'Fertiliser Logs', href: '/farmer/fertiliser', icon: 'droplets' },
        { label: 'Seed Varieties', href: '/farmer/seeds', icon: 'package' },
        { label: 'Products', href: '/farmer/products', icon: 'box' },
        { label: 'Compliance', href: '/farmer/compliance', icon: 'shield' },
        { label: 'Events', href: '/farmer/events', icon: 'calendar' }
      ],
      inspector: [
        { label: 'Overview', href: '/inspector', icon: 'home' },
        { label: 'Inspections', href: '/inspector/inspections', icon: 'clipboard-list' },
        { label: 'Reports', href: '/inspector/reports', icon: 'file-text' }
      ],
      logistics: [
        { label: 'Overview', href: '/logistics', icon: 'home' },
        { label: 'Vehicles', href: '/logistics/vehicles', icon: 'truck' },
        { label: 'Drivers', href: '/logistics/drivers', icon: 'users' },
        { label: 'Scheduling', href: '/logistics/scheduling', icon: 'calendar' },
        { label: 'Order Tracking', href: '/logistics/order-tracking', icon: 'package' },
        { label: 'Documentation', href: '/logistics/documentation', icon: 'file-text' },
        { label: 'Events', href: '/logistics/events', icon: 'calendar' }
      ],
      packaging: [
        { label: 'Overview', href: '/packaging', icon: 'home' },
        { label: 'Batch Processing', href: '/packaging/batch', icon: 'layers' },
        { label: 'Inventory', href: '/packaging/inventory', icon: 'package' },
        { label: 'Quality Check', href: '/packaging/quality-check', icon: 'check-circle' },
        { label: 'QR Generation', href: '/packaging/qr-generation', icon: 'qrcode' },
        { label: 'Reports', href: '/packaging/reports', icon: 'file-text' }
      ],
      retailer: [
        { label: 'Overview', href: '/retailer', icon: 'home' },
        { label: 'Products', href: '/retailer/product-management', icon: 'package' },
        { label: 'Orders', href: '/retailer/orders', icon: 'shopping-cart' },
        { label: 'Customers', href: '/retailer/customers', icon: 'users' },
        { label: 'Inventory', href: '/retailer/inventory', icon: 'package' },
        { label: 'Shipping', href: '/retailer/shipping', icon: 'truck' },
        { label: 'Payments', href: '/retailer/payments', icon: 'credit-card' },
        { label: 'Analytics', href: '/retailer/analytics', icon: 'bar-chart' }
      ],
      saps: [
        { label: 'Overview', href: '/saps', icon: 'home' },
        { label: 'Roadside Inspections', href: '/saps/inspections', icon: 'clipboard-list' },
        { label: 'Asset Recovery', href: '/saps/recovery', icon: 'search' },
        { label: 'Theft Reports', href: '/saps/reports', icon: 'alert-triangle' },
        { label: 'Heatmaps', href: '/saps/heatmaps', icon: 'activity' }
      ],
      admin: [
        // Admin role disabled - no navigation items
      ],
      public: [
        { label: 'Marketplace', href: '/marketplace', icon: 'shopping-bag' },
        { label: 'Products', href: '/products', icon: 'package' },
        { label: 'Public Access', href: '/public-access', icon: 'eye' }
      ],
      government: [
        { label: 'Overview', href: '/government', icon: 'home' },
        { label: 'Audits', href: '/government/audits', icon: 'clipboard-list' },
        { label: 'Compliance', href: '/government/compliance', icon: 'shield' },
        { label: 'Reports', href: '/government/reports', icon: 'file-text' }
      ],
      viewer: [
        { label: 'Products', href: '/products', icon: 'package' },
        { label: 'Public Access', href: '/public-access', icon: 'eye' }
      ]
    };

    // Add role-specific items
    if (roleSpecificItems[role]) {
      items.push(...roleSpecificItems[role]);
    }

    // Add common items for specific permissions
    if (permissions.canReport && !roleSpecificItems[role]?.some((item: { label: string; href: string; icon?: string }) => item.href.includes('reports'))) {
      items.push({ label: 'Reports', href: '/reports', icon: 'file-text' });
    }

    return items;
  }
}
