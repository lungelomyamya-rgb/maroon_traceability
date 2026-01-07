// src/lib/accessControl.ts

// Role-Based Access Control (RBAC) System
import { useCallback } from 'react';
import React from 'react';

import { UserRole } from '@/types/user';
import { commonColors } from '@/lib/theme/colors';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'verify' | 'export' | 'admin';
}

export interface Role {
  id: string;
  name: UserRole;
  permissions: string[];
  description: string;
  level: number; // Higher number = more permissions
}

export interface AccessRule {
  resource: string;
  action: string;
  requiredPermissions: string[];
  conditions?: {
    ownership?: boolean;
    status?: string[];
    department?: string[];
  };
}

class AccessControlManager {
  private static instance: AccessControlManager;
  private permissions: Map<string, Permission> = new Map();
  private roles: Map<string, Role> = new Map();
  private accessRules: Map<string, AccessRule> = new Map();

  private constructor() {
    this.initializePermissions();
    this.initializeRoles();
    this.initializeAccessRules();
  }

  static getInstance(): AccessControlManager {
    if (!AccessControlManager.instance) {
      AccessControlManager.instance = new AccessControlManager();
    }
    return AccessControlManager.instance;
  }

  private initializePermissions() {
    const permissions: Permission[] = [
      // Product permissions
      { id: 'product.create', name: 'Create Product', description: 'Create new products', resource: 'product', action: 'create' },
      { id: 'product.read', name: 'View Product', description: 'View product details', resource: 'product', action: 'read' },
      { id: 'product.update', name: 'Update Product', description: 'Update product information', resource: 'product', action: 'update' },
      { id: 'product.delete', name: 'Delete Product', description: 'Delete products', resource: 'product', action: 'delete' },
      { id: 'product.verify', name: 'Verify Product', description: 'Verify product authenticity', resource: 'product', action: 'verify' },
      
      // Blockchain permissions
      { id: 'blockchain.read', name: 'View Blockchain', description: 'View blockchain records', resource: 'blockchain', action: 'read' },
      { id: 'blockchain.verify', name: 'Verify Blockchain', description: 'Verify blockchain transactions', resource: 'blockchain', action: 'verify' },
      
      // User management permissions
      { id: 'user.create', name: 'Create User', description: 'Create new users', resource: 'user', action: 'create' },
      { id: 'user.read', name: 'View User', description: 'View user information', resource: 'user', action: 'read' },
      { id: 'user.update', name: 'Update User', description: 'Update user information', resource: 'user', action: 'update' },
      { id: 'user.delete', name: 'Delete User', description: 'Delete users', resource: 'user', action: 'delete' },
      
      // Analytics permissions
      { id: 'analytics.read', name: 'View Analytics', description: 'View analytics data', resource: 'analytics', action: 'read' },
      { id: 'analytics.export', name: 'Export Analytics', description: 'Export analytics data', resource: 'analytics', action: 'export' },
      
      // Admin permissions
      { id: 'system.admin', name: 'System Administration', description: 'Full system access', resource: 'system', action: 'admin' },
      { id: 'system.audit', name: 'View Audit Logs', description: 'View system audit logs', resource: 'system', action: 'read' },
    ];

    permissions.forEach(permission => {
      this.permissions.set(permission.id, permission);
    });
  }

