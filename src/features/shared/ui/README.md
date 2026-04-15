# UI Component Library

A comprehensive, accessible, and customizable React component library built with TypeScript and Tailwind CSS.

## 🎯 Design Principles

- **Accessibility First**: WCAG 2.1 AA compliant
- **Type Safety**: Full TypeScript support
- **Consistent API**: Standardized props across all components
- **Responsive**: Mobile-first design approach
- **Customizable**: Easy theming and customization

## 📦 Available Components

### Core Components

#### Button
Interactive button with multiple variants and states.

```tsx
import { Button } from '@/src/features/shared/ui';

<Button variant="default" size="lg" loading={false}>
  Click me
</Button>
```

**Props:**
- `variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'`
- `size?: 'default' | 'sm' | 'lg' | 'icon'`
- `loading?: boolean`
- `leftIcon?: React.ReactNode`
- `rightIcon?: React.ReactNode`
- `className?: string`

#### Card
Flexible container component with multiple sub-components.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/src/features/shared/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Badge
Small status indicator with multiple variants.

```tsx
import { Badge } from '@/src/features/shared/ui';

<Badge variant="success" size="lg">
  Status
</Badge>
```

**Props:**
- `variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'info' | 'success' | 'warning'`
- `size?: 'sm' | 'default' | 'lg'`

### Form Components

#### Input
Standard text input with validation states.

```tsx
import { Input } from '@/src/features/shared/ui';

<Input type="email" placeholder="Enter email" error={hasError} />
```

#### Select
Dropdown select component with search support.

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/features/shared/ui';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Checkbox
Checkbox with label support.

```tsx
import { Checkbox } from '@/src/features/shared/ui';

<Checkbox 
  checked={isChecked} 
  onCheckedChange={setIsChecked}
  label="Accept terms"
/>
```

#### Switch
Toggle switch component.

```tsx
import { Switch } from '@/src/features/shared/ui';

<Switch 
  checked={isEnabled} 
  onCheckedChange={setIsEnabled}
/>
```

### Layout Components

#### Dialog
Modal dialog with accessibility features.

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/src/features/shared/ui';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent title="Dialog Title" description="Dialog description">
    <p>Dialog content</p>
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Separator
Visual separator for content division.

```tsx
import { Separator } from '@/src/features/shared/ui';

<Separator orientation="horizontal" />
```

### Display Components

#### Avatar
User avatar with image fallback support.

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/src/features/shared/ui';

<Avatar src="/user.jpg" fallback="John Doe" size="lg">
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### Alert
Alert component for important messages.

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/src/features/shared/ui';

<Alert variant="warning" title="Warning">
  <AlertDescription>
    This action cannot be undone.
  </AlertDescription>
</Alert>
```

### Data Display

#### Table
Data table with sorting and filtering support.

```tsx
import { Table, TableColumn } from '@/src/features/shared/ui';

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', accessor: (row) => row.name },
  { key: 'email', label: 'Email', accessor: (row) => row.email },
];

<Table data={users} columns={columns} />
```

#### Progress
Progress indicator with multiple variants.

```tsx
import { Progress } from '@/src/features/shared/ui';

<Progress value={75} max={100} />
```

#### Skeleton
Loading placeholder component.

```tsx
import { Skeleton } from '@/src/features/shared/ui';

<Skeleton className="h-4 w-32" />
```

## 🎨 Theming

Components use CSS custom properties for easy theming:

```css
:root {
  --primary: 220 38 38;
  --primary-foreground: 210 40 98;
  --secondary: 220 38 38;
  --secondary-foreground: 215 40 97;
  --destructive: 0 84 95%;
  --destructive-foreground: 210 40 98;
}
```

## ♿ Accessibility Features

- **Keyboard Navigation**: All interactive elements support keyboard
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Logical tab order and focus indicators
- **High Contrast**: Meets WCAG AA contrast requirements
- **Reduced Motion**: Respects prefers-reduced-motion

## 🚀 Performance

- **Tree Shaking**: Only used components are bundled
- **Lazy Loading**: Components support lazy loading
- **Optimized Re-renders**: Efficient React patterns
- **Small Bundle**: Minimal CSS and JavaScript overhead

## 📱 Responsive Design

All components are responsive by default:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔧 Customization

### Override Styles
```tsx
<Button className="bg-custom-purple text-white">
  Custom Button
</Button>
```

### Extend Variants
```tsx
// Component accepts custom className for easy theming
const customVariants = {
  primary: 'bg-brand-blue text-white',
  secondary: 'bg-gray-100 text-gray-800',
};
```

## 📋 Migration Guide

### From Existing Components
```tsx
// Old
import { Button } from '@/components/ui/button';

// New
import { Button } from '@/src/features/shared/ui';
```

### Custom Theming
```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
      },
    },
  },
}
```

## 🧪 Testing

All components are tested with:
- **Unit Tests**: Jest + React Testing Library
- **Accessibility**: axe-core testing
- **Visual**: Storybook integration
- **E2E**: Playwright testing

## 📚 Documentation

- **JSDoc**: Comprehensive inline documentation
- **TypeScript**: Full type safety
- **Examples**: Usage examples for all components
- **Storybook**: Interactive component playground

## 🤝 Contributing

1. Follow existing component patterns
2. Ensure TypeScript compliance
3. Test accessibility
4. Update documentation
5. Use semantic HTML

## 📄 License

MIT License - feel free to use in commercial projects.
