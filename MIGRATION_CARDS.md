# Card Components Migration Guide

## Overview
This guide explains how to migrate from the old card components to the new unified card system.

## New Card Components

### UnifiedCard
Located at: `components/ui/unified-card.tsx`

Features:
- Supports multiple variants: 'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'outline', 'ghost', 'metrics', 'product', 'info'
- Supports header, content, and footer sections
- Built-in support for badges, icons, and actions
- Responsive design

### Pre-built Card Components
Located in `components/cards/`:
- `metric-card-new.tsx` - For displaying metrics/KPIs
- `product-card-new.tsx` - For product items
- `verification-card-new.tsx` - For verification status

## Migration Steps

### 1. Update Imports
Replace old card component imports with the new ones:

```typescript
// Old
import { MetricCard } from './old/path';

// New
import { UnifiedCard } from '@/components/ui/unified-card';
// or for pre-built cards
import { MetricCard } from '@/components/cards/metric-card-new';
```

### 2. Migrate MetricCard

**Old Usage**:
```tsx
<MetricCard
  title="Total Products"
  value={42}
  icon={<Package />}
  trend={5.2}
  variant="info"
/>
```

**New Usage**:
```tsx
<UnifiedCard
  variant="metrics"
  title="Total Products"
  value="42"
  icon={Package}
  trend={{ value: 5.2, label: 'vs last month' }}
  className="h-full"
/>
```

### 3. Migrate ProductCard

**Old Usage**:
```tsx
<ProductCard
  id="123"
  name="Organic Coffee"
  category="Beverages"
  status="verified"
  onView={handleView}
  onEdit={handleEdit}
/>
```

**New Usage**:
```tsx
import { ProductCard } from '@/components/cards/product-card-new';

<ProductCard
  id="123"
  name="Organic Coffee"
  category="Beverages"
  status="verified"
  onView={handleView}
  onEdit={handleEdit}
/>
```

## Benefits of the New System

1. **Consistent Styling**: All cards follow the same design system
2. **Better Performance**: Optimized rendering and memoization
3. **Easier Maintenance**: Single source of truth for card styles
4. **Enhanced Features**: Built-in support for common patterns

## Deprecation Notice
All old card components will be removed in the next major release. Please migrate to the new system as soon as possible.
