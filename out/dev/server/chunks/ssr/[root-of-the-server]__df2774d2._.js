module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/contexts/authContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
// src/contexts/authContext.tsx
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const login = async (email, password)=>{
        setLoading(true);
        try {
            // Mock login logic
            if (email && password) {
                setUser({
                    email,
                    name: 'User'
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        } finally{
            setLoading(false);
        }
    };
    const logout = ()=>{
        setUser(null);
    };
    const value = {
        user,
        login,
        logout,
        loading
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/authContext.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
"[project]/types/user.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ROLE_PERMISSIONS",
    ()=>ROLE_PERMISSIONS,
    "USER_ROLES",
    ()=>USER_ROLES
]);
// src/types/user.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-ssr] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.js [app-ssr] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-ssr] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
;
const USER_ROLES = [
    'farmer',
    'inspector',
    'logistics',
    'packaging',
    'retailer',
    'viewer',
    'government',
    'admin'
];
const ROLE_PERMISSIONS = {
    admin: {
        canCreate: true,
        canVerify: true,
        canView: true,
        allowedEvents: [
            '*'
        ],
        displayName: 'Administrator',
        icon: '👑',
        color: 'role-admin',
        IconComponent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
    },
    government: {
        canCreate: false,
        canVerify: true,
        canView: true,
        allowedEvents: [
            'compliance-check',
            'audit',
            'inspection'
        ],
        displayName: 'Government',
        icon: '🏛️',
        color: 'role-government',
        IconComponent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"]
    },
    farmer: {
        canCreate: true,
        canVerify: false,
        canView: true,
        allowedEvents: [
            'planting',
            'growth',
            'harvest'
        ],
        displayName: 'Farmer',
        icon: '👨\u200d🌾',
        color: 'role-farmer',
        IconComponent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"]
    },
    inspector: {
        canCreate: false,
        canVerify: true,
        canView: true,
        allowedEvents: [
            'quality-inspection',
            'compliance-check'
        ],
        displayName: 'Inspector',
        icon: '🔍',
        color: 'role-inspector',
        IconComponent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"]
    },
    logistics: {
        canCreate: false,
        canVerify: false,
        canView: true,
        allowedEvents: [
            'collection',
            'transport',
            'delivery'
        ],
        displayName: 'Logistics',
        icon: '🚚',
        color: 'role-logistics',
        IconComponent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"]
    },
    packaging: {
        canCreate: true,
        canVerify: false,
        canView: true,
        allowedEvents: [
            'packaging',
            'labeling',
            'qr-generation'
        ],
        displayName: 'Packaging',
        icon: '📦',
        color: 'role-packaging',
        IconComponent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
    },
    retailer: {
        canCreate: false,
        canVerify: true,
        canView: true,
        allowedEvents: [
            'retail-verification',
            'sale'
        ],
        displayName: 'Retailer',
        icon: '🛒',
        color: 'role-retailer',
        IconComponent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"]
    },
    viewer: {
        canCreate: false,
        canVerify: false,
        canView: true,
        allowedEvents: [],
        displayName: 'Viewer',
        icon: '👁️',
        color: 'role-viewer',
        IconComponent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"]
    }
};
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/auth.ts
__turbopack_context__.s([
    "authService",
    ()=>authService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/user.ts [app-ssr] (ecmascript)");
;
// Mock user database for demo
const MOCK_USERS = [
    {
        id: '1',
        name: 'John Farmer',
        email: 'john@farm.com',
        password: 'password123',
        role: 'farmer',
        address: 'Stellenbosch, Western Cape'
    },
    {
        id: '2',
        name: 'Jane Inspector',
        email: 'jane@inspect.gov',
        password: 'password123',
        role: 'inspector',
        address: 'Cape Town, Western Cape'
    },
    {
        id: '3',
        name: 'Bob Retailer',
        email: 'bob@retail.com',
        password: 'password123',
        role: 'retailer',
        address: 'Johannesburg, Gauteng'
    },
    {
        id: '4',
        name: 'Admin User',
        email: 'admin@system.com',
        password: 'admin123',
        role: 'admin',
        address: 'Pretoria, Gauteng'
    },
    {
        id: '5',
        name: 'Charlie Packaging',
        email: 'charlie@packaging.com',
        password: 'password123',
        role: 'packaging',
        address: 'Durban, KwaZulu-Natal'
    }
];
class AuthService {
    users;
    constructor(){
        // Initialize with mock users
        this.users = [
            ...MOCK_USERS
        ];
        // Load any additional users from localStorage (only on client side)
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Simulate API delay
    delay(ms = 1000) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
    // Generate JWT-like token (in production, use proper JWT)
    generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };
        return btoa(JSON.stringify(payload));
    }
    // Verify token
    verifyToken(token) {
        try {
            const payload = JSON.parse(atob(token));
            if (payload.exp < Date.now()) {
                return null; // Token expired
            }
            const user = this.users.find((u)=>u.id === payload.id);
            if (!user) return null;
            // Return user without password
            const { password, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                permissions: {
                    canCreate: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][user.role].canCreate,
                    canVerify: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][user.role].canVerify,
                    canView: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][user.role].canView
                }
            };
        } catch (error) {
            return null;
        }
    }
    // Login method
    async login(credentials) {
        await this.delay(); // Simulate network delay
        const user = this.users.find((u)=>u.email === credentials.email);
        if (!user) {
            return {
                success: false,
                error: 'Invalid email or password'
            };
        }
        if (user.password !== credentials.password) {
            return {
                success: false,
                error: 'Invalid email or password'
            };
        }
        // Remove password from user object
        const { password, ...userWithoutPassword } = user;
        const userWithPermissions = {
            ...userWithoutPassword,
            permissions: {
                canCreate: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][user.role].canCreate,
                canVerify: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][user.role].canVerify,
                canView: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][user.role].canView
            }
        };
        const token = this.generateToken(userWithPermissions);
        // Store session
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return {
            success: true,
            user: userWithPermissions,
            token
        };
    }
    // Register method
    async register(data) {
        await this.delay(); // Simulate network delay
        // Check if user already exists
        const existingUser = this.users.find((u)=>u.email === data.email);
        if (existingUser) {
            return {
                success: false,
                error: 'User with this email already exists'
            };
        }
        // Validate password strength
        if (data.password.length < 6) {
            return {
                success: false,
                error: 'Password must be at least 6 characters long'
            };
        }
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            address: data.address || ''
        };
        // Add to users array
        this.users.push(newUser);
        // Save to localStorage for persistence
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Remove password and create user with permissions
        const { password, ...userWithoutPassword } = newUser;
        const userWithPermissions = {
            ...userWithoutPassword,
            permissions: {
                canCreate: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][newUser.role].canCreate,
                canVerify: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][newUser.role].canVerify,
                canView: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][newUser.role].canView
            }
        };
        const token = this.generateToken(userWithPermissions);
        // Store session
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return {
            success: true,
            user: userWithPermissions,
            token
        };
    }
    // Logout method
    async logout() {
        await this.delay(500); // Simulate network delay
        // Clear session
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    // Get current user from token
    getCurrentUser() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
        const token = undefined;
    }
    // Check if user is authenticated
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
    // Refresh token
    async refreshToken() {
        if ("TURBOPACK compile-time truthy", 1) {
            return {
                success: false,
                error: 'Not available on server'
            };
        }
        //TURBOPACK unreachable
        ;
        const token = undefined;
        const user = undefined;
        const newToken = undefined;
    }
    // Update user profile
    async updateProfile(updates) {
        await this.delay();
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                error: 'Not authenticated'
            };
        }
        // Update user in array
        const userIndex = this.users.findIndex((u)=>u.id === currentUser.id);
        if (userIndex === -1) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updates
        };
        // Update stored user
        const updatedUser = {
            ...currentUser,
            ...updates
        };
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return {
            success: true,
            user: updatedUser
        };
    }
    // Change password
    async changePassword(oldPassword, newPassword) {
        await this.delay();
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                error: 'Not authenticated'
            };
        }
        // Find user with password
        const userIndex = this.users.findIndex((u)=>u.id === currentUser.id);
        if (userIndex === -1) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        const user = this.users[userIndex];
        if (user.password !== oldPassword) {
            return {
                success: false,
                error: 'Current password is incorrect'
            };
        }
        // Validate new password
        if (newPassword.length < 6) {
            return {
                success: false,
                error: 'New password must be at least 6 characters long'
            };
        }
        // Update password
        this.users[userIndex] = {
            ...user,
            password: newPassword
        };
        return {
            success: true,
            user: currentUser
        };
    }
}
const authService = new AuthService();
}),
"[project]/constants/users.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/constants/users.ts
__turbopack_context__.s([
    "DEMO_USERS",
    ()=>DEMO_USERS
]);
const DEMO_USERS = [
    {
        id: 'user_1',
        name: 'John Farmer',
        email: 'john@farm.com',
        role: 'farmer',
        permissions: {
            canCreate: true,
            canVerify: false
        }
    },
    {
        id: 'user_2',
        name: 'Jane Inspector',
        email: 'jane@inspect.com',
        role: 'inspector',
        permissions: {
            canCreate: false,
            canVerify: true
        }
    },
    {
        id: 'user_3',
        name: 'Bob Retailer',
        email: 'bob@retail.com',
        role: 'retailer',
        permissions: {
            canCreate: false,
            canVerify: true
        }
    },
    {
        id: 'user_4',
        name: 'Alice Logistics',
        email: 'alice@logistics.com',
        role: 'logistics',
        permissions: {
            canCreate: false,
            canVerify: false
        }
    },
    {
        id: 'user_5',
        name: 'Charlie Packaging',
        email: 'charlie@packaging.com',
        role: 'packaging',
        permissions: {
            canCreate: true,
            canVerify: false
        }
    },
    {
        id: 'user_6',
        name: 'Dana Viewer',
        email: 'dana@viewer.com',
        role: 'viewer',
        permissions: {
            canCreate: false,
            canVerify: false
        }
    },
    {
        id: 'user_7',
        name: 'Eve Government',
        email: 'eve@gov.com',
        role: 'government',
        permissions: {
            canCreate: false,
            canVerify: true
        }
    }
];
}),
"[project]/contexts/userContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserContext",
    ()=>UserContext,
    "UserProvider",
    ()=>UserProvider,
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// src/contexts/userContext.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/user.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/users.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const UserContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function UserProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const currentUser = user; // Alias for compatibility
    const switchUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((userId)=>{
        // Find user in mock data
        const mockUser = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_USERS"].find((u)=>u.id === userId);
        if (mockUser) {
            setUser(mockUser);
        }
    }, []);
    const setUserWithPersistence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newUser)=>{
        setUser(newUser);
    // In-memory state for demo purposes (no localStorage for security)
    }, []);
    const updateUserRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((role)=>{
        setUser((prevUser)=>{
            if (!prevUser) return null;
            return {
                ...prevUser,
                role,
                permissions: {
                    canCreate: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][role].canCreate,
                    canVerify: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][role].canVerify,
                    canView: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][role].canView
                }
            };
        });
    }, []);
    // Initialize user from auth service on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].getCurrentUser();
        if (currentUser) {
            // Ensure user has required permissions structure
            const userWithPermissions = {
                ...currentUser,
                permissions: {
                    canCreate: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][currentUser.role].canCreate,
                    canVerify: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][currentUser.role].canVerify,
                    canView: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$user$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROLE_PERMISSIONS"][currentUser.role].canView
                }
            };
            setUser(userWithPermissions);
        } else {
            // For demo purposes, set default viewer user if no user is logged in (public access)
            const viewerUser = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_USERS"].find((u)=>u.role === 'viewer');
            if (viewerUser) {
                setUser(viewerUser);
            }
        }
        setLoading(false);
    }, []);
    const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            user,
            currentUser,
            setUser,
            updateUserRole,
            switchUser,
            loading
        }), [
        user,
        loading,
        updateUserRole,
        switchUser
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UserContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/userContext.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
function useUser() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
}),
"[project]/types/product.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/types/product.ts
// 1. Product Categories
__turbopack_context__.s([
    "ProductCategory",
    ()=>ProductCategory,
    "isProductCategory",
    ()=>isProductCategory,
    "isProductStatus",
    ()=>isProductStatus
]);
var ProductCategory = /*#__PURE__*/ function(ProductCategory) {
    ProductCategory["FRUITS"] = "Fruit";
    ProductCategory["VEGETABLES"] = "Veg";
    ProductCategory["BEEF"] = "Beef";
    ProductCategory["POULTRY"] = "Poultry";
    ProductCategory["PORK"] = "Pork";
    ProductCategory["LAMB"] = "Lamb";
    ProductCategory["GOAT"] = "Goat";
    ProductCategory["FISH"] = "Fish";
    return ProductCategory;
}({});
function isProductStatus(status) {
    return [
        'pending',
        'verified',
        'rejected'
    ].includes(status);
}
function isProductCategory(category) {
    return Object.values(ProductCategory).includes(category);
}
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "generateAddress",
    ()=>generateAddress,
    "generateBlockHash",
    ()=>generateBlockHash,
    "generateBlockId",
    ()=>generateBlockId
]);
// src/lib/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function generateBlockHash() {
    return '0x' + Math.random().toString(16).substr(2, 40);
}
function generateAddress() {
    return '0x' + Math.random().toString(16).substr(2, 40);
}
function generateBlockId(currentLength) {
    return `BLK${String(currentLength + 1).padStart(3, '0')}`;
}
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}
function formatDateTime(date) {
    return new Date(date).toLocaleString();
}
}),
"[project]/lib/blockchain.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/blockchain.ts
__turbopack_context__.s([
    "createBlockchainRecord",
    ()=>createBlockchainRecord,
    "incrementVerification",
    ()=>incrementVerification,
    "mockBlockchain",
    ()=>mockBlockchain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
function createBlockchainRecord(product, currentRecordsLength, farmerName = 'Current Farm') {
    return {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateBlockId"])(currentRecordsLength),
        productName: product.name,
        category: product.category,
        location: product.location,
        description: product.description || '',
        harvestDate: product.harvestDate,
        batchSize: product.batchSize,
        certifications: product.certifications || [],
        farmer: farmerName,
        farmerAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateAddress"])(),
        blockHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateBlockHash"])(),
        txHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateBlockHash"])(),
        verified: true,
        timestamp: Date.now(),
        status: 'Certified',
        transactionFee: Math.random() * 0.005 + 0.001,
        verifications: 1
    };
}
function incrementVerification(record) {
    return {
        ...record,
        verifications: (record.verifications || 0) + 1
    };
}
const mockBlockchain = {
    async sendTransaction (method, params) {
        console.log('Mock blockchain transaction:', {
            method,
            params
        });
        await new Promise((resolve)=>setTimeout(resolve, 1000)); // Simulate block time
        // Simulate random failures (10% chance)
        if (Math.random() < 0.1) {
            throw new Error('Blockchain transaction failed (simulated)');
        }
        return {
            hash: `0x${Math.random().toString(16).substr(2, 64)}`,
            blockNumber: Math.floor(Math.random() * 10000)
        };
    }
};
}),
"[project]/lib/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORY_COLORS",
    ()=>CATEGORY_COLORS,
    "INITIAL_METRICS",
    ()=>INITIAL_METRICS,
    "eventTypeValues",
    ()=>eventTypeValues,
    "eventTypes",
    ()=>eventTypes
]);
// src/lib/constants.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/product.ts [app-ssr] (ecmascript)");
;
const INITIAL_METRICS = {
    totalProducts: 0,
    totalVerifications: 0,
    successfulVerifications: 0,
    lastVerification: undefined,
    totalInspections: 0,
    totalTransactions: 0,
    monthlyRevenue: 0,
    activeFarms: 0,
    connectedRetailers: 0,
    averageFee: 0.002,
    productsByCategory: {},
    inspectionsByCategory: {},
    systemUptime: Date.now(),
    lastActivity: new Date().toISOString()
};
const CATEGORY_COLORS = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].FRUITS]: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: '🍎'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].VEGETABLES]: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        icon: '🥬'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].BEEF]: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: '🥩'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].POULTRY]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: '🐔'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].PORK]: {
        bg: 'bg-pink-100',
        text: 'text-pink-800',
        icon: '🥓'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].LAMB]: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: '🐑'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].GOAT]: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        icon: '🐐'
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].FISH]: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: '🐟'
    }
};
const eventTypes = [
    {
        value: 'planting',
        label: 'Planting'
    },
    {
        value: 'growth',
        label: 'Growth Monitoring'
    },
    {
        value: 'harvest',
        label: 'Harvest'
    },
    {
        value: 'quality-inspection',
        label: 'Quality Inspection'
    },
    {
        value: 'packaging',
        label: 'Packaging'
    },
    {
        value: 'transport',
        label: 'Transport'
    },
    {
        value: 'delivery',
        label: 'Delivery'
    },
    {
        value: 'verification',
        label: 'Verification'
    }
];
const eventTypeValues = eventTypes.map((type)=>type.value);
}),
"[project]/contexts/productContext.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductProvider",
    ()=>ProductProvider,
    "useProducts",
    ()=>useProducts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/product.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blockchain$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/blockchain.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
