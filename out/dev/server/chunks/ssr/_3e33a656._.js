module.exports = [
"[project]/services/eventLogger.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/services/eventLogger.ts
__turbopack_context__.s([
    "EventLogger",
    ()=>EventLogger,
    "eventLogger",
    ()=>eventLogger
]);
class EventLogger {
    static instance;
    logs = [];
    static getInstance() {
        if (!EventLogger.instance) {
            EventLogger.instance = new EventLogger();
        }
        return EventLogger.instance;
    }
    log(type, message, metadata) {
        const log = {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            message,
            timestamp: Date.now(),
            metadata
        };
        this.logs.push(log);
        console.log(`[${type.toUpperCase()}] ${message}`, metadata);
    }
    getLogs() {
        return [
            ...this.logs
        ];
    }
    clearLogs() {
        this.logs = [];
    }
}
const eventLogger = EventLogger.getInstance();
}),
"[project]/services/analytics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/services/analytics.ts
__turbopack_context__.s([
    "AnalyticsService",
    ()=>AnalyticsService,
    "analytics",
    ()=>analytics
]);
class AnalyticsService {
    static instance;
    static getInstance() {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }
    track(event, properties) {
        // Mock implementation
        console.log('Analytics Event:', {
            event,
            properties,
            timestamp: Date.now()
        });
    }
    pageView(path) {
        this.track('page_view', {
            path
        });
    }
    userAction(action, details) {
        this.track('user_action', {
            action,
            ...details
        });
    }
    trackUserAction(action, details) {
        this.userAction(action, details);
    }
    trackFeatureUsage(feature, details) {
        this.track('feature_usage', {
            feature,
            ...details
        });
    }
    trackConversion(event, details) {
        this.track('conversion', {
            event,
            ...details
        });
    }
}
const analytics = AnalyticsService.getInstance();
}),
"[project]/services/realtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/services/realtime.ts
__turbopack_context__.s([
    "RealtimeService",
    ()=>RealtimeService,
    "realtime",
    ()=>realtime
]);
class RealtimeService {
    static instance;
    listeners = new Map();
    mockInterval = null;
    isRunning = false;
    static getInstance() {
        if (!RealtimeService.instance) {
            RealtimeService.instance = new RealtimeService();
        }
        return RealtimeService.instance;
    }
    constructor(){
        this.startMockActivity();
    }
    startMockActivity() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.mockInterval = setInterval(()=>{
            this.generateMockEvent();
        }, 3000 + Math.random() * 4000); // Random interval between 3-7 seconds
    }
    stopMockActivity() {
        if (this.mockInterval) {
            clearInterval(this.mockInterval);
            this.mockInterval = null;
        }
        this.isRunning = false;
    }
    generateMockEvent() {
        const eventTypes = [
            'product_update',
            'verification_update',
            'blockchain_update',
            'new_product',
            'quality_check',
            'shipment_update'
        ];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        let mockData;
        switch(eventType){
            case 'product_update':
                mockData = {
                    productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
                    status: Math.random() > 0.5 ? 'verified' : 'pending',
                    timestamp: new Date().toISOString()
                };
                break;
            case 'verification_update':
                mockData = {
                    productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
                    verificationCount: Math.floor(Math.random() * 10) + 1,
                    verifiedBy: [
                        'Inspector',
                        'Retailer',
                        'Consumer'
                    ][Math.floor(Math.random() * 3)],
                    timestamp: new Date().toISOString()
                };
                break;
            case 'blockchain_update':
                mockData = {
                    blockNumber: Math.floor(Math.random() * 100000) + 1700000,
                    transactionCount: Math.floor(Math.random() * 50) + 1,
                    timestamp: new Date().toISOString()
                };
                break;
            case 'new_product':
                const products = [
                    'Organic Apples',
                    'Free Range Eggs',
                    'Artisanal Cheese',
                    'Fresh Vegetables',
                    'Grass-fed Beef'
                ];
                mockData = {
                    productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
                    productName: products[Math.floor(Math.random() * products.length)],
                    farmer: [
                        'Green Valley Farm',
                        'Sunny Acres',
                        'Happy Farms',
                        'Organic Haven'
                    ][Math.floor(Math.random() * 4)],
                    timestamp: new Date().toISOString()
                };
                break;
            case 'quality_check':
                mockData = {
                    productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
                    quality: [
                        'Grade A+',
                        'Grade A',
                        'Grade B'
                    ][Math.floor(Math.random() * 3)],
                    inspector: [
                        'John Smith',
                        'Jane Doe',
                        'Mike Johnson'
                    ][Math.floor(Math.random() * 3)],
                    timestamp: new Date().toISOString()
                };
                break;
            case 'shipment_update':
                mockData = {
                    productId: `PRD-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
                    status: [
                        'In Transit',
                        'Delivered',
                        'Processing'
                    ][Math.floor(Math.random() * 3)],
                    location: [
                        'Cape Town',
                        'Johannesburg',
                        'Durban',
                        'Pretoria'
                    ][Math.floor(Math.random() * 4)],
                    timestamp: new Date().toISOString()
                };
                break;
            default:
                mockData = {
                    message: 'Mock event',
                    timestamp: new Date().toISOString()
                };
        }
        this.emit(eventType, mockData);
    }
    subscribe(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        const callbacks = this.listeners.get(eventType);
        callbacks.push(callback);
        // Return unsubscribe function
        return ()=>{
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }
    subscribeToAll(callback) {
        return this.subscribe('*', callback);
    }
    getConnectionStatus() {
        return this.isRunning; // Return actual mock connection status
    }
    // Control methods for mock activity
    enableMockActivity() {
        this.startMockActivity();
    }
    disableMockActivity() {
        this.stopMockActivity();
    }
    // Generate specific events for testing
    generateTestEvent(eventType, customData) {
        if (customData) {
            this.emit(eventType, customData);
        } else {
            this.generateMockEvent();
        }
    }
    emit(eventType, data) {
        const event = {
            type: eventType,
            data,
            timestamp: Date.now()
        };
        // Send to specific listeners
        const specificListeners = this.listeners.get(eventType);
        if (specificListeners) {
            specificListeners.forEach((callback)=>callback(event));
        }
        // Send to all listeners
        const allListeners = this.listeners.get('*');
        if (allListeners) {
            allListeners.forEach((callback)=>callback(event));
        }
    }
}
const realtime = RealtimeService.getInstance();
}),
"[project]/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/ui/button.tsx
__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function Button({ className = '', variant = 'outline', size = 'default', children, ...props }) {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-blue text-white hover:bg-blue-hover',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
    };
    const sizes = {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md'
    };
    // Check if custom colors are provided in className
    const hasCustomColors = /bg-\w+-\d+|text-\w+-\d+/.test(className);
    const variantClasses = hasCustomColors ? '' : variants[variant];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `${baseClasses} ${variantClasses} ${sizes[size]} ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/utils/assetPath.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/utils/assetPath.ts
/**
 * Utility function to get the correct asset path for GitHub Pages
 * This ensures all static assets are properly prefixed with the base path
 */ __turbopack_context__.s([
    "getAssetPath",
    ()=>getAssetPath,
    "getBaseUrl",
    ()=>getBaseUrl
]);
function getAssetPath(path) {
    // In production on GitHub Pages, assets need the base path prefix
    if (("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.location.hostname.includes('github.io')) //TURBOPACK unreachable
    ;
    // For local development, return the path as-is
    return path;
}
function getBaseUrl() {
    if (("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.location.hostname.includes('github.io')) //TURBOPACK unreachable
    ;
    return '';
}
}),
"[project]/services/rolePermissionsService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/services/rolePermissionsService.ts
// Role-based access control for Maroon Traceability events
__turbopack_context__.s([
    "rolePermissionsService",
    ()=>rolePermissionsService
]);
class RolePermissionsService {
    static instance;
    static getInstance() {
        if (!RolePermissionsService.instance) {
            RolePermissionsService.instance = new RolePermissionsService();
        }
        return RolePermissionsService.instance;
    }
    // Event type definitions
    eventTypes = [
        // Farmer events
        {
            id: 'planting',
            name: 'Planting',
            description: 'Record seed planting information',
            category: 'planting',
            requiredRole: 'farmer',
            canEdit: [
                'farmer',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        {
            id: 'seed-selection',
            name: 'Seed Selection',
            description: 'Record seed variety and certification',
            category: 'planting',
            requiredRole: 'farmer',
            canEdit: [
                'farmer',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        {
            id: 'fertiliser-application',
            name: 'Fertiliser Application',
            description: 'Record fertiliser and nutrient applications',
            category: 'growth',
            requiredRole: 'farmer',
            canEdit: [
                'farmer',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        {
            id: 'growth-monitoring',
            name: 'Growth Monitoring',
            description: 'Track plant development and health',
            category: 'growth',
            requiredRole: 'farmer',
            canEdit: [
                'farmer',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        {
            id: 'harvest',
            name: 'Harvest',
            description: 'Record harvest information and yields',
            category: 'harvest',
            requiredRole: 'farmer',
            canEdit: [
                'farmer',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        // Inspector events
        {
            id: 'quality-inspection',
            name: 'Quality Inspection',
            description: 'Third-party quality assessment',
            category: 'quality',
            requiredRole: 'inspector',
            canEdit: [
                'inspector',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            requiresApproval: false,
            attachmentsAllowed: true
        },
        {
            id: 'compliance-check',
            name: 'Compliance Check',
            description: 'Regulatory compliance verification',
            category: 'quality',
            requiredRole: 'inspector',
            canEdit: [
                'inspector',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            requiresApproval: true,
            attachmentsAllowed: true
        },
        {
            id: 'certification',
            name: 'Certification',
            description: 'Issue organic or quality certifications',
            category: 'quality',
            requiredRole: 'inspector',
            canEdit: [
                'inspector',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
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
            canEdit: [
                'logistics',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        {
            id: 'transport',
            name: 'Transport',
            description: 'Transport to processing facility',
            category: 'logistics',
            requiredRole: 'logistics',
            canEdit: [
                'logistics',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        {
            id: 'delivery',
            name: 'Delivery',
            description: 'Delivery to packaging or retail',
            category: 'logistics',
            requiredRole: 'logistics',
            canEdit: [
                'logistics',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        // Packaging events
        {
            id: 'packaging',
            name: 'Packaging',
            description: 'Product packaging and batch creation',
            category: 'packaging',
            requiredRole: 'packaging',
            canEdit: [
                'packaging',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        {
            id: 'batch-creation',
            name: 'Batch Creation',
            description: 'Create product batches with QR codes',
            category: 'packaging',
            requiredRole: 'packaging',
            canEdit: [
                'packaging',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        },
        {
            id: 'quality-check',
            name: 'Quality Check',
            description: 'Final quality check before packaging',
            category: 'packaging',
            requiredRole: 'packaging',
            canEdit: [
                'packaging',
                'inspector',
                'admin'
            ],
            canView: [
                'farmer',
                'inspector',
                'logistics',
                'packaging',
                'viewer',
                'admin'
            ],
            attachmentsAllowed: true
        }
    ];
    // Role permissions configuration
    rolePermissions = [
        {
            role: 'farmer',
            permissions: {
                canCreateEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring',
                    'harvest'
                ],
                canEditEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring',
                    'harvest'
                ],
                canViewEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring',
                    'harvest',
                    'quality-inspection',
                    'collection',
                    'transport',
                    'packaging'
                ],
                canDeleteEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring'
                ],
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
                canCreateEvents: [
                    'quality-inspection',
                    'compliance-check',
                    'certification'
                ],
                canEditEvents: [
                    'quality-inspection',
                    'compliance-check',
                    'certification'
                ],
                canViewEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring',
                    'harvest',
                    'quality-inspection',
                    'compliance-check',
                    'certification',
                    'collection',
                    'transport',
                    'packaging'
                ],
                canDeleteEvents: [
                    'quality-inspection'
                ],
                canApproveEvents: [
                    'compliance-check',
                    'certification'
                ],
                canManageUsers: false,
                canViewReports: true,
                canExportData: true,
                canManageSystem: false
            }
        },
        {
            role: 'logistics',
            permissions: {
                canCreateEvents: [
                    'collection',
                    'transport',
                    'delivery'
                ],
                canEditEvents: [
                    'collection',
                    'transport',
                    'delivery'
                ],
                canViewEvents: [
                    'harvest',
                    'quality-inspection',
                    'collection',
                    'transport',
                    'delivery',
                    'packaging'
                ],
                canDeleteEvents: [
                    'collection',
                    'transport'
                ],
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
                canCreateEvents: [
                    'packaging',
                    'batch-creation',
                    'quality-check'
                ],
                canEditEvents: [
                    'packaging',
                    'batch-creation',
                    'quality-check'
                ],
                canViewEvents: [
                    'harvest',
                    'quality-inspection',
                    'collection',
                    'transport',
                    'packaging',
                    'batch-creation',
                    'quality-check'
                ],
                canDeleteEvents: [
                    'packaging',
                    'batch-creation'
                ],
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
                canViewEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring',
                    'harvest',
                    'quality-inspection',
                    'compliance-check',
                    'certification',
                    'collection',
                    'transport',
                    'delivery',
                    'packaging',
                    'batch-creation',
                    'quality-check'
                ],
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
                canCreateEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring',
                    'harvest',
                    'quality-inspection',
                    'compliance-check',
                    'certification',
                    'collection',
                    'transport',
                    'delivery',
                    'packaging',
                    'batch-creation',
                    'quality-check'
                ],
                canEditEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring',
                    'harvest',
                    'quality-inspection',
                    'compliance-check',
                    'certification',
                    'collection',
                    'transport',
                    'delivery',
                    'packaging',
                    'batch-creation',
                    'quality-check'
                ],
                canViewEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring',
                    'harvest',
                    'quality-inspection',
                    'compliance-check',
                    'certification',
                    'collection',
                    'transport',
                    'delivery',
                    'packaging',
                    'batch-creation',
                    'quality-check'
                ],
                canDeleteEvents: [
                    'planting',
                    'seed-selection',
                    'fertiliser-application',
                    'growth-monitoring',
                    'harvest',
                    'quality-inspection',
                    'compliance-check',
                    'certification',
                    'collection',
                    'transport',
                    'delivery',
                    'packaging',
                    'batch-creation',
                    'quality-check'
                ],
                canApproveEvents: [
                    'compliance-check',
                    'certification'
                ],
                canManageUsers: true,
                canViewReports: true,
                canExportData: true,
                canManageSystem: true
            }
        }
    ];
    // Public methods
    getEventTypes() {
        return this.eventTypes;
    }
    getEventTypesForRole(role) {
        return this.eventTypes.filter((eventType)=>eventType.canView.includes(role));
    }
    getCreatableEventTypes(role) {
        return this.eventTypes.filter((eventType)=>eventType.requiredRole === role || role === 'admin' && eventType.requiredRole !== 'admin');
    }
    canCreateEvent(role, eventTypeId) {
        const eventType = this.eventTypes.find((et)=>et.id === eventTypeId);
        if (!eventType) return false;
        return eventType.requiredRole === role || role === 'admin';
    }
    canEditEvent(role, eventTypeId) {
        const eventType = this.eventTypes.find((et)=>et.id === eventTypeId);
        if (!eventType) return false;
        return eventType.canEdit.includes(role) || role === 'admin';
    }
    canViewEvent(role, eventTypeId) {
        const eventType = this.eventTypes.find((et)=>et.id === eventTypeId);
        if (!eventType) return false;
        return eventType.canView.includes(role) || role === 'admin';
    }
    canDeleteEvent(role, eventTypeId) {
        const permission = this.rolePermissions.find((p)=>p.role === role);
        if (!permission) return false;
        return permission.permissions.canDeleteEvents.includes(eventTypeId) || role === 'admin';
    }
    canApproveEvent(role, eventTypeId) {
        const eventType = this.eventTypes.find((et)=>et.id === eventTypeId);
        if (!eventType) return false;
        return Boolean(eventType.requiresApproval) && (eventType.canEdit.includes(role) || role === 'admin');
    }
    getRolePermissions(role) {
        return this.rolePermissions.find((p)=>p.role === role);
    }
    hasPermission(role, permission) {
        const rolePerm = this.rolePermissions.find((p)=>p.role === role);
        if (!rolePerm) return false;
        return Boolean(rolePerm.permissions[permission]);
    }
    // Validation methods
    validateEventCreation(role, eventTypeId) {
        if (!this.canCreateEvent(role, eventTypeId)) {
            return {
                valid: false,
                message: `Your role (${role}) is not authorized to create ${eventTypeId} events`
            };
        }
        return {
            valid: true
        };
    }
    validateEventEdit(role, eventTypeId) {
        if (!this.canEditEvent(role, eventTypeId)) {
            return {
                valid: false,
                message: `Your role (${role}) is not authorized to edit ${eventTypeId} events`
            };
        }
        return {
            valid: true
        };
    }
    // Get events by category for a role
    getEventsByCategory(role, category) {
        return this.eventTypes.filter((eventType)=>eventType.category === category && eventType.canView.includes(role));
    }
    // Get navigation items based on role
    getNavigationItems(role) {
        const baseItems = role === 'viewer' ? [
            {
                name: 'Dashboard',
                href: '/viewer'
            }
        ] : [];
        const roleSpecificItems = {
            farmer: [
                {
                    name: 'Event Management',
                    href: '/farmer/dashboard'
                },
                {
                    name: 'Growth Monitoring',
                    href: '/farmer/growth'
                },
                {
                    name: 'Fertiliser Logs',
                    href: '/farmer/fertiliser'
                },
                {
                    name: 'Seed Varieties',
                    href: '/farmer/seeds'
                },
                {
                    name: 'Compliance',
                    href: '/farmer/compliance'
                }
            ],
            inspector: [
                {
                    name: 'Overview',
                    href: '/inspector'
                },
                {
                    name: 'Inspections',
                    href: '/inspector/inspections'
                },
                {
                    name: 'Verification',
                    href: '/inspector/verification'
                },
                {
                    name: 'Reports',
                    href: '/inspector/reports'
                }
            ],
            logistics: [
                {
                    name: 'Overview',
                    href: '/logistics'
                },
                {
                    name: 'Vehicles',
                    href: '/logistics/vehicles'
                },
                {
                    name: 'Drivers',
                    href: '/logistics/drivers'
                },
                {
                    name: 'Scheduling',
                    href: '/logistics/scheduling'
                },
                {
                    name: 'Documentation',
                    href: '/logistics/documentation'
                },
                {
                    name: 'Events',
                    href: '/logistics/events'
                }
            ],
            packaging: [
                {
                    name: 'Overview',
                    href: '/packaging'
                },
                {
                    name: 'Batch Creation',
                    href: '/packaging/batch'
                },
                {
                    name: 'Quality Check',
                    href: '/packaging/quality'
                }
            ],
            viewer: [
                {
                    name: 'Products',
                    href: '/products'
                },
                {
                    name: 'Public Access',
                    href: '/public-access'
                }
            ],
            admin: [
                {
                    name: 'System Admin',
                    href: '/admin'
                },
                {
                    name: 'User Management',
                    href: '/admin/users'
                },
                {
                    name: 'Reports',
                    href: '/admin/reports'
                },
                {
                    name: 'Settings',
                    href: '/admin/settings'
                }
            ]
        };
        return [
            ...baseItems,
            ...roleSpecificItems[role] || []
        ];
    }
}
const rolePermissionsService = RolePermissionsService.getInstance();
}),
"[project]/components/layout/navigation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navigation",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$userContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/userContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/users.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/assetPath.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$rolePermissionsService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/rolePermissionsService.ts [app-ssr] (ecmascript)");
// src/components/layout/navigation.tsx
'use client';
;
;
;
;
;
;
;
;
;
;
function Navigation() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { currentUser, switchUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$userContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [isDropdownOpen, setIsDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Hide navigation on login page
    if (pathname === '/login') {
        return null;
    }
    // Page type detection
    const cleanPathname = pathname?.replace(/\/+$/, '') || '';
    const isViewerPage = cleanPathname === '/viewer';
    const isTracePage = cleanPathname.startsWith('/public-access/trace/');
    const isPublicAccessPage = cleanPathname === '/public-access';
    const isFarmerPage = cleanPathname.startsWith('/farmer');
    const isLogisticsPage = cleanPathname.startsWith('/logistics');
    const isInspectorPage = cleanPathname.startsWith('/inspector');
    const isPackagingPage = cleanPathname.startsWith('/packaging');
    // Logistics-specific navigation items
    const getLogisticsNavigationItems = ()=>{
        const logisticsTabs = [
            {
                name: 'Overview',
                href: '/logistics',
                description: 'Logistics dashboard and metrics'
            },
            {
                name: 'Vehicles',
                href: '/logistics/vehicles',
                description: 'Manage vehicle fleet and maintenance'
            },
            {
                name: 'Drivers',
                href: '/logistics/drivers',
                description: 'Driver profiles and assignments'
            },
            {
                name: 'Scheduling',
                href: '/logistics/scheduling',
                description: 'Transport scheduling and routes'
            },
            {
                name: 'Documentation',
                href: '/logistics/documentation',
                description: 'Bills of lading and delivery docs'
            },
            {
                name: 'Events',
                href: '/logistics/events',
                description: 'Logistics events and activities'
            }
        ];
        return logisticsTabs.map((tab)=>({
                ...tab,
                current: cleanPathname === tab.href || tab.href === '/logistics' && cleanPathname === '/logistics'
            }));
    };
    const getFarmerNavigationItems = ()=>{
        const farmerTabs = [
            {
                name: 'Event Management',
                href: '/farmer/dashboard',
                description: 'Add planting, growth, harvest events'
            },
            {
                name: 'Growth Monitoring',
                href: '/farmer/growth',
                description: 'Track plant development stages'
            },
            {
                name: 'Fertiliser Logs',
                href: '/farmer/fertiliser',
                description: 'Record nutrient applications'
            },
            {
                name: 'Seed Varieties',
                href: '/farmer/seeds',
                description: 'Manage seed certifications'
            },
            {
                name: 'Compliance',
                href: '/farmer/compliance',
                description: 'Food safety and export compliance'
            }
        ];
        return farmerTabs.map((tab)=>({
                ...tab,
                current: cleanPathname === tab.href || tab.href === '/farmer/dashboard' && cleanPathname === '/farmer'
            }));
    };
    // Inspector-specific navigation items
    const getInspectorNavigationItems = ()=>{
        const inspectorTabs = [
            {
                name: 'Overview',
                href: '/inspector',
                description: 'Inspector dashboard and metrics'
            },
            {
                name: 'Inspections',
                href: '/inspector/inspections',
                description: 'Quality inspections and assessments'
            },
            {
                name: 'Verification',
                href: '/inspector/verification',
                description: 'Third-party verification requests'
            },
            {
                name: 'Reports',
                href: '/inspector/reports',
                description: 'Inspection reports and analytics'
            }
        ];
        return inspectorTabs.map((tab)=>({
                ...tab,
                current: cleanPathname === tab.href || tab.href === '/inspector' && cleanPathname === '/inspector'
            }));
    };
    // Packaging-specific navigation items (empty - no tabs for packaging)
    const getPackagingNavigationItems = ()=>{
        return [];
    };
    // Default navigation for other roles
    const getDefaultNavigationItems = ()=>{
        // Only show dashboard for viewer role
        if (currentUser?.role === 'viewer') {
            return [
                {
                    name: 'Dashboard',
                    href: '/viewer',
                    current: isViewerPage
                },
                {
                    name: 'Products',
                    href: '/products',
                    current: cleanPathname === '/products'
                },
                {
                    name: 'Public Access',
                    href: '/public-access',
                    current: isPublicAccessPage
                }
            ];
        }
        return [];
    };
    // Choose navigation based on user role using the permissions service
    const userRole = currentUser?.role;
    const navigation = userRole ? __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$rolePermissionsService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rolePermissionsService"].getNavigationItems(userRole).map((item)=>({
            ...item,
            current: cleanPathname === item.href || item.href === '/viewer' && isViewerPage
        })) : getDefaultNavigationItems();
    const roles = [
        {
            name: 'Viewer',
            href: '/viewer'
        },
        {
            name: 'Farmer',
            href: '/farmer'
        },
        {
            name: 'Logistics',
            href: '/logistics'
        },
        {
            name: 'Packaging',
            href: '/packaging'
        },
        {
            name: 'Inspector',
            href: '/inspector'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "bg-white shadow-sm border-b",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between h-16 items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-shrink-0 flex items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$assetPath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssetPath"])("/images/maroon-logo.png"),
                                    alt: "MAROON",
                                    className: "h-8 w-8 mr-3 nav-logo"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/navigation.tsx",
                                    lineNumber: 123,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/viewer",
                                            className: "text-xl font-bold text-gray-900",
                                            children: "Maroon Blockchain"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navigation.tsx",
                                            lineNumber: 125,
                                            columnNumber: 17
                                        }, this),
                                        currentUser?.role === 'farmer' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-green-600 font-medium",
                                            children: "Farmer Portal"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navigation.tsx",
                                            lineNumber: 129,
                                            columnNumber: 19
                                        }, this),
                                        currentUser?.role === 'viewer' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-600 font-medium",
                                            children: "Public Portal"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navigation.tsx",
                                            lineNumber: 132,
                                            columnNumber: 19
                                        }, this),
                                        currentUser?.role === 'logistics' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-blue-600 font-medium",
                                            children: "Logistics Portal"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navigation.tsx",
                                            lineNumber: 135,
                                            columnNumber: 19
                                        }, this),
                                        currentUser?.role === 'inspector' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-purple-600 font-medium",
                                            children: "Inspector Portal"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navigation.tsx",
                                            lineNumber: 138,
                                            columnNumber: 19
                                        }, this),
                                        currentUser?.role === 'packaging' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-orange-600 font-medium",
                                            children: "Packaging Portal"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navigation.tsx",
                                            lineNumber: 141,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/navigation.tsx",
                                    lineNumber: 124,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/navigation.tsx",
                            lineNumber: 122,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/layout/navigation.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden sm:flex sm:space-x-4",
                                children: navigation.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${item.current ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`,
                                        title: item.description,
                                        children: [
                                            item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mr-2",
                                                children: item.icon
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/navigation.tsx",
                                                lineNumber: 161,
                                                columnNumber: 33
                                            }, this),
                                            item.name
                                        ]
                                    }, item.name, true, {
                                        fileName: "[project]/components/layout/navigation.tsx",
                                        lineNumber: 151,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/layout/navigation.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sm:hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        className: "flex items-center space-x-2",
                                        onClick: ()=>setIsDropdownOpen(!isDropdownOpen),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navigation.tsx",
                                            lineNumber: 174,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/navigation.tsx",
                                        lineNumber: 169,
                                        columnNumber: 15
                                    }, this),
                                    isDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "py-1",
                                            children: [
                                                navigation.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.href,
                                                        onClick: ()=>setIsDropdownOpen(false),
                                                        className: `w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${item.current ? 'bg-gray-100' : ''}`,
                                                        title: item.description,
                                                        children: [
                                                            item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "mr-2",
                                                                children: item.icon
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/layout/navigation.tsx",
                                                                lineNumber: 193,
                                                                columnNumber: 39
                                                            }, this),
                                                            item.name
                                                        ]
                                                    }, item.name, true, {
                                                        fileName: "[project]/components/layout/navigation.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 23
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border-t border-gray-200 mt-2 pt-2",
                                                    children: roles.map((role)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                if (role.name === 'Viewer') {
                                                                    // Update user context first, then navigate
                                                                    const viewerUser = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_USERS"].find((u)=>u.role === 'viewer');
                                                                    if (viewerUser) {
                                                                        switchUser(viewerUser.id);
                                                                        // Small delay to ensure context updates before navigation
                                                                        setTimeout(()=>{
                                                                            window.location.href = '/viewer';
                                                                        }, 100);
                                                                    } else {
                                                                        // Fallback if viewer user not found
                                                                        window.location.href = '/viewer';
                                                                    }
                                                                } else {
                                                                    // For other roles, go to login first
                                                                    router.push('/login');
                                                                }
                                                                setIsDropdownOpen(false);
                                                            },
                                                            className: `w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${currentUser?.role === 'farmer' && role.name === 'Farmer' || currentUser?.role === 'viewer' && role.name === 'Viewer' || currentUser?.role === 'logistics' && role.name === 'Logistics' || currentUser?.role === 'inspector' && role.name === 'Inspector' || currentUser?.role === 'packaging' && role.name === 'Packaging' ? 'bg-gray-100' : ''}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "capitalize",
                                                                    children: role.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/layout/navigation.tsx",
                                                                    lineNumber: 232,
                                                                    columnNumber: 27
                                                                }, this),
                                                                (currentUser?.role === 'farmer' && role.name === 'Farmer' || currentUser?.role === 'viewer' && role.name === 'Viewer' || currentUser?.role === 'logistics' && role.name === 'Logistics' || currentUser?.role === 'inspector' && role.name === 'Inspector' || currentUser?.role === 'packaging' && role.name === 'Packaging') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-gray-500",
                                                                    children: "(Current)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/layout/navigation.tsx",
                                                                    lineNumber: 238,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, role.name, true, {
                                                            fileName: "[project]/components/layout/navigation.tsx",
                                                            lineNumber: 201,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/navigation.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/navigation.tsx",
                                            lineNumber: 179,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/navigation.tsx",
                                        lineNumber: 178,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/navigation.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/navigation.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/navigation.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/layout/navigation.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/navigation.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/theme/colors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/theme/colors.ts
// Centralized color configuration for consistent theming across the application
// Dashboard color variants for metrics cards and UI elements
__turbopack_context__.s([
    "bannerGradients",
    ()=>bannerGradients,
    "bgColors",
    ()=>bgColors,
    "borderColors",
    ()=>borderColors,
    "buttonVariants",
    ()=>buttonVariants,
    "cardColors",
    ()=>cardColors,
    "categoryColors",
    ()=>categoryColors,
    "chartColors",
    ()=>chartColors,
    "commonColors",
    ()=>commonColors,
    "dashboardColors",
    ()=>dashboardColors,
    "getBannerGradient",
    ()=>getBannerGradient,
    "getButtonStyles",
    ()=>getButtonStyles,
    "getColorScheme",
    ()=>getColorScheme,
    "getRoleColors",
    ()=>getRoleColors,
    "getStatusColors",
    ()=>getStatusColors,
    "roleColorSchemes",
    ()=>roleColorSchemes,
    "statusColors",
    ()=>statusColors,
    "textColors",
    ()=>textColors
]);
const dashboardColors = {
    green: {
        bg: 'bg-green',
        light: 'bg-green-light',
        text: 'text-green-foreground',
        border: 'border-green/20',
        hover: 'hover:bg-green-hover'
    },
    blue: {
        bg: 'bg-blue',
        light: 'bg-blue-light',
        text: 'text-blue-foreground',
        border: 'border-blue/20',
        hover: 'hover:bg-blue-hover'
    },
    purple: {
        bg: 'bg-purple',
        light: 'bg-purple-light',
        text: 'text-purple-foreground',
        border: 'border-purple/20',
        hover: 'hover:bg-purple-hover'
    },
    orange: {
        bg: 'bg-orange',
        light: 'bg-orange-light',
        text: 'text-orange-foreground',
        border: 'border-orange/20',
        hover: 'hover:bg-orange-hover'
    },
    neutral: {
        bg: 'bg-neutral',
        light: 'bg-neutral-light',
        text: 'text-neutral-foreground',
        border: 'border-neutral/20',
        hover: 'hover:bg-neutral-dark'
    }
};
const roleColorSchemes = {
    farmer: {
        hero: 'from-green-600 to-green-500',
        button: 'bg-green-600 hover:bg-green-700 text-white',
        accent: 'bg-green-100 text-green-800 border-green-200'
    },
    retailer: {
        hero: 'from-blue-600 to-blue-500',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        accent: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    viewer: {
        hero: 'from-gray-600 to-gray-500',
        button: 'bg-gray-600 hover:bg-gray-700 text-white',
        accent: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    logistics: {
        hero: 'from-emerald-600 to-emerald-500',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        accent: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
};
function getRoleColors(role) {
    return roleColorSchemes[role] || roleColorSchemes.viewer;
}
const bannerGradients = {
    primary: 'from-primary to-primary/80',
    success: 'from-success to-success/80',
    warning: 'from-warning to-warning/80',
    error: 'from-error to-error/80',
    info: 'from-blue to-blue/80',
    green: 'from-green to-green/80',
    blue: 'from-blue to-blue/80',
    purple: 'from-purple to-purple/80',
    orange: 'from-orange to-orange/80'
};
const categoryColors = {
    fruit: {
        bg: 'bg-category-fruit-bg',
        text: 'bg-category-fruit-text',
        border: 'bg-category-fruit-border'
    },
    veg: {
        bg: 'bg-category-veg-bg',
        text: 'bg-category-veg-text',
        border: 'bg-category-veg-border'
    },
    beef: {
        bg: 'bg-category-beef-bg',
        text: 'bg-category-beef-text',
        border: 'bg-category-beef-border'
    },
    poultry: {
        bg: 'bg-category-poultry-bg',
        text: 'bg-category-poultry-text',
        border: 'bg-category-poultry-border'
    },
    pork: {
        bg: 'bg-category-pork-bg',
        text: 'bg-category-pork-text',
        border: 'bg-category-pork-border'
    },
    lamb: {
        bg: 'bg-category-lamb-bg',
        text: 'bg-category-lamb-text',
        border: 'bg-category-lamb-border'
    },
    goat: {
        bg: 'bg-category-goat-bg',
        text: 'bg-category-goat-text',
        border: 'bg-category-goat-border'
    },
    fish: {
        bg: 'bg-category-fish-bg',
        text: 'bg-category-fish-text',
        border: 'bg-category-fish-border'
    }
};
const cardColors = {
    'total-transactions': {
        bg: 'bg-card-green-light',
        text: 'text-card-green',
        border: 'border-card-green/20',
        icon: 'text-card-green'
    },
    'monthly-revenue': {
        bg: 'bg-card-blue-light',
        text: 'text-card-blue',
        border: 'border-card-blue/20',
        icon: 'text-card-blue'
    },
    'active-farms': {
        bg: 'bg-card-purple-light',
        text: 'text-card-purple',
        border: 'border-card-purple/20',
        icon: 'text-card-purple'
    },
    'retailers': {
        bg: 'bg-card-orange-light',
        text: 'text-card-orange',
        border: 'border-card-orange/20',
        icon: 'text-card-orange'
    },
    'avg-fee': {
        bg: 'bg-card-neutral-light',
        text: 'text-card-neutral',
        border: 'border-card-neutral/20',
        icon: 'text-card-neutral'
    },
    // Add fallback variants
    'primary-card': {
        bg: 'bg-card-blue-light',
        text: 'text-card-blue',
        border: 'border-card-blue/20',
        icon: 'text-card-blue'
    },
    'secondary-card': {
        bg: 'bg-card-purple-light',
        text: 'text-card-purple',
        border: 'border-card-purple/20',
        icon: 'text-card-purple'
    }
};
const statusColors = {
    certified: {
        bg: 'bg-success',
        light: 'bg-success-light',
        text: 'text-success-foreground',
        border: 'border-success/20',
        icon: 'text-success'
    },
    pending: {
        bg: 'bg-warning',
        light: 'bg-warning-light',
        text: 'text-warning-foreground',
        border: 'border-warning/20',
        icon: 'text-warning'
    },
    'in-transit': {
        bg: 'bg-warning',
        light: 'bg-warning-light',
        text: 'text-warning-foreground',
        border: 'border-warning/20',
        icon: 'text-warning'
    },
    delivered: {
        bg: 'bg-blue',
        light: 'bg-blue-light',
        text: 'text-blue-foreground',
        border: 'border-blue/20',
        icon: 'text-blue'
    },
    info: {
        bg: 'bg-blue',
        light: 'bg-blue-light',
        text: 'text-blue-foreground',
        border: 'border-blue/20',
        icon: 'text-blue'
    },
    error: {
        bg: 'bg-error',
        light: 'bg-error-light',
        text: 'text-error-foreground',
        border: 'border-error/20',
        icon: 'text-error'
    },
    success: {
        bg: 'bg-success',
        light: 'bg-success-light',
        text: 'text-success-foreground',
        border: 'border-success/20',
        icon: 'text-success'
    },
    warning: {
        bg: 'bg-warning',
        light: 'bg-warning-light',
        text: 'text-warning-foreground',
        border: 'border-warning/20',
        icon: 'text-warning'
    }
};
const buttonVariants = {
    primary: {
        base: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-primary text-primary hover:bg-primary/10'
    },
    secondary: {
        base: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'border border-secondary text-secondary hover:bg-secondary/10'
    },
    accent: {
        base: 'bg-accent text-accent-foreground hover:bg-accent/90',
        outline: 'border border-accent text-accent hover:bg-accent/10'
    },
    success: {
        base: 'bg-success text-success-foreground hover:bg-success/90',
        outline: 'border border-success text-success hover:bg-success/10'
    },
    warning: {
        base: 'bg-warning text-warning-foreground hover:bg-warning/90',
        outline: 'border border-warning text-warning hover:bg-warning/10'
    },
    error: {
        base: 'bg-error text-error-foreground hover:bg-error/90',
        outline: 'border border-error text-error hover:bg-error/10'
    },
    green: {
        base: 'bg-green text-green-foreground hover:bg-green-hover',
        outline: 'border border-green text-green hover:bg-green/10'
    },
    blue: {
        base: 'bg-blue text-blue-foreground hover:bg-blue-hover',
        outline: 'border border-blue text-blue hover:bg-blue/10'
    },
    purple: {
        base: 'bg-purple text-purple-foreground hover:bg-purple-hover',
        outline: 'border border-purple text-purple hover:bg-purple/10'
    },
    orange: {
        base: 'bg-orange text-orange-foreground hover:bg-orange-hover',
        outline: 'border border-orange text-orange hover:bg-orange/10'
    },
    neutral: {
        base: 'bg-neutral text-neutral-foreground hover:bg-neutral-dark',
        outline: 'border border-neutral text-neutral hover:bg-neutral-light'
    }
};
function getColorScheme(variant) {
    return dashboardColors[variant] || dashboardColors.neutral;
}
function getStatusColors(status) {
    return statusColors[status] || statusColors.info;
}
function getButtonStyles(variant, type = 'base') {
    return buttonVariants[variant]?.[type] || buttonVariants.primary.base;
}
const textColors = {
    primary: 'text-gray-700',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
    foreground: 'text-foreground',
    white: 'text-white',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info'
};
const bgColors = {
    primary: 'bg-card-blue-light',
    secondary: 'bg-card-purple-light',
    success: 'bg-card-green-light',
    warning: 'bg-card-orange-light',
    error: 'bg-card-neutral-light',
    neutral: 'bg-card-neutral-light',
    white: 'bg-white',
    muted: 'bg-gray-50'
};
const borderColors = {
    primary: 'border-card-blue/20',
    secondary: 'border-card-purple/20',
    success: 'border-card-green/20',
    warning: 'border-card-orange/20',
    error: 'border-card-neutral/20',
    neutral: 'border-card-neutral/20',
    default: 'border-gray-200'
};
const commonColors = {
    // Gray scale
    white: 'text-white',
    black: 'text-black',
    gray50: 'bg-gray-50',
    gray100: 'bg-gray-100',
    gray200: 'bg-gray-200',
    gray400: 'text-gray-400',
    gray500: 'text-gray-500',
    gray600: 'text-gray-600',
    gray700: 'text-gray-700',
    gray800: 'text-gray-800',
    gray900: 'text-gray-900',
    borderGray200: 'border-gray-200',
    borderGray700: 'border-gray-700',
    hoverGray100: 'hover:bg-gray-100',
    // Status colors
    blue500: 'text-blue-500',
    blue600: 'text-blue-600',
    green400: 'text-green-400',
    green600: 'text-green-600',
    green700: 'text-green-700',
    red100: 'bg-red-100',
    red800: 'text-red-800',
    yellow100: 'bg-yellow-100',
    yellow400: 'text-yellow-400',
    yellow800: 'text-yellow-800',
    emerald100: 'bg-emerald-100',
    emerald800: 'text-emerald-800',
    pink100: 'bg-pink-100',
    pink800: 'text-pink-800',
    purple100: 'bg-purple-100',
    purple800: 'text-purple-800',
    orange100: 'bg-orange-100',
    orange800: 'text-orange-800',
    // Blockchain/crypto colors
    blockchainBg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    blockchainText: 'text-blue-600',
    blockchainBorder: 'border-gray-700',
    // Interactive states
    hoverTransition: 'transition-colors',
    // Background colors
    whiteBg: 'bg-white',
    transparentBg: 'bg-transparent',
    // Shadow and border utilities
    shadowLg: 'shadow-lg',
    roundedLg: 'rounded-lg',
    roundedFull: 'rounded-full'
};
const chartColors = {
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    success: '#10b981',
    successDark: '#059669',
    warning: '#f59e0b',
    warningDark: '#d97706',
    error: '#ef4444',
    errorDark: '#dc2626',
    purple: '#8b5cf6',
    purpleDark: '#7c3aed',
    gray: '#666666',
    pieDefault: '#8884d8'
};
function getBannerGradient(type = 'primary') {
    return bannerGradients[type] || bannerGradients.primary;
}
}),
"[project]/components/dashboard/metricsCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetricsCard",
    ()=>MetricsCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme/colors.ts [app-ssr] (ecmascript)");
// src/components/dashboard/metricsCard.tsx
'use client';
;
;
;
function MetricsCard({ icon, label, value, variant = 'primary', compact = false }) {
    // Use colors from the centralized color file
    const colorScheme = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardColors"][variant] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardColors"]['total-transactions'];
    if (compact) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(colorScheme.bg, 'p-3 rounded-xl border shadow-sm hover:shadow-md transition-shadow h-full', colorScheme.border),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(colorScheme.bg, 'p-2 rounded-lg border shadow-sm mr-3', colorScheme.border),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4 flex items-center justify-center', colorScheme.icon),
                            children: icon
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/metricsCard.tsx",
                            lineNumber: 40,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/metricsCard.tsx",
                        lineNumber: 35,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-gray-500",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/metricsCard.tsx",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold text-gray-500",
                                children: value
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/metricsCard.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/metricsCard.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/metricsCard.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/dashboard/metricsCard.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(colorScheme.bg, 'p-4 rounded-xl border shadow-sm hover:shadow-md transition-all', colorScheme.border),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(colorScheme.bg, 'p-2 rounded-lg border shadow-sm mr-4', colorScheme.border),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-6 w-6 flex items-center justify-center', colorScheme.icon),
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/metricsCard.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/metricsCard.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-gray-500",
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/metricsCard.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-2xl font-bold', colorScheme.icon),
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/metricsCard.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/metricsCard.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard/metricsCard.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/dashboard/metricsCard.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/dashboard/DashboardLayout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/dashboard/DashboardLayout.tsx
__turbopack_context__.s([
    "DashboardLayout",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$navigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/navigation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$metricsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/metricsCard.tsx [app-ssr] (ecmascript)");
;
;
;
function MetricsCardWrapper({ title, value, icon, color, variant = 'primary' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$metricsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetricsCard"], {
        icon: icon,
        label: title,
        value: value,
        variant: variant
    }, void 0, false, {
        fileName: "[project]/components/dashboard/DashboardLayout.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
function DashboardLayout({ children, title, subtitle, actions, welcomeMessage, description, cards }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$navigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Navigation"], {}, void 0, false, {
                fileName: "[project]/components/dashboard/DashboardLayout.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 sm:px-6 lg:px-8",
                children: [
                    (title || subtitle || actions) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-8",
                        children: [
                            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-gray-900 mb-4",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/DashboardLayout.tsx",
                                lineNumber: 43,
                                columnNumber: 23
                            }, this),
                            subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-lg text-gray-600 max-w-2xl mx-auto",
                                children: subtitle
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/DashboardLayout.tsx",
                                lineNumber: 44,
                                columnNumber: 26
                            }, this),
                            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center mt-4 space-x-3",
                                children: actions
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/DashboardLayout.tsx",
                                lineNumber: 45,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/DashboardLayout.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this),
                    cards && cards.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6",
                        children: cards.map((card, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricsCardWrapper, {
                                title: card.title,
                                value: card.value,
                                icon: card.icon,
                                color: card.color,
                                variant: card.variant
                            }, index, false, {
                                fileName: "[project]/components/dashboard/DashboardLayout.tsx",
                                lineNumber: 53,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/DashboardLayout.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/DashboardLayout.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/DashboardLayout.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/DashboardLayout.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/dashboard/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/dashboard/constants.ts
__turbopack_context__.s([
    "CHART_COLORS",
    ()=>CHART_COLORS,
    "CHART_COLOR_MAP",
    ()=>CHART_COLOR_MAP,
    "DASHBOARD_CONFIG",
    ()=>DASHBOARD_CONFIG,
    "METRICS_LABELS",
    ()=>METRICS_LABELS
]);
const CHART_COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#6b7280',
    '#22c55e',
    '#f97316',
    '#dc2626',
    '#06b6d4'
];
const CHART_COLOR_MAP = {
    primary: '#3b82f6',
    secondary: '#10b981',
    tertiary: '#f59e0b',
    quaternary: '#ef4444',
    neutral: '#6b7280',
    success: '#22c55e',
    warning: '#f97316',
    error: '#dc2626',
    info: '#06b6d4',
    background: '#f3f4f6',
    border: '#e5e7eb',
    text: '#111827',
    textSecondary: '#6b7280'
};
const DASHBOARD_CONFIG = {
    refreshInterval: 30000,
    maxDataPoints: 50,
    animationDuration: 300
};
const METRICS_LABELS = {
    totalProducts: 'Total Products',
    verifiedProducts: 'Verified Products',
    pendingVerifications: 'Pending Verifications',
    activeUsers: 'Active Users',
    systemUptime: 'System Uptime',
    averageResponseTime: 'Avg Response Time'
};
}),
"[project]/components/qr/QRScanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QRScanner",
    ()=>QRScanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-ssr] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check-circle.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/qr-code.js [app-ssr] (ecmascript) <export default as QrCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
// src/components/qr/QRScanner.tsx
'use client';
;
;
;
;
function QRScanner({ onScanSuccess, onScanError, onClose, mockMode = true }) {
    const [isScanning, setIsScanning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scanResult, setScanResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showMockDialog, setShowMockDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mockInput, setMockInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startScanning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (mockMode) {
            setShowMockDialog(true);
            setIsScanning(true);
            setError(null);
            setScanResult(null);
        } else {
            // Real QR code scanning logic would go here
            setIsScanning(true);
            setError(null);
            setScanResult(null);
        }
    }, [
        mockMode
    ]);
    const stopScanning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsScanning(false);
        setShowMockDialog(false);
        setMockInput('');
        setError(null);
    }, []);
    const handleMockScan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!mockInput.trim()) {
            const errorMsg = 'Please enter a product ID or QR code data';
            setError(errorMsg);
            onScanError?.(errorMsg);
            return;
        }
        // Simulate successful scan
        setScanResult(mockInput);
        setError(null);
        onScanSuccess?.(mockInput);
        // Auto-close after successful scan
        setTimeout(()=>{
            stopScanning();
            onClose?.();
        }, 1500);
    }, [
        mockInput,
        onScanSuccess,
        onScanError,
        onClose,
        stopScanning
    ]);
    const generateMockProductIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const mockIds = [
            'PRD-2024-001',
            'PRD-2024-002',
            'PRD-2024-003',
            'BLK1704123456789',
            'TRACE-DEMO-001'
        ];
        return mockIds[Math.floor(Math.random() * mockIds.length)];
    }, []);
    const useMockId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const mockId = generateMockProductIds();
        setMockInput(mockId);
    }, [
        generateMockProductIds
    ]);
    if (showMockDialog) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-2xl shadow-2xl max-w-md w-full p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-2 bg-blue-100 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__["QrCode"], {
                                            className: "h-6 w-6 text-blue-600"
                                        }, void 0, false, {
                                            fileName: "[project]/components/qr/QRScanner.tsx",
                                            lineNumber: 92,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-gray-900",
                                                children: "QR Scanner"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRScanner.tsx",
                                                lineNumber: 95,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: "Mock Mode - Enter product ID"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRScanner.tsx",
                                                lineNumber: 96,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: stopScanning,
                                className: "h-8 w-8 p-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/qr/QRScanner.tsx",
                                    lineNumber: 105,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/qr/QRScanner.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    scanResult ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                    className: "h-8 w-8 text-green-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/qr/QRScanner.tsx",
                                    lineNumber: 112,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 111,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-lg font-semibold text-gray-900 mb-2",
                                children: "Scan Successful!"
                            }, void 0, false, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 114,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 font-mono bg-gray-100 px-3 py-2 rounded",
                                children: scanResult
                            }, void 0, false, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 115,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/qr/QRScanner.tsx",
                        lineNumber: 110,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                        children: "Enter Product ID or QR Data"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: mockInput,
                                                onChange: (e)=>setMockInput(e.target.value),
                                                placeholder: "e.g., PRD-2024-001",
                                                className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                autoFocus: true
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRScanner.tsx",
                                                lineNumber: 126,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: useMockId,
                                                className: "whitespace-nowrap",
                                                children: "Random"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRScanner.tsx",
                                                lineNumber: 134,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 125,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "h-4 w-4 text-red-600 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 147,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-red-700",
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 148,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 146,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleMockScan,
                                        className: "flex-1 bg-blue-600 hover:bg-blue-700",
                                        children: "Scan Product"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 153,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        onClick: stopScanning,
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 159,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 152,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-500 text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: 'Try: PRD-2024-001, BLK1704123456789, or click "Random"'
                                }, void 0, false, {
                                    fileName: "[project]/components/qr/QRScanner.tsx",
                                    lineNumber: 168,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 167,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/qr/QRScanner.tsx",
                        lineNumber: 120,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/qr/QRScanner.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/qr/QRScanner.tsx",
            lineNumber: 87,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex items-center justify-center min-h-[400px]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                        className: "h-8 w-8 text-blue-600"
                    }, void 0, false, {
                        fileName: "[project]/components/qr/QRScanner.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/qr/QRScanner.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-gray-900 mb-2",
                    children: "QR Code Scanner"
                }, void 0, false, {
                    fileName: "[project]/components/qr/QRScanner.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-600 mb-6",
                    children: mockMode ? 'Mock Mode - Simulate QR scanning' : 'Scan product QR codes'
                }, void 0, false, {
                    fileName: "[project]/components/qr/QRScanner.tsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, this),
                isScanning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-64 h-64 mx-auto bg-gray-900 rounded-lg overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-white text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__["QrCode"], {
                                                    className: "h-16 w-16 mx-auto mb-4 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/qr/QRScanner.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: "Scanning..."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/qr/QRScanner.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/qr/QRScanner.tsx",
                                            lineNumber: 195,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 194,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-blue-400 to-transparent animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRScanner.tsx",
                                        lineNumber: 201,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRScanner.tsx",
                                lineNumber: 192,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/qr/QRScanner.tsx",
                            lineNumber: 191,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: stopScanning,
                            variant: "outline",
                            className: "w-full",
                            children: "Stop Scanning"
                        }, void 0, false, {
                            fileName: "[project]/components/qr/QRScanner.tsx",
                            lineNumber: 205,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/qr/QRScanner.tsx",
                    lineNumber: 190,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: startScanning,
                            className: "w-full !bg-gradient-to-r !from-green-600 !to-green-500 hover:!from-green-700 hover:!to-green-600 !text-white shadow-lg rounded-full",
                            children: "Start Scanning"
                        }, void 0, false, {
                            fileName: "[project]/components/qr/QRScanner.tsx",
                            lineNumber: 215,
                            columnNumber: 13
                        }, this),
                        mockMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500",
                            children: "This is a mock implementation for demonstration"
                        }, void 0, false, {
                            fileName: "[project]/components/qr/QRScanner.tsx",
                            lineNumber: 223,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/qr/QRScanner.tsx",
                    lineNumber: 214,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/qr/QRScanner.tsx",
            lineNumber: 179,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/qr/QRScanner.tsx",
        lineNumber: 178,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/qr/QRGenerator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QRGenerator",
    ()=>QRGenerator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/qr-code.js [app-ssr] (ecmascript) <export default as QrCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
// src/components/qr/QRGenerator.tsx
'use client';
;
;
;
;
function QRGenerator({ productId = '', productName = '', farmer = '', location = '', onGenerate, mockMode = true }) {
    const [qrData, setQrData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isGenerating, setIsGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const generateQRData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!productId.trim()) {
            return '';
        }
        // Create structured QR data for the product
        const qrContent = {
            id: productId,
            name: productName,
            farmer: farmer,
            location: location,
            timestamp: new Date().toISOString(),
            source: 'maroon-traceability'
        };
        return JSON.stringify(qrContent);
    }, [
        productId,
        productName,
        farmer,
        location
    ]);
    const handleGenerate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!productId.trim()) {
            return;
        }
        setIsGenerating(true);
        // Simulate QR generation delay
        await new Promise((resolve)=>setTimeout(resolve, 1000));
        const generatedData = generateQRData();
        setQrData(generatedData);
        setShowPreview(true);
        setIsGenerating(false);
        onGenerate?.(generatedData);
    }, [
        productId,
        generateQRData,
        onGenerate
    ]);
    const handleCopy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        navigator.clipboard.writeText(qrData);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    }, [
        qrData
    ]);
    const handleDownload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // In a real implementation, this would download the QR code image
        // For mock, we'll download the data as a text file
        const blob = new Blob([
            qrData
        ], {
            type: 'text/plain'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-${productId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [
        qrData,
        productId
    ]);
    const handleShare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Product QR Code: ${productName}`,
                    text: `Scan this QR code to verify ${productName} from ${farmer}`,
                    url: qrData
                });
            } catch (error) {
                // Fallback to copying if share fails
                handleCopy();
            }
        } else {
            handleCopy();
        }
    }, [
        productName,
        farmer,
        qrData,
        handleCopy
    ]);
    const generateMockQR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // Generate a mock QR code visual representation
        const mockQR = [];
        const size = 25;
        for(let i = 0; i < size; i++){
            const row = [];
            for(let j = 0; j < size; j++){
                // Create a pattern that looks like a QR code
                const isPositionMarker = i < 7 && j < 7 || i < 7 && j >= size - 7 || i >= size - 7 && j < 7; // Bottom-left
                const isRandomPattern = Math.random() > 0.5;
                row.push(isPositionMarker || isRandomPattern);
            }
            mockQR.push(row);
        }
        return mockQR;
    }, []);
    const mockQRPattern = generateMockQR();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__["QrCode"], {
                            className: "h-8 w-8 text-green-600"
                        }, void 0, false, {
                            fileName: "[project]/components/qr/QRGenerator.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/qr/QRGenerator.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-900 mb-2",
                        children: "QR Code Generator"
                    }, void 0, false, {
                        fileName: "[project]/components/qr/QRGenerator.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: mockMode ? 'Mock Mode - Generate demo QR codes' : 'Generate product QR codes'
                    }, void 0, false, {
                        fileName: "[project]/components/qr/QRGenerator.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/qr/QRGenerator.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                        children: "Product ID"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: productId,
                                        onChange: (e)=>setQrData(''),
                                        placeholder: "e.g., PRD-2024-001",
                                        className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                        children: "Product Name"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: productName,
                                        onChange: (e)=>setQrData(''),
                                        placeholder: "e.g., Organic Apples",
                                        className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "Farmer"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 173,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: farmer,
                                                onChange: (e)=>setQrData(''),
                                                placeholder: "Farm name",
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 176,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 172,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "Location"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 186,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: location,
                                                onChange: (e)=>setQrData(''),
                                                placeholder: "Location",
                                                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 189,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 185,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/qr/QRGenerator.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handleGenerate,
                        disabled: !productId.trim() || isGenerating,
                        className: "w-full bg-green-600 hover:bg-green-700",
                        children: isGenerating ? 'Generating...' : 'Generate QR Code'
                    }, void 0, false, {
                        fileName: "[project]/components/qr/QRGenerator.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    showPreview && qrData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-white border-2 border-gray-300 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-25 gap-0",
                                        style: {
                                            gridTemplateColumns: `repeat(25, 1fr)`
                                        },
                                        children: mockQRPattern.map((row, i)=>row.map((cell, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-1 h-1 ${cell ? 'bg-black' : 'bg-white'}`
                                                }, `${i}-${j}`, false, {
                                                    fileName: "[project]/components/qr/QRGenerator.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 23
                                                }, this)))
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 215,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/qr/QRGenerator.tsx",
                                    lineNumber: 214,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 p-3 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-medium text-gray-700 mb-2",
                                        children: "QR Code Data:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 230,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-mono text-gray-600 break-all",
                                        children: qrData
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: handleCopy,
                                        className: "flex items-center gap-1",
                                        children: [
                                            copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 245,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 247,
                                                columnNumber: 19
                                            }, this),
                                            copied ? 'Copied!' : 'Copy'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 238,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: handleDownload,
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 258,
                                                columnNumber: 17
                                            }, this),
                                            "Download"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: handleShare,
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 268,
                                                columnNumber: 17
                                            }, this),
                                            "Share"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-blue-50 p-3 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium text-blue-900 mb-1",
                                        children: "Product Summary:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 275,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-blue-700 space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "ID:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                                        lineNumber: 277,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    productId
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 277,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Name:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    productName
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 278,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Farmer:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    farmer
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 279,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Location:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    location
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                                lineNumber: 280,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/qr/QRGenerator.tsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/qr/QRGenerator.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/qr/QRGenerator.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this),
                    mockMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500 text-center",
                        children: "This is a mock implementation for demonstration"
                    }, void 0, false, {
                        fileName: "[project]/components/qr/QRGenerator.tsx",
                        lineNumber: 287,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/qr/QRGenerator.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/qr/QRGenerator.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/qr/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// src/components/qr/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$qr$2f$QRScanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/qr/QRScanner.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$qr$2f$QRGenerator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/qr/QRGenerator.tsx [app-ssr] (ecmascript)");
;
;
}),
"[project]/app/viewer/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PublicAccessPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$productContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/contexts/productContext.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/product.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$errorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/errorBoundary.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.module.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$eventLogger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/eventLogger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$realtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/realtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$DashboardLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/DashboardLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$metricsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/metricsCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme/colors.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wifi.js [app-ssr] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-ssr] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$qr$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/qr/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$qr$2f$QRScanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/qr/QRScanner.tsx [app-ssr] (ecmascript)");
// src/app/viewer/page.tsx
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Category Overview Component
const CategoryOverview = ()=>{
    const { products } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$productContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useProducts"])();
    console.log('CategoryOverview - products:', products);
    try {
        // Calculate category distribution
        const categoryData = Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"]).map((category)=>{
            const count = products.filter((p)=>p.category === category).length;
            const percentage = products.length > 0 ? count / products.length * 100 : 0;
            return {
                name: category,
                value: count,
                percentage: parseFloat(percentage.toFixed(1))
            };
        }).filter((item)=>item.value > 0);
        console.log('CategoryOverview - categoryData:', categoryData);
        // Sort by count (descending)
        const sortedData = [
            ...categoryData
        ].sort((a, b)=>b.value - a.value);
        console.log('CategoryOverview - sortedData:', sortedData);
        const renderCustomizedLabel = (props)=>{
            // Defensive checks to prevent runtime errors
            if (!props || !props.cx || !props.cy || props.midAngle === undefined || !props.percent || !props.name) {
                return null;
            }
            const RADIAN = Math.PI / 180;
            const innerRadius = props.innerRadius || 0;
            const outerRadius = props.outerRadius || 0;
            const radius = 25 + innerRadius + outerRadius;
            const x = props.cx + radius * Math.cos(-props.midAngle * RADIAN);
            const y = props.cy + radius * Math.sin(-props.midAngle * RADIAN);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                x: x,
                y: y,
                fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].gray,
                textAnchor: x > props.cx ? 'start' : 'end',
                dominantBaseline: "central",
                className: "text-xs",
                children: `${props.name} (${(props.percent * 100).toFixed(0)}%)`
            }, void 0, false, {
                fileName: "[project]/app/viewer/page.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        };
        if (!sortedData || sortedData.length === 0) {
            console.warn('CategoryOverview: No data available for charts');
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$errorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].whiteBg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].roundedLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].shadowLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].borderGray200} p-6`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-4 flex items-center justify-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                    className: `h-5 w-5 ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["textColors"].info} mx-auto mb-2`
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 102,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: `text-lg font-semibold text-center ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["textColors"].primary}`,
                                    children: "Product Categories"
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 103,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/viewer/page.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center h-64 ${commonColors.gray500}",
                            children: "No category data available"
                        }, void 0, false, {
                            fileName: "[project]/app/viewer/page.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/viewer/page.tsx",
                    lineNumber: 100,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/viewer/page.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$errorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].whiteBg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].roundedLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].shadowLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].borderGray200} p-6`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-4 flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                className: "h-5 w-5 ${commonColors.blue500}"
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-center ${commonColors.gray900}",
                                children: "Product Categories"
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$errorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
                        children: sortedData.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-h-[200px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-h-[200px] w-full",
                                        role: "img",
                                        "aria-label": `Pie chart showing product category distribution`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                            width: "100%",
                                            height: 200,
                                            minWidth: 0,
                                            minHeight: 0,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PieChart"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pie"], {
                                                        data: sortedData,
                                                        cx: "50%",
                                                        cy: "50%",
                                                        labelLine: false,
                                                        outerRadius: 60,
                                                        fill: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].pieDefault,
                                                        dataKey: "value",
                                                        nameKey: "name",
                                                        label: renderCustomizedLabel,
                                                        children: sortedData.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cell"], {
                                                                fill: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHART_COLORS"][index % __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHART_COLORS"].length]
                                                            }, `cell-${index}`, false, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 141,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                        formatter: (value, name)=>[
                                                                `${value} products (${(value / products.length * 100).toFixed(1)}%)`,
                                                                name
                                                            ]
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 128,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/app/viewer/page.tsx",
                                            lineNumber: 127,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 126,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 125,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: sortedData.map((category, index)=>{
                                        const colors = [
                                            {
                                                bg: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].primary,
                                                border: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].primaryDark
                                            },
                                            {
                                                bg: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].success,
                                                border: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].successDark
                                            },
                                            {
                                                bg: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].warning,
                                                border: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].warningDark
                                            },
                                            {
                                                bg: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].error,
                                                border: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].errorDark
                                            },
                                            {
                                                bg: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].purple,
                                                border: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chartColors"].purpleDark
                                            }
                                        ];
                                        const color = colors[index % colors.length];
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-sm font-medium ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].gray900}`,
                                                            children: category.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 170,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `text-sm font-bold ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].gray900}`,
                                                                    children: category.value
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 172,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `text-xs font-semibold ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].gray500}`,
                                                                    children: [
                                                                        "(",
                                                                        category.percentage.toFixed(0),
                                                                        "%)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/viewer/page.tsx",
                                                                    lineNumber: 173,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `relative w-full h-2 rounded-full overflow-hidden ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].gray200}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                                                        style: {
                                                            width: `${category.percentage}%`,
                                                            background: `linear-gradient(90deg, ${color.bg}, ${color.border})`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, category.name, true, {
                                            fileName: "[project]/app/viewer/page.tsx",
                                            lineNumber: 168,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0));
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 156,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/viewer/page.tsx",
                            lineNumber: 123,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center h-64 ${commonColors.gray500}",
                            children: "No category data available"
                        }, void 0, false, {
                            fileName: "[project]/app/viewer/page.tsx",
                            lineNumber: 191,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/viewer/page.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/viewer/page.tsx",
            lineNumber: 114,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    } catch (error) {
        console.error('CategoryOverview error:', error);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$errorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].whiteBg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].roundedLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].shadowLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].borderGray200} p-6`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-4 flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                className: "h-5 w-5 ${commonColors.blue500}"
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-center ${commonColors.gray900}",
                                children: "Product Categories"
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center h-64 ${commonColors.gray500}",
                        children: "Error loading category data"
                    }, void 0, false, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/viewer/page.tsx",
                lineNumber: 203,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/viewer/page.tsx",
            lineNumber: 202,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
};
function PublicAccessPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const { products, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$productContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useProducts"])();
    const [isRealtimeConnected, setIsRealtimeConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recentEvents, setRecentEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Set up real-time subscriptions
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Subscribe to product updates
        const unsubscribeProduct = __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$realtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["realtime"].subscribe('product_update', (event)=>{
            console.log('Product update received:', event.data);
            setRecentEvents((prev)=>[
                    event,
                    ...prev.slice(0, 4)
                ]); // Keep last 5 events
            // Track real-time event
            __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackUserAction('realtime_product_update', {
                productId: event.data.productId,
                status: event.data.status
            });
        });
        // Subscribe to verification updates
        const unsubscribeVerification = __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$realtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["realtime"].subscribe('verification_update', (event)=>{
            console.log('Verification update received:', event.data);
            setRecentEvents((prev)=>[
                    event,
                    ...prev.slice(0, 4)
                ]);
            __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackUserAction('realtime_verification_update', {
                productId: event.data.productId,
                verificationCount: event.data.verificationCount
            });
        });
        // Subscribe to blockchain updates
        const unsubscribeBlockchain = __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$realtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["realtime"].subscribe('blockchain_update', (event)=>{
            console.log('Blockchain update received:', event.data);
            setRecentEvents((prev)=>[
                    event,
                    ...prev.slice(0, 4)
                ]);
            __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackUserAction('realtime_blockchain_update', {
                blockNumber: event.data.blockNumber,
                transactionCount: event.data.transactionCount
            });
        });
        // Monitor connection status
        const unsubscribeAll = __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$realtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["realtime"].subscribeToAll((event)=>{
            if (event && event.type === 'connection_established') {
                setIsRealtimeConnected(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackUserAction('realtime_connected', {
                    connectedClients: event.data.connectedClients
                });
            }
        });
        // Check initial connection status
        setIsRealtimeConnected(__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$realtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["realtime"].getConnectionStatus());
        // Cleanup subscriptions
        return ()=>{
            unsubscribeProduct();
            unsubscribeVerification();
            unsubscribeBlockchain();
            unsubscribeAll();
        };
    }, []);
    // Log dashboard view (without user dependency)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$eventLogger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eventLogger"].log('USER_ACTION', 'View dashboard', {
            userId: 'public-access-anonymous',
            userRole: 'public',
            action: 'VIEW_PUBLIC_ACCESS',
            details: {
                dashboard: 'public-access',
                anonymous: true,
                productCount: products.length,
                realtimeConnected: isRealtimeConnected
            }
        });
        // Track analytics
        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackUserAction('view_public_access', {
            dashboardType: 'public-access',
            productCount: products.length,
            isLoading,
            realtimeConnected: isRealtimeConnected
        });
        // Track feature usage
        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackFeatureUsage('dashboard_public_access', {
            productCategories: Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"]).length,
            hasProducts: products.length > 0,
            realtimeEnabled: true
        });
    }, [
        products.length,
        isLoading,
        isRealtimeConnected
    ]);
    // Calculate metrics
    const metrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            totalProducts: products.length,
            verifiedProducts: products.filter((p)=>p.status === 'verified').length,
            pendingVerification: products.filter((p)=>p.status === 'pending').length,
            totalVerifications: products.reduce((sum, p)=>sum + (p.verifications || 0), 0)
        }), [
        products
    ]);
    // Debug logging
    console.log('Products data:', products);
    console.log('Public Access metrics updated:', metrics);
    console.log('Metrics re-rendering with new values');
    const displayProducts = products.map((product)=>({
            id: product.id,
            name: product.name,
            category: product.category,
            status: product.status,
            verificationCount: product.verifications,
            lastVerified: product.lastVerified
        })).sort((a, b)=>b.verificationCount - a.verificationCount).slice(0, 3); // Only show top 3 for cleaner layout
    const handleProductClick = (productId)=>{
        // Track product click
        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackUserAction('click_product', {
            productId,
            source: 'public_access_dashboard'
        });
        // Track conversion (product view)
        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackConversion('product_view', {
            productId,
            dashboardType: 'public-access'
        });
        router.push(`/public-access/trace/${productId}`);
    };
    // Get public-access specific colors
    const viewerColors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRoleColors"])('viewer');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$errorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$DashboardLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardLayout"], {
            description: "View and verify product information on blockchain",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `relative overflow-hidden bg-gradient-to-br from-gray-600 to-gray-500 rounded-2xl shadow-2xl max-w-4xl mx-auto w-full`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-foreground/5"
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 365,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative z-10 text-center p-8 px-4 sm:px-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "inline-block mb-4 px-4 py-1.5 bg-background/20 backdrop-blur-sm rounded-full border border-white/10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-medium text-white",
                                            children: "Public Dashboard"
                                        }, void 0, false, {
                                            fileName: "[project]/app/viewer/page.tsx",
                                            lineNumber: 368,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 367,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "mb-2 text-white text-2xl sm:text-3xl font-bold",
                                        children: "Welcome"
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 370,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-white/90 text-sm max-w-md mx-auto",
                                        children: "View product information and track blockchain history (Read-only access)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 373,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 366,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 364,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$metricsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetricsCard"], {
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    className: "h-6 w-6",
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 383,
                                    columnNumber: 21
                                }, void 0),
                                label: "Total Products",
                                value: metrics.totalProducts,
                                variant: "total-transactions"
                            }, "total-products", false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 381,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$metricsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetricsCard"], {
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    className: "h-6 w-6",
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 390,
                                    columnNumber: 21
                                }, void 0),
                                label: "Certified",
                                value: metrics.verifiedProducts,
                                variant: "success"
                            }, "certified-products", false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 388,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$metricsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetricsCard"], {
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    className: "h-6 w-6",
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 397,
                                    columnNumber: 21
                                }, void 0),
                                label: "In Transit",
                                value: metrics.pendingVerification,
                                variant: "warning"
                            }, "in-transit", false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 395,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$metricsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetricsCard"], {
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                    className: "h-6 w-6",
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 404,
                                    columnNumber: 21
                                }, void 0),
                                label: "Total Verifications",
                                value: metrics.totalVerifications,
                                variant: "monthly-revenue"
                            }, "total-verifications", false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 402,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 380,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].whiteBg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].roundedLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].shadowLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].borderGray200}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-6",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-lg font-semibold text-gray-900",
                                                            children: "Recent Products"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 419,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: ()=>router.push('/products'),
                                                            className: "!bg-gradient-to-r !from-gray-600 !to-gray-500 hover:!from-gray-700 hover:!to-gray-600 !text-white shadow-lg",
                                                            size: "sm",
                                                            children: "View All"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 420,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 418,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 417,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        ...Array(3)
                                                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "animate-pulse",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-20 ${commonColors.gray200} rounded-lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 434,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, i, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 433,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 23
                                                }, this) : displayProducts.length > 0 ? displayProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4 ${commonColors.gray50} ${commonColors.hoverGray100} rounded-lg cursor-pointer transition-colors",
                                                        onClick: ()=>handleProductClick(product.id),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-4 flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "bg-white p-3 rounded-lg shadow-sm flex-shrink-0",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                                            className: `h-6 w-6 ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["textColors"].muted}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/viewer/page.tsx",
                                                                            lineNumber: 447,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 446,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1 min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex flex-col sm:flex-row sm:items-center gap-2 mb-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                        className: `font-semibold ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["textColors"].primary} truncate`,
                                                                                        children: product.name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                                        lineNumber: 451,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: `px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${product.status === 'verified' ? 'bg-card-green-light text-card-green' : product.status === 'pending' ? 'bg-card-orange-light text-card-orange' : 'bg-card-neutral-light text-card-neutral'}`,
                                                                                        children: product.status.charAt(0).toUpperCase() + product.status.slice(1)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                                        lineNumber: 452,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                                lineNumber: 450,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs ${commonColors.gray500}",
                                                                                children: product.category
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                                lineNumber: 460,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 449,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 445,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-right sm:text-left",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `text-sm font-semibold ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["textColors"].primary}`,
                                                                        children: [
                                                                            product.verificationCount || 0,
                                                                            " verifications"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 464,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    product.lastVerified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs ${commonColors.gray500}",
                                                                        children: new Date(product.lastVerified).toLocaleDateString()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 466,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 463,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, product.id, true, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 440,
                                                        columnNumber: 25
                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center py-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                            className: `h-12 w-12 ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["textColors"].muted} mx-auto mb-3`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 475,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["textColors"].muted}`,
                                                            children: "No products available"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/viewer/page.tsx",
                                                            lineNumber: 476,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/viewer/page.tsx",
                                                    lineNumber: 474,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 429,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 416,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 415,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 414,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryOverview, {}, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 486,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 485,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 412,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$qr$2f$QRScanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QRScanner"], {
                                onScanSuccess: (data)=>{
                                    console.log('QR Scanned:', data);
                                    router.push(`/public-access/trace/${data}`);
                                },
                                onScanError: (error)=>{
                                    console.error('QR Scan Error:', error);
                                },
                                mockMode: true
                            }, void 0, false, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 492,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].whiteBg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].roundedLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].shadowLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].borderGray200} p-6`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-center ${commonColors.gray900} mb-4",
                                        children: "Quick Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 504,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: ()=>router.push('/public-access'),
                                                className: "w-full !bg-gradient-to-r !from-gray-600 !to-gray-500 hover:!from-gray-700 hover:!to-gray-600 !text-white shadow-lg rounded-full",
                                                children: "Public Access"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 506,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: ()=>window.open('/qr-demo', '_blank'),
                                                className: "w-full !bg-gradient-to-r !from-gray-600 !to-gray-500 hover:!from-gray-700 hover:!to-gray-600 !text-white shadow-lg rounded-full",
                                                children: "QR Page"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 512,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 505,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 p-4 bg-blue-50 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-medium text-blue-900 mb-2",
                                                children: "Public Access Benefits:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 521,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "text-sm text-blue-800 space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• No login required"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 523,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• Complete product transparency"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 524,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• Mobile QR scanning"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 525,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "• Share and print features"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 526,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 522,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 520,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/viewer/page.tsx",
                                lineNumber: 503,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 491,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].whiteBg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].roundedLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].shadowLg} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commonColors"].borderGray200}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-semibold text-center text-gray-900",
                                                children: "Real-time Activity"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 537,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 justify-center sm:justify-start",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                size: "sm",
                                                                onClick: ()=>{
                                                                    if (isRealtimeConnected) {
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$realtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["realtime"].disableMockActivity();
                                                                    } else {
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$realtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["realtime"].enableMockActivity();
                                                                    }
                                                                },
                                                                children: isRealtimeConnected ? 'Pause' : 'Resume'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 540,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                size: "sm",
                                                                onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$realtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["realtime"].generateTestEvent('product_update'),
                                                                children: "Test Event"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 553,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 539,
                                                        columnNumber: 21
                                                    }, this),
                                                    isRealtimeConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1 px-3 py-1 bg-card-green-light text-card-green rounded-full text-sm font-medium justify-center sm:justify-end",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                                                                className: "h-3 w-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 563,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Connected"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 562,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1 px-3 py-1 bg-card-neutral-light text-card-neutral rounded-full text-sm font-medium justify-center sm:justify-end",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                                                                className: "h-3 w-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 568,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Disconnected"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 567,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 538,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 536,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 535,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: recentEvents.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: recentEvents.map((event, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 gap-3 ${commonColors.gray50} rounded-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-2 h-2 bg-card-green rounded-full animate-pulse flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 585,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "min-w-0 flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: `font-medium text-sm ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["textColors"].primary} capitalize truncate`,
                                                                        children: event.type.replace('_', ' ')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 587,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs ${commonColors.gray500}",
                                                                        children: new Date(event.timestamp).toLocaleTimeString()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/viewer/page.tsx",
                                                                        lineNumber: 590,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 586,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 584,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right sm:text-left min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm ${commonColors.gray900} truncate",
                                                                children: event.data?.productId || event.data?.productName || `Block ${event.data?.blockNumber}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 596,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs ${commonColors.gray500} capitalize truncate",
                                                                children: event.data?.status || event.data?.verificationCount ? `${event.data.verificationCount} verifications` : event.data?.quality ? `Quality: ${event.data.quality}` : event.data?.location ? `${event.data.location}` : event.data?.transactionCount ? `${event.data.transactionCount} transactions` : 'Updated'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/viewer/page.tsx",
                                                                lineNumber: 599,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/viewer/page.tsx",
                                                        lineNumber: 595,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, `${event.id}-${index}`, true, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 580,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 578,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-8 ${commonColors.gray500}",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                                                className: "h-8 w-8 mx-auto mb-2 opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 614,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm",
                                                children: isRealtimeConnected ? 'Waiting for events...' : 'Click "Resume" to start mock activity'
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 615,
                                                columnNumber: 21
                                            }, this),
                                            !isRealtimeConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs mt-2",
                                                children: "Mock events will appear every 3-7 seconds when active"
                                            }, void 0, false, {
                                                fileName: "[project]/app/viewer/page.tsx",
                                                lineNumber: 619,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/viewer/page.tsx",
                                        lineNumber: 613,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/viewer/page.tsx",
                                    lineNumber: 576,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/viewer/page.tsx",
                            lineNumber: 534,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/viewer/page.tsx",
                        lineNumber: 533,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/viewer/page.tsx",
                lineNumber: 362,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/viewer/page.tsx",
            lineNumber: 359,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/viewer/page.tsx",
        lineNumber: 358,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_3e33a656._.js.map