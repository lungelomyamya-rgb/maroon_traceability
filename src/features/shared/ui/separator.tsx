// src/components/ui/separator.tsx

import React from 'react';

import { cn } from '@/lib/utils';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
}

export function Separator({ 
  orientation = 'horizontal', 
  decorative = true, 
  className = '', 
}: SeparatorProps) {
  const baseClasses = 'shrink-0 bg-border';
  const orientationClasses = orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]';
  
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      className={cn(baseClasses, orientationClasses, className)}
    />
  );
}
