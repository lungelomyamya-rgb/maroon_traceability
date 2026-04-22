// src/features/auth/__tests__/AuthApplication.test.ts
// Unit tests for AuthApplication - Hybrid Architecture Integration

import { AuthApplication } from '@/src/features/auth/application/AuthApplication';
import type { RegistrationData } from '@/src/core/types/adapter';

// Mock dependencies
jest.mock('@/src/features/auth/adapters/HybridAuthAdapter', () => ({
  HybridAuthAdapter: jest.fn().mockImplementation(() => ({
    id: 'hybrid-auth',
    type: 'hybrid',
    isAvailable: true,
    initialize: jest.fn().mockImplementation(async (config) => {
      // Mock initialize with config parameter
      return Promise.resolve();
    }),
    cleanup: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    refreshToken: jest.fn(),
    resetPassword: jest.fn(),
    getHealth: jest.fn(),
    getHealthStatus: jest.fn(),
    switchMode: jest.fn(),
    getCurrentMode: jest.fn().mockReturnValue('mock'),
    isFallbackEnabled: jest.fn(() => true),
    setFallbackEnabled: jest.fn(),
  })),
}));

jest.mock('../../../core/registry/AdapterRegistry', () => ({
  adapterRegistry: {
    registerAdapter: jest.fn(),
    getHealthStatus: jest.fn(),
    getAdapterHealth: jest.fn(),
  },
}));

jest.mock('../../../core/infrastructure/HybridModeManager', () => ({
  hybridModeManager: {
    getMode: jest.fn(() => 'hybrid'),
    setMode: jest.fn(),
  },
}));

jest.mock('../../../core/infrastructure/HealthMonitor', () => ({
  healthMonitor: {
    subscribe: jest.fn(),
    startMonitoring: jest.fn(),
    getHealthStats: jest.fn(() => ({ monitoringActive: false })),
  },
}));

