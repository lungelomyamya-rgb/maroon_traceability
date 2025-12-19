// tailwind.config.ts
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Card colors
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        
        // Popover
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        
        // Input
        input: 'hsl(var(--input))',
        'input-foreground': 'hsl(var(--input-foreground))',
        'input-border': 'hsl(var(--input-border))',

        // Neutral colors
        neutral: {
          DEFAULT: 'hsl(var(--neutral))',
          light: 'hsl(var(--neutral-light))',
          dark: 'hsl(var(--neutral-dark))',
          foreground: 'hsl(var(--neutral-foreground))'
        },
        
        // Action Colors
        green: {
          DEFAULT: 'hsl(var(--green))',
          light: 'hsl(var(--green-light))',
          foreground: 'hsl(var(--green-foreground))'
        },
        blue: {
          DEFAULT: 'hsl(var(--blue))',
          light: 'hsl(var(--blue-light))',
          foreground: 'hsl(var(--blue-foreground))'
        },
        purple: {
          DEFAULT: 'hsl(var(--purple))',
          foreground: 'hsl(var(--purple-foreground))',
          hover: 'hsl(var(--purple-hover))',
          light: 'hsl(var(--purple-light))'
        },
        orange: {
          DEFAULT: 'hsl(var(--orange))',
          foreground: 'hsl(var(--orange-foreground))',
          hover: 'hsl(var(--orange-hover))',
          light: 'hsl(var(--orange-light))'
        },
        
        // Card Colors for dashboard metrics
        'card-green': {
          DEFAULT: 'hsl(var(--card-green))',
          light: 'hsl(var(--card-green-light))'
        },
        'card-blue': {
          DEFAULT: 'hsl(var(--card-blue))',
          light: 'hsl(var(--card-blue-light))'
        },
        'card-purple': {
          DEFAULT: 'hsl(var(--card-purple))',
          light: 'hsl(var(--card-purple-light))'
        },
        'card-orange': {
          DEFAULT: 'hsl(var(--card-orange))',
          light: 'hsl(var(--card-orange-light))'
        },
        'card-neutral': {
          DEFAULT: 'hsl(var(--card-neutral))',
          light: 'hsl(var(--card-neutral-light))'
        },
        
        // Status Colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          light: 'hsl(var(--success-light))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          light: 'hsl(var(--warning-light))'
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
          light: 'hsl(var(--error-light))'
        },
        
        // Neutral Colors
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        
        // Border colors
        border: 'hsl(var(--border))',
        'border-light': 'hsl(var(--border-light))',
        
        // Ring colors
        ring: 'hsl(var(--ring))',
        
        // Category colors (for product categories)
        category: {
          fruit: {
            bg: 'hsl(var(--fruit-bg))',
            text: 'hsl(var(--fruit-text))',
            border: 'hsl(var(--fruit-border))'
          },
          veg: {
            bg: 'hsl(var(--veg-bg))',
            text: 'hsl(var(--veg-text))',
            border: 'hsl(var(--veg-border))'
          },
          beef: {
            bg: 'hsl(var(--beef-bg))',
            text: 'hsl(var(--beef-text))',
            border: 'hsl(var(--beef-border))'
          },
          poultry: {
            bg: 'hsl(var(--poultry-bg))',
            text: 'hsl(var(--poultry-text))',
            border: 'hsl(var(--poultry-border))'
          },
          pork: {
            bg: 'hsl(var(--pork-bg))',
            text: 'hsl(var(--pork-text))',
            border: 'hsl(var(--pork-border))'
          },
          lamb: {
            bg: 'hsl(var(--lamb-bg))',
            text: 'hsl(var(--lamb-text))',
            border: 'hsl(var(--lamb-border))'
          },
          goat: {
            bg: 'hsl(var(--goat-bg))',
            text: 'hsl(var(--goat-text))',
            border: 'hsl(var(--goat-border))'
          },
          fish: {
            bg: 'hsl(var(--fish-bg))',
            text: 'hsl(var(--fish-text))',
            border: 'hsl(var(--fish-border))'
          },
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
}