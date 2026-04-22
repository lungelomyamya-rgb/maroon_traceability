// components/ui/LoadingSkeletons.tsx

import React from 'react';
import { Skeleton } from './skeleton';

export function LoadingSpinner({ className = '', text }: { className?: string; text?: string }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-8 w-8 ${className}`}>
      <span className="sr-only">{text || 'Loading...'}</span>
    </div>
  );
}

export function FarmerDashboardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export function PageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 p-6 ${className}`}>
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlockchainSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
