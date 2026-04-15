# Navigation Component

## Overview

The `Navigation` component provides the main navigation structure for the application. It includes role-based navigation items, role switching functionality, and responsive design with mobile support.

## Props

The Navigation component doesn't accept explicit props - it uses context and hooks to manage its state internally.

## State Management

### Internal State

| State | Type | Description |
|--------|------|-------------|
| `isDropdownOpen` | `boolean` | Controls desktop role dropdown visibility |
| `isMobileDropdownOpen` | `boolean` | Controls mobile menu visibility |

### External Dependencies

| Hook/Service | Description |
|---------------|-------------|
| `useUser()` | User context for current user and role switching |
| `rolePermissionsService` | Service for role-based navigation items |
| `DEMO_USERS` | Mock user data for role switching |

## Usage Examples

### Basic Usage

```typescript
import { Navigation } from '@/src/features/shared/layout/navigation';

function AppLayout() {
  return (
    <div>
      <Navigation />
      <main>
        {/* Page content */}
      </main>
    </div>
  );
}
```

### Role-Based Navigation

The navigation automatically adapts based on the current user's role:

```typescript
// Farmer role navigation items
const farmerNavigation = [
  { name: 'Dashboard', href: '/farmer', current: false },
  { name: 'Products', href: '/farmer/products', current: false },
  { name: 'Analytics', href: '/farmer/analytics', current: false },
  { name: 'Settings', href: '/farmer/settings', current: false }
];

// Public role navigation items
const publicNavigation = [
  { name: 'Marketplace', href: '/marketplace', current: false },
  { name: 'Products', href: '/products', current: false },
  { name: 'Public Access', href: '/public-access', current: false }
];
```

## Navigation Structure

### Component Hierarchy

```
Navigation
├── Fixed Navigation Bar
│   ├── Logo and Title Section
│   │   ├── MAROON Logo
│   │   ├── Role-based Title
│   │   └── Mobile Title (hidden on desktop)
│   └── Actions Section
│       ├── Desktop Navigation Items
│       ├── Desktop Role Selector
│       └── Mobile Navigation (Hamburger Menu)
└── Role Switching Dropdowns
    ├── Desktop Dropdown
    └── Mobile Dropdown
```

### Responsive Behavior

#### Desktop (> 1024px)
- Horizontal navigation bar
- Desktop navigation items visible
- Desktop role selector dropdown
- Mobile menu hidden

#### Tablet (640px - 1024px)
- Horizontal navigation bar
- Desktop navigation items visible
- Desktop role selector dropdown
- Mobile menu hidden

#### Mobile (< 640px)
- Compact navigation bar
- Desktop navigation hidden
- Mobile hamburger menu
- Mobile role selector in dropdown

## Role-Based Features

### Dynamic Title Display

```typescript
// Role-based title and subtitle
{currentUser?.role === 'farmer' && (
  <div className="text-sm text-green-600 font-medium">Farmer Portal</div>
)}
{currentUser?.role === 'public' && (
  <div className="text-sm text-gray-600 font-medium">Public Portal</div>
)}
{currentUser?.role === 'inspector' && (
  <div className="text-sm text-purple-600 font-medium">Inspector Portal</div>
)}
```

### Role Mapping

```typescript
const roleMapping = {
  'public': 'viewer',
  'government': 'admin',
  // Other roles map to themselves
};
```

### Navigation Items by Role

#### Farmer Role
- Dashboard
- Products
- Analytics
- Settings

#### Inspector Role
- Dashboard
- Verification Queue
- Inspection History
- Reports

#### Public Role
- Marketplace
- Products
- Public Access

## Role Switching

### Desktop Role Switcher

```typescript
// Desktop dropdown trigger
<Button 
  variant="ghost" 
  className="flex items-center space-x-2"
  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
>
  <span>{currentUser?.role ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}` : 'Switch Role'}</span>
  <ChevronDown className="h-4 w-4" />
</Button>
```

### Mobile Role Switcher

```typescript
// Mobile hamburger menu
<Button 
  variant="ghost" 
  className="flex items-center space-x-2 p-2 sm:p-3"
  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
>
  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
</Button>
```

### Role Switching Logic

```typescript
const handleRoleChange = async (role: UserRole) => {
  if (role === 'Public') {
    // Switch to public user and navigate to marketplace
    const publicUser = DEMO_USERS.find((u: User) => u.role === 'public');
    if (publicUser) {
      switchUser(publicUser.id);
      setTimeout(() => {
        window.location.href = '/marketplace';
      }, 100);
    }
  } else {
    // Navigate to login for other roles
    router.push('/login');
  }
  setIsDropdownOpen(false);
};
```

## Styling and CSS Classes

### Navigation Bar

```css
/* Main navigation container */
.bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50

/* Content container */
.max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

/* Height and alignment */
.flex justify-between h-16 items-center
```

### Navigation Items

```css
/* Navigation links */
.inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium

/* Active state */
.border-green-600 text-green-700

