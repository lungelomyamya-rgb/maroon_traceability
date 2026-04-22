// src/app/providers.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/errorBoundary';
import { EventLogsProvider } from '@/contexts/eventLogsContext';
import { ProductProvider } from '@/contexts/productContext';
import { SearchProvider } from '@/contexts/search-context';
import { UserProvider } from '@/contexts/userContext';

// Theme context to replace next-themes
interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('maroon-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (mounted) {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme, mounted]);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('maroon-theme', theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UserProvider>
          <ProductProvider>
            <EventLogsProvider>
              <SearchProvider>
                <main className="container mx-auto px-4 pt-20 pb-8">
                  {children}
                </main>
              </SearchProvider>
            </EventLogsProvider>
          </ProductProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
