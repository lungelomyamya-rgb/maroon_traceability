// src/components/ui/skeleton.tsx
import React from 'react';
import { commonColors } from '@/lib/theme/colors';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md ${commonColors.gray200} ${className}`}
    />
  );
}