// src/contexts/ProductContext.tsx
'use client';
;
;
;
;
;
;
const ProductContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const INITIAL_RECORDS = [
    {
        id: 'BLK001',
        productName: 'Organic Apples',
        description: 'Fresh organic apples from Green Valley Farm',
        category: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].FRUITS,
        farmer: 'Green Valley Farm',
        farmerAddress: '0x742d35Cc6634C0532925a3b8D1750B87B02B6C71',
        location: 'Stellenbosch, Western Cape',
        harvestDate: '2025-09-10',
        certifications: [
            'Organic',
            'Fair Trade'
        ],
        batchSize: '500kg',
        blockHash: '0x4f3c2a1b8e7d6c5a9b8e7f6d5c4a3b2c1d0e9f8a',
        timestamp: new Date('2025-09-10T08:30:00Z').getTime(),
        status: 'Certified',
        txHash: '0x4f3c2a1b8e7d6c5a9b8e7f6d5c4a3b2c1d0e9f8a',
        verified: true,
        transactionFee: 0.002,
        verifications: 3
    },
    {
        id: 'BLK002',
        productName: 'Free-Range Eggs',
        description: 'Fresh free-range eggs from happy chickens',
        category: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].POULTRY,
        farmer: 'Sunrise Poultry',
        farmerAddress: '0x8b3e4d2a1c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d',
        location: 'Robertson, Western Cape',
        harvestDate: '2025-09-11',
        certifications: [
            'Free-Range',
            'Animal Welfare Approved'
        ],
        batchSize: '1200 eggs',
        blockHash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
        timestamp: new Date('2025-09-11T06:15:00Z').getTime(),
        status: 'In Transit',
        txHash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
        verified: true,
        transactionFee: 0.0015,
        verifications: 1
    },
    {
        id: 'BLK003',
        productName: 'Grass-Fed Beef',
        description: 'Fresh beef from happy beef',
        category: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].BEEF,
        farmer: 'Karoo Cattle Co.',
        farmerAddress: '0x9c4f5e6d7a8b9c0e1f2a3b4c5d6e7f8a9b0c1d2e',
        location: 'Graaff-Reinet, Eastern Cape',
        harvestDate: '2025-09-12',
        certifications: [
            'Organic',
            'Animal Welfare Approved',
            'Sustainable'
        ],
        batchSize: '250kg',
        blockHash: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e',
        timestamp: new Date('2025-09-12T10:20:00Z').getTime(),
        status: 'Certified',
        txHash: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e',
        verified: true,
        transactionFee: 0.0025,
        verifications: 5
    },
    {
        id: 'BLK004',
        productName: 'Fresh Spinach',
        description: 'Fresh spinach from Green Valley Farm',
        category: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].VEGETABLES,
        farmer: 'Leafy Greens Farm',
        farmerAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        location: 'Paarl, Western Cape',
        harvestDate: '2025-09-13',
        certifications: [
            'Organic',
            'Local'
        ],
        batchSize: '150kg',
        blockHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
        timestamp: new Date('2025-09-13T07:30:00Z').getTime(),
        status: 'Certified',
        txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
        verified: true,
        transactionFee: 0.0012,
        verifications: 2
    }
];
function ProductProvider({ children }) {
    const [blockchainRecords, setBlockchainRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(INITIAL_RECORDS);
    const [businessMetrics, setBusinessMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INITIAL_METRICS"]);
    const [selectedProduct, setSelectedProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('All');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const products = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return blockchainRecords.map((record)=>({
                id: record.id,
                name: record.productName || 'Unknown Product',
                description: `${record.category} product from ${record.location || 'Unknown Location'}`,
                category: record.category || __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].FRUITS,
                location: record.location || 'Unknown Location',
                harvestDate: record.timestamp ? new Date(record.timestamp).toISOString() : new Date().toISOString(),
                batchSize: 'Standard',
                photos: [],
                certifications: record.verified ? [
                    'Verified'
                ] : [],
                status: record.verified ? 'verified' : 'pending',
                verifications: record.verifications || 0,
                createdAt: record.timestamp ? new Date(record.timestamp).toISOString() : new Date().toISOString(),
                lastVerified: record.timestamp ? new Date(record.timestamp).toISOString() : null,
                farmerName: record.farmer || 'Unknown Farmer'
            }));
    }, [
        blockchainRecords
    ]);
    // Filter records based on category and search
    const filteredRecords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        let filtered = blockchainRecords;
        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter((record)=>record.category === selectedCategory);
        }
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((record)=>record.productName?.toLowerCase().includes(query) || record.farmer?.toLowerCase().includes(query) || record.location?.toLowerCase().includes(query) || record.category?.toLowerCase().includes(query));
        }
        return filtered;
    }, [
        blockchainRecords,
        selectedCategory,
        searchQuery
    ]);
    // Calculate category statistics
    const categoryStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const stats = {};
        // Initialize all categories with 0
        const allCategories = [
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].FRUITS,
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].VEGETABLES,
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].BEEF,
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].POULTRY,
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].PORK,
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].LAMB,
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].GOAT,
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$product$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCategory"].FISH
        ];
        allCategories.forEach((cat)=>{
            stats[cat] = 0;
        });
        // Count records per category
        blockchainRecords.forEach((record)=>{
            if (record.category && record.category in stats) {
                stats[record.category]++;
            }
        });
        return stats;
    }, [
        blockchainRecords
    ]);
    const verifyProduct = async (productId)=>{
        try {
            // In a real app, you would call your blockchain function here:
            // const result = await incrementVerification(productId);
            // For now, we'll simulate a successful verification
            const verificationResult = {
                success: true
            };
            if (verificationResult.success) {
                // Update blockchain records with new verification
                setBlockchainRecords((prevRecords)=>prevRecords.map((record)=>{
                        if (record.id === productId) {
                            return {
                                ...record,
                                verifications: (record.verifications || 0) + 1,
                                lastVerified: new Date().toISOString(),
                                verifiedBy: 'retailer'
                            };
                        }
                        return record;
                    }));
                // Update business metrics
                setBusinessMetrics((prev)=>({
                        ...prev,
                        totalVerifications: (prev.totalVerifications || 0) + 1,
                        lastVerification: new Date().toISOString()
                    }));
                // Show success message
                // In a real app, you might want to use a toast notification here
                console.log(`Successfully verified product ${productId}`);
            } else {
                console.error('Failed to verify product on the blockchain');
            }
        } catch (error) {
            console.error('Error verifying product:', error);
        }
    };
    const addProduct = (product, farmerName)=>{
        const newRecord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blockchain$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBlockchainRecord"])(product, blockchainRecords.length, farmerName);
        setBlockchainRecords((prev)=>[
                ...prev,
                newRecord
            ]);
        setBusinessMetrics((prev)=>({
                ...prev,
                totalTransactions: prev.totalTransactions + 1,
                monthlyRevenue: prev.monthlyRevenue + prev.averageFee
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductContext.Provider, {
        value: {
            blockchainRecords,
            businessMetrics,
            selectedProduct,
            selectedCategory,
            searchQuery,
            products,
            addProduct,
            verifyProduct,
            setSelectedProduct,
            setSelectedCategory,
            setSearchQuery,
            filteredRecords,
            categoryStats
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/productContext.tsx",
        lineNumber: 238,
        columnNumber: 5
    }, this);
}
function useProducts() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
}),
"[project]/components/errorBoundary.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorBoundary",
    ()=>ErrorBoundary,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
// src/components/errorBoundary.tsx
'use client';
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    state = {
        hasError: false
    };
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
    }
    componentDidCatch(error, errorInfo) {
        // Enhanced error logging
        const errorData = {
            errorId: this.state.errorId,
            timestamp: new Date().toISOString(),
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            componentStack: errorInfo.componentStack,
            context: {
                url: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'N/A',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
            }
        };
        // Log to console in development
        if ("TURBOPACK compile-time truthy", 1) {
            console.error('Uncaught error:', errorData);
        }
        // Log error reporting service (in production, send to monitoring service)
        this.logError(errorData);
        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    logError = (errorData)=>{
        try {
            // Store error in localStorage for debugging (only on client)
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        } catch (loggingError) {
            console.error('Failed to log error:', loggingError);
        }
    };
    handleRetry = ()=>{
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined
        });
    };
    handleReload = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    };
    copyErrorDetails = ()=>{
        if (this.state.error && this.state.errorInfo) {
            const errorDetails = `
Error ID: ${this.state.errorId}
Timestamp: ${new Date().toISOString()}
Error: ${this.state.error.name}
Message: ${this.state.error.message}
Stack: ${this.state.error.stack}
Component Stack: ${this.state.errorInfo.componentStack}
URL: ${("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'N/A'}
      `.trim();
            navigator.clipboard.writeText(errorDetails).then(()=>{
                console.log('Error details copied to clipboard');
            }).catch((error)=>{
                console.error('Failed to copy error details:', error);
            });
        }
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center min-h-screen bg-gray-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-8 h-8 text-red-600",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        }, void 0, false, {
                                            fileName: "[project]/components/errorBoundary.tsx",
                                            lineNumber: 135,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/errorBoundary.tsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/errorBoundary.tsx",
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-gray-900 mb-2",
                                    children: "Something went wrong"
                                }, void 0, false, {
                                    fileName: "[project]/components/errorBoundary.tsx",
                                    lineNumber: 143,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 mb-6",
                                    children: "We apologize for the inconvenience. An unexpected error has occurred."
                                }, void 0, false, {
                                    fileName: "[project]/components/errorBoundary.tsx",
                                    lineNumber: 146,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/errorBoundary.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, this),
                        ("TURBOPACK compile-time value", "development") === 'development' && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "mb-6 text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    className: "cursor-pointer text-sm font-medium text-gray-700 mb-2",
                                    children: "Error Details (Development Only)"
                                }, void 0, false, {
                                    fileName: "[project]/components/errorBoundary.tsx",
                                    lineNumber: 154,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Error ID:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/errorBoundary.tsx",
                                                    lineNumber: 159,
                                                    columnNumber: 21
                                                }, this),
                                                " ",
                                                this.state.errorId
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/errorBoundary.tsx",
                                            lineNumber: 158,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Error:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/errorBoundary.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 21
                                                }, this),
                                                " ",
                                                this.state.error.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/errorBoundary.tsx",
                                            lineNumber: 161,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Message:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/errorBoundary.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 21
                                                }, this),
                                                " ",
                                                this.state.error.message
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/errorBoundary.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Stack:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/errorBoundary.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                    className: "whitespace-pre-wrap",
                                                    children: this.state.error.stack
                                                }, void 0, false, {
                                                    fileName: "[project]/components/errorBoundary.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/errorBoundary.tsx",
                                            lineNumber: 167,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/errorBoundary.tsx",
                                    lineNumber: 157,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/errorBoundary.tsx",
                            lineNumber: 153,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleRetry,
                                    className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
                                    children: "Try Again"
                                }, void 0, false, {
                                    fileName: "[project]/components/errorBoundary.tsx",
                                    lineNumber: 177,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex space-x-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: this.handleReload,
                                            className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors",
                                            children: "Reload Page"
                                        }, void 0, false, {
                                            fileName: "[project]/components/errorBoundary.tsx",
                                            lineNumber: 185,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: this.copyErrorDetails,
                                            className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors",
                                            children: "Copy Error"
                                        }, void 0, false, {
                                            fileName: "[project]/components/errorBoundary.tsx",
                                            lineNumber: 192,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/errorBoundary.tsx",
                                    lineNumber: 184,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/errorBoundary.tsx",
                            lineNumber: 176,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 pt-6 border-t border-gray-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500",
                                children: [
                                    "If this problem persists, please contact support with Error ID:",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono bg-gray-100 px-2 py-1 rounded",
                                        children: this.state.errorId
                                    }, void 0, false, {
                                        fileName: "[project]/components/errorBoundary.tsx",
                                        lineNumber: 205,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/errorBoundary.tsx",
                                lineNumber: 203,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/errorBoundary.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/errorBoundary.tsx",
                    lineNumber: 126,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/errorBoundary.tsx",
                lineNumber: 125,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
;
const __TURBOPACK__default__export__ = ErrorBoundary;
}),
"[project]/contexts/eventLogsContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventLogsProvider",
    ()=>EventLogsProvider,
    "useEventLogs",
    ()=>useEventLogs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
