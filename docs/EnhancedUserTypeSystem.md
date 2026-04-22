# User Type System Documentation

## Overview

This document explains the user type system implementation that ensures UI components don't need to care whether data came from hardcoded objects or JSON API responses.

## Architecture

### Core Problem Solved

**Before**: UI components needed to handle different user data sources (MockUser, AuthUser, CompleteUser, etc.) with type guards and conditional logic.

**After**: All user data is normalized to `UIUser` interface before reaching UI components, ensuring consistent typing regardless of data source.

### Type System Hierarchy

```
BaseUser → User → CompleteUser/AuthUser/MockUser → UniversalUser → UIUser/UIUser
```

## Key Components

### 1. UIUser Interface

```typescript
export interface UIUser {
  // Core identity fields (always required)
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  
  // Display fields (optional but commonly used)
  readonly avatar?: string;
  readonly isActive?: boolean;
  readonly permissions?: UserPermissions;
  
  // UI-specific computed properties
  readonly displayName?: string;
  readonly roleDisplay?: string;
  readonly initials?: string;
}
```

### 2. UIUser Interface

```typescript
export interface UIUser extends UIUser {
  readonly displayName: string;
  readonly roleDisplay: string;
  readonly initials: string;
  readonly status: 'active' | 'inactive' | 'unknown';
}
```

### 3. Transformation Functions

#### toUIUser()
Transforms any user data source to UIUser:
```typescript
import { toUIUser } from '@/types/ui-user';

const uiUser = toUIUser(apiResponse);
```

#### safeToUIUser()
Safe transformation with type guard:
```typescript
import { safeToUIUser } from '@/types/ui-user';

const uiUser = safeToUIUser(unknownData);
```

#### toUIUser()
Transforms to UIUser with computed properties:
```typescript
import { toUIUser } from '@/types/ui-user';

const User = toUIUser(apiResponse);
```

### 4. UserTransformer Integration

The UserTransformer class now includes UI transformation methods:
```typescript
import { UserTransformer } from '@/types/UserTransformer';

// Direct transformation
const uiUser = UserTransformer.toUIUser(universalUser);

// Safe transformation from any data source
const uiUser = UserTransformer.toUIUserSafe(userData, 'api');

// Transformation
const User = UserTransformer.toUIUser(universalUser);
```

### 5. Utility Functions

#### Permission Checking
```typescript
import { userHasPermission, userCanPerformAction } from '@/types/ui-user';

// Check specific permission
if (userHasPermission(user, 'canCreate')) {
  // User can create content
}

// Check action capability
if (userCanPerformAction(user, 'edit')) {
  // User can edit content
}
```

#### Status Management
```typescript
import { getUserStatus } from '@/types/ui-user';

const status = getUserStatus(user); // 'active' | 'inactive' | 'unknown'
```

## Usage Examples

### Basic Component with Type Safety

```typescript
import React from 'react';
import { UIUser, toUIUserSafe } from '@/types/ui-user';

const UserCard: React.FC<{ user: UIUser }> = ({ user }) => {
  // No type guards needed - guaranteed UIUser!
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>{user.role}</p>
      {userHasPermission(user, 'canView') && <span>Can View</span>}
    </div>
  );
};
```

### Handling Multiple Data Sources

```typescript
// API Response
const apiUser = toUIUserSafe(apiResponse, 'api');

// Mock Data
const mockUser = toUIUserSafe(mockData, 'mock');

// Same component works with both!
<UserCard user={apiUser} />
<UserCard user={mockUser} />
```

### Advanced Component with UIUser

```typescript
import { UIUser, toUIUser } from '@/types/ui-user';

const RichUserCard: React.FC = () => {
  const User = toUIUser(apiResponse);
  
  return (
    <div>
      <h3>{User.displayName}</h3>
      <p>{User.roleDisplay}</p>
      <p>{User.initials}</p>
      <span className={`status-${User.status}`}>
        {User.status.toUpperCase()}
      </span>
    </div>
  );
};
```

