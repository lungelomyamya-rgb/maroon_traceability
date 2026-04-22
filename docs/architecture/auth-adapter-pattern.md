# Authentication Adapter Pattern Implementation

## Overview

This document describes the implementation of a decoupled authentication system that allows seamless switching between simulated and real API services without changing UI components.

## Architecture

### Core Components

1. **AuthAdapter Interface** (`src/core/types/adapter.ts`)
   - Defines the contract for all authentication adapters
   - Ensures consistent API across different implementations
   - Supports login, register, logout, refresh, and password reset

2. **SimulatedAuthAdapter** (`src/core/adapters/auth/SimulatedAuthAdapter.ts`)
   - Mock implementation using in-memory data
   - Perfect for development and testing
   - Includes the same mock users from the original auth service

3. **RealAuthAdapter** (`src/core/adapters/auth/RealAuthAdapter.ts`)
   - Production implementation using HTTP client
   - Supports JWT tokens, auto-refresh, and error handling
   - Configurable endpoints and authentication strategies

4. **StorageAdapter Interface** (`src/core/types/storage.ts`)
   - Abstracts storage operations (localStorage, IndexedDB, memory)
   - Enables swapping storage implementations
   - Supports TTL, batch operations, and statistics

5. **AdapterRegistry** (`src/core/adapters/AdapterRegistry.ts`)
   - Central registry for all adapters
   - Supports runtime adapter creation and management
   - Enables hybrid configurations and failover

## Usage Examples

### Basic Usage

```typescript
import { useAuth } from '@/contexts/authContext';

function LoginForm() {
  const { login, loading, user } = useAuth();
  
  const handleSubmit = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      // User is now logged in, role-based redirect happens automatically
    }
  };
}
```

### Adapter Switching

```typescript
import { AuthAdapterFactory } from '@/src/core/examples/AuthAdapterExample';

// Development mode
const devAdapter = await AuthAdapterFactory.getAdapter('development');

// Production mode  
const prodAdapter = await AuthAdapterFactory.getAdapter('production');
```

### Configuration-Based Selection

```typescript
// In authContext.tsx or configuration
const adapterConfig = process.env.NODE_ENV === 'production' 
  ? { baseUrl: 'https://api.example.com', type: 'real' }
  : { type: 'mock' };

const adapter = await createAuthAdapter('real', adapterConfig);
```

## Benefits

### 1. **Seamless API Swapping**
- Switch between simulated and real APIs without UI changes
- Zero-impact migration from development to production
- A/B testing different authentication providers

### 2. **Type Safety**
- Full TypeScript support with comprehensive interfaces
- Compile-time error detection
- Better IntelliSense and developer experience

### 3. **Testability**
- Mock adapter for unit tests
- Easy injection of test adapters
- Isolated testing of authentication logic

### 4. **Scalability**
- Easy to add new authentication providers
- Support for multiple authentication strategies
- Hybrid configurations with failover

### 5. **Maintainability**
- Clear separation of concerns
- Single responsibility principle
- Easy to extend and modify

## Migration Guide

### From Direct Service Usage

**Before:**
```typescript
import { authService } from '@/services/auth/auth';
const response = await authService.login(credentials);
```

**After:**
```typescript
import { useAuth } from '@/contexts/authContext';
const { login } = useAuth();
const success = await login(email, password);
```

### Component Updates

1. **Remove direct service imports**
2. **Use useAuth hook instead**
3. **Update error handling to use boolean responses**
4. **Remove manual user state management**

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_AUTH_MODE=development  # or production
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_AUTH_TIMEOUT=5000
```

### Adapter Configuration

```typescript
const realAuthConfig: RealAuthConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  type: 'real',
  timeout: parseInt(process.env.NEXT_PUBLIC_AUTH_TIMEOUT || '5000'),
  autoRefresh: true,
  endpoints: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    logout: '/api/v1/auth/logout',
    refresh: '/api/v1/auth/refresh',
    resetPassword: '/api/v1/auth/reset-password',
    getCurrentUser: '/api/v1/auth/me',
  },
};
```

## Testing

### Unit Tests

```typescript
import { SimulatedAuthAdapter } from '@/src/core/adapters/auth/SimulatedAuthAdapter';

describe('SimulatedAuthAdapter', () => {
  let adapter: SimulatedAuthAdapter;
  
  beforeEach(async () => {
    adapter = new SimulatedAuthAdapter();
    await adapter.initialize();
  });
  
  it('should login with valid credentials', async () => {
    const result = await adapter.login('john@farm.com', 'password123');
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('John Farmer');
  });
});
```

### Integration Tests

```typescript
import { AuthAdapterFactory } from '@/src/core/examples/AuthAdapterExample';

describe('AuthAdapterFactory', () => {
  it('should return simulated adapter in development', async () => {
    const adapter = await AuthAdapterFactory.getAdapter('development');
    expect(adapter.id).toBe('simulated-auth');
  });
});
```

## Performance Considerations

### Memory Management
- Adapters are singleton instances
- Automatic cleanup on component unmount
- Efficient token refresh with intervals

### Network Optimization
- Request interceptors for authentication headers
- Automatic retry logic for failed requests
- Configurable timeouts and retry strategies

### Caching
- User session persistence in localStorage
- Token caching with automatic refresh
- Adapter instance caching in factory

## Security

### Token Management
- JWT token validation and refresh
- Secure storage with localStorage
- Automatic token expiration handling

### Error Handling
- Comprehensive error types and messages
- Secure error logging without sensitive data
- Graceful degradation on authentication failures

### Configuration Security
- Environment-based configuration
- No hardcoded credentials
- Secure endpoint configuration

## Future Enhancements

### Planned Features
1. **Multi-factor authentication** support
2. **Social login** adapters (Google, Facebook, etc.)
3. **Biometric authentication** adapters
4. **OAuth 2.0** implementation
5. **SAML** enterprise integration

### Extensibility
- Plugin architecture for custom adapters
- Event system for authentication events
- Middleware support for custom logic
- Hook system for authentication lifecycle

## Troubleshooting

### Common Issues

1. **Adapter not found**: Ensure adapters are registered before use
2. **Configuration errors**: Check required fields in adapter config
3. **Type errors**: Verify correct TypeScript types are imported
4. **Runtime errors**: Check adapter initialization and cleanup

### Debug Mode

```typescript
// Enable debug logging
const adapter = new SimulatedAuthAdapter({ debug: true });
```

### Health Monitoring

```typescript
// Check adapter health
const health = await adapterRegistry.getHealthStatus();
console.log('Adapter health:', health);
```

## Conclusion

The authentication adapter pattern provides a robust, flexible, and maintainable solution for authentication management. It enables seamless switching between different authentication providers while maintaining type safety and developer productivity.

The implementation follows enterprise-level patterns and is ready for production use with comprehensive testing, error handling, and security considerations.
