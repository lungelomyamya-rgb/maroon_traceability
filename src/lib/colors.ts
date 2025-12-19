// src/lib/colors.ts
export const statusColors = {
  certified: {
    bg: 'bg-green-light',
    text: 'text-green',
    border: 'border-green/20',
    icon: 'text-green',
  },
  pending: {
    bg: 'bg-orange-light',
    text: 'text-orange',
    border: 'border-orange/20',
    icon: 'text-orange',
  },
  delivered: {
    bg: 'bg-blue-light',
    text: 'text-blue',
    border: 'border-blue/20',
    icon: 'text-blue',
  },
  info: {
    bg: 'bg-blue-light',
    text: 'text-blue',
    border: 'border-blue/20',
    icon: 'text-blue',
  },
  error: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: 'text-red-500',
  },
  success: {
    bg: 'bg-green-light',
    text: 'text-green',
    border: 'border-green/20',
    icon: 'text-green',
  },
  warning: {
    bg: 'bg-orange-light',
    text: 'text-orange',
    border: 'border-orange/20',
    icon: 'text-orange',
  },
  // Dashboard card colors from images
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
};

export const buttonVariants = {
  primary: {
    base: 'bg-green text-white hover:bg-green-hover',
    outline: 'border border-green text-green hover:bg-green/10',
  },
  secondary: {
    base: 'bg-blue text-white hover:bg-blue-hover',
    outline: 'border border-blue text-blue hover:bg-blue/10',
  },
  warning: {
    base: 'bg-orange text-white hover:bg-orange-hover',
    outline: 'border border-orange text-orange hover:bg-orange/10',
  },
  neutral: {
    base: 'bg-neutral text-foreground hover:bg-neutral/90',
    outline: 'border border-border hover:bg-neutral-light',
  },
};

// For consistent spacing and sizing
export const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8 text-lg',
};

// For consistent border radius
export const radius = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};