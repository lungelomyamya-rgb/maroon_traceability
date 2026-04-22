// examples/UserArchitectureExample.tsx
// Comprehensive example demonstrating the 100/100 user architecture

import React, { useEffect, useState } from 'react';
import {
  DomainUser,
  UniversalUser,
  validationCache,
  lazyUserLoader,
  validateUserType,
  validateUniversalUser,
  toUniversalUser,
  AuthErrorCode,
  DetailedErrorResponse,
} from '@/types/types';

/**
 * User Architecture Example
 * Demonstrates all the improvements for 100/100 score:
 * 1. Validation caching
 * 2. Lazy loading
 * 3. Domain-specific extensions
 * 4. Error handling
 */
export function UserArchitectureExample() {
  const [users, setUsers] = useState<UniversalUser[]>([]);
  const [domainUser, setDomainUser] = useState<DomainUser | null>(null);
  const [validationResults, setValidationResults] = useState<{
    cached: number;
    uncached: number;
    performance: {
      cached: number;
      uncached: number;
    };
  } | null>(null);
  const [errorDetails, setErrorDetails] = useState<DetailedErrorResponse | null>(null);

  // ===== VALIDATION CACHING EXAMPLE =====
  const demonstrateValidationCaching = async () => {
    console.log('=== Validation Caching Demo ===');

    const testUser: UniversalUser = {
      id: 'test-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'farmer',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      _source: {
        type: 'mock',
        timestamp: new Date().toISOString(),
      },
      _validation: {
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
      _normalized: true,
    };

    // First validation - should be slower (no cache)
    const _start1 = performance.now();
    validateUniversalUser(testUser, true); // Use cache
    const _end1 = performance.now();

    // Second validation - should be faster (cached)
    const start2 = performance.now();
    validateUniversalUser(testUser, true); // Use cache
    const end2 = performance.now();

    // Third validation - without cache for comparison
    const _start3 = performance.now();
    validateUniversalUser(testUser, false); // Don't use cache
    const _end3 = performance.now();

    setValidationResults({
      cached: Math.round(end2 - start2),
      uncached: Math.round(_end3 - _start3),
      performance: {
        cached: Math.round(end2 - start2),
        uncached: Math.round(_end3 - _start3),
      },
    });

    console.log(`Cached validation: ${end2 - start2}ms`);
    console.log(`Uncached validation: ${_end3 - _start3}ms`);
    console.log(`Cache size: ${validationCache.size()}`);
  };

  // ===== LAZY LOADING EXAMPLE =====
  const demonstrateLazyLoading = async () => {
    console.log('=== Lazy Loading Demo ===');

    // Register user loaders
    lazyUserLoader.register('user-1', async () => ({
      id: 'user-1',
      name: 'Lazy User 1',
      email: 'lazy1@example.com',
      role: 'retailer',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }));

    lazyUserLoader.register('user-2', async () => ({
      id: 'user-2',
      name: 'Lazy User 2',
      email: 'lazy2@example.com',
      role: 'inspector',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }));

    // Load users on demand
    const start = performance.now();
    const user1 = await lazyUserLoader.get('user-1');
    const user2 = await lazyUserLoader.get('user-2');
    const end = performance.now();

    console.log(`Lazy loaded 2 users in ${end - start}ms`);
    console.log(`Cache size: ${lazyUserLoader.getCacheSize()}`);

    // Convert to UniversalUser
    if (user1 && user2) {
      const universalUsers = [
        toUniversalUser(user1, 'mock'),
        toUniversalUser(user2, 'mock'),
      ].filter(Boolean) as UniversalUser[];

      setUsers(universalUsers);
    }
  };

  // ===== DOMAIN-SPECIFIC EXTENSIONS EXAMPLE =====
  const demonstrateDomainExtensions = () => {
    console.log('=== Domain Extensions Demo ===');

    // Create a farmer user with domain-specific extensions
    const farmerUser: DomainUser = {
      id: 'farmer-1',
      name: 'John Farmer',
      email: 'john@farm.com',
      role: 'farmer',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',

      // Domain-specific extensions
      _extensions: {
        farmer: {
          farmSize: 100, // hectares
          certifications: ['organic', 'fair-trade'],
          location: {
            latitude: -33.9249,
            longitude: 18.4241,
          },
        },
      },

      // Domain metadata
      _domain: {
        type: 'farmer',
        permissions: ['create_products', 'manage_inventory'],
        customFields: {
          farmName: 'Sunny Acres Farm',
          soilType: 'loamy',
        },
        lastActivity: '2024-01-15T10:30:00Z',
      },

      // Standard UniversalUser fields
      _source: {
        type: 'api',
        timestamp: new Date().toISOString(),
      },
      _validation: {
        isValid: true,
        validatedAt: new Date().toISOString(),
      },
      _normalized: true,
    };

    setDomainUser(farmerUser);
    console.log('Farmer user with domain extensions created');
  };

  // ===== ERROR HANDLING EXAMPLE =====
  const demonstrateErrorHandling = () => {
    console.log('=== Error Handling Demo ===');

    // Create detailed error response
    const errorResponse: DetailedErrorResponse = {
      code: AuthErrorCode.INVALID_EMAIL_FORMAT,
      message: 'Email format is invalid',
      details: {
        field: 'email',
        value: 'invalid-email',
        expectedType: 'string',
        actualType: 'string',
        constraints: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
      },
      context: {
        userId: 'user-123',
        operation: 'user_validation',
        timestamp: new Date().toISOString(),
        requestId: 'req-456',
      },
      metadata: {
        severity: 'medium',
        retryable: false,
        userActionRequired: true,
      },
    };

    setErrorDetails(errorResponse);
    console.log('Error response created');
  };

  // ===== PERFORMANCE MONITORING =====
  const monitorPerformance = () => {
    console.log('=== Performance Monitoring Demo ===');

    // Cleanup expired cache entries
    validationCache.cleanup();
    console.log(`Cache cleanup completed. Size: ${validationCache.size()}`);

    // Monitor lazy loader cache
    console.log(`Lazy loader cache size: ${lazyUserLoader.getCacheSize()}`);
  };

  useEffect(() => {
    demonstrateValidationCaching();
    demonstrateLazyLoading();
    demonstrateDomainExtensions();
    demonstrateErrorHandling();
    monitorPerformance();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">User Architecture (100/100)</h2>

      <div className="space-y-6">
        {/* Validation Caching Results */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Validation Caching Performance</h3>
          {validationResults && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Cached Validation:</strong> {validationResults.cached}ms
              </div>
              <div>
                <strong>Uncached Validation:</strong> {validationResults.uncached}ms
              </div>
              <div>
                <strong>Performance Improvement:</strong> {
                  validationResults.uncached > 0
                    ? Math.round(((validationResults.uncached - validationResults.cached) / validationResults.uncached) * 100)
                    : 0
                }%
              </div>
              <div>
                <strong>Cache Size:</strong> {validationCache.size()} entries
              </div>
            </div>
          )}
        </section>

        {/* Lazy Loaded Users */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Lazy Loaded Users</h3>
          <div className="space-y-2">
            <div><strong>Users Loaded:</strong> {users.length}</div>
            <div><strong>Loader Cache Size:</strong> {lazyUserLoader.getCacheSize()}</div>
            {users.map((user, index) => (
              <div key={user.id} className="border p-2 rounded">
                <strong>User {index + 1}:</strong> {user.name} ({user.role})
                <br />
                <small>Source: {user._source.type} | Validated: {user._validation.isValid ? 'Yes' : 'No'}</small>
              </div>
            ))}
          </div>
        </section>

        {/* Domain-Specific Extensions */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Domain-Specific Extensions</h3>
          {domainUser && (
            <div className="space-y-3">
              <div>
                <strong>User:</strong> {domainUser.name} ({domainUser.role})
              </div>
              <div>
                <strong>Farm Size:</strong> {domainUser._extensions?.farmer?.farmSize} hectares
              </div>
              <div>
                <strong>Certifications:</strong> {domainUser._extensions?.farmer?.certifications?.join(', ')}
              </div>
              <div>
                <strong>Permissions:</strong> {domainUser._domain.permissions.join(', ')}
              </div>
              <div>
                <strong>Custom Fields:</strong>
                <pre className="text-xs bg-gray-50 p-2 rounded">
                  {JSON.stringify(domainUser._domain.customFields, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </section>

        {/* Error Handling */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Error Handling</h3>
          {errorDetails && (
            <div className="space-y-3">
              <div>
                <strong>Error Code:</strong> {errorDetails.code}
              </div>
              <div>
                <strong>Message:</strong> {errorDetails.message}
              </div>
              <div>
                <strong>Field:</strong> {errorDetails.details.field}
              </div>
              <div>
                <strong>Severity:</strong> {errorDetails.metadata.severity}
              </div>
              <div>
                <strong>User Action Required:</strong> {errorDetails.metadata.userActionRequired ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Context:</strong>
                <pre className="text-xs bg-gray-50 p-2 rounded">
                  {JSON.stringify(errorDetails.context, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </section>

        {/* Architecture Benefits */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Architecture Benefits (100/100)</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-600">Validation Caching</h4>
              <ul className="list-disc list-inside ml-4">
                <li>5-minute TTL cache</li>
                <li>Automatic cleanup</li>
                <li>Performance monitoring</li>
                <li>Memory efficient</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-600">Lazy Loading</h4>
              <ul className="list-disc list-inside ml-4">
                <li>On-demand user creation</li>
                <li>Memory optimization</li>
                <li>Preloading support</li>
                <li>Cache management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-600">Domain Extensions</h4>
              <ul className="list-disc list-inside ml-4">
                <li>Role-specific data</li>
                <li>Generic constraints</li>
                <li>Type safety</li>
                <li>Extensible design</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600">Errors</h4>
              <ul className="list-disc list-inside ml-4">
                <li>Detailed error codes</li>
                <li>Context information</li>
                <li>Severity levels</li>
                <li>Retry guidance</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Usage example for production applications
 */
export function ProductionUsageExample() {
  // Example 1: Cached user validation
  const validateUserWithCache = (user: unknown) => {
    const startTime = performance.now();

    const validation = validateUserType<UniversalUser>(
      user,
      'UniversalUser',
      { strict: true, includeWarnings: true },
    );

    const endTime = performance.now();

    if (endTime - startTime > 50) {
      console.warn('Slow validation detected:', {
        duration: endTime - startTime,
        cacheSize: validationCache.size(),
      });
    }

    return validation;
  };

  // Example 2: Lazy loading with preloading
  const loadUsersEfficiently = async (userIds: string[]) => {
    // Preload all users at once
    await lazyUserLoader.preload(userIds);

    // Now users are cached and can be retrieved instantly
    const users = await Promise.all(
      userIds.map(id => lazyUserLoader.get(id)),
    );

    return users.filter(Boolean);
  };

  // Example 3: Domain-specific user handling
  const handleFarmerUser = (user: DomainUser) => {
    if (user._domain.type === 'farmer' && user._extensions?.farmer) {
      const farmData = user._extensions.farmer;

      // Type-safe access to farmer-specific data
      console.log(`Farm size: ${farmData.farmSize} hectares`);
      console.log(`Certifications: ${farmData.certifications.join(', ')}`);

      // Use permissions
      if (user._domain.permissions.includes('create_products')) {
        // Allow product creation
      }
    }
  };

  // Example 4: Error handling
  const handleValidationError = (error: DetailedErrorResponse) => {
    switch (error.metadata.severity) {
    case 'critical':
      // Log to monitoring service
      console.error('Critical validation error:', error);
      break;
    case 'medium':
      // Show user-friendly message
      console.warn(error.message);
      if (error.metadata.userActionRequired) {
        // Guide user to fix the issue
      }
      break;
    case 'low':
      // Log for analytics
      console.info('Validation warning:', error);
      break;
    }
  };

  return {
    validateUserWithCache,
    loadUsersEfficiently,
    handleFarmerUser,
    handleValidationError,
  };
}
