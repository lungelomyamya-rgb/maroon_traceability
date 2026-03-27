// src/components/ui/label.tsx
import React from 'react';
import { commonColors } from '@/lib/theme/colors';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export function Label({ children, htmlFor, className = '' }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium ${commonColors.gray700} ${className}`}
    >
      {children}
    </label>
  );
}