## Benefits

### 1. Type Safety
- **Compile-time**: TypeScript errors caught during development
- **Runtime**: Type guards prevent invalid data from reaching UI
- **IntelliSense**: Full autocomplete support for UIUser properties

### 2. Source Agnostic
- **UI Components**: Don't need to know data origin
- **Data Layer**: Handles transformation logic centrally
- **Consistency**: All user data follows same contract

### 3. Developer Experience
- **Single Interface**: One interface to rule them all
- **Utility Functions**: Common operations abstracted away
- **Error Prevention**: Invalid data caught before reaching UI

### 4. Maintainability
- **Centralized Logic**: Transformation logic in one place
- **Extensible**: Easy to add new UI-specific properties
- **Testable**: Clear separation of concerns

## Migration Guide

### Step 1: Update Components
Replace `unknown` or `UniversalUser` props with `UIUser`:

```typescript
// Before
const UserCard = ({ user }: { user: unknown }) => {
  if (!isValidUser(user)) {
    return <div>Invalid user</div>;
  }
  // ... component logic
};

// After
const UserCard = ({ user }: { user: UIUser }) => {
  // Component logic - no validation needed!
  // ... component logic
};
```

### Step 2: Update Data Loading
Use transformation functions when loading user data:

```typescript
// Before
const response = await fetchUser();
const user = response.data; // Unknown type

// After
const response = await fetchUser();
const user = toUIUserSafe(response.data, 'api');
```

### Step 3: Update Type Guards
Replace complex type guards with simple UIUser checks:

```typescript
// Before
if (typeof user === 'object' && 
    typeof user.id === 'string' && 
    typeof user.name === 'string' && 
    typeof user.email === 'string') {
  // Valid user
}

// After
if (user && user.id && user.name && user.email) {
  // Valid UIUser
}
```

## Best Practices

### 1. Always Use UIUser in Components
UI components should only work with `UIUser` interface for maximum type safety.

### 2. Transform at Data Layer Boundaries
Transform data to UIUser immediately when it enters your application:
- API responses
- Mock data
- Cache data
- Local storage data

### 3. Use UIUser for Rich UI
When you need computed properties like display names or status, use `UIUser`.

### 4. Leverage Utility Functions
Use the provided utility functions instead of implementing logic manually:
- `userHasPermission()` for permission checks
- `userCanPerformAction()` for action validation
- `getUserStatus()` for status formatting

## Files

### Core Files
- `types/ui-user.ts` - UI-specific interfaces and utilities
- `types/UserTransformer.ts` - With UI transformation methods
- `examples/UserTypeUsage.tsx` - Complete usage examples

### Component Files
Update existing components to use `UIUser` instead of `unknown` or `UniversalUser`.

## Testing

### Type Safety Tests
```typescript
describe('UIUser transformation', () => {
  it('should transform API response to UIUser', () => {
    const mockAPIResponse = createMockAPIResponse();
    const uiUser = toUIUser(mockAPIResponse);
    
    expect(uiUser.id).toBe('user-123');
    expect(uiUser.name).toBe('John Doe');
    expect(uiUser.email).toBe('john@example.com');
  });
  
  it('should handle invalid data gracefully', () => {
    const invalidData = { invalid: 'data' };
    const uiUser = toUIUserSafe(invalidData);
    
    expect(uiUser).toBeNull();
  });
});
```

### Component Tests
```typescript
describe('UserCard component', () => {
  it('should render with UIUser props', () => {
    const uiUser: UIUser = {
      id: 'test',
      name: 'Test User',
      email: 'test@example.com',
      role: 'farmer'
    };
    
    render(<UserCard user={uiUser} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});
```

## Conclusion

The user type system provides:
- **Complete type safety** for UI components
- **Source-agnostic** data handling
- **Developer-friendly** API with utilities
- **Maintainable** architecture for future development

UI components can now focus on presentation logic without worrying about data source validation or type checking.
