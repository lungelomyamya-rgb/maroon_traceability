# Adapter API Documentation

## Overview

The Adapter Pattern provides a unified interface for accessing different service implementations (mock vs real) without changing the UI components. This documentation covers the complete API for the adapter system.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Authentication Adapter](#authentication-adapter)
- [Blockchain Adapter](#blockchain-adapter)
- [Configuration Management](#configuration-management)
- [Health Monitoring](#health-monitoring)
- [Performance Monitoring](#performance-monitoring)
- [Error Tracking](#error-tracking)
- [Testing Framework](#testing-framework)
- [React Hooks](#react-hooks)

## Core Concepts

### Base Adapter Interface

All adapters implement the `BaseAdapter` interface:

```typescript
interface BaseAdapter {
  /** Unique adapter identifier */
  id: string;
  /** Adapter type */
  type: string;
  /** Whether adapter is available */
  isAvailable: boolean;
  /** Initialize the adapter */
  initialize(): Promise<void>;
  /** Cleanup resources */
  cleanup(): Promise<void>;
}
```

### Adapter Result Interface

All adapter operations return an `AdapterResult`:

```typescript
interface AdapterResult<T> {
  /** Whether the operation was successful */
  success: boolean;
  /** Result data */
  data?: T;
  /** Error message */
  error?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}
```

## Authentication Adapter

### Interface

```typescript
interface AuthAdapter extends BaseAdapter {
  /** Login with credentials */
  login(email: string, password: string): Promise<AdapterResult<User>>;
  /** Logout current user */
  logout(): Promise<AdapterResult<void>>;
  /** Get current user */
  getCurrentUser(): Promise<AdapterResult<User>>;
  /** Register new user */
  register(userData: RegisterData): Promise<AdapterResult<User>>;
  /** Refresh authentication token */
  refreshToken(): Promise<AdapterResult<string>>;
  /** Update user profile */
  updateProfile(userData: Partial<User>): Promise<AdapterResult<User>>;
  /** Change password */
  changePassword(oldPassword: string, newPassword: string): Promise<AdapterResult<void>>;
  /** Reset password */
  resetPassword(email: string): Promise<AdapterResult<void>>;
}
```

### Usage Examples

#### Basic Authentication

```typescript
import { AuthAdapterFactory } from '@/src/core/adapters/auth';

// Get adapter instance
const authAdapter = AuthAdapterFactory.getAdapter();

// Login user
const loginResult = await authAdapter.login('user@example.com', 'password123');
if (loginResult.success) {
  console.log('User logged in:', loginResult.data);
} else {
  console.error('Login failed:', loginResult.error);
}

// Get current user
const currentUserResult = await authAdapter.getCurrentUser();
if (currentUserResult.success) {
  console.log('Current user:', currentUserResult.data);
}

// Logout
const logoutResult = await authAdapter.logout();
if (logoutResult.success) {
  console.log('User logged out');
}
```

#### React Hook Usage

```typescript
import { useAuthAdapter } from '@/hooks/auth/useAuthAdapter';

function LoginComponent() {
  const { user, login, logout, isLoading, error } = useAuthAdapter();

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      console.log('Login successful');
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      console.log('Logout successful');
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Please login</p>
          <button onClick={() => handleLogin('user@example.com', 'password123')}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}
```

## Blockchain Adapter

### Interface

```typescript
interface BlockchainAdapter extends BaseAdapter {
  /** Create product record on blockchain */
  createProductRecord(
    product: any,
    farmerName: string,
    farmerAddress: string
  ): Promise<AdapterResult<BlockchainRecord>>;
  
  /** Get product history */
  getProductHistory(productId: string): Promise<AdapterResult<BlockchainRecord[]>>;
  
  /** Verify product */
  verifyProduct(
    productId: string,
    inspectorName: string,
    inspectorAddress: string
  ): Promise<AdapterResult<VerificationResult>>;
  
  /** Get blockchain status */
  getBlockchainStatus(): Promise<AdapterResult<BlockchainStatus>>;
  
  /** Get transaction details */
  getTransaction(txHash: string): Promise<AdapterResult<Transaction>>;
  
  /** Get account balance */
  getAccountBalance(address: string): Promise<AdapterResult<string>>;
  
  /** Transfer ownership */
  transferOwnership(
    productId: string,
    fromAddress: string,
    toAddress: string
  ): Promise<AdapterResult<TransactionResult>>;
}
```

### Usage Examples

#### Basic Blockchain Operations

```typescript
import { BlockchainAdapterFactory } from '@/src/core/adapters/blockchain';

// Get adapter instance
const blockchainAdapter = BlockchainAdapterFactory.getAdapter();

// Create product record
const productData = {
  name: 'Organic Tomatoes',
  category: 'vegetables',
  description: 'Fresh organic tomatoes',
  location: 'Cape Town',
  harvestDate: '2024-01-15',
  batchSize: '10kg'
};

const createResult = await blockchainAdapter.createProductRecord(
  productData,
  'John Farmer',
  '0x1234567890123456789012345678901234567890'
);

if (createResult.success) {
  console.log('Product created:', createResult.data);
  
  // Get product history
  const historyResult = await blockchainAdapter.getProductHistory(createResult.data.id);
  if (historyResult.success) {
    console.log('Product history:', historyResult.data);
  }
  
  // Verify product
  const verifyResult = await blockchainAdapter.verifyProduct(
    createResult.data.id,
    'Inspector Jane',
    '0x0987654321098765432109876543210987654321'
  );
  
  if (verifyResult.success) {
    console.log('Product verified:', verifyResult.data);
  }
}
```

#### React Hook Usage

```typescript
import { useBlockchainAdapter } from '@/hooks/blockchain/useBlockchainAdapter';

function ProductTrackingComponent() {
  const { 
    createProductRecord, 
    getProductHistory, 
    verifyProduct,
    getBlockchainStatus,
    isLoading,
    error 
  } = useBlockchainAdapter();

  const handleCreateProduct = async (productData: any) => {
    const result = await createProductRecord(
      productData,
      'John Farmer',
      '0x1234567890123456789012345678901234567890'
    );
    
    if (result.success) {
      console.log('Product created:', result.data);
    }
  };

  return (
    <div>
      <button onClick={() => handleCreateProduct(mockProductData)}>
        Create Product
      </button>
    </div>
  );
}
```

## Configuration Management

### AdapterConfigManager

The `AdapterConfigManager` provides centralized configuration for all adapters:

```typescript
import { AdapterConfigManager } from '@/src/core/config/AdapterManager';

const configManager = AdapterConfigManager.getInstance();

// Get configuration
const config = configManager.getConfig();

// Get adapter type for specific service
const authAdapterType = configManager.getAdapterType('auth'); // 'mock' | 'real'
const blockchainAdapterType = configManager.getAdapterType('blockchain'); // 'mock' | 'real'

// Get feature flags
const features = configManager.getFeatures();
const isAnalyticsEnabled = features.analytics.enabled;
const isHealthMonitoringEnabled = features.healthMonitoring.enabled;

// Get logging configuration
const loggingConfig = configManager.getLoggingConfig();
```

### Environment-based Configuration

The system automatically configures adapters based on environment variables:

```typescript
// Environment variables
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### Configuration Example

```typescript
// Development environment
const devConfig = {
  environment: 'development',
  adapters: {
    auth: { type: 'mock' },
    blockchain: { type: 'mock' },
    database: { type: 'memory' },
    analytics: { type: 'mock' }
  },
  features: {
    analytics: { enabled: true },
    healthMonitoring: { enabled: true },
    performanceMonitoring: { enabled: true },
    errorTracking: { enabled: true }
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableRemote: false
  }
};

// Production environment
const prodConfig = {
  environment: 'production',
  adapters: {
    auth: { type: 'real', baseUrl: 'https://api.example.com' },
    blockchain: { type: 'real', rpcUrl: 'https://mainnet.infura.io' },
    database: { type: 'indexeddb' },
    analytics: { type: 'real', endpoint: 'https://analytics.example.com' }
  },
  features: {
    analytics: { enabled: true },
    healthMonitoring: { enabled: true },
    performanceMonitoring: { enabled: true },
    errorTracking: { enabled: true }
  },
  logging: {
    level: 'warn',
    enableConsole: false,
    enableRemote: true
  }
};
```

## Health Monitoring

### AdapterHealthMonitor

The health monitor tracks the health status of all adapters:

```typescript
import { adapterHealthMonitor } from '@/src/core/monitoring/AdapterHealthMonitor';

// Register adapter for monitoring
adapterHealthMonitor.registerAdapter(authAdapter, {
  checkInterval: 30000, // 30 seconds
  timeout: 5000, // 5 seconds
  failureThreshold: 3,
  enableAutoRecovery: true
});

// Get health status
const allHealth = adapterHealthMonitor.getAllHealthStatus();
const authHealth = adapterHealthMonitor.getHealthStatus('auth-mock-1');

// Get system health summary
const systemHealth = adapterHealthMonitor.getSystemHealthSummary();
console.log('System health:', systemHealth.overall); // 'healthy' | 'degraded' | 'unhealthy'

// Get unhealthy adapters
const unhealthyAdapters = adapterHealthMonitor.getUnhealthyAdapters();
```

### React Hook Usage

```typescript
import { useAdapterHealth } from '@/hooks/monitoring/useAdapterHealth';

function HealthDashboard() {
  const { healthStatus, systemHealth, forceHealthCheck, isHealthy, hasIssues } = useAdapterHealth();

  return (
    <div>
      <h2>System Health: {systemHealth.overall}</h2>
      <div>
        <p>Total adapters: {systemHealth.total}</p>
        <p>Healthy: {systemHealth.healthy}</p>
        <p>Degraded: {systemHealth.degraded}</p>
        <p>Unhealthy: {systemHealth.unhealthy}</p>
      </div>
      
      <button onClick={() => forceHealthCheck()}>
        Force Health Check
      </button>
    </div>
  );
}
```

## Performance Monitoring

### PerformanceMonitor

The performance monitor tracks adapter performance metrics:

```typescript
import { performanceMonitor } from '@/src/core/monitoring/PerformanceMonitor';

// Record performance metric
performanceMonitor.recordMetric({
  operation: 'login',
  adapterType: 'auth',
  timestamp: Date.now(),
  duration: 1500,
  success: true,
  memoryBefore: 1024000,
  memoryAfter: 1025000
});

// Start measurement
const endMeasurement = performanceMonitor.startMeasurement('login', 'auth');
// ... perform operation
const metric = endMeasurement(true); // success

// Get performance statistics
const stats = performanceMonitor.getStats();
console.log('Average duration:', stats.avgDuration);
console.log('Success rate:', stats.successRate);
console.log('Operations per second:', stats.opsPerSecond);

// Get performance trends
const trends = performanceMonitor.getTrends('login', 3600000); // Last hour

// Get optimization recommendations
const recommendations = performanceMonitor.getRecommendations();
```

### React Hook Usage

```typescript
import { usePerformanceMonitor } from '@/hooks/monitoring/usePerformanceMonitor';

function PerformanceDashboard() {
  const { 
    stats, 
    alerts, 
    recommendations, 
    recordOperation,
    isHealthy,
    hasIssues 
  } = usePerformanceMonitor();

  const handleOperation = async () => {
    const startTime = Date.now();
    try {
      await someOperation();
      recordOperation('test-operation', 'auth', Date.now() - startTime, true);
    } catch (error) {
      recordOperation('test-operation', 'auth', Date.now() - startTime, false, error.message);
    }
  };

  return (
    <div>
      <h2>Performance Overview</h2>
      <p>Average Duration: {stats.avgDuration}ms</p>
      <p>Success Rate: {stats.successRate}%</p>
      <p>Ops/sec: {stats.opsPerSecond}</p>
      
      {recommendations.length > 0 && (
        <div>
          <h3>Recommendations:</h3>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Error Tracking

### ErrorTracker

The error tracker provides comprehensive error analytics:

```typescript
import { errorTracker } from '@/src/core/analytics/ErrorTracker';

// Track error
errorTracker.trackException(
  new Error('Network timeout'),
  'network_error',
  'auth',
  'login',
  'high',
  { timeout: 5000 }
);

// Track custom error event
errorTracker.trackError({
  id: 'custom-error-1',
  type: 'validation_error',
  message: 'Invalid email format',
  timestamp: Date.now(),
  severity: 'medium',
  adapterType: 'auth',
  operation: 'register',
  userContext: {
    userId: 'user-123',
    role: 'farmer'
  }
});

// Get analytics
const analytics = errorTracker.getAnalytics(3600000); // Last hour
console.log('Total errors:', analytics.totalErrors);
console.log('Error rate:', analytics.errorRate);
console.log('Recovery rate:', analytics.recoveryRate);

// Get recent errors
const recentErrors = errorTracker.getRecentErrors(10);

// Get error patterns
const patterns = errorTracker.getErrorPatterns();
```

### React Hook Usage

```typescript
import { useErrorTracker } from '@/hooks/analytics/useErrorTracker';

function ErrorAnalyticsDashboard() {
  const { 
    analytics, 
    recentErrors, 
    trackError, 
    markRecovered,
    errorRate,
    totalErrors,
    recoveryRate,
    hasCriticalErrors 
  } = useErrorTracker();

  const handleError = (error: Error) => {
    trackError(error, 'api_error', 'auth', 'login', 'high');
  };

  const handleRecovery = (errorId: string) => {
    markRecovered(errorId, 3000); // 3 seconds recovery time
  };

  return (
    <div>
      <h2>Error Analytics</h2>
      <p>Total Errors: {totalErrors}</p>
      <p>Error Rate: {errorRate}/min</p>
      <p>Recovery Rate: {recoveryRate}%</p>
      
      {hasCriticalErrors && (
        <div className="alert">
          <strong>Critical errors detected!</strong>
        </div>
      )}
      
      <div>
        <h3>Recent Errors</h3>
        {recentErrors.map(error => (
          <div key={error.id}>
            <p>{error.type}: {error.message}</p>
            <p>Severity: {error.severity}</p>
            {!error.recovered && (
              <button onClick={() => handleRecovery(error.id)}>
                Mark Recovered
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Testing Framework

### AdapterTestFramework

The testing framework provides comprehensive adapter testing:

```typescript
import { adapterTestFramework } from '@/src/core/testing/AdapterTestFramework';
import { createAuthTestSuite, createBlockchainTestSuite } from '@/src/core/testing/AdapterTestSuites';

// Register test suites
adapterTestFramework.registerTestSuite(createAuthTestSuite());
adapterTestFramework.registerTestSuite(createBlockchainTestSuite());

// Run all tests
const results = await adapterTestFramework.runAllTests(authAdapter);
console.log('Test results:', results);

// Generate report
const report = adapterTestFramework.generateReport(results);
console.log('Test report:', report);
```

### Predefined Test Suites

```typescript
import { createAuthTestSuite, createBlockchainTestSuite, createPerformanceTestSuite } from '@/src/core/testing/AdapterTestSuites';

// Authentication test suite
const authTestSuite = createAuthTestSuite();
// Includes tests for:
// - Adapter initialization
// - Login with valid credentials
// - Login with invalid credentials
// - Get current user
// - Logout functionality
// - Token refresh

// Blockchain test suite
const blockchainTestSuite = createBlockchainTestSuite();
// Includes tests for:
// - Adapter initialization
// - Create product record
// - Get product history
// - Verify product
// - Get blockchain status
// - Get transaction details

// Performance test suite
const performanceTestSuite = createPerformanceTestSuite();
// Includes tests for:
// - Response time under load
// - Memory usage over time
// - Operations per second
```

## React Hooks

### Available Hooks

```typescript
// Authentication hooks
import { useAuthAdapter } from '@/hooks/auth/useAuthAdapter';
import { useAuthState } from '@/hooks/auth/useAuthState';

// Blockchain hooks
import { useBlockchainAdapter } from '@/hooks/blockchain/useBlockchainAdapter';
import { useBlockchainStatus } from '@/hooks/blockchain/useBlockchainAdapter';

// Health monitoring hooks
import { useAdapterHealth } from '@/hooks/monitoring/useAdapterHealth';
import { useUnhealthyAdapters } from '@/hooks/monitoring/useAdapterHealth';

// Performance monitoring hooks
import { usePerformanceMonitor } from '@/hooks/monitoring/usePerformanceMonitor';
import { useOperationMonitor } from '@/hooks/monitoring/usePerformanceMonitor';

// Error tracking hooks
import { useErrorTracker } from '@/hooks/analytics/useErrorTracker';
import { useErrorPatterns } from '@/hooks/analytics/useErrorTracker';
```

### Hook Examples

#### useAuthAdapter

```typescript
function AuthComponent() {
  const { user, login, logout, isLoading, error } = useAuthAdapter();

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      console.log('Login successful');
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => handleLogin('user@example.com', 'password123')}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}
```

#### usePerformanceMonitor

```typescript
function PerformanceComponent() {
  const { stats, recordOperation, isHealthy } = usePerformanceMonitor();

  const performOperation = async () => {
    const startTime = Date.now();
    try {
      await someAsyncOperation();
      recordOperation('test-operation', 'auth', Date.now() - startTime, true);
    } catch (error) {
      recordOperation('test-operation', 'auth', Date.now() - startTime, false, error.message);
    }
  };

  return (
    <div>
      <p>System Health: {isHealthy ? 'Healthy' : 'Issues detected'}</p>
      <p>Average Response Time: {stats.avgDuration}ms</p>
      <p>Success Rate: {stats.successRate}%</p>
      <button onClick={performOperation}>Test Operation</button>
    </div>
  );
}
```

## Best Practices

### 1. Error Handling

Always handle adapter results properly:

```typescript
const result = await adapter.someOperation();
if (result.success) {
  // Handle success
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
  // Optionally track the error
  errorTracker.trackException(new Error(result.error), 'adapter_error');
}
```

### 2. Performance Monitoring

Monitor adapter performance for optimization:

```typescript
const endMeasurement = performanceMonitor.startMeasurement('operation', 'auth');
try {
  const result = await adapter.someOperation();
  endMeasurement(true);
  return result;
} catch (error) {
  endMeasurement(false, error.message);
  throw error;
}
```

### 3. Health Checks

Implement regular health checks for adapters:

```typescript
// Register adapter with health monitoring
adapterHealthMonitor.registerAdapter(adapter, {
  checkInterval: 30000, // Check every 30 seconds
  failureThreshold: 3, // Mark unhealthy after 3 failures
  enableAutoRecovery: true
});
```

### 4. Configuration

Use environment-based configuration:

```typescript
const configManager = AdapterConfigManager.getInstance();
const adapterType = configManager.getAdapterType('auth');
const adapter = AuthAdapterFactory.getAdapter(adapterType);
```

### 5. Testing

Always test adapters with the testing framework:

```typescript
// Run comprehensive tests
const results = await adapterTestFramework.runAllTests(adapter);
if (!results.every(suite => suite.passed)) {
  console.error('Adapter tests failed');
}
```

## Migration Guide

### From Direct Service Usage

**Before:**
```typescript
import { authService } from '@/services/auth/auth';

const user = await authService.login(email, password);
```

**After:**
```typescript
import { useAuthAdapter } from '@/hooks/auth/useAuthAdapter';

function MyComponent() {
  const { login } = useAuthAdapter();
  
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      console.log('Login successful');
    }
  };
}
```

### From Mock to Real Adapters

**Development (Mock):**
```typescript
// Environment: NODE_ENV=development
const authAdapter = AuthAdapterFactory.getAdapter('mock');
```

**Production (Real):**
```typescript
// Environment: NODE_ENV=production
const authAdapter = AuthAdapterFactory.getAdapter('real');
```

The system automatically selects the appropriate adapter based on configuration.

## Troubleshooting

### Common Issues

1. **Adapter not found**: Ensure adapters are registered before use
2. **Configuration errors**: Check environment variables and configuration files
3. **Health check failures**: Verify adapter connectivity and configuration
4. **Performance issues**: Use performance monitoring to identify bottlenecks
5. **Error tracking**: Check error analytics for patterns and trends

### Debug Mode

Enable debug logging:

```typescript
const configManager = AdapterConfigManager.getInstance();
const loggingConfig = configManager.getLoggingConfig();
console.log('Logging level:', loggingConfig.level);
```

### Health Status

Check adapter health:

```typescript
const healthMonitor = adapterHealthMonitor;
const systemHealth = healthMonitor.getSystemHealthSummary();
console.log('System health:', systemHealth);
```

This comprehensive API documentation provides all the information needed to use the adapter pattern effectively in your application.