  private initializeRoles() {
    const roles: Role[] = [
      {
        id: 'farmer',
        name: 'farmer' as UserRole,
        permissions: ['product.create', 'product.read', 'product.update', 'blockchain.read'],
        description: 'Can create and manage their own products',
        level: 1
      },
      {
        id: 'inspector',
        name: 'inspector' as UserRole,
        permissions: ['product.read', 'product.verify', 'blockchain.read', 'blockchain.verify'],
        description: 'Can verify products and view blockchain data',
        level: 2
      },
      {
        id: 'logistics',
        name: 'logistics' as UserRole,
        permissions: ['product.read', 'blockchain.read'],
        description: 'Can view product information for logistics',
        level: 1
      },
      {
        id: 'packaging',
        name: 'packaging' as UserRole,
        permissions: ['product.read', 'product.update', 'blockchain.read'],
        description: 'Can update product packaging information',
        level: 2
      },
      {
        id: 'retailer',
        name: 'retailer' as UserRole,
        permissions: ['product.read', 'product.verify', 'blockchain.read', 'analytics.read'],
        description: 'Can verify products and view analytics',
        level: 2
      },
      {
        id: 'viewer',
        name: 'viewer' as UserRole,
        permissions: ['product.read', 'blockchain.read'],
        description: 'Read-only access to products and blockchain',
        level: 0
      },
      {
        id: 'government',
        name: 'government' as UserRole,
        permissions: ['product.read', 'product.verify', 'blockchain.read', 'blockchain.verify', 'analytics.read', 'analytics.export'],
        description: 'Government oversight with audit capabilities',
        level: 3
      },
      {
        id: 'admin',
        name: 'admin' as UserRole,
        permissions: Array.from(this.permissions.keys()),
        description: 'Full system administration access',
        level: 4
      }
    ];

    roles.forEach(role => {
      this.roles.set(role.id, role);
    });
  }

  private initializeAccessRules() {
    const rules: AccessRule[] = [
      // Product ownership rules
      {
        resource: 'product',
        action: 'update',
        requiredPermissions: ['product.update'],
        conditions: {
          ownership: true
        }
      },
      {
        resource: 'product',
        action: 'delete',
        requiredPermissions: ['product.delete'],
        conditions: {
          ownership: true
        }
      },
      // Admin-only rules
      {
        resource: 'system',
        action: 'admin',
        requiredPermissions: ['system.admin']
      },
      {
        resource: 'user',
        action: 'delete',
        requiredPermissions: ['system.admin']
      }
    ];

    rules.forEach(rule => {
      this.accessRules.set(`${rule.resource}:${rule.action}`, rule);
    });
  }

  // Permission checking methods
  hasPermission(userRole: UserRole, permissionId: string): boolean {
    const role = this.roles.get(userRole);
    return role ? role.permissions.includes(permissionId) : false;
  }

  hasAnyPermission(userRole: UserRole, permissionIds: string[]): boolean {
    return permissionIds.some(permissionId => this.hasPermission(userRole, permissionId));
  }

  hasAllPermissions(userRole: UserRole, permissionIds: string[]): boolean {
    return permissionIds.every(permissionId => this.hasPermission(userRole, permissionId));
  }

  canAccessResource(userRole: UserRole, resource: string, action: string, context?: any): boolean {
    const ruleKey = `${resource}:${action}`;
    const rule = this.accessRules.get(ruleKey);
    
    if (!rule) {
      // If no specific rule, check if user has the basic permission
      const permissionId = `${resource}.${action}`;
      return this.hasPermission(userRole, permissionId);
    }

    // Check required permissions
    const hasRequiredPermissions = this.hasAllPermissions(userRole, rule.requiredPermissions);
    if (!hasRequiredPermissions) {
      return false;
    }

    // Check conditions
    if (rule.conditions) {
      if (rule.conditions.ownership && context) {
        // Check if user owns the resource
        if (context.userId && context.createdBy !== context.userId) {
          return false;
        }
      }
      
      if (rule.conditions.status && context) {
        // Check if resource has allowed status
        if (!rule.conditions.status.includes(context.status)) {
          return false;
        }
      }
      
      if (rule.conditions.department && context) {
        // Check department-based access
        if (!rule.conditions.department.includes(context.department)) {
          return false;
        }
      }
    }

    return true;
  }

  // Role management
  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  getPermissionsForRole(userRole: UserRole): Permission[] {
    const role = this.roles.get(userRole);
    if (!role) return [];
    
    return role.permissions
      .map(permissionId => this.permissions.get(permissionId))
      .filter((permission): permission is Permission => permission !== undefined);
  }

  // Permission hierarchy
  getRoleHierarchy(): Role[] {
    return this.getAllRoles().sort((a, b) => b.level - a.level);
  }