// src/contexts/eventLogsContext.tsx
'use client';
;
;
const EventLogsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function EventLogsProvider({ children }) {
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const addLog = (log)=>{
        const newLog = {
            ...log,
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString()
        };
        setLogs((prev)=>[
                ...prev,
                newLog
            ]);
    };
    const clearLogs = ()=>{
        setLogs([]);
    };
    const value = {
        logs,
        addLog,
        clearLogs
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EventLogsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/eventLogsContext.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
function useEventLogs() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(EventLogsContext);
    if (context === undefined) {
        throw new Error('useEventLogs must be used within an EventLogsProvider');
    }
    return context;
}
}),
"[project]/contexts/search-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchProvider",
    ()=>SearchProvider,
    "useSearch",
    ()=>useSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
// src/contexts/search-context.tsx
'use client';
;
;
const SearchContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function SearchProvider({ children }) {
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const value = {
        query,
        setQuery,
        results,
        isSearching
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/search-context.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
function useSearch() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}
}),
"[project]/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.module.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$authContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/authContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$userContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/userContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$productContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/contexts/productContext.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$errorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/errorBoundary.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$eventLogsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/eventLogsContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$search$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/search-context.tsx [app-ssr] (ecmascript)");
// src/app/providers.tsx
'use client';
;
;
;
;
;
;
;
;
function ThemeProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "light",
        enableSystem: true,
        disableTransitionOnChange: true,
        storageKey: "maroon-theme",
        children: children
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$errorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeProvider, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$authContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$userContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$productContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ProductProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$eventLogsContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EventLogsProvider"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$search$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SearchProvider"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                    className: "container mx-auto px-4 pt-20 pb-8",
                                    children: children
                                }, void 0, false, {
                                    fileName: "[project]/app/providers.tsx",
                                    lineNumber: 35,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/providers.tsx",
                                lineNumber: 34,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/providers.tsx",
                            lineNumber: 33,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/providers.tsx",
                        lineNumber: 32,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/providers.tsx",
                    lineNumber: 31,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/providers.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/providers.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/clientLayout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function ClientLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Providers"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/clientLayout.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/service-worker-registration.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServiceWorkerRegistration",
    ()=>ServiceWorkerRegistration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
// src/components/service-worker-registration.tsx
'use client';
;
function ServiceWorkerRegistration() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Only register service worker in production
        if (("TURBOPACK compile-time value", "undefined") !== 'undefined' && 'serviceWorker' in navigator && ("TURBOPACK compile-time value", "development") === 'production') //TURBOPACK unreachable
        ;
    }, []);
    return null;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__df2774d2._.js.map