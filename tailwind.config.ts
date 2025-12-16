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
        // Base colors (Dark theme by default)
        background: 'hsl(45 28% 6%)',
        foreground: 'hsl(45 30% 95%)',
        
        // Card colors
        card: 'hsl(45 25% 10%)',
        'card-foreground': 'hsl(45 30% 95%)',
        
        // Popover
        popover: 'hsl(45 25% 10%)',
        'popover-foreground': 'hsl(45 30% 95%)',
        
        // Input
        input: 'hsl(42 25% 25%)',
        'input-foreground': 'hsl(45 30% 95%)',
        'input-border': 'hsl(42 30% 25%)',
        
        // Buttons
        primary: {
          DEFAULT: 'hsl(42 80% 50%)',  // Gold
          foreground: 'hsl(45 28% 6%)',
          hover: 'hsl(42 80% 45%)'
        },
        secondary: {
          DEFAULT: 'hsl(42 40% 30%)',  // Darker gold
          foreground: 'hsl(45 30% 95%)',
          hover: 'hsl(42 40% 25%)'
        },
        
        // Muted colors
        muted: 'hsl(45 20% 15%)',
        'muted-foreground': 'hsl(45 25% 70%)',
        
        // Accent colors
        accent: 'hsl(42 50% 25%)',
        'accent-foreground': 'hsl(45 30% 95%)',
        
        // Destructive colors
        destructive: 'hsl(0 84% 60%)',
        'destructive-foreground': 'hsl(0 0% 100%)',
        
        // Border colors
        border: 'hsl(42 30% 25%)',
        'border-light': 'hsl(42 30% 35%)',
        
        // Ring colors
        ring: 'hsl(42 80% 60%)',
        
        // Status colors
        success: 'hsl(42 90% 45%)',
        'success-foreground': 'hsl(45 30% 95%)',
        warning: 'hsl(38 90% 55%)',
        'warning-foreground': 'hsl(45 30% 95%)',
        error: 'hsl(0 84% 60%)',
        'error-foreground': 'hsl(0 0% 100%)',
        
        // Category colors (for product categories)
        category: {
          fruit: {
            bg: 'hsl(42 90% 60%)',
            text: 'hsl(45 28% 6%)',
            border: 'hsl(42 90% 45%)'
          },
          veg: {
            bg: 'hsl(38 90% 55%)',
            text: 'hsl(45 30% 95%)',
            border: 'hsl(38 90% 40%)'
          },
          beef: {
            bg: 'hsl(35 90% 50%)',
            text: 'hsl(45 30% 95%)',
            border: 'hsl(35 90% 35%)'
          },
          poultry: {
            bg: 'hsl(45 90% 65%)',
            text: 'hsl(45 28% 6%)',
            border: 'hsl(45 90% 50%)'
          },
          pork: {
            bg: 'hsl(40 90% 55%)',
            text: 'hsl(45 28% 6%)',
            border: 'hsl(40 90% 40%)'
          },
          lamb: {
            bg: 'hsl(50 90% 60%)',
            text: 'hsl(45 28% 6%)',
            border: 'hsl(50 90% 45%)'
          },
          goat: {
            bg: 'hsl(42 85% 55%)',
            text: 'hsl(45 30% 95%)',
            border: 'hsl(42 85% 40%)'
          },
          fish: {
            bg: 'hsl(48 90% 58%)',
            text: 'hsl(45 28% 6%)',
            border: 'hsl(48 90% 43%)'
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