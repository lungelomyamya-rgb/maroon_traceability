# MetricsCard Component

## Overview

The `MetricsCard` component displays key performance indicators with an icon, label, and value. It's designed to provide at-a-glance information about important metrics in dashboards and reports.

## Props

### MetricsCardProps

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `icon` | `React.ReactNode` | **Required**. Icon or visual element to display |
| `label` | `string` | **Required**. Text label describing the metric |
| `value` | `string \| number` | **Required**. The metric value to display |
| `variant` | `CardVariant` | `'primary'` | Visual style variant for the card |
| `compact` | `boolean` | `false` | Whether to display in compact mode |

### CardVariant Type

```typescript
type CardVariant = 
  | 'primary'
  | 'secondary' 
  | 'success'
  | 'warning'
  | 'error'
  | 'total-transactions'
  | 'monthly-revenue'
  | 'active-farms'
  | 'retailers'
  | 'avg-fee'
  | 'primary-card'
  | 'secondary-card';
```

## Usage Examples

### Basic Usage

```typescript
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { Package, TrendingUp, Users } from 'lucide-react';

function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricsCard
        icon={<Package className="h-6 w-6" />}
        label="Active Products"
        value={42}
        variant="primary"
      />
      
      <MetricsCard
        icon={<TrendingUp className="h-6 w-6" />}
        label="Growth Rate"
        value="+12%"
        variant="success"
      />
      
      <MetricsCard
        icon={<Users className="h-6 w-6" />}
        label="Total Users"
        value={1250}
        variant="secondary"
      />
    </div>
  );
}
```

### Compact Mode

```typescript
function CompactDashboard() {
  return (
    <div className="space-y-4">
      <MetricsCard
        icon={<Package className="h-4 w-4" />}
        label="Products"
        value={42}
        variant="primary"
        compact
      />
      
      <MetricsCard
        icon={<TrendingUp className="h-4 w-4" />}
        label="Growth"
        value="+12%"
        variant="success"
        compact
      />
    </div>
  );
}
```

### Specialized Variants

```typescript
function FinancialDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricsCard
        icon={<DollarSign className="h-6 w-6" />}
        label="Total Transactions"
        value={1250}
        variant="total-transactions"
      />
      
      <MetricsCard
        icon={<TrendingUp className="h-6 w-6" />}
        label="Monthly Revenue"
        value="$45,230"
        variant="monthly-revenue"
      />
      
      <MetricsCard
        icon={<Farm className="h-6 w-6" />}
        label="Active Farms"
        value={87}
        variant="active-farms"
      />
      
      <MetricsCard
        icon={<Store className="h-6 w-6" />}
        label="Retailers"
        value={156}
        variant="retailers"
      />
    </div>
  );
}
```

## Variants

### Primary Variant
- **Use Case**: Main metrics, primary KPIs
- **Colors**: Blue theme
- **When to Use**: Most important metrics that need emphasis

```typescript
<MetricsCard
  icon={<Package className="h-6 w-6" />}
  label="Total Products"
  value={42}
  variant="primary"
/>
```

### Success Variant
- **Use Case**: Positive metrics, growth indicators
- **Colors**: Green theme
- **When to Use**: Metrics showing positive trends or achievements

```typescript
<MetricsCard
  icon={<TrendingUp className="h-6 w-6" />}
  label="Growth Rate"
  value="+12%"
  variant="success"
/>
```

### Warning Variant
- **Use Case**: Cautionary metrics, attention needed
- **Colors**: Orange theme
- **When to Use**: Metrics that need attention but aren't critical

```typescript
<MetricsCard
  icon={<AlertTriangle className="h-6 w-6" />}
  label="Pending Reviews"
  value={8}
  variant="warning"
/>
```

### Error Variant
- **Use Case**: Critical metrics, problems detected
- **Colors**: Red theme
- **When to Use**: Metrics indicating problems or failures

```typescript
<MetricsCard
  icon={<XCircle className="h-6 w-6" />}
  label="Failed Transactions"
  value={3}
  variant="error"
/>
```

### Specialized Business Variants

#### Total Transactions
- **Use Case**: Financial transaction metrics
- **Colors**: Custom blue-green theme
- **When to Use**: Transaction-related KPIs

#### Monthly Revenue
- **Use Case**: Revenue and financial metrics
- **Colors**: Custom green theme
- **When to Use**: Monthly/quarterly revenue data

#### Active Farms
- **Use Case**: Agricultural/farm metrics
- **Colors**: Custom green theme
- **When to Use**: Farm participation metrics

## Layout Guidelines

### Grid Layout
```typescript
// Responsive grid for metrics
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
  <MetricsCard {...props} />
</div>
```

### Spacing
- **Between cards**: Use `gap-4 lg:gap-6`
- **Within sections**: Use `space-y-6`
- **Around cards**: Use `p-4` to `p-6`

## Accessibility

### Keyboard Navigation
- Cards are not interactive by default
- If cards become clickable, ensure proper focus management

### Screen Reader Support
- Icons should have appropriate aria labels if they're not decorative
- Use semantic HTML structure for metric data

### Color Contrast
- All color variants meet WCAG 2.1 AA standards
- Text contrast ratios are validated for accessibility

## Best Practices

### DO
✅ Use descriptive labels that clearly indicate the metric
✅ Choose appropriate variants based on metric importance
✅ Use compact mode for space-constrained layouts
✅ Maintain consistent icon sizes (h-6 w-6 for normal, h-4 w-4 for compact)
✅ Group related metrics together
✅ Use responsive grids for multiple cards

### DON'T
❌ Don't use cards for non-metric data
❌ Don't mix variants without clear purpose
❌ Don't overcrowd cards with too much information
❌ Don't use inconsistent icon styles
❌ Don't hardcode values - pass them as props

## Performance Considerations

### Optimization Tips
- Use React.memo for cards in large lists
- Implement virtual scrolling for 50+ cards
- Lazy load card data when possible
- Debounce real-time metric updates

### Example with Memoization
```typescript
import React, { memo } from 'react';

const OptimizedMetricsCard = memo(MetricsCard);

function Dashboard({ metrics }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <OptimizedMetricsCard key={metric.id} {...metric} />
      ))}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

**Icon Not Displaying**
- Ensure icon is a valid React.ReactNode
- Check icon component imports
- Verify icon dimensions

**Colors Not Applying**
- Check variant spelling
- Ensure Tailwind classes are properly configured
- Verify CSS custom properties are loaded

**Layout Issues**
- Check responsive grid classes
- Verify container has proper width
- Ensure parent element allows grid layout

### Debug Mode
For development, you can add debug props to identify issues:

```typescript
<MetricsCard
  icon={<Package className="h-6 w-6" />}
  label="Debug Card"
  value={42}
  variant="primary"
  // Debug props (remove in production)
  data-testid="metrics-card-primary"
  data-variant="primary"
/>
```

## Related Components

- **DashboardLayout**: Container component for metrics cards
- **Card**: Generic card component for other content types
- **Button**: Often used with metrics cards for actions

## Migration Guide

### From Old Card Component
```typescript
// Old way
<Card className="p-4 border rounded-lg">
  <div className="flex items-center">
    <Icon className="h-6 w-6 mr-4" />
    <div>
      <p className="text-sm text-gray-500">Label</p>
      <p className="text-2xl font-bold">Value</p>
    </div>
  </div>
</Card>

// New way
<MetricsCard
  icon={<Icon className="h-6 w-6" />}
  label="Label"
  value="Value"
  variant="primary"
/>
```

---

*Last updated: April 2026*
*Component Version: 1.0.0*
