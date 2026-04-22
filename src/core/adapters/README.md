# Adapter Pattern Implementation

## Overview

This directory contains the implementation of the Adapter Pattern for the Maroon Traceability application. The adapter pattern allows for swapping between 'Simulated' and 'Real' API services without changing the UI components.

## Architecture

```
src/core/adapters/
|-- auth/                    # Authentication adapters
|   |-- SimulatedAuthAdapter.ts
|   |-- RealAuthAdapter.ts
|   |-- index.ts
|-- blockchain/              # Blockchain adapters
|   |-- SimulatedBlockchainAdapter.ts
|   |-- RealBlockchainAdapter.ts
|   |-- index.ts
|-- types/                   # Shared type definitions
|   |-- adapter.ts
|-- monitoring/              # Health and performance monitoring
|   |-- AdapterHealthMonitor.ts
|   |-- PerformanceMonitor.ts
|-- analytics/               # Error tracking and analytics
|   |-- ErrorTracker.ts
|-- testing/                 # Testing framework
|   |-- AdapterTestFramework.ts
|   |-- AdapterTestSuites.ts
|-- config/                  # Configuration management
|   |-- AdapterManager.ts
|-- examples/                # Usage examples
|   |-- AuthAdapterExample.ts
|   |-- BlockchainAdapterExample.ts
```

## Key Features

### 1. **Adapter Interface Standardization**
- All adapters implement the same interface
- Consistent error handling and response format
- Type-safe operations with TypeScript

### 2. **Environment-Based Configuration**
- Automatic adapter selection based on environment
- Development uses simulated adapters
- Production uses real adapters

### 3. **Health Monitoring**
- Real-time health status tracking
- Automatic recovery mechanisms
- Performance metrics collection

### 4. **Error Tracking**
- Comprehensive error analytics
- Pattern recognition
- Recovery rate monitoring

### 5. **Testing Framework**
- Built-in test suites for all adapters
- Performance testing capabilities
- Automated test execution

## Quick Start

### 1. Import and Use Adapters

```typescript
import { AuthAdapterFactory } from '@/src/core/adapters/auth';
import { BlockchainAdapterFactory } from '@/src/core/adapters/blockchain';

// Get adapter instances
const authAdapter = AuthAdapterFactory.getAdapter();
const blockchainAdapter = BlockchainAdapterFactory.getAdapter();

// Use adapters
const loginResult = await authAdapter.login(email, password);
const productResult = await blockchainAdapter.createProductRecord(product, farmer, address);
```

### 2. React Hooks Integration

```typescript
import { useAuthAdapter } from '@/features/auth/hooks/useAuthAdapter';
import { useBlockchainAdapter } from '@/hooks/blockchain/useBlockchainAdapter';

function MyComponent() {
  const { user, login, logout } = useAuthAdapter();
  const { createProductRecord, verifyProduct } = useBlockchainAdapter();
  
  // Use adapter functions
}
```

### 3. Configuration Management

```typescript
import { AdapterConfigManager } from '@/src/core/config/AdapterManager';

const configManager = AdapterConfigManager.getInstance();
const adapterType = configManager.getAdapterType('auth'); // 'mock' | 'real'
```

## Adapter Types

### Authentication Adapter

Handles user authentication and authorization:

```typescript
interface AuthAdapter extends BaseAdapter {
  login(email: string, password: string): Promise<AdapterResult<User>>;
  logout(): Promise<AdapterResult<void>>;
  getCurrentUser(): Promise<AdapterResult<User>>;
  register(userData: RegisterData): Promise<AdapterResult<User>>;
  refreshToken(): Promise<AdapterResult<string>>;
  updateProfile(userData: Partial<User>): Promise<AdapterResult<User>>;
  changePassword(oldPassword: string, newPassword: string): Promise<AdapterResult<void>>;
  resetPassword(email: string): Promise<AdapterResult<void>>;
}
```

### Blockchain Adapter

Handles blockchain operations for product traceability:

```typescript
interface BlockchainAdapter extends BaseAdapter {
  createProductRecord(product: any, farmerName: string, farmerAddress: string): Promise<AdapterResult<BlockchainRecord>>;
  getProductHistory(productId: string): Promise<AdapterResult<BlockchainRecord[]>>;
  verifyProduct(productId: string, inspectorName: string, inspectorAddress: string): Promise<AdapterResult<VerificationResult>>;
  getBlockchainStatus(): Promise<AdapterResult<BlockchainStatus>>;
  getTransaction(txHash: string): Promise<AdapterResult<Transaction>>;
  getAccountBalance(address: string): Promise<AdapterResult<string>>;
  transferOwnership(productId: string, fromAddress: string, toAddress: string): Promise<AdapterResult<TransactionResult>>;
}
```

## Configuration

### Environment Variables

```bash
# Development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.maroontraceability.com
NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### Adapter Configuration

```typescript
// Development configuration
const devConfig = {
  adapters: {
    auth: { type: 'mock' },
    blockchain: { type: 'mock' },
    database: { type: 'memory' }
  }
};

