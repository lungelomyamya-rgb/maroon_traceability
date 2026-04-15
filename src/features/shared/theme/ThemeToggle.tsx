'use client';

import { Sun, Moon } from 'lucide-react';
import React from 'react';

import { useTheme } from '@/app/providers';
import { Button } from '@/src/features/shared/ui/button';

/**
 * Theme Toggle Component
 * 
 * @description A simple toggle button that allows users to switch between light and dark themes.
 * Uses the custom theme context to avoid next-themes script injection issues.
 * 
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-full"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
