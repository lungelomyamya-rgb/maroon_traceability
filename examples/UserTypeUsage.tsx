// src/examples/UserTypeUsage.tsx
// Example demonstrating type safety with UIUser interfaces

import React from 'react';
import { UniversalUser , UIUser, toUIUser } from '@/types/types';

// Helper functions that were missing
const userHasPermission = (user: UIUser, permission: string): boolean => {
  return user.permissions?.[permission] === true;
};

const userCanPerformAction = (user: UIUser, action: string): boolean => {
  switch (action) {
  case 'view': return userHasPermission(user, 'canView');
  case 'create': return userHasPermission(user, 'canCreate');
  case 'edit': return userHasPermission(user, 'canEdit');
  case 'delete': return userHasPermission(user, 'canDelete');
  case 'verify': return userHasPermission(user, 'canVerify');
  default: return false;
  }
};

const getUserStatus = (user: UIUser): string => {
  return user.status || 'unknown';
};


// ===== EXAMPLE DATA =====

// Mock API response (simulating real user data from API)
const mockAPIResponse = {
  id: 'user-123',
  name: 'Sarah Farmer',
  email: 'sarah@farm.com',
  role: 'farmer' as const,
  avatar: 'https://example.com/avatar.jpg',
  isActive: true,
  permissions: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canVerify: false,
    canExport: true,
    canView: true,
  },
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T15:45:00Z',
  _source: {
    type: 'api' as const,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    latency: 150,
  },
  _validation: {
    isValid: true,
    validatedAt: new Date().toISOString(),
  },
  _normalized: true,
} as UniversalUser;

// Mock user data (simulating hardcoded mock data)
const mockUserData = {
  id: 'mock-456',
  name: 'John Inspector',
  email: 'john@inspect.gov',
  role: 'inspector' as const,
  password: 'secure-password',
  isMockUser: true,
  mockDataQuality: 'high' as const,
  testScenario: 'standard-user',
  lastUpdated: '2024-01-10T08:00:00Z',
  isActive: true,
  permissions: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canVerify: true,
    canExport: true,
    canView: true,
  },
};

// ===== COMPONENT EXAMPLES =====

/**
 * Example 1: Type-safe UserCard with API data
 * Demonstrates how UI components don't need to know data source
 */
const APIUserCard: React.FC = () => {
  // Transform API response to UIUser with full type safety
  const uiUser = toUIUser(mockAPIResponse);
  if (!uiUser) {
    return <div>Error: Invalid user data</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">API User Card</h3>
      <div className="space-y-2">
        <p><strong>Name:</strong> {uiUser.name}</p>
        <p><strong>Email:</strong> {uiUser.email}</p>
        <p><strong>Role:</strong> {uiUser.role}</p>
        <p><strong>Status:</strong> {uiUser.isActive ? 'Active' : 'Inactive'}</p>

        {/* Type-safe permission checking */}
        {userHasPermission(uiUser, 'canCreate') && (
          <p className="text-green-600">✓ Can create content</p>
        )}

        {userCanPerformAction(uiUser, 'verify') && (
          <p className="text-blue-600">✓ Can verify content</p>
        )}
      </div>
    </div>
  );
};

/**
 * Example 2: Type-safe UserCard with Mock data
 * Same component, different data source - no changes needed!
 */
const MockUserCard: React.FC = () => {
  // Transform mock data to UIUser with full type safety
  const uiUser = toUIUser(mockUserData);
  if (!uiUser) {
    return <div>Error: Invalid user data</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Mock User Card</h3>
      <div className="space-y-2">
        <p><strong>Name:</strong> {uiUser.name}</p>
        <p><strong>Email:</strong> {uiUser.email}</p>
        <p><strong>Role:</strong> {uiUser.role}</p>
        <p><strong>Status:</strong> {getUserStatus(uiUser)}</p>

        {/* Permission checking works the same way */}
        {userCanPerformAction(uiUser, 'verify') && (
          <p className="text-purple-600">✓ Can verify content</p>
        )}
      </div>
    </div>
  );
};

/**
 * Example 3: UI with computed properties
 * Shows how UIUser provides rich display information
 */
