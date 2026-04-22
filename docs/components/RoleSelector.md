# RoleSelector Component

## Overview

The `RoleSelector` component allows users to switch between different user roles in the application. It provides multiple display modes (dropdown, card, button-group) and integrates with the user context for seamless role switching.

## Props

### RoleSelectorProps

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `displayMode` | `'dropdown' \| 'card' \| 'button-group'` | `'dropdown'` | How to display the role selector |
| `className` | `string` | `undefined` | Additional CSS classes for the container |
| `onRoleChange` | `(role: UserRole) => void` | `undefined` | Callback function when role is changed |
| `_align` | `'start' \| 'center' \| 'end'` | `'end'` | Alignment for dropdown menu (internal use) |
| `_sideOffset` | `number` | `4` | Offset for dropdown menu (internal use) |

## Usage Examples

### Dropdown Mode (Default)

```typescript
import { RoleSelector } from '@/src/features/shared/roleSelector';

function Header() {
  const handleRoleChange = (newRole) => {
    console.log('Role changed to:', newRole);
  };

  return (
    <RoleSelector
      displayMode="dropdown"
      onRoleChange={handleRoleChange}
      className="ml-4"
    />
  );
}
```

### Card Mode

```typescript
function RoleSelectionPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Select Your Role</h1>
      <RoleSelector
        displayMode="card"
        onRoleChange={(role) => console.log('Selected:', role)}
        className="mb-8"
      />
      <div className="text-gray-600">
        Choose a role to explore the application features available to different user types.
      </div>
    </div>
  );
}
```

### Button Group Mode

```typescript
function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Quick Role Switch</h2>
      <RoleSelector
        displayMode="button-group"
        onRoleChange={(role) => {
          // Handle role change with navigation
          window.location.href = `/${role}`;
        }}
      />
    </div>
  );
}
```

## Display Modes

### Dropdown Mode
- **Use Case**: Header navigation, compact spaces
- **Behavior**: Click to show dropdown with role options
- **Features**: Current role displayed, chevron indicator
- **Best For**: Navigation bars, toolbars

```typescript
// Dropdown renders as:
<Button className="flex items-center gap-2">
  <span>Current Role</span>
  <ChevronDown className="h-4 w-4" />
</Button>
// + Dropdown menu with role options
```

### Card Mode
- **Use Case**: Dedicated role selection pages
- **Behavior**: Card with current role info and button grid
- **Features**: Descriptive text, visual role indicators
- **Best For**: Onboarding, settings pages

```typescript
// Card renders as:
<Card title="Current Role: Farmer" description="Switch between different user roles">
  <div className="flex flex-wrap gap-2">
    {roleButtons}
  </div>
</Card>
```

### Button Group Mode
- **Use Case**: Inline role switching
- **Behavior**: Horizontal button group
- **Features**: Compact layout, current role highlighted
- **Best For**: Settings panels, quick switch areas

```typescript
// Button group renders as:
<div className="flex flex-wrap gap-2">
  {roleButtons}
</div>
```

## Role Integration

### Available Roles

The component integrates with the role permissions system:

```typescript
const availableRoles = [
  { name: 'Public', href: '/marketplace' },
  { name: 'Farmer', href: '/farmer' },
  { name: 'Logistics', href: '/logistics' },
  { name: 'Packaging', href: '/packaging' },
  { name: 'Retailer', href: '/retailer' },
  { name: 'Inspector', href: '/inspector' },
  { name: 'SAPS', href: '/saps' },
];
```

### Role Permissions

Each role has associated permissions and display information:

```typescript
interface RoleConfig {
  displayName: string;
  icon: string | React.ComponentType;
  permissions: string[];
  description: string;
}
```

## State Management

### User Context Integration

The component uses the `useUser` hook:

```typescript
const { currentUser, switchUser } = useUser();
```

- `currentUser`: Current user object with role information
- `switchUser`: Function to switch to a different user/role

### Role Switching Logic

```typescript
const handleRoleChange = async (role: UserRole) => {
  if (role === currentUser?.role) {
    return; // Already in this role
  }
  
  try {
    // Find demo user with new role
    const newUser = DEMO_USERS.find((user: User) => user.role === role);
    if (newUser) {
      // Update user context
      switchUser(newUser.id);
      onRoleChange?.(role);
    }
  } catch (error) {
    console.error('Failed to update role:', error);
  } finally {
    // Close dropdowns
    setIsDropdownOpen(false);
  }
};
```

## Styling and CSS Classes

### Base Classes
```css
/* Container */
.flex items-center gap-2

/* Dropdown button */
.flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md

/* Card container */
.p-4 rounded-xl border shadow-sm

/* Button group container */
.flex flex-wrap gap-2
```

