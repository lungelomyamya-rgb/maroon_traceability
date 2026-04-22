# Adapter Pattern Migration Guide

## Overview

This guide helps you migrate from direct service usage to the adapter pattern implementation. The adapter pattern provides a unified interface for accessing different service implementations (mock vs real) without changing the UI components.

## Table of Contents

- [Why Migrate?](#why-migrate)
- [Migration Strategy](#migration-strategy)
- [Step-by-Step Migration](#step-by-step-migration)
- [Common Migration Patterns](#common-migration-patterns)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Why Migrate?

### Benefits of Adapter Pattern

1. **Unified Interface**: Consistent API across all services
2. **Environment Flexibility**: Easy switching between mock and real implementations
3. **Better Testing**: Comprehensive testing framework built-in
4. **Monitoring**: Health, performance, and error tracking
5. **Type Safety**: Full TypeScript support
6. **Maintainability**: Centralized configuration and management

### Before vs After

**Before (Direct Service Usage):**
```typescript
import { authService } from '@/services/auth/auth';

// Direct service usage - tightly coupled
const user = await authService.login(email, password);
if (user) {
  console.log('Login successful');
} else {
  console.error('Login failed');
}
```

**After (Adapter Pattern):**
```typescript
import { useAuthAdapter } from '@/hooks/auth/useAuthAdapter';

function LoginComponent() {
  const { login } = useAuthAdapter();
  
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      console.log('Login successful:', result.data);
    } else {
      console.error('Login failed:', result.error);
    }
  };
  
  return <button onClick={() => handleLogin('user@example.com', 'password123')}>Login</button>;
}
```

## Migration Strategy

### 1. Incremental Migration

Migrate one service at a time to minimize risk:

1. **Phase 1**: Authentication adapter
2. **Phase 2**: Blockchain adapter
3. **Phase 3**: Database adapter
4. **Phase 4**: Analytics adapter

### 2. Backward Compatibility

Maintain backward compatibility during migration:

```typescript
// Legacy service wrapper
export const authService = {
  login: async (email: string, password: string) => {
    const authAdapter = AuthAdapterFactory.getAdapter();
    const result = await authAdapter.login(email, password);
    return result.success ? result.data : null;
  },
  // ... other methods
};
```

### 3. Feature Flags

Use feature flags to control migration:

```typescript
const USE_ADAPTER_PATTERN = process.env.NEXT_PUBLIC_USE_ADAPTERS === 'true';

const login = USE_ADAPTER_PATTERN 
  ? useAdapterLogin()
  : useDirectServiceLogin();
```

## Step-by-Step Migration

### Step 1: Setup Adapter Infrastructure

1. **Install Dependencies**
   ```bash
   # No additional dependencies needed - adapters are built-in
   ```

2. **Configure Environment Variables**
   ```bash
   # .env.local
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_RPC_URL=http://localhost:8545
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
   ```

3. **Verify Adapter Configuration**
   ```typescript
   import { AdapterConfigManager } from '@/src/core/config/AdapterManager';
   
   const configManager = AdapterConfigManager.getInstance();
   console.log('Auth adapter type:', configManager.getAdapterType('auth'));
   console.log('Blockchain adapter type:', configManager.getAdapterType('blockchain'));
   ```

### Step 2: Migrate Authentication Service

**Current Code:**
```typescript
// services/auth/auth.ts
export class AuthService {
  async login(email: string, password: string): Promise<User | null> {
    // Direct implementation
  }
}

// components/LoginForm.tsx
import { authService } from '@/services/auth/auth';

function LoginForm() {
  const handleLogin = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    if (user) {
      // Success
    }
  };
}
```

**Migrated Code:**
```typescript
// hooks/auth/useAuthAdapter.ts
import { useAuthAdapter } from '@/hooks/auth/useAuthAdapter';

function LoginForm() {
  const { login, isLoading, error } = useAuthAdapter();
  
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      // Success - result.data contains user
    } else {
      // Handle error - result.error contains message
    }
  };
  
  return (
    <div>
      <button onClick={() => handleLogin('user@example.com', 'password123')}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### Step 3: Migrate Blockchain Service

**Current Code:**
```typescript
// services/blockchainService.ts
export class BlockchainService {
  async createProductRecord(product: any, farmerName: string, farmerAddress: string): Promise<BlockchainRecord | null> {
    // Direct implementation
  }
}

// components/ProductForm.tsx
import { blockchainService } from '@/services/blockchainService';

function ProductForm() {
  const handleSubmit = async (productData: any) => {
    const record = await blockchainService.createProductRecord(productData, 'John', '0x123...');
    if (record) {
      // Success
    }
  };
}
```

**Migrated Code:**
```typescript
// hooks/blockchain/useBlockchainAdapter.ts
import { useBlockchainAdapter } from '@/hooks/blockchain/useBlockchainAdapter';

function ProductForm() {
  const { createProductRecord, isLoading, error } = useBlockchainAdapter();
  
  const handleSubmit = async (productData: any) => {
    const result = await createProductRecord(productData, 'John', '0x123...');
    if (result.success) {
      // Success - result.data contains blockchain record
    } else {
      // Handle error
    }
  };
  
  return (
    <div>
      <button onClick={() => handleSubmit(mockProductData)}>
        {isLoading ? 'Creating...' : 'Create Product'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### Step 4: Update Context and State Management

**Current Code:**
```typescript
// contexts/authContext.tsx
export const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = async (email: string, password: string) => {
    const userData = await authService.login(email, password);
    setUser(userData);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Migrated Code:**
```typescript
// contexts/authContext.tsx
export const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: false,
  error: null,
});

function AuthProvider({ children }) {
  const { user, login, logout, isLoading, error } = useAuthAdapter();
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Step 5: Add Monitoring and Error Tracking

```typescript
// Component with monitoring
function ProductForm() {
  const { createProductRecord } = useBlockchainAdapter();
  const { recordOperation } = usePerformanceMonitor();
  const { trackError } = useErrorTracker();
  
  const handleSubmit = async (productData: any) => {
    const startTime = Date.now();
    try {
      const result = await createProductRecord(productData, 'John', '0x123...');
      
      if (result.success) {
        recordOperation('createProduct', 'blockchain', Date.now() - startTime, true);
        console.log('Product created:', result.data);
      } else {
        trackError(new Error(result.error), 'blockchain_error', 'blockchain', 'createProduct');
      }
    } catch (error) {
      recordOperation('createProduct', 'blockchain', Date.now() - startTime, false, error.message);
      trackError(error, 'blockchain_error', 'blockchain', 'createProduct');
    }
  };
}
```

## Common Migration Patterns

### Pattern 1: Service Method Migration

**Before:**
```typescript
const result = await someService.someMethod(param1, param2);
if (result) {
  // Handle success
}
```

**After:**
```typescript
const result = await someAdapter.someMethod(param1, param2);
if (result.success) {
  // Handle success - result.data
} else {
  // Handle error - result.error
}
```

### Pattern 2: Error Handling Migration

**Before:**
```typescript
try {
  const result = await someService.someMethod();
  return result;
} catch (error) {
  console.error('Service error:', error);
  return null;
}
```

**After:**
```typescript
const result = await someAdapter.someMethod();
if (result.success) {
  return result.data;
} else {
  console.error('Adapter error:', result.error);
  // Error is already tracked by the adapter
  return null;
}
```

### Pattern 3: Async State Migration

**Before:**
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await someService.someMethod();
    // Handle success
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**After:**
```typescript
const { someMethod, isLoading, error } = useSomeAdapter();

const handleSubmit = async () => {
  const result = await someMethod();
  // Loading and error states are managed by the hook
  if (result.success) {
    // Handle success
  }
};
```

### Pattern 4: Context Provider Migration

**Before:**
```typescript
function AppProvider({ children }) {
  const [state, setState] = useState(initialState);
  
  const actions = {
    login: async (email, password) => {
      const user = await authService.login(email, password);
      setState(prev => ({ ...prev, user }));
    }
  };
  
  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}
```

**After:**
```typescript
function AppProvider({ children }) {
  // Hooks manage state internally
  const authAdapter = useAuthAdapter();
  const blockchainAdapter = useBlockchainAdapter();
  
  return (
    <AppContext.Provider value={{ 
      auth: authAdapter, 
      blockchain: blockchainAdapter 
    }}>
      {children}
    </AppContext.Provider>
  );
}
```

## Troubleshooting

### Common Issues

#### Issue 1: Adapter Not Found

**Error:** `Cannot find module '@/src/core/adapters/auth'`

**Solution:** Ensure adapters are properly exported and imported:

```typescript
// Check import path
import { AuthAdapterFactory } from '@/src/core/adapters/auth'; // Correct
import { AuthAdapterFactory } from '@/src/core/adapters/auth/index'; // Also correct
```

#### Issue 2: Configuration Errors

**Error:** Adapter returns wrong implementation type

**Solution:** Check environment configuration:

```typescript
import { AdapterConfigManager } from '@/src/core/config/AdapterManager';

const configManager = AdapterConfigManager.getInstance();
console.log('Current config:', configManager.getConfig());
```

#### Issue 3: Type Errors

**Error:** TypeScript errors with adapter results

**Solution:** Ensure proper type handling:

```typescript
// Before
const user = await adapter.login(email, password);

// After
const result = await adapter.login(email, password);
if (result.success) {
  const user = result.data; // Type-safe access
}
```

#### Issue 4: Hook Usage Errors

**Error:** Hooks can only be used in React components

**Solution:** Use hooks within React components or custom hooks:

```typescript
// Correct - in React component
function MyComponent() {
  const { login } = useAuthAdapter();
  // ...
}

// Correct - in custom hook
function useCustomAuth() {
  const { login } = useAuthAdapter();
  return { login };
}

// Incorrect - outside React
const { login } = useAuthAdapter(); // Error!
```

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
// Enable debug mode
const configManager = AdapterConfigManager.getInstance();
const loggingConfig = configManager.getLoggingConfig();
console.log('Logging configuration:', loggingConfig);

// Check adapter health
import { adapterHealthMonitor } from '@/src/core/monitoring/AdapterHealthMonitor';
const healthStatus = adapterHealthMonitor.getSystemHealthSummary();
console.log('System health:', healthStatus);
```

### Performance Issues

If you experience performance issues after migration:

1. **Check Adapter Selection**: Ensure you're using the right adapter type
2. **Monitor Performance**: Use the performance monitor to identify bottlenecks
3. **Review Error Rates**: High error rates can impact performance
4. **Optimize Configuration**: Adjust timeouts and intervals

```typescript
// Check performance
const { stats } = usePerformanceMonitor();
console.log('Average response time:', stats.avgDuration);
console.log('Success rate:', stats.successRate);

// Check error rates
const { analytics } = useErrorTracker();
console.log('Error rate:', analytics.errorRate);
```

## Best Practices

### 1. Consistent Error Handling

Always handle adapter results consistently:

```typescript
const result = await adapter.someMethod();
if (result.success) {
  // Handle success
  console.log('Operation successful:', result.data);
} else {
  // Handle error
  console.error('Operation failed:', result.error);
  // Error is automatically tracked
}
```

### 2. Use React Hooks

Prefer React hooks over direct adapter usage:

```typescript
// Good
function MyComponent() {
  const { login, isLoading, error } = useAuthAdapter();
  // ...
}

// Avoid
function MyComponent() {
  const adapter = AuthAdapterFactory.getAdapter(); // Don't do this
  // ...
}
```

### 3. Implement Monitoring

Always use monitoring for production apps:

```typescript
function MyComponent() {
  const { someOperation } = useSomeAdapter();
  const { recordOperation } = usePerformanceMonitor();
  const { trackError } = useErrorTracker();
  
  const handleOperation = async () => {
    const startTime = Date.now();
    try {
      const result = await someOperation();
      if (result.success) {
        recordOperation('operation', 'adapter', Date.now() - startTime, true);
      } else {
        trackError(new Error(result.error), 'adapter_error', 'adapter', 'operation');
      }
    } catch (error) {
      recordOperation('operation', 'adapter', Date.now() - startTime, false, error.message);
      trackError(error, 'adapter_error', 'adapter', 'operation');
    }
  };
}
```

### 4. Test Thoroughly

Use the built-in testing framework:

```typescript
// Run comprehensive tests
import { adapterTestFramework } from '@/src/core/testing/AdapterTestFramework';

const results = await adapterTestFramework.runAllTests(adapter);
if (!results.every(suite => suite.passed)) {
  console.error('Tests failed:', results);
}
```

### 5. Configuration Management

Use environment-based configuration:

```typescript
// Development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api

// Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.maroontraceability.com
```

## Migration Checklist

### Pre-Migration

- [ ] Review current service usage
- [ ] Identify components to migrate
- [ ] Set up environment configuration
- [ ] Plan migration strategy
- [ ] Create backup of current code

### Migration

- [ ] Migrate authentication service
- [ ] Migrate blockchain service
- [ ] Migrate database service
- [ ] Update context providers
- [ ] Add monitoring and error tracking
- [ ] Update tests

### Post-Migration

- [ ] Test all migrated functionality
- [ ] Verify performance
- [ ] Check error tracking
- [ ] Update documentation
- [ ] Remove old service code
- [ ] Monitor production

## Rollback Plan

If migration causes issues, rollback steps:

1. **Immediate Rollback**: Revert to previous service usage
2. **Feature Flags**: Disable adapter pattern temporarily
3. **Configuration**: Switch back to old configuration
4. **Monitoring**: Check for issues during rollback

```typescript
// Rollback using feature flag
const USE_ADAPTER_PATTERN = process.env.NEXT_PUBLIC_USE_ADAPTERS !== 'false';

const login = USE_ADAPTER_PATTERN 
  ? useAdapterLogin()
  : useDirectServiceLogin();
```

## Support

For migration support:

1. **Documentation**: See [Adapter API Documentation](../api/adapter-api.md)
2. **Examples**: Check `src/core/examples/` for usage examples
3. **Testing**: Use the built-in testing framework
4. **Monitoring**: Use health and performance monitoring
5. **Community**: Create issues for migration problems

## Conclusion

The adapter pattern provides a robust, scalable foundation for service management. Follow this guide carefully for a smooth migration process.

Remember to:
- Migrate incrementally
- Test thoroughly
- Monitor performance
- Handle errors properly
- Use React hooks
- Keep documentation updated

Happy migrating!
