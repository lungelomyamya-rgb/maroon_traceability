# DashboardLayout Component

## Overview

The `DashboardLayout` component provides a consistent layout structure for dashboard pages. It includes navigation, header sections, and optional metrics cards, making it ideal for role-based dashboards and analytical pages.

## Props

### DashboardLayoutProps

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | **Required**. Main content of the dashboard |
| `title` | `string` | `undefined` | Page title displayed in the header |
| `subtitle` | `string` | `undefined` | Subtitle or description displayed below title |
| `description` | `string` | `undefined` | Additional description text (preferred over `_description`) |
| `actions` | `React.ReactNode` | `undefined` | Action buttons or controls in the header |
| `welcomeMessage` | `string` | `undefined` | Welcome message for the user |
| `cards` | `MetricsCardProps[]` | `undefined` | Array of metrics cards to display |

### MetricsCardProps (for cards array)

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `title` | `string` | **Required**. Card title |
| `value` | `number` | **Required**. Card value |
| `icon` | `React.ReactNode` | **Required**. Card icon |
| `variant` | `string` | `undefined` | Card variant (see MetricsCard docs) |

## Usage Examples

### Basic Dashboard Layout

```typescript
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/src/features/shared/ui/button';

function FarmerDashboard() {
  return (
    <DashboardLayout
      title="Farmer Dashboard"
      subtitle="Manage your products and track performance"
      welcomeMessage="Welcome back, John!"
    >
      <div className="space-y-6">
        {/* Dashboard content goes here */}
        <ProductTable />
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
}
```

### Dashboard with Metrics Cards

```typescript
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Package, TrendingUp, Users, AlertTriangle } from 'lucide-react';

function AnalyticsDashboard() {
  const metricsCards = [
    {
      title: 'Active Products',
      value: 42,
      icon: <Package className="h-6 w-6" />,
      variant: 'primary'
    },
    {
      title: 'Monthly Growth',
      value: 12,
      icon: <TrendingUp className="h-6 w-6" />,
      variant: 'success'
    },
    {
      title: 'Total Users',
      value: 1250,
      icon: <Users className="h-6 w-6" />,
      variant: 'secondary'
    },
    {
      title: 'Pending Issues',
      value: 3,
      icon: <AlertTriangle className="h-6 w-6" />,
      variant: 'warning'
    }
  ];

  return (
    <DashboardLayout
      title="Analytics Dashboard"
      subtitle="Track your key performance indicators"
      cards={metricsCards}
    >
      <div className="space-y-6">
        <ChartsSection />
        <DetailedReports />
      </div>
    </DashboardLayout>
  );
}
```

### Dashboard with Actions

```typescript
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/src/features/shared/ui/button';
import { Download, Plus } from 'lucide-react';

function ReportsDashboard() {
  const headerActions = (
    <div className="flex gap-3">
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="default" size="sm">
        <Plus className="h-4 w-4 mr-2" />
        New Report
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Reports Dashboard"
      subtitle="Generate and view detailed reports"
      actions={headerActions}
    >
      <div className="space-y-6">
        <ReportGenerator />
        <ReportHistory />
      </div>
    </DashboardLayout>
  );
}
```

## Layout Structure

### Component Hierarchy

```
DashboardLayout
├── Navigation (fixed top)
├── Main Container
│   ├── Header Section (optional)
│   │   ├── Title (optional)
│   │   ├── Subtitle (optional)
│   │   ├── Description (optional)
│   │   └── Actions (optional)
│   ├── Metrics Cards (optional)
│   └── Children Content
└── Footer (implicit)
```

### CSS Classes Applied

```css
/* Main container */
.min-h-screen bg-gray-50

/* Content container */
.px-4 sm:px-6 lg:px-8

/* Header section */
.text-center mb-8

/* Title */
.text-3xl font-bold text-gray-900 mb-4

/* Subtitle */
.mt-2 text-lg text-gray-600 max-w-2xl mx-auto

/* Actions container */
.flex justify-center mt-4 space-x-3

/* Metrics cards grid */
.grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-6

/* Content area */
.space-y-6
```

## Responsive Behavior

### Breakpoints

- **Mobile (< 640px)**: Single column for metrics cards, full-width content
- **Tablet (640px - 1024px)**: 2 columns for metrics cards
- **Desktop (1024px - 1280px)**: 3 columns for metrics cards
- **Large Desktop (> 1280px)**: 4 columns for metrics cards

### Navigation Integration

The component automatically includes the `Navigation` component at the top, which:
- Is fixed positioned with `z-50`
- Adapts to user role and permissions
- Provides mobile-responsive menu
- Handles role switching

## Best Practices

