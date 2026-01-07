// src/lib/theme/colors.ts
// Centralized color configuration for consistent theming across the application

// Dashboard color variants for metrics cards and UI elements
export const dashboardColors = {
  green: {
    bg: 'bg-green',
    light: 'bg-green-light',
    text: 'text-green-foreground',
    border: 'border-green/20',
    hover: 'hover:bg-green-hover',
  },
  blue: {
    bg: 'bg-blue',
    light: 'bg-blue-light',
    text: 'text-blue-foreground',
    border: 'border-blue/20',
    hover: 'hover:bg-blue-hover',
  },
  purple: {
    bg: 'bg-purple',
    light: 'bg-purple-light',
    text: 'text-purple-foreground',
    border: 'border-purple/20',
    hover: 'hover:bg-purple-hover',
  },
  orange: {
    bg: 'bg-orange',
    light: 'bg-orange-light',
    text: 'text-orange-foreground',
    border: 'border-orange/20',
    hover: 'hover:bg-orange-hover',
  },
  neutral: {
    bg: 'bg-neutral',
    light: 'bg-neutral-light',
    text: 'text-neutral-foreground',
    border: 'border-neutral/20',
    hover: 'hover:bg-neutral-dark',
  },
};

// Role-specific color schemes for harmonized hero and button colors
export const roleColorSchemes = {
  farmer: {
    hero: 'from-green-600 to-green-500',
    button: 'bg-green-600 hover:bg-green-700 text-white',
    accent: 'bg-green-100 text-green-800 border-green-200',
  },
  retailer: {
    hero: 'from-blue-600 to-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    accent: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  viewer: {
    hero: 'from-gray-600 to-gray-500',
    button: 'bg-gray-600 hover:bg-gray-700 text-white',
    accent: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  logistics: {
    hero: 'from-emerald-600 to-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    accent: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
};

// Helper function to get role-specific colors
export function getRoleColors(role: keyof typeof roleColorSchemes) {
  return roleColorSchemes[role] || roleColorSchemes.viewer;
}

// Banner/hero section gradients
export const bannerGradients = {
  primary: 'from-primary to-primary/80',
  success: 'from-success to-success/80',
  warning: 'from-warning to-warning/80',
  error: 'from-error to-error/80',
  info: 'from-blue to-blue/80',
  green: 'from-green to-green/80',
  blue: 'from-blue to-blue/80',
  purple: 'from-purple to-purple/80',
  orange: 'from-orange to-orange/80',
};

// Category colors for product categories
export const categoryColors = {
  fruit: {
    bg: 'bg-category-fruit-bg',
    text: 'bg-category-fruit-text',
    border: 'bg-category-fruit-border',
  },
  veg: {
    bg: 'bg-category-veg-bg',
    text: 'bg-category-veg-text',
    border: 'bg-category-veg-border',
  },
  beef: {
    bg: 'bg-category-beef-bg',
    text: 'bg-category-beef-text',
    border: 'bg-category-beef-border',
  },
  poultry: {
    bg: 'bg-category-poultry-bg',
    text: 'bg-category-poultry-text',
    border: 'bg-category-poultry-border',
  },
  pork: {
    bg: 'bg-category-pork-bg',
    text: 'bg-category-pork-text',
    border: 'bg-category-pork-border',
  },
  lamb: {
    bg: 'bg-category-lamb-bg',
    text: 'bg-category-lamb-text',
    border: 'bg-category-lamb-border',
  },
  goat: {
    bg: 'bg-category-goat-bg',
    text: 'bg-category-goat-text',
    border: 'bg-category-goat-border',
  },
  fish: {
    bg: 'bg-category-fish-bg',
    text: 'bg-category-fish-text',
    border: 'bg-category-fish-border',
  },
};

// Dashboard card colors for metrics
export const cardColors = {
  'total-transactions': {
    bg: 'bg-card-green-light',
    text: 'text-card-green',
    border: 'border-card-green/20',
    icon: 'text-card-green',
  },
  'monthly-revenue': {
    bg: 'bg-card-blue-light',
    text: 'text-card-blue',
    border: 'border-card-blue/20',
    icon: 'text-card-blue',
  },
  'active-farms': {
    bg: 'bg-card-purple-light',
    text: 'text-card-purple',
    border: 'border-card-purple/20',
    icon: 'text-card-purple',
  },
  'retailers': {
    bg: 'bg-card-orange-light',
    text: 'text-card-orange',
    border: 'border-card-orange/20',
    icon: 'text-card-orange',
  },
  'avg-fee': {
    bg: 'bg-card-neutral-light',
    text: 'text-card-neutral',
    border: 'border-card-neutral/20',
    icon: 'text-card-neutral',
  },
  // Add fallback variants
  'primary-card': {
    bg: 'bg-card-blue-light',
    text: 'text-card-blue',
    border: 'border-card-blue/20',
    icon: 'text-card-blue',
  },
  'secondary-card': {
    bg: 'bg-card-purple-light',
    text: 'text-card-purple',
    border: 'border-card-purple/20',
    icon: 'text-card-purple',
  }
};

// Status colors for badges and indicators
export const statusColors = {
  certified: {
    bg: 'bg-success',
    light: 'bg-success-light',
    text: 'text-success-foreground',
    border: 'border-success/20',
    icon: 'text-success',
  },
  pending: {
    bg: 'bg-warning',
    light: 'bg-warning-light',
    text: 'text-warning-foreground',
    border: 'border-warning/20',
    icon: 'text-warning',
  },
  'in-transit': {
    bg: 'bg-warning',
    light: 'bg-warning-light',
    text: 'text-warning-foreground',
    border: 'border-warning/20',
    icon: 'text-warning',
  },
  delivered: {
    bg: 'bg-blue',
    light: 'bg-blue-light',
    text: 'text-blue-foreground',
    border: 'border-blue/20',
    icon: 'text-blue',
  },
  info: {
    bg: 'bg-blue',
    light: 'bg-blue-light',
    text: 'text-blue-foreground',
    border: 'border-blue/20',
    icon: 'text-blue',
  },
  error: {
    bg: 'bg-error',
    light: 'bg-error-light',
    text: 'text-error-foreground',
    border: 'border-error/20',
    icon: 'text-error',
  },
  success: {
    bg: 'bg-success',
    light: 'bg-success-light',
    text: 'text-success-foreground',
    border: 'border-success/20',
    icon: 'text-success',
  },
  warning: {
    bg: 'bg-warning',
    light: 'bg-warning-light',
    text: 'text-warning-foreground',
    border: 'border-warning/20',
    icon: 'text-warning',
  },
};

// Button variants for consistent styling
export const buttonVariants = {
  primary: {
    base: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-primary text-primary hover:bg-primary/10',
  },
  secondary: {
    base: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-secondary text-secondary hover:bg-secondary/10',
  },
  accent: {
    base: 'bg-accent text-accent-foreground hover:bg-accent/90',
    outline: 'border border-accent text-accent hover:bg-accent/10',
  },
  success: {
    base: 'bg-success text-success-foreground hover:bg-success/90',
    outline: 'border border-success text-success hover:bg-success/10',
  },
  warning: {
    base: 'bg-warning text-warning-foreground hover:bg-warning/90',
    outline: 'border border-warning text-warning hover:bg-warning/10',
  },
  error: {
    base: 'bg-error text-error-foreground hover:bg-error/90',
    outline: 'border border-error text-error hover:bg-error/10',
  },
  green: {
    base: 'bg-green text-green-foreground hover:bg-green-hover',
    outline: 'border border-green text-green hover:bg-green/10',
  },
  blue: {
    base: 'bg-blue text-blue-foreground hover:bg-blue-hover',
    outline: 'border border-blue text-blue hover:bg-blue/10',
  },
  purple: {
    base: 'bg-purple text-purple-foreground hover:bg-purple-hover',
    outline: 'border border-purple text-purple hover:bg-purple/10',
  },
  orange: {
    base: 'bg-orange text-orange-foreground hover:bg-orange-hover',
    outline: 'border border-orange text-orange hover:bg-orange/10',
  },
  neutral: {
    base: 'bg-neutral text-neutral-foreground hover:bg-neutral-dark',
    outline: 'border border-neutral text-neutral hover:bg-neutral-light',
  },
};

// Helper function to get color scheme by variant
export function getColorScheme(variant: keyof typeof dashboardColors) {
  return dashboardColors[variant] || dashboardColors.neutral;
}

// Helper function to get status colors
export function getStatusColors(status: keyof typeof statusColors) {
  return statusColors[status] || statusColors.info;
}

// Helper function to get button styles
export function getButtonStyles(variant: keyof typeof buttonVariants, type: 'base' | 'outline' = 'base') {
  return buttonVariants[variant]?.[type] || buttonVariants.primary.base;
}

// Text colors for better readability
export const textColors = {
  primary: 'text-gray-700',
  secondary: 'text-gray-600', 
  muted: 'text-gray-500',
  foreground: 'text-foreground',
  white: 'text-white',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info'
};

// Background colors
export const bgColors = {
  primary: 'bg-card-blue-light',
  secondary: 'bg-card-purple-light',
  success: 'bg-card-green-light',
  warning: 'bg-card-orange-light',
  error: 'bg-card-neutral-light',
  neutral: 'bg-card-neutral-light',
  white: 'bg-white',
  muted: 'bg-gray-50'
};

// Border colors
export const borderColors = {
  primary: 'border-card-blue/20',
  secondary: 'border-card-purple/20',
  success: 'border-card-green/20',
  warning: 'border-card-orange/20',
  error: 'border-card-neutral/20',
  neutral: 'border-card-neutral/20',
  default: 'border-gray-200'
};

// Common hardcoded colors that should be used consistently
export const commonColors = {
  // Gray scale
  white: 'text-white',
  black: 'text-black',
  gray50: 'bg-gray-50',
  gray100: 'bg-gray-100',
  gray200: 'bg-gray-200',
  gray400: 'text-gray-400',
  gray500: 'text-gray-500',
  gray600: 'text-gray-600',
  gray700: 'text-gray-700',
  gray800: 'text-gray-800',
  gray900: 'text-gray-900',
  borderGray200: 'border-gray-200',
  borderGray700: 'border-gray-700',
  hoverGray100: 'hover:bg-gray-100',
  
  // Status colors
  blue500: 'text-blue-500',
  blue600: 'text-blue-600',
  green400: 'text-green-400',
  green600: 'text-green-600',
  green700: 'text-green-700',
  red100: 'bg-red-100',
  red800: 'text-red-800',
  yellow100: 'bg-yellow-100',
  yellow400: 'text-yellow-400',
  yellow800: 'text-yellow-800',
  emerald100: 'bg-emerald-100',
  emerald800: 'text-emerald-800',
  pink100: 'bg-pink-100',
  pink800: 'text-pink-800',
  purple100: 'bg-purple-100',
  purple800: 'text-purple-800',
  orange100: 'bg-orange-100',
  orange800: 'text-orange-800',
  
  // Blockchain/crypto colors
  blockchainBg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
  blockchainText: 'text-blue-600',
  blockchainBorder: 'border-gray-700',
  
  // Interactive states
  hoverTransition: 'transition-colors',
  
  // Background colors
  whiteBg: 'bg-white',
  transparentBg: 'bg-transparent',
  
  // Shadow and border utilities
  shadowLg: 'shadow-lg',
  roundedLg: 'rounded-lg',
  roundedFull: 'rounded-full',
};

// Chart colors for data visualization
export const chartColors = {
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  success: '#10b981', 
  successDark: '#059669',
  warning: '#f59e0b',
  warningDark: '#d97706',
  error: '#ef4444',
  errorDark: '#dc2626',
  purple: '#8b5cf6',
  purpleDark: '#7c3aed',
  gray: '#666666',
  pieDefault: '#8884d8'
};

// Helper function to get banner gradient
export function getBannerGradient(type: keyof typeof bannerGradients = 'primary') {
  return bannerGradients[type] || bannerGradients.primary;
}
