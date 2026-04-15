# Component Documentation

This directory contains comprehensive documentation for all UI components in the Maroon Traceability application.

## Available Documentation

### Core Components

#### [MetricsCard](./MetricsCard.md)
- **Purpose**: Display key performance indicators with icons and values
- **Usage**: Dashboard metrics, KPI cards, data visualization
- **Features**: Multiple variants, responsive design, accessibility support

#### [DashboardLayout](./DashboardLayout.md)
- **Purpose**: Main layout component for dashboard pages
- **Usage**: Page layouts, navigation integration, metrics display
- **Features**: Responsive design, role-based layouts, header actions

#### [RoleSelector](./RoleSelector.md)
- **Purpose**: User role switching component with multiple display modes
- **Usage**: Navigation bars, settings pages, user management
- **Features**: Dropdown/card/button modes, role integration, responsive design

#### [Navigation](./Navigation.md)
- **Purpose**: Main navigation component with role-based menu items
- **Usage**: Header navigation, mobile menu, role switching
- **Features**: Responsive design, accessibility, role-based navigation

## Documentation Structure

Each component documentation includes:

### 📋 **Component Overview**
- Purpose and use cases
- Props interface with TypeScript types
- Usage examples for different scenarios

### 🎨 **Implementation Details**
- Component architecture and patterns
- State management approach
- Styling and CSS class usage

### 🎯 **Best Practices**
- DO's and DON'Ts for proper usage
- Performance considerations
- Accessibility guidelines

### 🔧 **Advanced Usage**
- Custom configurations and extensions
- Integration with other components
- Troubleshooting and debugging tips

### 📱 **Responsive Design**
- Mobile-first approach
- Breakpoint-specific behaviors
- Touch interaction support

### ♿ **Accessibility**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

## Design System Integration

All components follow the established [Design System](../design-system.md) with:

- **Consistent Colors**: Using CSS custom properties
- **Standardized Spacing**: Following the spacing scale
- **Typography Scale**: Using the defined font sizes
- **Border Radius**: Consistent corner radius values
- **Transitions**: Standardized duration and easing

## Usage Guidelines

### For Developers
1. **Start Here**: Read the component overview to understand purpose
2. **Check Props**: Review the props interface for available options
3. **Copy Examples**: Use the provided examples as starting points
4. **Follow Best Practices**: Adhere to DO's and DON'Ts guidelines

### For Designers
1. **Consistency**: All components follow the same design patterns
2. **Extensibility**: Components designed for easy customization
3. **Responsive**: Mobile-first approach across all components
4. **Accessibility**: Built-in ARIA support and keyboard navigation

## Maintenance

### Adding New Components
When documenting new components:

1. **Follow Template**: Use the existing documentation structure
2. **Include Examples**: Provide practical usage examples
3. **Document Props**: Full TypeScript interface documentation
4. **Add Best Practices**: Include DO's and DON'Ts section
5. **Test Accessibility**: Ensure proper ARIA implementation

### Updating Existing Components
When modifying existing components:

1. **Update Documentation**: Keep docs in sync with code changes
2. **Version Control**: Document breaking changes
3. **Examples**: Add new usage patterns
4. **Deprecation**: Mark old patterns as deprecated
5. **Migration**: Provide upgrade paths

## Getting Started

### Quick Start
```bash
# Read component documentation
open docs/components/MetricsCard.md

# Use in your component
import { MetricsCard } from '@/components/dashboard/MetricsCard';

<MetricsCard
  icon={<Package />}
  label="Active Products"
  value={42}
  variant="primary"
/>
```

### Design System Reference
All components reference the centralized design system:
- [Colors](../design-system.md#colors)
- [Typography](../design-system.md#typography)
- [Spacing](../design-system.md#spacing)
- [Transitions](../design-system.md#transitions)

---

*Last updated: April 2026*
*Documentation Version: 1.0.0*
