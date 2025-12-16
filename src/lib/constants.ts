// src/lib/constants.ts
import { ProductCategory } from '@/types/product';
import { LucideIcon } from 'lucide-react';

export const CERTIFICATION_OPTIONS = [
  'Organic',
  'Fair Trade',
  'Free-Range',
  'Animal Welfare Approved',
  'Rainforest Alliance',
  'Non-GMO',
  'Sustainable',
  'Local',
  'Halal',
  'Kosher',
] as const;
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Fruit',
  'Veg',
  'Beef',
  'Poultry',
  'Pork',
  'Lamb',
  'Goat',
  'Fish',
] as const;
// Using theme colors from tailwind.config.ts
export const CATEGORY_COLORS: Record<ProductCategory, { 
  bg: string; 
  text: string; 
  border: string 
}> = {
  Fruit: { 
    bg: 'bg-category-fruit', 
    text: 'text-foreground', 
    border: 'border-category-fruit'
  },
  Veg: { 
    bg: 'bg-category-veg', 
    text: 'text-foreground',
    border: 'border-category-veg'
  },
  Beef: { 
    bg: 'bg-category-beef', 
    text: 'text-foreground',
    border: 'border-category-beef'
  },
  Poultry: { 
    bg: 'bg-category-poultry', 
    text: 'text-foreground',
    border: 'border-category-poultry'
  },
  Pork: { 
    bg: 'bg-category-pork', 
    text: 'text-foreground',
    border: 'border-category-pork'
  },
  Lamb: { 
    bg: 'bg-category-lamb', 
    text: 'text-foreground',
    border: 'border-category-lamb'
  },
  Goat: { 
    bg: 'bg-category-goat', 
    text: 'text-foreground',
    border: 'border-category-goat'
  },
  Fish: { 
    bg: 'bg-category-fish', 
    text: 'text-foreground',
    border: 'border-category-fish'
  }
};
export const STATUS_COLORS = {
  Certified: 'bg-success text-success-foreground border-success/50',
  'In Transit': 'bg-warning/80 text-warning-foreground border-warning/50',
  Delivered: 'bg-primary/90 text-primary-foreground border-primary/50',
} as const;

// This is a type-safe way to get the icon components
export const getCategoryIcon = (category: ProductCategory): LucideIcon => {
  // Using dynamic imports to avoid including all icons in the initial bundle
  switch (category) {
    case 'Fruit':
      return require('lucide-react').Apple;
    case 'Veg':
      return require('lucide-react').Carrot;
    case 'Beef':
      return require('lucide-react').Beef;
    case 'Poultry':
      return require('lucide-react').Drumstick;
    case 'Pork':
      return require('lucide-react').PiggyBank;
    case 'Lamb':
      return require('lucide-react').Heart; // Fallback
    case 'Goat':
      return require('lucide-react').Circle; // Fallback
    case 'Fish':
      return require('lucide-react').Fish;
    default:
      return require('lucide-react').Package; // Default fallback
  }
};

export const INITIAL_METRICS = {
  totalTransactions: 247,
  monthlyRevenue: 2470,
  activeFarms: 23,
  connectedRetailers: 8,
  averageFee: 10,
  totalVerifications: 0,
};