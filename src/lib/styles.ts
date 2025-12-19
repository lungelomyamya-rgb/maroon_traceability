// src/lib/styles.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging Tailwind classes with clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Common button variants
export const buttonVariants = {
  primary: 'bg-green hover:opacity-90 text-green-foreground',
  secondary: 'bg-blue hover:opacity-90 text-blue-foreground',
  outline: 'bg-transparent border border-input hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
} as const;

// Card styles
export const cardStyles = {
  base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  header: 'flex flex-col space-y-1.5 p-6',
  title: 'text-lg font-semibold leading-none tracking-tight',
  description: 'text-sm text-muted-foreground',
  content: 'p-6 pt-0',
  footer: 'flex items-center p-6 pt-0',
} as const;

// Input styles
export const inputStyles = {
  base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
} as const;

// Alert styles
export const alertVariants = {
  default: 'bg-background text-foreground',
  success: 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  error: 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
} as const;
