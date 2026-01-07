// src/services/permissionService.ts

export class PermissionService {
  private static instance: PermissionService;

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  async requestPermission(permission: PermissionDescriptor): Promise<boolean> {
    try {
      // Check if permission API is supported
      if (!navigator.permissions || !navigator.permissions.query) {
        console.warn('Permissions API not supported');
        return false;
      }
      
      // For now, just check the permission status
      const result = await navigator.permissions.query(permission);
      return result.state === 'granted';
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  async checkPermission(permission: PermissionDescriptor): Promise<boolean> {
    try {
      const result = await navigator.permissions.query(permission);
      return result.state === 'granted';
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  static getDefaultRoute(role: string): string {
    const routes: Record<string, string> = {
      admin: '/dashboard',
      government: '/dashboard',
      inspector: '/inspector',
      logistics: '/logistics',
      packaging: '/packaging',
      retailer: '/retailer',
      farmer: '/farmer/dashboard',
      viewer: '/viewer'
    };
    return routes[role] || '/dashboard';
  }
}

export const permissionService = PermissionService.getInstance();
