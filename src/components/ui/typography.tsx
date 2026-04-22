import * as React from 'react';
import { cn } from '@/lib/utils';

export const ProductTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-lg font-semibold text-gray-900',
      className,
    )}
    {...props}
  />
));
ProductTitle.displayName = 'ProductTitle';

export const ProductDetail = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'text-sm text-gray-600',
      className,
    )}
    {...props}
  />
));
ProductDetail.displayName = 'ProductDetail';

export const BlockchainDetail = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'text-xs text-gray-500 font-mono',
      className,
    )}
    {...props}
  />
));
BlockchainDetail.displayName = 'BlockchainDetail';

export const Strong = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <strong
    ref={ref}
    className={cn(
      'font-semibold',
      className,
    )}
    {...props}
  />
));
Strong.displayName = 'Strong';

export const SectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      'text-2xl font-bold text-gray-900 mb-4',
      className,
    )}
    {...props}
  />
));
SectionTitle.displayName = 'SectionTitle';

export const InfoText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-gray-600',
      className,
    )}
    {...props}
  />
));
InfoText.displayName = 'InfoText';

export const PageTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      'text-3xl font-bold text-gray-900 mb-6',
      className,
    )}
    {...props}
  />
));
PageTitle.displayName = 'PageTitle';