### DO
✅ Use descriptive titles and subtitles
✅ Include relevant metrics cards for dashboards
✅ Provide actions for user workflows
✅ Use consistent spacing with the `space-y-6` pattern
✅ Keep content organized in logical sections
✅ Use responsive grid layouts for metrics cards

### DON'T
❌ Don't mix different layout patterns
❌ Don't override the navigation without good reason
❌ Don't use inconsistent spacing
❌ Don't overcrowd the header with too many actions
❌ Don't skip responsive design considerations

## Role-Based Usage

### Farmer Dashboard
```typescript
<DashboardLayout
  title="Farmer Dashboard"
  subtitle="Manage your products and track performance"
  welcomeMessage="Welcome to your farm portal"
  cards={farmMetrics}
>
  <ProductManagement />
  <HarvestTracking />
</DashboardLayout>
```

### Inspector Dashboard
```typescript
<DashboardLayout
  title="Inspector Dashboard"
  subtitle="Verify products and ensure compliance"
  cards={inspectionMetrics}
>
  <VerificationQueue />
  <InspectionHistory />
</DashboardLayout>
```

### Retailer Dashboard
```typescript
<DashboardLayout
  title="Retailer Dashboard"
  subtitle="Manage inventory and track sales"
  cards={retailMetrics}
>
  <InventoryManagement />
  <SalesAnalytics />
</DashboardLayout>
```

## Performance Considerations

### Optimization Tips
- Use React.memo for child components
- Implement virtual scrolling for large data tables
- Lazy load chart components
- Debounce search and filter operations

### Example with Optimizations
```typescript
import React, { memo, useMemo } from 'react';

const OptimizedProductTable = memo(ProductTable);

function Dashboard({ products }) {
  const metricsCards = useMemo(() => [
    {
      title: 'Total Products',
      value: products.length,
      icon: <Package className="h-6 w-6" />,
      variant: 'primary'
    }
  ], [products.length]);

  return (
    <DashboardLayout
      title="Dashboard"
      cards={metricsCards}
    >
      <OptimizedProductTable products={products} />
    </DashboardLayout>
  );
}
```

## Accessibility

### Keyboard Navigation
- Navigation is fully keyboard accessible
- Header actions are focusable and have proper focus management
- Metrics cards are not interactive by default

### Screen Reader Support
- Proper heading hierarchy (h1 for title)
- Semantic HTML structure
- ARIA labels where needed

### Focus Management
- Proper focus order through navigation and content
- Visual focus indicators on all interactive elements
- Skip navigation option for screen reader users

## Troubleshooting

### Common Issues

**Navigation Not Showing**
- Check if pathname is `/login` (navigation is hidden on login)
- Verify Navigation component import path
- Check user context for role information

**Metrics Cards Not Displaying**
- Verify cards array structure matches MetricsCardProps
- Check that required props (title, value, icon) are provided
- Ensure variant values are valid

**Responsive Layout Issues**
- Check Tailwind responsive class usage
- Verify container has proper max-width settings
- Ensure no conflicting CSS styles

### Debug Mode
For development, add debug attributes:

```typescript
<DashboardLayout
  title="Debug Dashboard"
  data-testid="dashboard-layout"
  data-role={userRole}
>
  {/* Content */}
</DashboardLayout>
```

## Migration Guide

### From Custom Layout
```typescript
// Old way
<div className="min-h-screen bg-gray-50">
  <Navigation />
  <div className="px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-lg text-gray-600">{subtitle}</p>
    {children}
  </div>
</div>

// New way
<DashboardLayout
  title={title}
  subtitle={subtitle}
>
  {children}
</DashboardLayout>
```

## Related Components

- **Navigation**: Automatically included navigation component
- **MetricsCard**: Used for the cards array
- **Card**: Generic card component for other content
- **Button**: Used for header actions

## Advanced Usage

### Conditional Content
```typescript
function ConditionalDashboard({ userRole, showAdvanced }) {
  return (
    <DashboardLayout
      title={`${userRole} Dashboard`}
      subtitle={
        showAdvanced 
          ? "Advanced analytics and reporting"
          : "Basic dashboard overview"
      }
      cards={showAdvanced ? advancedMetrics : basicMetrics}
    >
      {showAdvanced && <AdvancedAnalytics />}
      <BasicOverview />
    </DashboardLayout>
  );
}
```

### Dynamic Content Loading
```typescript
function DynamicDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics().then(data => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <DashboardLayout title="Loading..." />;
  }

  return (
    <DashboardLayout
      title="Dashboard"
      cards={metrics}
    >
      <DashboardContent />
    </DashboardLayout>
  );
}
```

---

*Last updated: April 2026*
*Component Version: 1.0.0*