/* Hover state */
.border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700
```

### Role Indicators

```css
/* Role-specific colors */
.text-green-600    /* Farmer */
.text-purple-600   /* Inspector */
.text-blue-600     /* Logistics */
.text-orange-600   /* Packaging */
.text-indigo-600   /* Retailer */
.text-blue-800     /* SAPS */
```

### Dropdown Styling

```css
/* Dropdown container */
.absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200

/* Dropdown items */
.w-full text-left px-4 py-2 text-sm hover:bg-gray-100

/* Current role indication */
.bg-gray-100
.text-xs.text-gray-500.ml-2
```

## Accessibility

### Keyboard Navigation

- Full keyboard accessibility for all navigation items
- Tab order follows logical sequence
- Focus indicators on all interactive elements
- Skip navigation option for screen readers

### ARIA Labels

```typescript
// Navigation links
<Link
  href={item.href}
  className={navClasses}
  title={item.description}  // Tooltip for screen readers
  aria-label={`${item.name} ${item.current ? 'current page' : ''}`}
>
  {item.icon && <span className="mr-2">{item.icon}</span>}
  {item.name}
</Link>

// Role switcher
<button
  aria-label="Switch user role"
  aria-expanded={isDropdownOpen}
  aria-haspopup="true"
>
  {currentRole}
</button>
```

### Screen Reader Support

- Semantic HTML5 navigation element
- Proper heading structure
- Live regions for dynamic content
- Current page announcements

## Event Handling

### Click Outside Detection

```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    // Handle desktop dropdown
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
    
    // Handle mobile dropdown
    if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
      setIsMobileDropdownOpen(false);
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

## Performance Considerations

### Optimization Tips

- Use `useCallback` for event handlers
- Memoize navigation items calculation
- Lazy load role-specific content
- Debounce rapid role changes

### Example with Optimizations

```typescript
const navigation = useMemo(() => {
  const userRole = currentUser?.role === 'public' ? 'viewer' as UserRole : 
    currentUser?.role === 'government' ? 'admin' as UserRole :
    currentUser?.role as UserRole | null;
  
  return userRole 
    ? rolePermissionsService.getNavigationItems(userRole).map(item => ({
        ...item,
        current: cleanPathname === item.href || (item.href === '/marketplace' && isPublicPage),
      }))
    : getDefaultNavigationItems();
}, [currentUser, cleanPathname, isPublicPage]);

const handleRoleChange = useCallback(async (role: UserRole) => {
  // Role switching logic
}, [currentUser]);
```

## Best Practices

### DO

✅ Use semantic HTML5 navigation element
✅ Provide proper ARIA labels and roles
✅ Implement keyboard navigation
✅ Use responsive design patterns
✅ Handle click outside for dropdowns
✅ Provide loading states during role switching
✅ Use focus management for accessibility

### DON'T

❌ Don't skip accessibility testing
❌ Don't use fixed positioning without consideration
❌ Don't ignore mobile touch interactions
❌ Don't hardcode navigation items
❌ Don't skip keyboard navigation support

## Troubleshooting

### Common Issues

**Navigation Not Showing**
- Check if pathname is `/login` (navigation is hidden on login)
- Verify user context is properly initialized
- Check role permissions service

**Role Switching Not Working**
- Verify DEMO_USERS data structure
- Check switchUser function in user context
- Ensure role exists in permissions system

**Mobile Menu Issues**
- Check touch event listeners
- Verify mobile breakpoint styles
- Ensure proper z-index stacking

**Dropdown Not Closing**
- Check click outside event listeners
- Verify ref attachments
- Check for z-index conflicts

### Debug Mode

Add debug attributes for development:

```typescript
<nav 
  data-testid="main-navigation"
  data-current-role={currentUser?.role}
  data-is-mobile={isMobile}
>
  {/* Navigation content */}
</nav>
```

## Integration Points

### With User Context

```typescript
// Navigation automatically integrates with user context
import { useUser } from '@/contexts/userContext';

function NavigationWrapper() {
  const { currentUser, switchUser } = useUser();
  // Navigation uses these automatically
}
```

### With Role Permissions

```typescript
// Navigation uses role permissions service
import { rolePermissionsService } from '@/services/rolePermissionsService';

// Service provides navigation items based on role
const navigation = rolePermissionsService.getNavigationItems('farmer');
```

## Advanced Usage

### Custom Navigation Items

```typescript
function CustomNavigation() {
  const customItems = [
    { name: 'Custom Page', href: '/custom', current: false, icon: <CustomIcon /> }
  ];

  return (
    <Navigation>
      {/* Navigation will use role-based items by default */}
    </Navigation>
  );
}
```

### Conditional Navigation

```typescript
function ConditionalNavigation({ showAdminNav }) {
  return (
    <Navigation>
      {/* Navigation automatically adapts based on user role */}
      {showAdminNav && (
        <div className="border-t pt-4">
          <AdminNavigationItems />
        </div>
      )}
    </Navigation>
  );
}
```

---

*Last updated: April 2026*
*Component Version: 1.0.0*
