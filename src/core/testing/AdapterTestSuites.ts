// src/core/testing/AdapterTestSuites.ts
// Predefined test suites for common adapter types

import { BaseAdapter } from '../adapters';
import type {
  AdapterConfig as _AdapterConfig,
  AdapterCapabilities,
  ValidationResult,
} from '../interfaces/IAdapter';
// eslint-disable-next-line import/order
import type {
  AuthAdapter,
  BlockchainAdapter,
  AdapterResult as _AdapterResult,
} from '../types/adapter';

// Proper type definitions for test implementations
interface TestAdapterConfig extends _AdapterConfig {
  mockData?: unknown;
  testMode?: 'unit' | 'integration' | 'e2e';
}

// Type alias for test adapters to avoid any types
type TestAdapter = BaseAdapter<unknown, unknown>;

// Test adapter interface for testing purposes
interface _TestAdapter {
  // BaseAdapter properties
  readonly id: string;
  readonly name: string;
  readonly type: 'mock' | 'real' | 'hybrid';
  readonly feature: string;
  readonly priority: number;
  readonly isActive: boolean;
  isAvailable: boolean;
  initialize(): Promise<void>;
  cleanup(): Promise<void>;

  // Additional properties for testing
  loginSuccess?: boolean;
  user?: unknown;
  loginFailedAsExpected?: boolean;
  logoutSuccess?: boolean;
  tokenRefreshSuccess?: boolean;
  newToken?: string;

  // BlockchainAdapter properties
  productCreated?: boolean;
  record?: unknown;
  productVerified?: boolean;
  verification?: unknown;
  historyRetrieved?: boolean;
  records?: unknown;
  statusRetrieved?: boolean;
  status?: unknown;
  transactionRetrieved?: boolean;
  transaction?: unknown;

  // Performance properties
  performanceMetrics?: {
    duration: number;
    operationCompleted: boolean;
    criteriaMet: boolean;
  };

  // Status properties
  initialized?: boolean;
}

// Mock test adapter for testing purposes
class _MockTestAdapter extends BaseAdapter<unknown, unknown> {
  public isAvailable: boolean = true;

  // TestAdapter properties
  loginSuccess?: boolean;
  user?: unknown;
  loginFailedAsExpected?: boolean;
  logoutSuccess?: boolean;
  tokenRefreshSuccess?: boolean;
  newToken?: string;
  productCreated?: boolean;
  record?: unknown;
  productVerified?: boolean;
  verification?: unknown;
  historyRetrieved?: boolean;
  records?: unknown;
  statusRetrieved?: boolean;
  status?: unknown;
  transactionRetrieved?: boolean;
  transaction?: unknown;
  performanceMetrics?: {
    duration: number;
    operationCompleted: boolean;
    criteriaMet: boolean;
  };
  initialized?: boolean;

  constructor(
    name: string,
    type: 'mock' | 'real' | 'hybrid',
    feature: string,
    priority: number = 1,
    isActive: boolean = true,
  ) {
    super(name, type, feature, priority, isActive);
  }

  protected async initializeImpl(_config: TestAdapterConfig): Promise<void> {
    // Mock implementation
    this.initialized = true;
  }

  protected async transformImpl(_input: unknown): Promise<unknown> {
    // Mock implementation
    return _input;
  }

  protected async reverseTransformImpl(_output: unknown): Promise<unknown> {
    // Mock implementation
    return _output;
  }

  protected async validateImpl(_input: unknown): Promise<ValidationResult> {
    // Mock implementation
    return { isValid: true, errors: [], warnings: [] };
  }

  protected getCapabilitiesImpl(): AdapterCapabilities {
    // Mock implementation
    return {
      supportsCaching: false,
      supportsCompression: false,
      supportsStreaming: false,
      supportsBatching: false,
      supportsTransactions: false,
      supportsRealTime: false,
      maxConnections: 1,
      supportedOperations: [],
    };
  }

  protected async cleanupImpl(): Promise<void> {
    // Mock implementation
  }
}

import { adapterTestFramework, type TestSuite, type AdapterTestCase } from './AdapterTestFramework';

/**
 * Create authentication adapter test suite
 */
