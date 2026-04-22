// examples/RuntimeTypeGuardExample.tsx
// Comprehensive example demonstrating runtime type guards

import React, { useEffect, useState } from 'react';
import {
  UniversalUser,
  BaseUser,
  AuthUser,
  validateUserType,
  isUserTypeWithPerformance,
  validateUserBusinessRules,
  validateUserBatch,
  isBaseUser,
  isAuthUser,
  isMockUser,
  isUniversalUser,
  ValidationPerformance,
  BusinessRuleValidation,
  BatchValidationResult,
} from '@/types/types';

/**
 * Example component demonstrating comprehensive runtime type guard usage
 * Shows how to validate different user types at runtime
 */
export function RuntimeTypeGuardExample() {
  const [validationResults, setValidationResults] = useState<{
    basic: {
      baseUser: boolean;
      mockUser: boolean;
      authUser: boolean;
      universalUser: boolean;
    };
    enhanced: {
      detailed: Record<string, unknown>;
      performance: { isValid: boolean; data?: UniversalUser; performance: ValidationPerformance };
    };
    business: BusinessRuleValidation;
    batch: BatchValidationResult<BaseUser>;
  } | null>(null);
  const [testUsers, setTestUsers] = useState<unknown[]>([]);

  useEffect(() => {
    // Example user data from different sources
    const exampleUsers = {
      // Valid BaseUser
      validBaseUser: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'farmer',
      },

      // Invalid BaseUser (missing required fields)
      invalidBaseUser: {
        id: 'user-2',
        name: '', // Empty name
        email: 'invalid-email', // Invalid email format
        role: 'invalid-role', // Invalid role
      },

      // Valid MockUser
      validMockUser: {
        id: 'mock-1',
        name: 'Mock User',
        email: 'mock@example.com',
        role: 'inspector',
        password: 'password123',
        isMockUser: true,
        mockDataQuality: 'high',
        failedLoginAttempts: 0,
        accountLocked: false,
      },

      // Valid AuthUser
      validAuthUser: {
        id: 'auth-1',
        name: 'Auth User',
        email: 'auth@example.com',
        role: 'admin',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-15T10:30:00Z',
        emailVerified: true,
      },

      // Valid UniversalUser
      validUniversalUser: {
        id: 'universal-1',
        name: 'Universal User',
        email: 'universal@example.com',
        role: 'retailer' as const,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        _source: {
          type: 'api' as const,
          timestamp: '2024-01-01T00:00:00Z',
          adapterId: 'api-adapter',
          version: '1.0.0',
          latency: 150,
        },
        _validation: {
          isValid: true,
          validatedAt: '2024-01-01T00:00:00Z',
        },
        _normalized: true as const,
      },
    };

    // Demonstrate basic type guards
    console.log('=== Basic Type Guard Examples ===');

    // Test BaseUser validation
    const baseUserResult = isBaseUser(exampleUsers.validBaseUser);
    console.log('BaseUser validation (valid):', baseUserResult);

    const invalidBaseUserResult = isBaseUser(exampleUsers.invalidBaseUser);
    console.log('BaseUser validation (invalid):', invalidBaseUserResult);

    // Test MockUser validation
    const mockUserResult = isMockUser(exampleUsers.validMockUser);
    console.log('MockUser validation:', mockUserResult);

    // Test AuthUser validation
    const authUserResult = isAuthUser(exampleUsers.validAuthUser);
    console.log('AuthUser validation:', authUserResult);

    // Test UniversalUser validation
    const universalUserResult = isUniversalUser(exampleUsers.validUniversalUser);
    console.log('UniversalUser validation:', universalUserResult);

    // Demonstrate validation with detailed reporting
    console.log('\n=== Validation Examples ===');

    // Validate with detailed error reporting
    const detailedValidation = validateUserType<AuthUser>(
      exampleUsers.validAuthUser,
      'AuthUser',
      { strict: true, includeWarnings: true },
    );
    console.log('Detailed AuthUser validation:', detailedValidation);

    // Validate with performance monitoring
    const performanceValidation = isUserTypeWithPerformance(
      exampleUsers.validUniversalUser,
      isUniversalUser,
      'UniversalUser',
    );
    console.log('Performance-monitored validation:', performanceValidation);

    // Demonstrate business rule validation
    console.log('\n=== Business Rule Validation ===');
    const businessValidation = validateUserBusinessRules(exampleUsers.validUniversalUser);
    console.log('Business rule validation:', businessValidation);

    // Demonstrate batch validation
    console.log('\n=== Batch Validation Example ===');
    const usersToValidate = [
      exampleUsers.validBaseUser,
      exampleUsers.validMockUser,
      exampleUsers.validAuthUser,
      exampleUsers.invalidBaseUser,
    ];

    const batchValidation = validateUserBatch(
      usersToValidate,
      isBaseUser,
      { stopOnFirstError: false },
    );
    console.log('Batch validation results:', batchValidation);

    // Store results for display
    setValidationResults({
      basic: {
        baseUser: baseUserResult,
        mockUser: mockUserResult,
        authUser: authUserResult,
        universalUser: universalUserResult,
      },
      enhanced: {
        detailed: detailedValidation,
        performance: performanceValidation,
      },
      business: businessValidation,
      batch: batchValidation,
    });

    setTestUsers(usersToValidate);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Runtime Type Guard Examples</h2>

      <div className="space-y-6">
        {/* Basic Validation Results */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Basic Type Guard Results</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>BaseUser (Valid):</strong>
              <pre className="mt-1 p-2 bg-green-50 rounded">
                {JSON.stringify(validationResults?.basic?.baseUser || {}, null, 2)}
              </pre>
            </div>
            <div>
              <strong>MockUser:</strong>
              <pre className="mt-1 p-2 bg-green-50 rounded">
                {JSON.stringify(validationResults?.basic?.mockUser || {}, null, 2)}
              </pre>
            </div>
            <div>
              <strong>AuthUser:</strong>
              <pre className="mt-1 p-2 bg-green-50 rounded">
                {JSON.stringify(validationResults?.basic?.authUser || {}, null, 2)}
              </pre>
            </div>
            <div>
              <strong>UniversalUser:</strong>
              <pre className="mt-1 p-2 bg-green-50 rounded">
                {JSON.stringify(validationResults?.basic?.universalUser || {}, null, 2)}
              </pre>
            </div>
          </div>
        </section>

        {/* Validation */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Validation</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Detailed AuthUser Validation:</h4>
              <pre className="p-2 bg-blue-50 rounded text-sm">
                {JSON.stringify(validationResults?.enhanced?.detailed || {}, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium">Performance-Monitored Validation:</h4>
              <pre className="p-2 bg-blue-50 rounded text-sm">
                {JSON.stringify(validationResults?.enhanced?.performance || {}, null, 2)}
              </pre>
            </div>
          </div>
        </section>

        {/* Business Rule Validation */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Business Rule Validation</h3>
          <div className="space-y-2">
            <div>
              <strong>Compliance Score:</strong> {validationResults?.business?.score || 0}/100
            </div>
            <div>
              <strong>Valid:</strong> {validationResults?.business?.isValid ? 'Yes' : 'No'}
            </div>
            {validationResults?.business?.warnings && validationResults.business.warnings.length > 0 && (
              <div>
                <strong>Warnings:</strong>
                <ul className="list-disc list-inside ml-4">
                  {validationResults.business.warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-yellow-600">{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Batch Validation */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Batch Validation Results</h3>
          <div className="text-sm">
            <div><strong>Total Processed:</strong> {validationResults?.batch?.totalProcessed || 0}</div>
            <div><strong>Valid Count:</strong> {validationResults?.batch?.validCount || 0}</div>
            <div><strong>Invalid Count:</strong> {validationResults?.batch?.invalidCount || 0}</div>
            <div><strong>Success Rate:</strong> {((validationResults?.batch?.successRate || 0) * 100).toFixed(1)}%</div>
            {validationResults?.batch?.errors && validationResults.batch.errors.length > 0 && (
              <div>
                <strong>Errors:</strong>
                <ul className="list-disc list-inside ml-4">
                  {validationResults.batch.errors.map((error: { index: number; error: string }, index: number) => (
                    <li key={index} className="text-red-600">
                      Index {error.index}: {error.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Test Users Display */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Test Users Data</h3>
          <div className="space-y-2">
            {testUsers.map((user, index) => (
              <div key={index} className="border p-3 rounded">
                <strong>User {index + 1}:</strong>
                <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Usage example for runtime type guards in different contexts
 */
export function TypeGuardUsageExamples() {
  // Example 1: Safe API response handling
  const handleApiResponse = (response: unknown) => {
    const validation = validateUserType<UniversalUser>(response, 'UniversalUser');

    if (!validation.isValid) {
      console.error('Invalid API response:', validation.errors);
      return null;
    }

    return validation.data; // Type-safe UniversalUser
  };

  // Example 2: Form data validation
  const validateRegistrationForm = (formData: unknown) => {
    const validation = validateUserType<BaseUser>(formData, 'BaseUser', { strict: true });

    if (!validation.isValid) {
      throw new Error(`Invalid form data: ${validation.errors.join(', ')}`);
    }

    return validation.data; // Type-safe BaseUser
  };

  // Example 3: Component prop validation
  const validateUserProp = (userProp: unknown) => {
    // Quick type guard for component props
    if (!isBaseUser(userProp)) {
      console.warn('Invalid user prop provided');
      return null;
    }

    return userProp; // Type-safe BaseUser
  };

  // Example 4: Performance monitoring in production
  const monitorUserValidation = (user: unknown) => {
    const result = isUserTypeWithPerformance(
      user,
      isUniversalUser,
      'UniversalUser',
    );

    // Log performance metrics in production
    if (process.env.NODE_ENV === 'production' && result.performance.duration > 50) {
      console.warn('Slow user validation detected:', result.performance);
    }

    return result;
  };

  return {
    handleApiResponse,
    validateRegistrationForm,
    validateUserProp,
    monitorUserValidation,
  };
}
