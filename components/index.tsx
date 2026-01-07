// src/components/index.tsx
import React from 'react';

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({ children, className = '', padding }: { children: React.ReactNode; className?: string; padding?: string }) {
  const paddingClasses = {
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16',
  };
  
  return (
    <section className={`${paddingClasses[padding as keyof typeof paddingClasses] || 'py-12'} ${className}`}>
      {children}
    </section>
  );
}

export function Grid({ children, className = '', cols, gap }: { children: React.ReactNode; className?: string; cols?: number; gap?: string }) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };
  
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };
  
  return (
    <div className={`grid ${colsClasses[cols as keyof typeof colsClasses] || 'grid-cols-1'} ${gapClasses[gap as keyof typeof gapClasses] || 'gap-4'} ${className}`}>
      {children}
    </div>
  );
}
