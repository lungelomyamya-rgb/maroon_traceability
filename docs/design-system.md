# Maroon Traceability Design System

## Overview

This design system provides the foundation for building consistent, accessible, and beautiful user interfaces across the Maroon Traceability platform. It includes colors, typography, spacing, components, and usage guidelines.

## Table of Contents

- [Colors](#colors)
- [Typography](#typography)
- [Spacing](#spacing)
- [Border Radius](#border-radius)
- [Shadows](#shadows)
- [Transitions](#transitions)
- [Component Guidelines](#component-guidelines)
- [Accessibility](#accessibility)
- [Responsive Design](#responsive-design)

---

## Colors

### Color System

Our color system uses HSL values for better consistency and theming support. All colors are defined as CSS custom properties in `:root`.

#### Primary Colors

```css
:root {
  --green: 142 70% 45%;
  --green-light: 142 70% 96%;
  --green-hover: 142 70% 40%;
  
  --blue: 217 89% 61%;
  --blue-light: 217 89% 96%;
  --blue-hover: 217 89% 56%;
  
  --purple: 262 83% 58%;
  --purple-light: 262 83% 96%;
  --purple-hover: 262 83% 53%;
  
  --orange: 27 90% 55%;
  --orange-light: 27 90% 96%;
  --orange-hover: 27 90% 50%;
}
```

#### Status Colors

```css
:root {
  --success: 142 70% 45%;
  --success-light: 142 70% 96%;
  
  --warning: 38 92% 50%;
  --warning-light: 38 92% 96%;
  
  --error: 0 84% 60%;
  --error-light: 0 84% 96%;
  
  --info: 217 89% 61%;
  --info-light: 217 89% 96%;
}
```

#### Category Colors

Product categories have dedicated color schemes for visual distinction:

```css
:root {
  --category-fruit-bg: 142 70% 96%;
  --category-fruit-text: 142 70% 45%;
  --category-fruit-border: 142 70% 85%;
  
  --category-veg-bg: 38 92% 96%;
  --category-veg-text: 38 92% 50%;
  --category-veg-border: 38 92% 85%;
  
  --category-beef-bg: 0 84% 96%;
  --category-beef-text: 0 84% 60%;
  --category-beef-border: 0 84% 85%;
}
```

#### Usage Guidelines

**DO:**
- Use semantic colors (success, warning, error) for status indicators
- Use category colors for product-related elements
- Maintain sufficient contrast for accessibility
- Use color variants (light, hover) for interactive states

**DON'T:**
- Don't use colors for decoration only
- Don't rely on color alone to convey information
- Don't create new colors without design review
- Don't use hardcoded color values

---

## Typography

### Font Scale

We use a consistent typographic scale based on Tailwind CSS classes:

```css
/* Text Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;    /* 36px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Guidelines

**Headings:**
- H1: `text-3xl font-bold` (30px, bold)
- H2: `text-2xl font-semibold` (24px, semibold)
- H3: `text-xl font-semibold` (20px, semibold)
- H4: `text-lg font-medium` (18px, medium)

**Body Text:**
- Large: `text-base font-normal` (16px, normal)
- Small: `text-sm font-normal` (14px, normal)
- Caption: `text-xs font-normal` (12px, normal)

---

## Spacing

### Spacing Scale

Consistent spacing using Tailwind's spacing scale:

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

### Spacing Guidelines

**Component Internal Spacing:**
- Small: `p-3` (12px)
- Medium: `p-4` (16px)
- Large: `p-6` (24px)

**Component External Spacing:**
- Tight: `gap-2` (8px)
- Normal: `gap-4` (16px)
- Loose: `gap-6` (24px)

**Layout Spacing:**
- Section margins: `mb-8` (32px)
- Container padding: `px-4 sm:px-6 lg:px-8`
- Grid gaps: `gap-4 lg:gap-6`

---

## Border Radius

### Border Radius Scale

```css
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
--radius-xl: 1rem;     /* 16px */
--radius-2xl: 1.5rem; /* 24px */
--radius-full: 9999px;
```

### Border Radius Guidelines

**Elements:**
- Buttons: `rounded-lg` (12px)
- Cards: `rounded-xl` (16px)
- Inputs: `rounded-md` (8px)
- Badges: `rounded-full` (circular)
- Avatars: `rounded-full` (circular)

---

## Shadows

### Shadow Scale

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### Shadow Guidelines

**Usage:**
- Cards: `shadow-sm hover:shadow-md`
- Dropdowns: `shadow-lg`
- Modals: `shadow-xl`
- Buttons: `shadow-sm hover:shadow-md`

---

## Transitions

### Transition Duration

```css
--transition-fast: 150ms ease-out;
--transition-normal: 200ms ease-out;
--transition-slow: 300ms ease-out;
```

### Transition Properties

**Common Transitions:**
```css
/* All properties */
transition-all duration-200 ease-out

/* Specific properties */
transition-colors duration-200 ease-out
transition-transform duration-200 ease-out
transition-shadow duration-200 ease-out
```

### Micro-interactions

**Hover States:**
```css
hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out
```

**Active States:**
```css
active:scale-95 transition-all duration-150 ease-out
```

**Focus States:**
```css
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200
```

---

## Component Guidelines

### Button Component

#### Variants
- **Primary**: Main action buttons
- **Secondary**: Secondary actions
- **Outline**: Tertiary actions
- **Ghost**: Minimal actions
- **Destructive**: Delete/danger actions

#### Sizes
- **sm**: `px-3 py-1.5 text-sm` (Small buttons)
- **md**: `px-4 py-2 text-base` (Default)
- **lg**: `px-6 py-3 text-lg` (Large buttons)

#### Usage Examples
```typescript
// Primary action
<Button variant="default" size="md">
  Save Changes
</Button>

// Secondary action
<Button variant="outline" size="sm">
  Cancel
</Button>

// Destructive action
<Button variant="destructive" size="md">
  Delete Item
</Button>
```

### Card Component

#### Variants
- **Default**: Standard card with border
- **Elevated**: Card with shadow
- **Bordered**: Emphasized border

#### Usage Examples
```typescript
// Standard card
<Card variant="default">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>

// Metrics card
<Card variant="elevated" className="hover:shadow-lg transition-all duration-200">
  <div className="flex items-center">
    <div className="p-2 rounded-lg bg-blue-100 mr-4">
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">Label</p>
      <p className="text-2xl font-bold text-gray-900">Value</p>
    </div>
  </div>
</Card>
```

### MetricsCard Component

#### Variants
- **primary**: Blue theme for primary metrics
- **success**: Green theme for positive metrics
- **warning**: Orange theme for cautionary metrics
- **error**: Red theme for negative metrics
- **total-transactions**: Specialized for transaction data
- **monthly-revenue**: Specialized for revenue data

#### Usage Examples
```typescript
// Basic metrics card
<MetricsCard
  icon={<Package className="h-6 w-6" />}
  label="Active Products"
  value={42}
  variant="primary"
/>

// Compact metrics card
<MetricsCard
  icon={<TrendingUp className="h-4 w-4" />}
  label="Growth Rate"
  value="+12%"
  variant="success"
  compact
/>
```

---

## Accessibility

### Color Contrast

All text and background combinations must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

### Focus Management

**Focus Styles:**
```css
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

**Keyboard Navigation:**
- All interactive elements must be keyboard accessible
- Tab order should follow logical reading order
- Focus indicators should be clearly visible

### Screen Reader Support

**Semantic HTML:**
- Use proper semantic elements (`<nav>`, `<main>`, `<section>`)
- Provide descriptive alt text for images
- Use ARIA labels where needed

**ARIA Guidelines:**
```typescript
// Button with icon
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

// Status indicator
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

---

## Responsive Design

### Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Mobile-First Approach

**Strategy:**
1. Design for mobile first (320px+)
2. Progressively enhance for tablet (768px+)
3. Optimize for desktop (1024px+)
4. Enhance for large screens (1280px+)

**Responsive Patterns:**
```css
/* Mobile-first */
.grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

/* Responsive text */
.text-xl sm:text-2xl lg:text-3xl

/* Responsive spacing */
.p-4 sm:p-6 lg:p-8

/* Responsive layout */
.flex-col md:flex-row
```

### Container Queries

**Container Pattern:**
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
}
```

---

## Usage Guidelines

### Do's and Don'ts

**DO:**
✅ Use semantic HTML elements
✅ Maintain consistent spacing
✅ Follow the color system
✅ Ensure keyboard accessibility
✅ Test with screen readers
✅ Use responsive design
✅ Add proper focus states
✅ Include loading states
✅ Handle error states

**DON'T:**
❌ Use inline styles
❌ Hardcode colors or spacing
❌ Skip accessibility testing
❌ Ignore mobile experience
❌ Use decorative images without alt text
❌ Create inconsistent spacing
❌ Skip focus states
❌ Ignore loading/error states

### Component Development

When creating new components:

1. **Use TypeScript** for type safety
2. **Follow naming conventions** (PascalCase for components)
3. **Document props** with JSDoc comments
4. **Include accessibility** features
5. **Test responsiveness** at all breakpoints
6. **Add micro-interactions** for better UX
7. **Handle edge cases** (loading, error, empty states)

### Code Style

**Consistent Patterns:**
```typescript
// Use cn utility for className merging
const className = cn(baseStyles, variantStyles[variant], className);

// Use semantic props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

// Use proper TypeScript types
export function Button({ variant = 'primary', size = 'md', disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        buttonStyles.base,
        buttonStyles.variants[variant],
        buttonStyles.sizes[size],
        disabled && buttonStyles.disabled
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## Contributing

### Adding New Colors

1. Define in CSS custom properties
2. Add to Tailwind config
3. Update this documentation
4. Test contrast ratios
5. Get design review approval

### Adding New Components

1. Follow existing component patterns
2. Include TypeScript interfaces
3. Add comprehensive documentation
4. Test accessibility
5. Verify responsive behavior
6. Add to component library

### Updating Guidelines

1. Discuss changes with the team
2. Update documentation first
3. Implement changes
4. Test thoroughly
5. Update examples and demos

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility Guide](https://reactjs.org/docs/accessibility.html)
- [Component Library Examples](./components/)

---

*Last updated: April 2026*
*Version: 1.0.0*
