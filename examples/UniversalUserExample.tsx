// examples/UniversalUserExample.tsx
// Example demonstrating UniversalUser interface usage in UI components

'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/userContext';
import { UniversalUser, isUniversalUser, AuthAdapterError, AuthErrorCode, toUniversalUser, MockUser } from '@/types/types';


/**
 * Example component showing how to use UniversalUser in UI
 * This component works with any user data source (mock, API, cache, etc.)
 */
export function UserProfileCard() {
  const { user, loading } = useAuth();
  const [_metrics, _setMetrics] = useState<Record<string, unknown> | null>(null);

  // Example: Get performance metrics
  useEffect(() => {
    if (user) {
      // Metrics functionality not yet implemented
      _setMetrics({ message: 'Metrics not yet available' });
    }
  }, [user]);

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  // Type safety guaranteed - user is always UniversalUser here
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Source tracking and security info */}
      {process.env.NODE_ENV === 'development' && isUniversalUser(user) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Data source: {user._source?.type || 'unknown'}
          </p>
          <p className="text-xs text-gray-500">
            Normalized: {user._normalized ? 'Yes' : 'No'}
          </p>
          <p className="text-xs text-gray-500">
            Adapter: {user._source?.adapterId || 'unknown'}
          </p>
          <p className="text-xs text-gray-500">
            Latency: {user._source?.latency || 0}ms
          </p>
          <p className="text-xs text-gray-500">
            Validated: {user._validation?.isValid ? 'Yes' : 'No'}
          </p>
          {(() => {
            const security = (user as unknown as Record<string, unknown>)._security as Record<string, unknown>;
            return security?.dataClassification ? (
              <p className="text-xs text-gray-500">
                Classification: {security.dataClassification as string}
              </p>
            ) : null;
          })()}
        </div>
      )}

      {/* Conditional rendering based on available data */}
      {user.address && (
        <div className="mt-4">
          <h3 className="font-medium">Address</h3>
          <p className="text-gray-600">
            {typeof user.address === 'string'
              ? user.address
              : user.address.formatted || 'Address available'}
          </p>
        </div>
      )}

      {user.permissions && (
        <div className="mt-4">
          <h3 className="font-medium">Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(user.permissions).map(([key, value]) => (
              value && (
                <span
                  key={key}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                >
                  {key}
                </span>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example of processing user data from different sources
 */
export function UserProcessor({ userData }: { userData: unknown }) {
  const { user } = useAuth();

  // Example of using type guards with unknown data
  const processUserData = (data: unknown): UniversalUser | null => {
    if (isUniversalUser(data)) {
      return data;
    }
    return null;
  };

  const processedUser = processUserData(userData);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">User Data Processing</h3>

      {/* Current authenticated user */}
      <div className="bg-green-50 p-4 rounded">
        <h4 className="font-medium text-green-800">Current User (from context)</h4>
        {user ? (
          <pre className="text-sm text-green-700">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p className="text-green-700">No user logged in</p>
        )}
      </div>

      {/* Processed user data */}
      <div className="bg-blue-50 p-4 rounded">
        <h4 className="font-medium text-blue-800">Processed User Data</h4>
        {processedUser ? (
          <div>
            <p className="text-blue-700">
              Successfully processed user: {processedUser.name}
            </p>
            <p className="text-sm text-blue-600">
              Source: {processedUser._source?.type || 'unknown'}
            </p>
          </div>
        ) : (
          <p className="text-blue-700">Invalid user data provided</p>
        )}
      </div>
    </div>
  );
}

/**
 * Example of UniversalUser creation with security and performance
 */
export function UserCreator() {
  const [creationResult, setCreationResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [_metrics, _setMetrics] = useState<Record<string, unknown> | null>(null);

  const createUniversalUserExample = async () => {
    try {
      // Example: Create user from fragmented data sources
      const partialData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'farmer' as const,
      };

      const additionalData = {
        address: '123 Farm Road, Countryside',
        phone: '+1-555-0123',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Creation with security metadata
      const mockUser = {
        ...partialData,
        ...additionalData,
        password: 'temp123',
        isMockUser: true as const,
        mockDataQuality: 'high' as const,
        testScenario: 'example-creation',
        lastUpdated: new Date().toISOString(),
        failedLoginAttempts: 0,
        accountLocked: false,
        loginMethod: 'password' as const,
        mfaEnabled: false,
      } as MockUser; // Type assertion for mock user

      // Use toUniversalUser transformation
      const universalUser = toUniversalUser(mockUser, 'mock', {
        adapterId: 'example-creator',
      });

      if (universalUser) {
        setCreationResult(`Successfully created UniversalUser: ${universalUser.name}`);
        setError('');
      } else {
        setError('Failed to create user: Unknown error');
        setCreationResult('');
      }
    } catch (err) {
      setError(`❌ Exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setCreationResult('');
    }
  };

  const demonstrateErrorHandling = () => {
    try {
      // Example of standardized error handling
      const error = new AuthAdapterError(
        'Example error for demonstration',
        AuthErrorCode.VALIDATION_FAILED,
        'example-adapter',
        { field: 'email', value: 'invalid-email' },
      );

      console.log('Structured error:', error.toJSON());
      setError(`Error demo: ${error.message} (Code: ${error.code})`);
    } catch (err) {
      setError(`Error in error demo: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  };

  return (
    <div className="bg-yellow-50 p-4 rounded">
      <h3 className="font-medium text-yellow-800">User Creation Example</h3>
      <p className="text-yellow-700 mb-2">
        Demonstrates UniversalUser creation with security metadata and performance tracking
      </p>

      <div className="space-y-2">
        <button
          onClick={createUniversalUserExample}
          className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
        >
          Create UniversalUser with Features
        </button>

        <button
          onClick={demonstrateErrorHandling}
          className="px-4 py-2 bg-orange-200 text-orange-800 rounded hover:bg-orange-300"
        >
          Demonstrate Error Handling
        </button>
      </div>

      {creationResult && (
        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-sm">
          {creationResult}
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-800 rounded text-sm">
          {error}
        </div>
      )}

      {_metrics && (
        <div className="mt-2 p-2 bg-blue-100 text-blue-800 rounded text-xs">
          <strong>Performance Metrics:</strong>
          <div>Avg Transformation: {((_metrics.averageTimes as Record<string, unknown>)?.transformation as number)?.toFixed(2) || '0'}ms</div>
          <div>Success Rate: {(((_metrics.successRates as Record<string, unknown>)?.transformation as number) * 100).toFixed(1)}%</div>
          <div>Total Operations: {(_metrics.operations as unknown as Array<unknown>)?.length || 0}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Main example component
 */
export default function UniversalUserExample() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">UniversalUser Interface Examples</h1>

      <UserProfileCard />

      <UserProcessor userData={{ id: 'test', name: 'Test User' }} />

      <UserCreator />

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Architecture Benefits:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Works with any data source (mock, API, cache, localStorage)</li>
          <li>✅ Type-safe with full TypeScript support</li>
          <li>✅ Optional fields for maximum flexibility</li>
          <li>✅ Source tracking with performance metrics</li>
          <li>✅ Runtime type validation with detailed error reporting</li>
          <li>✅ UI components don't need to know data origin</li>
          <li>🆕 Security metadata for compliance and auditing</li>
          <li>🆕 Performance monitoring and caching</li>
          <li>🆕 Standardized error handling with error codes</li>
          <li>🆕 Memoization for improved performance</li>
        </ul>
      </div>
    </div>
  );
}