### State Classes
```css
/* Current role highlighting */
.bg-gray-100 (for current role in dropdown/card)
.variant="default" (for current role in button group)

/* Hover states */
.hover:bg-gray-100 (for dropdown items)
.hover:shadow-md (for cards)
```

## Responsive Behavior

### Mobile Considerations
- Dropdown: Full-width dropdown on mobile
- Card: Responsive button layout
- Button Group: Wraps to multiple lines on small screens

### Breakpoints
- **Mobile (< 640px)**: Stacked layouts, larger touch targets
- **Tablet (640px - 1024px)**: Balanced layouts
- **Desktop (> 1024px)**: Optimal layouts with proper spacing

## Accessibility

### Keyboard Navigation
- Full keyboard accessibility for all display modes
- Tab order follows logical sequence
- Enter/Space to activate role selection
- Escape to close dropdowns

### Screen Reader Support
- Proper ARIA labels and roles
- Current role announcements
- Role change notifications

### Focus Management
```typescript
// Focus handling for dropdowns
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside);
  
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('touchstart', handleClickOutside);
  };
}, []);
```

## Best Practices

### DO
✅ Use appropriate display mode for context
✅ Provide role change callbacks for navigation
✅ Handle loading states during role switching
✅ Use semantic HTML for accessibility
✅ Test keyboard navigation
✅ Provide visual feedback for current role

### DON'T
❌ Don't use in forms (use separate role selection)
❌ Don't override internal state without understanding
❌ Don't hardcode role options (use permissions system)
❌ Don't skip accessibility testing
❌ Don't ignore mobile touch interactions

## Performance Considerations

### Optimization Tips
- Use React.memo for role options
- Debounce rapid role changes
- Lazy load role-specific content
- Cache role permission lookups

### Example with Optimizations
```typescript
import React, { memo, useCallback } from 'react';

const RoleOption = memo(({ role, isCurrent, onSelect }) => (
  <Button
    variant={isCurrent ? 'default' : 'outline'}
    size="sm"
    onClick={() => onSelect(role)}
    className="flex items-center gap-2"
  >
    <span>{role.icon}</span>
    {role.displayName}
  </Button>
));

function OptimizedRoleSelector({ onRoleChange }) {
  const handleRoleSelect = useCallback((role) => {
    onRoleChange?.(role);
  }, [onRoleChange]);

  return (
    <RoleSelector onRoleChange={handleRoleSelect} />
  );
}
```

## Troubleshooting

### Common Issues

**Dropdown Not Closing**
- Check event listener cleanup
- Verify ref attachment to dropdown container
- Ensure no z-index conflicts

**Role Not Switching**
- Verify user context is properly initialized
- Check DEMO_USERS data structure
- Ensure role exists in permissions system

**Mobile Touch Issues**
- Check touch event listeners
- Verify touch target sizes
- Ensure proper mobile viewport meta tag

### Debug Mode
For development, add debug attributes:

```typescript
<RoleSelector
  displayMode="dropdown"
  onRoleChange={(role) => console.log('Role changed:', role)}
  data-testid="role-selector"
  data-current-role={currentUser?.role}
/>
```

## Advanced Usage

### Custom Role Filtering
```typescript
function CustomRoleSelector() {
  const allowedRoles = ['farmer', 'inspector', 'retailer'];
  
  return (
    <RoleSelector
      displayMode="dropdown"
      onRoleChange={(role) => {
        if (allowedRoles.includes(role)) {
          // Handle role change
          navigateToRole(role);
        }
      }}
    />
  );
}
```

### Role-Specific Styling
```typescript
function StyledRoleSelector() {
  const getRoleVariant = (role) => {
    const variants = {
      farmer: 'success',
      inspector: 'warning',
      retailer: 'primary',
      // ... other roles
    };
    return variants[role] || 'secondary';
  };

  return (
    <RoleSelector
      displayMode="button-group"
      onRoleChange={(role) => {
        // Apply role-specific styling
        document.body.className = `theme-${role}`;
      }}
    />
  );
}
```

## Related Components

- **Button**: Used for role selection buttons
- **Card**: Used for card display mode
- **DropdownMenu**: Used for dropdown functionality
- **useUser**: Hook for user context management

## Migration Guide

### From Custom Role Switcher
```typescript
// Old way
<div className="flex gap-2">
  {roles.map(role => (
    <button onClick={() => switchRole(role)}>
      {role.name}
    </button>
  ))}
</div>

// New way
<RoleSelector
  displayMode="button-group"
  onRoleChange={switchRole}
/>
```

---

*Last updated: April 2026*
*Component Version: 1.0.0*
