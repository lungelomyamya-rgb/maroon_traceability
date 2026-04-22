// examples/UserTypeConsistencyExample.tsx
// Example demonstrating perfect UI consistency between mock and real user data

import React from 'react';
import { toUIUser, UIUser } from '@/types/types';

// Mock user data (simulated)
const mockUserData = {
  id: 'mock-1',
  name: 'John Farmer',
  email: 'john@farm.com',
  password: 'password123',
  role: 'farmer' as const,
  address: {
    street: '123 Farm Road',
    city: 'Stellenbosch',
    state: 'Western Cape',
    postalCode: '7600',
    country: 'South Africa',
    formatted: '123 Farm Road, Stellenbosch, Western Cape 7600, South Africa',
  },
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  emailVerified: true,
  isMockUser: true as const,
  mockDataQuality: 'high' as const,
  testScenario: 'demo-user',
  lastUpdated: '2024-01-01T00:00:00Z',
  failedLoginAttempts: 0,
  accountLocked: false,
  loginMethod: 'password' as const,
  mfaEnabled: false,
};

// API user data (real)
const apiUserData = {
  user: {
    id: 'api-1',
    name: 'Jane Inspector',
    email: 'jane@inspect.gov',
    role: 'inspector' as const,
    address: {
      street: '456 Government Ave',
      city: 'Cape Town',
      state: 'Western Cape',
      postalCode: '8001',
      country: 'South Africa',
      formatted: '456 Government Ave, Cape Town, Western Cape 8001, South Africa',
    },
    phone: '+27 21 123 4567',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    lastLoginAt: '2024-01-20T10:30:00Z',
    emailVerified: true,
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canVerify: true,
      canView: true,
      canExport: true,
    },
  },
  token: 'jwt-token-here',
  sessionExpiresAt: '2024-01-22T00:00:00Z',
  responseTime: 150,
  apiVersion: 'v1.0.0',
  requestId: 'req-123456',
};

/**
 * Example component showing perfect UI consistency
 */
export function UserTypeConsistencyExample() {
  // Transform mock data to UIUser
  const mockUIUser = toUIUser(mockUserData);

  // Transform API data to UIUser
  const apiUIUser = toUIUser(apiUserData.user);

  // Both users now have identical structure!
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Type Consistency Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mock User Card */}
        {mockUIUser && <UserCard user={mockUIUser} title="Mock User" />}

        {/* API User Card */}
        {apiUIUser && <UserCard user={apiUIUser} title="API User" />}
      </div>

      <ConsistencyComparison mockUser={mockUIUser} apiUser={apiUIUser} />
    </div>
  );
}

/**
 * User card component that works with ANY user source
 */
interface UserCardProps {
  user: UIUser;
  title: string;
}

function UserCard({ user, title }: UserCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      {/* User Info - Same structure regardless of source */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          {/* Avatar with fallback to initials */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: user.roleColor }}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.displayName} className="w-12 h-12 rounded-full" />
            ) : (
              user.initials
            )}
          </div>

          <div>
            <div className="font-medium">{user.displayName}</div>
            <div className="text-sm text-gray-600">{user.roleDisplay}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: user.statusColor }}
          />
          <span className="text-sm capitalize">{user.status}</span>
        </div>

        {/* User role and status */}
        <div className="text-xs text-gray-500">
          Role: {user.roleDisplay} | Status: {user.status}
        </div>
      </div>
    </div>
  );
}

/**
 * Component showing consistency comparison
 */
interface ConsistencyComparisonProps {
  mockUser: UIUser | null;
  apiUser: UIUser | null;
}

function ConsistencyComparison({ mockUser, apiUser }: ConsistencyComparisonProps) {
  if (!mockUser || !apiUser) {
    return null;
  }

  const comparisonData = [
    { field: 'id', mock: mockUser.id, api: apiUser.id },
    { field: 'name', mock: mockUser.name, api: apiUser.name },
    { field: 'email', mock: mockUser.email, api: apiUser.email },
    { field: 'role', mock: mockUser.role, api: apiUser.role },
    { field: 'displayName', mock: mockUser.displayName, api: apiUser.displayName },
    { field: 'roleDisplay', mock: mockUser.roleDisplay, api: apiUser.roleDisplay },
    { field: 'initials', mock: mockUser.initials, api: apiUser.initials },
    { field: 'status', mock: mockUser.status, api: apiUser.status },
    { field: 'isActive', mock: mockUser.isActive, api: apiUser.isActive },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Structure Consistency Check</h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Field</th>
              <th className="px-4 py-2 text-left">Mock User</th>
              <th className="px-4 py-2 text-left">API User</th>
              <th className="px-4 py-2 text-left">Consistent</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map(({ field, mock, api }) => (
              <tr key={field} className="border-t">
                <td className="px-4 py-2 font-medium">{field}</td>
                <td className="px-4 py-2">{String(mock)}</td>
                <td className="px-4 py-2">{String(api)}</td>
                <td className="px-4 py-2">
                  {typeof mock === typeof api ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Key Benefits:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✓ Same structure regardless of data source</li>
          <li>✓ Same computed properties (displayName, initials, etc.)</li>
          <li>✓ Same type safety and IntelliSense</li>
          <li>✓ Same validation and quality scoring</li>
          <li>✓ UI components don't need to know data origin</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Usage examples for different scenarios
 */
export function UsageExamples() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Usage Examples</h2>

      {/* Example 1: Direct transformation */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">1. Direct Transformation</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {`// Transform any user data source
const uiUser = toUIUser(userData, 'api');

// Or use specific methods
const mockUser = UIUserAdapter.fromMock(mockData);
const apiUser = UIUserAdapter.fromAPI(apiResponse);
const universalUser = UIUserAdapter.fromUniversal(universalData);`}
        </pre>
      </div>

      {/* Example 2: Quality checking */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">2. Quality Checking</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {`// Check data quality
const isHighQuality = UIUserAdapter.isHighQuality(user);
const qualityScore = UIUserAdapter.getQualityScore(user);

// Check validation warnings
if (user.validationWarnings?.length > 0) {
  console.warn('User data issues:', user.validationWarnings);
}`}
        </pre>
      </div>

      {/* Example 3: Component usage */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">3. Component Usage</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {`// Components work with any user source
function UserAvatar({ user }: { user: UIUser }) {
  return (
    <div style={{ backgroundColor: user.roleColor }}>
      {user.avatar || user.initials}
    </div>
  );
}

// No need to check if user is from mock or API!
<UserAvatar user={anyUserFromAnySource} />`}
        </pre>
      </div>
    </div>
  );
}
