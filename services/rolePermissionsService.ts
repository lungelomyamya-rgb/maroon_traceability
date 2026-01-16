// src/services/rolePermissionsService.ts
// Role-based access control for Maroon Traceability events

export type UserRole = 'farmer' | 'inspector' | 'logistics' | 'packaging' | 'retailer' | 'viewer' | 'admin';

export interface EventType {
  id: string;
  name: string;
  description: string;
  category: 'planting' | 'growth' | 'harvest' | 'quality' | 'logistics' | 'packaging';
  requiredRole: UserRole;
  canEdit: UserRole[];
  canView: UserRole[];
  requiresApproval?: boolean;
  attachmentsAllowed?: boolean;
}

export interface Permission {
  role: UserRole;
  permissions: {
    canCreateEvents: string[];
    canEditEvents: string[];
    canViewEvents: string[];
    canDeleteEvents: string[];
    canApproveEvents: string[];
    canManageUsers: boolean;
    canViewReports: boolean;
    canExportData: boolean;
    canManageSystem: boolean;
  };
}

class RolePermissionsService {
  private static instance: RolePermissionsService;

  static getInstance(): RolePermissionsService {
    if (!RolePermissionsService.instance) {
      RolePermissionsService.instance = new RolePermissionsService();
    }
    return RolePermissionsService.instance;
  }

