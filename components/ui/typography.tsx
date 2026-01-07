// src/components/ui/typography.tsx
import React from 'react';
import { commonColors } from '@/lib/theme/colors';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function ProductTitle({ children, className = '' }: TypographyProps) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function ProductDetail({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
}

export function BlockchainDetail({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-xs text-muted-foreground font-mono ${className}`}>
      {children}
    </p>
  );
}

export function PageTitle({ children, className = '' }: TypographyProps) {
  return (
    <h1 className={`text-3xl font-bold ${commonColors.gray900} ${className}`}>
      {children}
    </h1>
  );
}

export function SectionTitle({ children, className = '' }: TypographyProps) {
  return (
    <h2 className={`text-2xl font-bold ${commonColors.gray900} mb-4 ${className}`}>
      {children}
    </h2>
  );
}

export function InfoText({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-sm ${commonColors.gray600} ${className}`}>
      {children}
    </p>
  );
}

export function Strong({ children, className = '' }: TypographyProps) {
  return (
    <strong className={`font-medium ${className}`}>
      {children}
    </strong>
  );
}