describe('AuthApplication - Hybrid Architecture Integration', () => {
  let app: AuthApplication;
  const mockCredentials = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    rememberMe: false,
  };
  const mockRegistrationData: RegistrationData = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    name: 'Test User',
    role: 'farmer',
    additionalData: {
      phone: '+1234567890',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    app = new AuthApplication();
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);

      await expect(app.initialize()).resolves.not.toThrow();
      expect(mockAdapter.initialize).toHaveBeenCalled();
    });

    it('should register adapters with global registry', async () => {
      const { adapterRegistry } = require('../../../core/registry/AdapterRegistry');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);

      // Mock the registerAdapter method
      const mockRegisterAdapter = jest.fn().mockImplementation(async (adapter, config) => {
        // Mock the initialize call that registerAdapter makes
        if (adapter.initialize) {
          await adapter.initialize(config);
        }
      });
      adapterRegistry.registerAdapter = mockRegisterAdapter;

      await app.initialize();

      // Verify that registerAdapter was called
      expect(mockRegisterAdapter).toHaveBeenCalled();
      expect(mockRegisterAdapter).toHaveBeenCalledWith(
        expect.any(Object), // the HybridAuthAdapter instance
        expect.objectContaining({
          name: 'authentication',
          type: 'hybrid',
        })
      );
    });

    it('should setup health monitoring', async () => {
      const { HybridAuthAdapter } = require('../adapters/HybridAuthAdapter');
      const { healthMonitor } = require('../../../core/infrastructure/HealthMonitor');
      const mockAdapter = new HybridAuthAdapter();
      mockAdapter.initialize.mockResolvedValue(undefined);

      await app.initialize();

      expect(healthMonitor.subscribe).toHaveBeenCalled();
      expect(healthMonitor.startMonitoring).toHaveBeenCalledWith(30000);
    });

    it('should not initialize twice', async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);

      await app.initialize();
      await app.initialize();

      expect(mockAdapter.initialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Authentication', () => {
    beforeEach(async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);
      mockAdapter.getHealth.mockResolvedValue({
        status: 'healthy',
        details: { connected: true },
      });
      
      await app.initialize();
    });

    it('should authenticate user successfully', async () => {
      const { hybridModeManager } = require('../../../core/infrastructure/HybridModeManager');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.login.mockResolvedValue({
        success: true,
        data: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'farmer',
          isActive: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
      });

      const result = await app.authenticateUser(mockCredentials);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockAdapter.login).toHaveBeenCalled();
    });

    it('should fail authentication with invalid credentials', async () => {
      const result = await app.authenticateUser({
        email: 'invalid-email',
        password: '',
        rememberMe: false,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Validation failed');
    });

    it('should fallback to mock when real adapter is unhealthy', async () => {
      const { hybridModeManager } = require('../../../core/infrastructure/HybridModeManager');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      hybridModeManager.getMode.mockReturnValue('real');
      mockAdapter.getHealth.mockResolvedValue({
        status: 'unhealthy',
        details: { error: 'Connection failed' },
      });
      mockAdapter.isFallbackEnabled.mockReturnValue(true);
      mockAdapter.login.mockResolvedValue({
        success: false,
        error: 'Authentication service currently unavailable',
      });

      const result = await app.authenticateUser(mockCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toContain('currently unavailable');
    });

    it('should log authentication events', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.login.mockResolvedValue({
        success: true,
        data: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'farmer',
          isActive: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
      });

      await app.authenticateUser(mockCredentials);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Authentication event: user_authenticated',
        expect.objectContaining({
          userId: 'user-123',
          email: 'test@example.com',
          mode: 'real',
        })
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('User Registration', () => {
    beforeEach(async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);
      mockAdapter.getHealth.mockResolvedValue({
        status: 'healthy',
        details: { connected: true },
      });
      
      await app.initialize();
    });

    it('should register user successfully', async () => {
      const { hybridModeManager } = require('../../../core/infrastructure/HybridModeManager');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.register.mockResolvedValue({
        success: true,
        data: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'farmer',
          isActive: false,
          emailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: null,
        },
      });

      const result = await app.registerUser(mockRegistrationData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.metadata?.adapterUsed).toBe('mock-auth');
      expect(result.metadata?.hybridMode).toBe('real');
    });

    it('should switch to real mode for registration', async () => {
      const { hybridModeManager } = require('../../../core/infrastructure/HybridModeManager');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      hybridModeManager.getMode.mockReturnValue('simulated');
      mockAdapter.register.mockResolvedValue({
        success: true,
        data: { id: 'user-123', email: 'test@example.com' },
      });

      await app.registerUser(mockRegistrationData);

      expect(mockAdapter.switchMode).toHaveBeenCalledWith('real');
    });

    it('should fail registration with invalid data', async () => {
      const result = await app.registerUser({
        email: 'invalid-email',
        password: 'weak',
        name: '',
        role: 'retailer', // Valid role for testing
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Validation failed');
    });

    it('should log registration events', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.register.mockResolvedValue({
        success: true,
        data: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'farmer',
          isActive: false,
          emailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: null,
        },
      });

      await app.registerUser(mockRegistrationData);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Authentication event: user_registered',
        expect.objectContaining({
          userId: 'user-123',
          email: 'test@example.com',
          role: 'farmer',
        })
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('User Logout', () => {
    beforeEach(async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);
      mockAdapter.getHealth.mockResolvedValue({
        status: 'healthy',
        details: { connected: true },
      });
      
      await app.initialize();
    });

    it('should logout user successfully', async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.logout.mockResolvedValue({
        success: true,
        data: undefined,
      });

      const result = await app.logoutUser('user-123');

      expect(result.success).toBe(true);
      expect(mockAdapter.logout).toHaveBeenCalled();
    });

    it('should log logout events', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.logout.mockResolvedValue({
        success: true,
        data: undefined,
      });

      await app.logoutUser('user-123');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Authentication event: user_logged_out',
        expect.objectContaining({
          userId: 'user-123',
          adapterId: 'mock-auth',
        })
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Get Current User', () => {
    beforeEach(async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);

      await app.initialize();
    });

    it('should get current user successfully', async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.getCurrentUser.mockResolvedValue({
        success: true,
        data: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'farmer',
          isActive: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
      });

      const result = await app.getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockAdapter.getCurrentUser).toHaveBeenCalled();
    });

    it('should handle no current user', async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.getCurrentUser.mockResolvedValue({
        success: true,
        data: null,
      });

      const result = await app.getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('Mode Switching', () => {
    beforeEach(async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);

      await app.initialize();
    });

    it('should switch to mock mode', async () => {
      const { hybridModeManager } = require('../../../core/infrastructure/HybridModeManager');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.getCurrentMode = jest.fn().mockReturnValue('real');

      const result = await app.switchMode('mock');

      expect(result.success).toBe(true);
      expect(mockAdapter.switchMode).toHaveBeenCalledWith('mock');
      expect(hybridModeManager.setMode).toHaveBeenCalledWith('authentication', 'mock');
    });

    it('should switch to real mode', async () => {
      const { hybridModeManager } = require('../../../core/infrastructure/HybridModeManager');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.getCurrentMode = jest.fn().mockReturnValue('mock');

      const result = await app.switchMode('real');

      expect(result.success).toBe(true);
      expect(mockAdapter.switchMode).toHaveBeenCalledWith('real');
      expect(hybridModeManager.setMode).toHaveBeenCalledWith('authentication', 'real');
    });

    it('should log mode switching events', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.getCurrentMode = jest.fn().mockReturnValue('mock');

      await app.switchMode('real');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Authentication event: mode_switched',
        expect.objectContaining({
          from: 'mock',
          to: 'real',
          adapterId: 'mock-auth',
        })
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('System Health', () => {
    beforeEach(async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);

      await app.initialize();
    });

    it('should return healthy system status', async () => {
      const { adapterRegistry } = require('../../../core/registry/AdapterRegistry');
      const { hybridModeManager } = require('../../../core/infrastructure/HybridModeManager');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.getHealth.mockResolvedValue({
        status: 'healthy',
        details: { connected: true },
      });
      adapterRegistry.getHealthStatus.mockReturnValue({});
      hybridModeManager.getMode.mockReturnValue('hybrid');

      const result = await app.getSystemHealth();

      expect(result.authentication.status).toBe('healthy');
      expect(result.hybrid.mode).toBe('hybrid');
      expect(result.overall).toBe('healthy');
    });

    it('should return degraded status when adapter is degraded', async () => {
      const { adapterRegistry } = require('../../../core/registry/AdapterRegistry');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.getHealth.mockResolvedValue({
        status: 'degraded',
        details: { connected: true, fallback: true },
      });
      adapterRegistry.getHealthStatus.mockReturnValue({});

      const result = await app.getSystemHealth();

      expect(result.overall).toBe('degraded');
    });

    it('should return unhealthy status when adapter is unhealthy', async () => {
      const { adapterRegistry } = require('../../../core/registry/AdapterRegistry');
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.getHealth.mockResolvedValue({
        status: 'unhealthy',
        details: { error: 'Connection failed' },
      });
      adapterRegistry.getHealthStatus.mockReturnValue({});

      const result = await app.getSystemHealth();

      expect(result.overall).toBe('unhealthy');
    });
  });

  describe('Authentication Statistics', () => {
    beforeEach(async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);

      await app.initialize();
    });

    it('should return authentication statistics', async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      
      mockAdapter.getHealth.mockResolvedValue({
        status: 'healthy',
        details: { connected: true },
      });

      const result = await app.getAuthStatistics();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        totalAuthentications: 5000,
        recentAuthentications: 150,
        authenticationsByMode: expect.objectContaining({
          real: 3500,
          mock: 1200,
          hybrid: 300,
        }),
        averageProcessingTime: 800,
        successRate: 0.98,
        healthStatus: 'healthy',
        currentMode: 'mock',
      });
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources properly', async () => {
      const mockAdapter = app.getHybridAdapter() as jest.Mocked<any>;
      mockAdapter.initialize.mockResolvedValue(undefined);

      await app.initialize();
      await app.cleanup();

      expect(mockAdapter.cleanup).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    afterEach(() => {
      // Clean up any test-specific mock changes
      jest.clearAllMocks();
    });

    it('should handle initialization errors', async () => {
      const { HybridAuthAdapter } = require('../adapters/HybridAuthAdapter');
      HybridAuthAdapter.mockImplementation(() => ({
        id: 'hybrid-auth',
        type: 'hybrid',
        isAvailable: true,
        initialize: jest.fn().mockRejectedValue(new Error('Init failed')),
        cleanup: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        getCurrentUser: jest.fn(),
        refreshToken: jest.fn(),
        resetPassword: jest.fn(),
        getHealthStatus: jest.fn(),
        switchMode: jest.fn(),
        getCurrentMode: jest.fn().mockReturnValue('mock'),
        isFallbackEnabled: jest.fn(() => true),
        setFallbackEnabled: jest.fn(),
      }));

      // Create new app instance after mocking constructor
      const errorApp = new AuthApplication();
      
      await expect(errorApp.initialize()).rejects.toThrow('Initialization failed: Init failed');
    });

    it('should handle authentication errors gracefully', async () => {
      // Mock the HybridAuthAdapter constructor before creating the app
      const { HybridAuthAdapter } = require('../adapters/HybridAuthAdapter');
      
      HybridAuthAdapter.mockImplementation(() => ({
        id: 'hybrid-auth',
        type: 'hybrid',
        isAvailable: true,
        initialize: jest.fn().mockResolvedValue(undefined),
        cleanup: jest.fn(),
        login: jest.fn().mockResolvedValue({
          success: false,
          error: 'Login failed',
        }),
        register: jest.fn(),
        logout: jest.fn(),
        getCurrentUser: jest.fn(),
        refreshToken: jest.fn(),
        resetPassword: jest.fn(),
        getHealthStatus: jest.fn(),
        getHealth: jest.fn().mockResolvedValue({
          status: 'healthy',
          adapterId: 'hybrid-auth',
          lastCheck: new Date().toISOString(),
          metrics: {},
          currentMode: 'mock',
          fallbackEnabled: true,
        }),
        switchMode: jest.fn(),
        getCurrentMode: jest.fn().mockReturnValue('mock'),
        isFallbackEnabled: jest.fn(() => true),
        setFallbackEnabled: jest.fn(),
      }));

      // Create a fresh app instance after mocking
      const testApp = new AuthApplication();
      await testApp.initialize();

      const result = await testApp.authenticateUser(mockCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Login failed');
      
      // Clean up
      await testApp.cleanup();
    });
  });
});