export function createAuthTestSuite(): TestSuite {
  const testCases: AdapterTestCase[] = [
    {
      name: 'Adapter Initialization',
      description: 'Test that the adapter can be initialized',
      category: 'unit',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        await adapter.initialize({
          name: 'test-adapter',
          type: 'mock',
          feature: 'test',
          priority: 1,
          isActive: true,
          connection: {
            timeout: 5000,
            retry: {
              attempts: 3,
              delay: 1000,
              backoff: 'exponential',
            },
          },
          performance: {
            enableCache: true,
            cacheTTL: 300000,
            enableCompression: false,
          },
        } as _AdapterConfig);
        return {
          testName: 'Adapter Initialization',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Login with Valid Credentials',
      description: 'Test login functionality with valid credentials',
      category: 'unit',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const authAdapter = adapter as unknown as AuthAdapter;
        const result = await authAdapter.login('test@example.com', 'password123');

        if (!result.success) {
          throw new Error('Login failed');
        }

        return {
          testName: 'Login with Valid Credentials',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Login with Invalid Credentials',
      description: 'Test login functionality with invalid credentials',
      category: 'unit',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const authAdapter = adapter as unknown as AuthAdapter;
        const result = await authAdapter.login('invalid@example.com', 'wrongpassword');

        if (result.success) {
          throw new Error('Login should have failed');
        }

        return {
          testName: 'Login with Invalid Credentials',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Get Current User',
      description: 'Test getting current authenticated user',
      category: 'unit',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const authAdapter = adapter as unknown as AuthAdapter;

        // First login
        await authAdapter.login('test@example.com', 'password123');

        // Then get current user
        const result = await authAdapter.getCurrentUser();

        if (!result.success || !result.data) {
          throw new Error('Failed to get current user');
        }

        return {
          testName: 'Get Current User',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Logout Functionality',
      description: 'Test logout functionality',
      category: 'unit',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const authAdapter = adapter as unknown as AuthAdapter;

        // First login
        await authAdapter.login('test@example.com', 'password123');

        // Then logout
        const result = await authAdapter.logout();

        if (!result.success) {
          throw new Error('Logout failed');
        }

        // Verify user is logged out
        const currentUser = await authAdapter.getCurrentUser();
        if (currentUser.success && currentUser.data) {
          throw new Error('User should not be logged in after logout');
        }

        return {
          testName: 'Logout Functionality',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Token Refresh',
      description: 'Test token refresh functionality',
      category: 'unit',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const authAdapter = adapter as unknown as AuthAdapter;

        // First login
        await authAdapter.login('test@example.com', 'password123');

        // Then refresh token
        const result = await authAdapter.refreshToken();

        if (!result.success) {
          throw new Error('Token refresh failed');
        }

        return {
          testName: 'Token Refresh',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
  ];

  return {
    name: 'Authentication Adapter Tests',
    description: 'Comprehensive test suite for authentication adapters',
    testCases,
    timeout: 30000,
  };
}

/**
 * Create blockchain adapter test suite
 */
export function createBlockchainTestSuite(): TestSuite {
  const testCases: AdapterTestCase[] = [
    {
      name: 'Adapter Initialization',
      description: 'Test that the blockchain adapter can be initialized',
      category: 'unit',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        await adapter.initialize({
          name: 'test-adapter',
          type: 'mock',
          feature: 'test',
          priority: 1,
          isActive: true,
          connection: {
            timeout: 5000,
            retry: {
              attempts: 3,
              delay: 1000,
              backoff: 'exponential',
            },
          },
          performance: {
            enableCache: true,
            cacheTTL: 300000,
            enableCompression: false,
          },
        } as _AdapterConfig);
        return {
          testName: 'Adapter Initialization',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Create Product Record',
      description: 'Test creating a product record on the blockchain',
      category: 'integration',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const blockchainAdapter = adapter as unknown as BlockchainAdapter;

        const product = {
          name: 'Test Product',
          category: 'Test Category',
          description: 'Test Description',
          location: 'Test Location',
          harvestDate: '2024-01-01',
          batchSize: 100,
        };

        const result = await blockchainAdapter.createProductRecord(
          product,
          'Test Farmer',
          '0x1234567890123456789012345678901234567890',
        );

        if (!result.success || !result.data) {
          throw new Error('Failed to create product record');
        }

        return {
          testName: 'Create Product Record',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Get Product History',
      description: 'Test retrieving product history from blockchain',
      category: 'integration',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const blockchainAdapter = adapter as unknown as BlockchainAdapter;

        // First create a product
        const product = {
          name: 'Test Product',
          category: 'Test Category',
        };

        const createResult = await blockchainAdapter.createProductRecord(
          product,
          'Test Farmer',
          '0x1234567890123456789012345678901234567890',
        );

        if (!createResult.success) {
          throw new Error('Failed to create product for history test');
        }

        // Then get history
        if (!createResult.data) {
          throw new Error('Create result data is null');
        }
        const historyResult = await blockchainAdapter.getProductHistory(createResult.data.id);

        if (!historyResult.success) {
          throw new Error('Failed to get product history');
        }

        return {
          testName: 'Get Product History',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Verify Product',
      description: 'Test product verification on blockchain',
      category: 'integration',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const blockchainAdapter = adapter as unknown as BlockchainAdapter;

        // First create a product
        const product = {
          name: 'Test Product',
          category: 'Test Category',
        };

        const createResult = await blockchainAdapter.createProductRecord(
          product,
          'Test Farmer',
          '0x1234567890123456789012345678901234567890',
        );

        if (!createResult.success) {
          throw new Error('Failed to create product for verification test');
        }

        if (!createResult.data) {
          throw new Error('Create result data is null');
        }

        const verifyResult = await blockchainAdapter.verifyProduct(
          createResult.data.id,
          'Test Inspector',
          '0x0987654321098765432109876543210987654321',
        );

        if (!verifyResult.success) {
          throw new Error('Failed to verify product');
        }

        return {
          testName: 'Verify Product',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Get Blockchain Status',
      description: 'Test getting blockchain network status',
      category: 'unit',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const blockchainAdapter = adapter as unknown as BlockchainAdapter;
        const result = await blockchainAdapter.getBlockchainStatus();

        if (!result.success || !result.data) {
          throw new Error('Failed to get blockchain status');
        }

        return {
          testName: 'Get Blockchain Status',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Get Transaction Details',
      description: 'Test getting transaction details',
      category: 'integration',
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const blockchainAdapter = adapter as unknown as BlockchainAdapter;

        // First create a product to get a transaction
        const product = {
          name: 'Test Product',
          category: 'Test Category',
        };

        const createResult = await blockchainAdapter.createProductRecord(
          product,
          'Test Farmer',
          '0x1234567890123456789012345678901234567890',
        );

        if (!createResult.success) {
          throw new Error('Failed to create product for transaction test');
        }

        // Then get transaction details
        const transactionResult = await blockchainAdapter.getTransaction(createResult.data?.txHash || '');

        if (!transactionResult.success) {
          throw new Error('Failed to get transaction details');
        }

        return {
          testName: 'Get Transaction Details',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
  ];

  return {
    name: 'Blockchain Adapter Tests',
    description: 'Comprehensive test suite for blockchain adapters',
    testCases,
    timeout: 60000,
  };
}

/**
 * Create performance test suite
 */
export function createPerformanceTestSuite(): TestSuite {
  const testCases: AdapterTestCase[] = [
    {
      name: 'Adapter Response Time',
      description: 'Test adapter response time under load',
      category: 'performance',
      timeout: 60000,
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const testFramework = adapterTestFramework;
        const iterations = 50;

        // Test a simple operation multiple times
        const metrics = await testFramework.runPerformanceTests(
          adapter,
          async (adapter: TestAdapter) => {
            if ('getCurrentUser' in adapter) {
              await (adapter as unknown as AuthAdapter).getCurrentUser();
              return { operation: 'getCurrentUser' };
            } else if ('getBlockchainStatus' in adapter) {
              await (adapter as unknown as BlockchainAdapter).getBlockchainStatus();
              return { operation: 'getBlockchainStatus' };
            } else {
              const health = await adapter.getHealth();
              return { available: health.isHealthy };
            }
          },
          iterations,
        );

        // Performance criteria
        if (metrics.avgResponseTime > 1000) {
          throw new Error(`Average response time too high: ${metrics.avgResponseTime}ms`);
        }

        if (metrics.p95ResponseTime > 2000) {
          throw new Error(`95th percentile response time too high: ${metrics.p95ResponseTime}ms`);
        }

        return {
          testName: 'Adapter Response Time',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
    {
      name: 'Memory Usage',
      description: 'Test adapter memory usage',
      category: 'performance',
      timeout: 30000,
      test: async (adapter: TestAdapter) => {
        const startTime = Date.now();
        const testFramework = adapterTestFramework;
        const iterations = 100;

        // Test memory usage over multiple operations
        const metrics = await testFramework.runPerformanceTests(
          adapter,
          async (adapter: TestAdapter) => {
            // Create test data to stress memory usage
            const testData = {
              name: 'Test Product '.repeat(10),
              description: 'Test Description '.repeat(20),
              metadata: Array(100).fill(0).map((_, i) => ({ key: `key${i}`, value: `value${i}` })),
            };

            if ('createProductRecord' in adapter) {
              await (adapter as unknown as BlockchainAdapter).createProductRecord(testData, 'Test Farmer', '0x1234567890123456789012345678901234567890');
              return { operation: 'createProductRecord', testData: testData };
            } else if ('login' in adapter) {
              await (adapter as unknown as AuthAdapter).login('test@example.com', 'password');
              return { operation: 'login', testData: testData };
            } else {
              return { testData: testData };
            }
          },
          iterations,
        );

        // Memory criteria (less than 10MB increase)
        const maxMemoryIncrease = 10 * 1024 * 1024; // 10MB
        if (metrics.memoryUsage && metrics.memoryUsage > maxMemoryIncrease) {
          throw new Error(`Memory usage too high: ${metrics.memoryUsage} bytes`);
        }

        return {
          testName: 'Memory Usage',
          passed: true,
          duration: Date.now() - startTime,
        };
      },
    },
  ];

  return {
    name: 'Performance Tests',
    description: 'Performance and load testing for adapters',
    testCases,
    timeout: 120000,
  };
}

/**
 * Register all predefined test suites
 */
export function registerPredefinedTestSuites(): void {
  adapterTestFramework.registerTestSuite(createAuthTestSuite());
  adapterTestFramework.registerTestSuite(createBlockchainTestSuite());
  adapterTestFramework.registerTestSuite(createPerformanceTestSuite());
}

/**
 * Get all predefined test suites
 */
export function getPredefinedTestSuites(): TestSuite[] {
  return [
    createAuthTestSuite(),
    createBlockchainTestSuite(),
    createPerformanceTestSuite(),
  ];
}