  canUpgradeRole(currentRole: UserRole, targetRole: UserRole): boolean {
    const current = this.roles.get(currentRole);
    const target = this.roles.get(targetRole);
    
    if (!current || !target) return false;
    
    return target.level > current.level;
  }

  // Utility methods
  getPermissionById(permissionId: string): Permission | undefined {
    return this.permissions.get(permissionId);
  }

  getAllPermissions(): Permission[] {
    return Array.from(this.permissions.values());
  }

  searchPermissions(query: string): Permission[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllPermissions().filter(permission =>
      permission.name.toLowerCase().includes(lowerQuery) ||
      permission.description.toLowerCase().includes(lowerQuery) ||
      permission.resource.toLowerCase().includes(lowerQuery)
    );
  }

  // Access validation helpers
  validateProductAccess(userRole: UserRole, action: string, product?: any): boolean {
    return this.canAccessResource(userRole, 'product', action, product);
  }

  validateUserAccess(userRole: UserRole, action: string, targetUser?: any): boolean {
    return this.canAccessResource(userRole, 'user', action, targetUser);
  }

  validateSystemAccess(userRole: UserRole, action: string): boolean {
    return this.canAccessResource(userRole, 'system', action);
  }

  // Permission matrix for UI
  getPermissionMatrix(): Record<string, Record<string, boolean>> {
    const matrix: Record<string, Record<string, boolean>> = {};
    
    this.getAllRoles().forEach(role => {
      matrix[role.name] = {};
      this.getAllPermissions().forEach(permission => {
        matrix[role.name][permission.id] = this.hasPermission(role.name, permission.id);
      });
    });
    
    return matrix;
  }
}

// Export singleton instance
export const accessControl = AccessControlManager.getInstance();

// React Hook for Access Control
export const useAccessControl = (userRole?: UserRole) => {
  const checkPermission = useCallback((permissionId: string) => {
    if (!userRole) return false;
    return accessControl.hasPermission(userRole, permissionId);
  }, [userRole]);

  const checkAnyPermission = useCallback((permissionIds: string[]) => {
    if (!userRole) return false;
    return accessControl.hasAnyPermission(userRole, permissionIds);
  }, [userRole]);

  const checkAllPermissions = useCallback((permissionIds: string[]) => {
    if (!userRole) return false;
    return accessControl.hasAllPermissions(userRole, permissionIds);
  }, [userRole]);

  const canAccess = useCallback((resource: string, action: string, context?: any) => {
    if (!userRole) return false;
    return accessControl.canAccessResource(userRole, resource, action, context);
  }, [userRole]);

  const getRolePermissions = useCallback(() => {
    if (!userRole) return [];
    return accessControl.getPermissionsForRole(userRole);
  }, [userRole]);

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    canAccess,
    getRolePermissions,
    getRole: accessControl.getRole.bind(accessControl),
    getAllRoles: accessControl.getAllRoles.bind(accessControl),
    getPermissionMatrix: accessControl.getPermissionMatrix.bind(accessControl)
  };
};

// Higher-Order Components for Access Control
export const withPermissionCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermissions: string[]
) => {
  return React.memo((props: P & { userRole?: UserRole }) => {
    const { userRole, ...restProps } = props;
    const { checkAllPermissions } = useAccessControl(userRole);

    if (!userRole || !checkAllPermissions(requiredPermissions)) {
      return (
        <div className="flex items-center justify-center min-h-screen ${commonColors.gray50}">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold ${commonColors.red800} mb-4">Access Denied</h2>
            <p className="${commonColors.gray600}">
              You don't have permission to access this resource.
            </p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...restProps as P} />;
  });
};

export const withRoleCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: UserRole[]
) => {
  return React.memo((props: P & { userRole?: UserRole }) => {
    const { userRole, ...restProps } = props;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen ${commonColors.gray50}">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold ${commonColors.red800} mb-4">Access Denied</h2>
            <p className="${commonColors.gray600}">
              Your role is not authorized to access this resource.
            </p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...restProps as P} />;
  });
};
