# Color System Documentation

## Centralized Color Configuration

The application now uses a centralized color system located in `src/lib/theme/colors.ts`. This ensures consistent theming across all components.

### Usage Examples

#### 1. Button Styling
```tsx
import { getButtonStyles } from '@/lib/theme/colors';

<Button className={getButtonStyles('green')}>Green Button</Button>
<Button className={getButtonStyles('blue', 'outline')}>Blue Outline Button</Button>
```

#### 2. Banner Gradients
```tsx
import { getBannerGradient } from '@/lib/theme/colors';

<div className={`bg-gradient-to-br ${getBannerGradient('primary')}`}>
  Primary Banner
</div>
```

#### 3. Metrics Cards
```tsx
<MetricsCard
  icon={Package}
  label="Total Transactions"
  value={123}
  variant="total-transactions"  // Uses specific card color
/>
```

#### 4. Status Colors
```tsx
import { getStatusColors } from '@/lib/theme/colors';

const colors = getStatusColors('certified');
// Returns { bg, light, text, border, icon }
```

### Available Color Variants

#### Button Variants
- `primary`, `secondary`, `accent`
- `success`, `warning`, `error`
- `green`, `blue`, `purple`, `orange`, `neutral`

#### Banner Gradients
- `primary`, `success`, `warning`, `error`, `info`
- `green`, `blue`, `purple`, `orange`

#### Metrics Card Variants
- `total-transactions` (green)
- `monthly-revenue` (blue)
- `active-farms` (purple)
- `retailers` (orange)
- `avg-fee` (neutral)
- `primary`, `secondary`, `success`, `warning`, `error`

#### Status Variants
- `certified`, `pending`, `in-transit`, `delivered`
- `info`, `error`, `success`, `warning`

### Benefits

1. **Consistency**: All components use the same color definitions
2. **Maintainability**: Update colors in one place
3. **Type Safety**: TypeScript ensures correct variant usage
4. **Flexibility**: Easy to add new color schemes
5. **Integration**: Works with existing Tailwind and CSS variables

### Integration with Existing System

The centralized colors work seamlessly with:
- Global CSS variables in `globals.css`
- Tailwind configuration in `tailwind.config.ts`
- Existing component styling patterns

This system provides a single source of truth for all color-related styling while maintaining compatibility with your existing setup.
