// src/components/ui/card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
  title?: string;
  description?: string;
  badge?: {
    text: string;
    variant: string;
  };
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', variant = 'default', title, description, badge }: CardProps) {
  const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  const variants = {
    default: 'border-border',
    outline: 'border-2 border-border',
    ghost: 'border-transparent bg-transparent',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {(title || description || badge) && (
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <div>
              {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            {badge && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                badge.variant === 'destructive' ? 'bg-red-100 text-red-800' :
                badge.variant === 'success' ? 'bg-green-100 text-green-800' :
                badge.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {badge.text}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="p-6 pt-0">
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ children, className = '', id }: CardHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} id={id}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </div>
  );
}

export function CardDescription({ children, className = '' }: CardContentProps) {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}
