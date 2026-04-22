// components/ui/avatar.tsx

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = '', src, alt, fallback, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium',
          sizes[size],
          className,
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.textContent = fallback ? getInitials(fallback) : '?';
              }
            }}
          />
        ) : (
          <span className="text-sm">
            {fallback ? getInitials(fallback) : '?'}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className = '', onLoadingStatusChange, ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn('aspect-square h-full w-full rounded-full object-cover', className)}
        onLoad={() => onLoadingStatusChange?.('loaded')}
        onError={() => onLoadingStatusChange?.('error')}
        alt={props.alt || 'Avatar'}
        {...props}
      />
    );
  },
);

AvatarImage.displayName = 'AvatarImage';

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium',
          className,
        )}
        {...props}
      >
        <span className="text-sm">{children}</span>
      </div>
    );
  },
);

AvatarFallback.displayName = 'AvatarFallback';