// Production configuration
const prodConfig = {
  adapters: {
    auth: { type: 'real', baseUrl: 'https://api.maroontraceability.com' },
    blockchain: { type: 'real', rpcUrl: 'https://mainnet.infura.io' },
    database: { type: 'indexeddb' }
  }
};
```

## Monitoring

### Health Monitoring

```typescript
import { adapterHealthMonitor } from '@/src/core/monitoring/AdapterHealthMonitor';

// Register adapter for monitoring
adapterHealthMonitor.registerAdapter(adapter, {
  checkInterval: 30000, // 30 seconds
  timeout: 5000, // 5 seconds
  failureThreshold: 3,
  enableAutoRecovery: true
});

// Get health status
const healthStatus = adapterHealthMonitor.getHealthStatus('adapter-id');
const systemHealth = adapterHealthMonitor.getSystemHealthSummary();
```

### Performance Monitoring

```typescript
import { performanceMonitor } from '@/src/core/monitoring/PerformanceMonitor';

// Record performance metric
performanceMonitor.recordMetric({
  operation: 'login',
  adapterType: 'auth',
  timestamp: Date.now(),
  duration: 1500,
  success: true
});

// Get performance statistics
const stats = performanceMonitor.getStats();
console.log('Average duration:', stats.avgDuration);
console.log('Success rate:', stats.successRate);
```

### Error Tracking

```typescript
import { errorTracker } from '@/src/core/analytics/ErrorTracker';

// Track error
errorTracker.trackException(
  new Error('Network timeout'),
  'network_error',
  'auth',
  'login',
  'high'
);

// Get analytics
const analytics = errorTracker.getAnalytics();
console.log('Total errors:', analytics.totalErrors);
console.log('Error rate:', analytics.errorRate);
```

## Testing

### Running Tests

```typescript
import { adapterTestFramework } from '@/src/core/testing/AdapterTestFramework';
import { createAuthTestSuite, createBlockchainTestSuite } from '@/src/core/testing/AdapterTestSuites';

// Register test suites
adapterTestFramework.registerTestSuite(createAuthTestSuite());
adapterTestFramework.registerTestSuite(createBlockchainTestSuite());

// Run tests
const results = await adapterTestFramework.runAllTests(adapter);
const report = adapterTestFramework.generateReport(results);
```

### Test Categories

1. **Unit Tests**: Individual adapter method testing
2. **Integration Tests**: End-to-end workflow testing
3. **Performance Tests**: Load and stress testing
4. **Security Tests**: Authentication and authorization testing

## React Integration

### Available Hooks

```typescript
// Authentication hooks
import { useAuthAdapter } from '@/features/auth/hooks/useAuthAdapter';
import { useAuthState } from '@/hooks/auth/useAuthState';

// Blockchain hooks
import { useBlockchainAdapter } from '@/hooks/blockchain/useBlockchainAdapter';
import { useBlockchainStatus } from '@/hooks/blockchain/useBlockchainAdapter';

// Monitoring hooks
import { useAdapterHealth } from '@/hooks/monitoring/useAdapterHealth';
import { usePerformanceMonitor } from '@/hooks/monitoring/usePerformanceMonitor';
import { useErrorTracker } from '@/hooks/analytics/useErrorTracker';
```

### Hook Usage Example

```typescript
function ProductTrackingComponent() {
  const { 
    createProductRecord, 
    getProductHistory, 
    verifyProduct,
    isLoading,
    error 
  } = useBlockchainAdapter();

  const { recordOperation } = usePerformanceMonitor();
  const { trackError } = useErrorTracker();

  const handleCreateProduct = async (productData: any) => {
    const startTime = Date.now();
    try {
      const result = await createProductRecord(
        productData,
        'John Farmer',
        '0x1234567890123456789012345678901234567890'
      );
      
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

  return (
    <div>
      <button onClick={() => handleCreateProduct(mockProduct)}>
        Create Product
      </button>
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
adapterHealthMonitor.registerAdapter(adapter, {
  checkInterval: 30000,
  failureThreshold: 3,
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

## Migration Guide

### From Direct Service Usage

**Before:**
```typescript
import { authService } from '@/services/auth/auth';
const user = await authService.login(email, password);
```

**After:**
```typescript
import { useAuthAdapter } from '@/features/auth/hooks/useAuthAdapter';
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

The system automatically selects adapters based on environment configuration:

```typescript
// Development (mock)
NODE_ENV=development
const authAdapter = AuthAdapterFactory.getAdapter('mock');

// Production (real)
NODE_ENV=production
const authAdapter = AuthAdapterFactory.getAdapter('real');
```

## API Documentation

For detailed API documentation, see:
- [Adapter API Documentation](../../../docs/api/adapter-api.md)
- [Type Definitions](./types/adapter.ts)
- [Examples](./examples/)

## Contributing

When adding new adapters:

1. Create adapter interface in `types/adapter.ts`
2. Implement `SimulatedAdapter` and `RealAdapter` classes
3. Create factory and registration in `index.ts`
4. Add React hooks in `hooks/`
5. Create test suites in `testing/AdapterTestSuites.ts`
6. Update documentation

## License

This adapter pattern implementation is part of the Maroon Traceability project.
