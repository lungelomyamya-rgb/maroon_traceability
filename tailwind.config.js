/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        // Base colors
        neutral: 'hsl(var(--neutral) / <alpha-value>)',
        'neutral-light': 'hsl(var(--neutral-light) / <alpha-value>)',
        'neutral-dark': 'hsl(var(--neutral-dark) / <alpha-value>)',
        'neutral-foreground': 'hsl(var(--neutral-foreground) / <alpha-value>)',
        
        // Action colors
        green: {
          DEFAULT: 'hsl(var(--green) / <alpha-value>)',
          light: 'hsl(var(--green-light) / <alpha-value>)',
          foreground: 'hsl(var(--green-foreground) / <alpha-value>)',
          hover: 'hsl(var(--green-hover) / <alpha-value>)',
        },
        blue: {
          DEFAULT: 'hsl(var(--blue) / <alpha-value>)',
          light: 'hsl(var(--blue-light) / <alpha-value>)',
          foreground: 'hsl(var(--blue-foreground) / <alpha-value>)',
          hover: 'hsl(var(--blue-hover) / <alpha-value>)',
        },
        purple: {
          DEFAULT: 'hsl(var(--purple) / <alpha-value>)',
          light: 'hsl(var(--purple-light) / <alpha-value>)',
          foreground: 'hsl(var(--purple-foreground) / <alpha-value>)',
          hover: 'hsl(var(--purple-hover) / <alpha-value>)',
        },
        orange: {
          DEFAULT: 'hsl(var(--orange) / <alpha-value>)',
          light: 'hsl(var(--orange-light) / <alpha-value>)',
          foreground: 'hsl(var(--orange-foreground) / <alpha-value>)',
          hover: 'hsl(var(--orange-hover) / <alpha-value>)',
        },
        
        // Card colors
        'card-green': 'hsl(var(--card-green) / <alpha-value>)',
        'card-green-light': 'hsl(var(--card-green-light) / <alpha-value>)',
        'card-blue': 'hsl(var(--card-blue) / <alpha-value>)',
        'card-blue-light': 'hsl(var(--card-blue-light) / <alpha-value>)',
        'card-purple': 'hsl(var(--card-purple) / <alpha-value>)',
        'card-purple-light': 'hsl(var(--card-purple-light) / <alpha-value>)',
        'card-orange': 'hsl(var(--card-orange) / <alpha-value>)',
        'card-orange-light': 'hsl(var(--card-orange-light) / <alpha-value>)',
        'card-neutral': 'hsl(var(--card-neutral) / <alpha-value>)',
        'card-neutral-light': 'hsl(var(--card-neutral-light) / <alpha-value>)',
        
        // Status colors
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
        info: 'hsl(var(--info) / <alpha-value>)',
        'in-transit': 'hsl(var(--in-transit) / <alpha-value>)',
        'in-transit-light': 'hsl(var(--in-transit-light) / <alpha-value>)',
        
        // ShadCN/ui colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