  // Event type definitions
  private eventTypes: EventType[] = [
    // Farmer events
    {
      id: 'planting',
      name: 'Planting',
      description: 'Record seed planting information',
      category: 'planting',
      requiredRole: 'farmer',
      canEdit: ['farmer', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },
    {
      id: 'seed-selection',
      name: 'Seed Selection',
      description: 'Record seed variety and certification',
      category: 'planting',
      requiredRole: 'farmer',
      canEdit: ['farmer', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },
    {
      id: 'fertiliser-application',
      name: 'Fertiliser Application',
      description: 'Record fertiliser and nutrient applications',
      category: 'growth',
      requiredRole: 'farmer',
      canEdit: ['farmer', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },
    {
      id: 'growth-monitoring',
      name: 'Growth Monitoring',
      description: 'Track plant development and health',
      category: 'growth',
      requiredRole: 'farmer',
      canEdit: ['farmer', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },
    {
      id: 'harvest',
      name: 'Harvest',
      description: 'Record harvest information and yields',
      category: 'harvest',
      requiredRole: 'farmer',
      canEdit: ['farmer', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },

    // Inspector events
    {
      id: 'quality-inspection',
      name: 'Quality Inspection',
      description: 'Third-party quality assessment',
      category: 'quality',
      requiredRole: 'inspector',
      canEdit: ['inspector', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      requiresApproval: false,
      attachmentsAllowed: true
    },
    {
      id: 'compliance-check',
      name: 'Compliance Check',
      description: 'Regulatory compliance verification',
      category: 'quality',
      requiredRole: 'inspector',
      canEdit: ['inspector', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      requiresApproval: true,
      attachmentsAllowed: true
    },
    {
      id: 'certification',
      name: 'Certification',
      description: 'Issue organic or quality certifications',
      category: 'quality',
      requiredRole: 'inspector',
      canEdit: ['inspector', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      requiresApproval: true,
      attachmentsAllowed: true
    },

    // Logistics events
    {
      id: 'collection',
      name: 'Collection',
      description: 'Produce collection from farm',
      category: 'logistics',
      requiredRole: 'logistics',
      canEdit: ['logistics', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },
    {
      id: 'transport',
      name: 'Transport',
      description: 'Transport to processing facility',
      category: 'logistics',
      requiredRole: 'logistics',
      canEdit: ['logistics', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },
    {
      id: 'delivery',
      name: 'Delivery',
      description: 'Delivery to packaging or retail',
      category: 'logistics',
      requiredRole: 'logistics',
      canEdit: ['logistics', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },

    // Packaging events
    {
      id: 'packaging',
      name: 'Packaging',
      description: 'Product packaging and batch creation',
      category: 'packaging',
      requiredRole: 'packaging',
      canEdit: ['packaging', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },
    {
      id: 'batch-creation',
      name: 'Batch Creation',
      description: 'Create product batches with QR codes',
      category: 'packaging',
      requiredRole: 'packaging',
      canEdit: ['packaging', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    },
    {
      id: 'quality-check',
      name: 'Quality Check',
      description: 'Final quality check before packaging',
      category: 'packaging',
      requiredRole: 'packaging',
      canEdit: ['packaging', 'inspector', 'admin'],
      canView: ['farmer', 'inspector', 'logistics', 'packaging', 'viewer', 'admin'],
      attachmentsAllowed: true
    }
  ];

  // Role permissions configuration
  private rolePermissions: Permission[] = [
    {
      role: 'farmer',
      permissions: {
        canCreateEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring', 'harvest'],
        canEditEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring', 'harvest'],
        canViewEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring', 'harvest', 'quality-inspection', 'collection', 'transport', 'packaging'],
        canDeleteEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring'],
        canApproveEvents: [],
        canManageUsers: false,
        canViewReports: true,
        canExportData: true,
        canManageSystem: false
      }
    },
    {
      role: 'inspector',
      permissions: {
        canCreateEvents: ['quality-inspection', 'compliance-check', 'certification'],
        canEditEvents: ['quality-inspection', 'compliance-check', 'certification'],
        canViewEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring', 'harvest', 'quality-inspection', 'compliance-check', 'certification', 'collection', 'transport', 'packaging'],
        canDeleteEvents: ['quality-inspection'],
        canApproveEvents: ['compliance-check', 'certification'],
        canManageUsers: false,
        canViewReports: true,
        canExportData: true,
        canManageSystem: false
      }
    },
    {
      role: 'logistics',
      permissions: {
        canCreateEvents: ['collection', 'transport', 'delivery'],
        canEditEvents: ['collection', 'transport', 'delivery'],
        canViewEvents: ['harvest', 'quality-inspection', 'collection', 'transport', 'delivery', 'packaging'],
        canDeleteEvents: ['collection', 'transport'],
        canApproveEvents: [],
        canManageUsers: false,
        canViewReports: true,
        canExportData: true,
        canManageSystem: false
      }
    },
    {
      role: 'packaging',
      permissions: {
        canCreateEvents: ['packaging', 'batch-creation', 'quality-check'],
        canEditEvents: ['packaging', 'batch-creation', 'quality-check'],
        canViewEvents: ['harvest', 'quality-inspection', 'collection', 'transport', 'packaging', 'batch-creation', 'quality-check'],
        canDeleteEvents: ['packaging', 'batch-creation'],
        canApproveEvents: [],
        canManageUsers: false,
        canViewReports: true,
        canExportData: true,
        canManageSystem: false
      }
    },
    {
      role: 'viewer',
      permissions: {
        canCreateEvents: [],
        canEditEvents: [],
        canViewEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring', 'harvest', 'quality-inspection', 'compliance-check', 'certification', 'collection', 'transport', 'delivery', 'packaging', 'batch-creation', 'quality-check'],
        canDeleteEvents: [],
        canApproveEvents: [],
        canManageUsers: false,
        canViewReports: true,
        canExportData: false,
        canManageSystem: false
      }
    },
    {
      role: 'admin',
      permissions: {
        canCreateEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring', 'harvest', 'quality-inspection', 'compliance-check', 'certification', 'collection', 'transport', 'delivery', 'packaging', 'batch-creation', 'quality-check'],
        canEditEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring', 'harvest', 'quality-inspection', 'compliance-check', 'certification', 'collection', 'transport', 'delivery', 'packaging', 'batch-creation', 'quality-check'],
        canViewEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring', 'harvest', 'quality-inspection', 'compliance-check', 'certification', 'collection', 'transport', 'delivery', 'packaging', 'batch-creation', 'quality-check'],
        canDeleteEvents: ['planting', 'seed-selection', 'fertiliser-application', 'growth-monitoring', 'harvest', 'quality-inspection', 'compliance-check', 'certification', 'collection', 'transport', 'delivery', 'packaging', 'batch-creation', 'quality-check'],
        canApproveEvents: ['compliance-check', 'certification'],
        canManageUsers: true,
        canViewReports: true,
        canExportData: true,
        canManageSystem: true
      }
    }
  ];

  // Public methods
  getEventTypes(): EventType[] {
    return this.eventTypes;
  }

  getEventTypesForRole(role: UserRole): EventType[] {
    return this.eventTypes.filter(eventType => 
      eventType.canView.includes(role)
    );
  }

  getCreatableEventTypes(role: UserRole): EventType[] {
    return this.eventTypes.filter(eventType => 
      eventType.requiredRole === role || 
      (role === 'admin' && eventType.requiredRole !== 'admin')
    );
  }

  canCreateEvent(role: UserRole, eventTypeId: string): boolean {
    const eventType = this.eventTypes.find(et => et.id === eventTypeId);
    if (!eventType) return false;
    
    return eventType.requiredRole === role || role === 'admin';
  }

  canEditEvent(role: UserRole, eventTypeId: string): boolean {
    const eventType = this.eventTypes.find(et => et.id === eventTypeId);
    if (!eventType) return false;
    
    return eventType.canEdit.includes(role) || role === 'admin';
  }

  canViewEvent(role: UserRole, eventTypeId: string): boolean {
    const eventType = this.eventTypes.find(et => et.id === eventTypeId);
    if (!eventType) return false;
    
    return eventType.canView.includes(role) || role === 'admin';
  }

  canDeleteEvent(role: UserRole, eventTypeId: string): boolean {
    const permission = this.rolePermissions.find(p => p.role === role);
    if (!permission) return false;
    
    return permission.permissions.canDeleteEvents.includes(eventTypeId) || role === 'admin';
  }

  canApproveEvent(role: UserRole, eventTypeId: string): boolean {
    const eventType = this.eventTypes.find(et => et.id === eventTypeId);
    if (!eventType) return false;
    
    return Boolean(eventType.requiresApproval) &&
           (eventType.canEdit.includes(role) || role === 'admin');
  }

  getRolePermissions(role: UserRole): Permission | undefined {
    return this.rolePermissions.find(p => p.role === role);
  }

  hasPermission(role: UserRole, permission: keyof Permission['permissions']): boolean {
    const rolePerm = this.rolePermissions.find(p => p.role === role);
    if (!rolePerm) return false;
    
    return Boolean(rolePerm.permissions[permission]);
  }

  // Validation methods
  validateEventCreation(role: UserRole, eventTypeId: string): { valid: boolean; message?: string } {
    if (!this.canCreateEvent(role, eventTypeId)) {
      return {
        valid: false,
        message: `Your role (${role}) is not authorized to create ${eventTypeId} events`
      };
    }
    
    return { valid: true };
  }

  validateEventEdit(role: UserRole, eventTypeId: string): { valid: boolean; message?: string } {
    if (!this.canEditEvent(role, eventTypeId)) {
      return {
        valid: false,
        message: `Your role (${role}) is not authorized to edit ${eventTypeId} events`
      };
    }
    
    return { valid: true };
  }

  // Get events by category for a role
  getEventsByCategory(role: UserRole, category: EventType['category']): EventType[] {
    return this.eventTypes.filter(eventType => 
      eventType.category === category && 
      eventType.canView.includes(role)
    );
  }

  // Get navigation items based on role
  getNavigationItems(role: UserRole) {
    const baseItems = role === 'viewer' 
      ? [{ name: 'Dashboard', href: '/viewer' }]
      : [];

    const roleSpecificItems = {
      farmer: [
        { name: 'Event Management', href: '/farmer/dashboard' },
        { name: 'Growth Monitoring', href: '/farmer/growth' },
        { name: 'Fertiliser Logs', href: '/farmer/fertiliser' },
        { name: 'Seed Varieties', href: '/farmer/seeds' },
        { name: 'Compliance', href: '/farmer/compliance' }
      ],
      inspector: [
        { name: 'Overview', href: '/inspector' },
        { name: 'Inspections', href: '/inspector/inspections' },
        { name: 'Verification', href: '/inspector/verification' },
        { name: 'Reports', href: '/inspector/reports' }
      ],
      logistics: [
        { name: 'Overview', href: '/logistics' },
        { name: 'Vehicles', href: '/logistics/vehicles' },
        { name: 'Drivers', href: '/logistics/drivers' },
        { name: 'Scheduling', href: '/logistics/scheduling' },
        { name: 'Documentation', href: '/logistics/documentation' },
        { name: 'Events', href: '/logistics/events' }
      ],
      packaging: [
        { name: 'Overview', href: '/packaging' },
        { name: 'Batch Creation', href: '/packaging/batch' },
        { name: 'Quality Check', href: '/packaging/quality' }
      ],
      retailer: [
        { name: 'Overview', href: '/retailer' },
        { name: 'Products', href: '/retailer/product-management' },
        { name: 'Orders', href: '/retailer/orders' },
        { name: 'Analytics', href: '/retailer/analytics' }
      ],
      viewer: [
        { name: 'Products', href: '/products' },
        { name: 'Public Access', href: '/public-access' }
      ],
      admin: [
        { name: 'System Admin', href: '/admin' },
        { name: 'User Management', href: '/admin/users' },
        { name: 'Reports', href: '/admin/reports' },
        { name: 'Settings', href: '/admin/settings' }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[role] || [])];
  }
}

export const rolePermissionsService = RolePermissionsService.getInstance();