const UserDisplay: React.FC = () => {
  // Transform to UIUser for rich UI components
  const User = toUIUser(mockAPIResponse);
  if (!User) {
    return <div>Error: Invalid user data</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">User Display</h3>
      <div className="space-y-2">
        <p><strong>Display Name:</strong> {User.displayName}</p>
        <p><strong>Role Display:</strong> {User.roleDisplay}</p>
        <p><strong>Initials:</strong> {User.initials}</p>
        <p><strong>Status:</strong> {User.status}</p>

        {/* Rich status indicator */}
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          User.status === 'active'
            ? 'bg-green-100 text-green-800'
            : User.status === 'inactive'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
        }`}>
          {User.status.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

/**
 * Example 4: User list with mixed data sources
 * Demonstrates how the UI handles different data sources seamlessly
 */
const UserListExample: React.FC = () => {
  // Mix of API and mock data
  const mixedData = [mockAPIResponse, mockUserData];

  // Transform all data to UIUsers
  const uiUsers = mixedData
    .map((data) => toUIUser(data))
    .filter((user): user is UIUser => user !== null);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">User List (Mixed Data Sources)</h3>
      <div className="space-y-3">
        {uiUsers.map((user, _index) => (
          <div key={user.id} className="p-3 bg-gray-50 rounded border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>

              {/* Consistent permission checking across all users */}
              <div className="text-right space-y-1">
                {userCanPerformAction(user, 'view') && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">View</span>
                )}
                {userCanPerformAction(user, 'create') && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Create</span>
                )}
                {userCanPerformAction(user, 'edit') && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Edit</span>
                )}
                {userCanPerformAction(user, 'verify') && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Verify</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Example 5: Advanced type-safe user management
 * Shows comprehensive type safety in complex scenarios
 */
const UserManagementExample: React.FC = () => {
  const [selectedUser, setSelectedUser] = React.useState<UIUser | null>(null);
  const [users, setUsers] = React.useState<UIUser[]>([]);

  // Load users from different sources
  React.useEffect(() => {
    const loadUsers = async () => {
      try {
        // Simulate API call
        const apiResponse = await Promise.resolve(mockAPIResponse);
        const mockResponse = await Promise.resolve(mockUserData);

        // Transform both to UIUsers
        const apiUser = toUIUser(apiResponse);
        const mockUser = toUIUser(mockResponse);

        if (apiUser && mockUser) {
          setUsers([apiUser, mockUser]);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };

    loadUsers();
  }, []);

  // Type-safe user selection
  const handleUserSelect = (user: UIUser) => {
    setSelectedUser(user);
  };

  // Type-safe permission-based actions
  const handleUserAction = (user: UIUser, action: 'edit' | 'delete' | 'verify') => {
    if (!userCanPerformAction(user, action)) {
      alert(`User ${user.name} cannot perform ${action} action`);
      return;
    }

    alert(`${user.name} can perform ${action} action`);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Advanced User Management</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* User list */}
        <div>
          <h4 className="font-medium mb-2">Users</h4>
          <div className="space-y-2">
            {users.map(user => (
              <div
                key={user.id}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                  selectedUser?.id === user.id ? 'bg-blue-50 border-blue-500' : ''
                }`}
                onClick={() => handleUserSelect(user)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleUserSelect(user);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select user ${user.name}`}
              >
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
                <p className="text-xs text-gray-500">{getUserStatus(user)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User details and actions */}
        <div>
          <h4 className="font-medium mb-2">User Details</h4>
          {selectedUser ? (
            <div className="space-y-3">
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                <p className="text-xs text-gray-500">Role: {selectedUser.role}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Available Actions:</p>
                {userCanPerformAction(selectedUser, 'edit') && (
                  <button
                    className="block w-full text-left px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    onClick={() => handleUserAction(selectedUser, 'edit')}
                  >
                    Edit User
                  </button>
                )}
                {userCanPerformAction(selectedUser, 'verify') && (
                  <button
                    className="block w-full text-left px-3 py-2 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                    onClick={() => handleUserAction(selectedUser, 'verify')}
                  >
                    Verify User
                  </button>
                )}
                {userCanPerformAction(selectedUser, 'delete') && (
                  <button
                    className="block w-full text-left px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                    onClick={() => handleUserAction(selectedUser, 'delete')}
                  >
                    Delete User
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a user to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== EXPORT EXAMPLES =====

/**
 * Main export showing all examples
 */
export const UserTypeExamples: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Type System Examples</h2>

      <APIUserCard />
      <MockUserCard />
      <UserDisplay />
      <UserListExample />
      <UserManagementExample />

      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="text-lg font-semibold mb-2">Key Benefits Demonstrated:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Type Safety:</strong> All user data is validated at compile time</li>
          <li><strong>Source Agnostic:</strong> UI components work with unknown data source</li>
          <li><strong>Runtime Validation:</strong> Built-in type guards prevent runtime errors</li>
          <li><strong>Permission Safety:</strong> Type-safe permission checking</li>
          <li><strong>Developer Experience:</strong> Full TypeScript IntelliSense support</li>
        </ul>
      </div>
    </div>
  );
};

export default UserTypeExamples;
