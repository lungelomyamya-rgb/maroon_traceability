// src/components/layout/roleSelector.tsx
'use client';

import { useUser } from '@/contexts/userContext';
import { UserRole, ROLE_PERMISSIONS, RoleIcon } from '@/types/user';
import { ChevronDown, User } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/styles';

interface RoleSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export function RoleSelector({ 
  className, 
  align = 'end',
  sideOffset = 4,
  ...props 
}: RoleSelectorProps) {
  const { user, updateUserRole } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentRole = user?.role ? ROLE_PERMISSIONS[user.role] : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && 
          buttonRef.current &&
          !dropdownRef.current.contains(event.target as Node) && 
          !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!user) return null;

  return (
    <div className={cn('relative', className)} {...props}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2',
          'bg-card hover:bg-accent/80',
          'border border-border',
          'rounded-lg px-3 py-2',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'text-sm font-medium'
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green/10">
          <User className="h-4 w-4 text-green" />
        </div>
        <span className="text-foreground">
          {currentRole?.displayName || 'Select Role'}
        </span>
        <ChevronDown 
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'transform rotate-180'
          )} 
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={cn(
            'absolute z-50 mt-2 w-56',
            'bg-popover text-popover-foreground',
            'border border-border rounded-lg shadow-lg',
            'animate-in fade-in-80',
            'overflow-hidden',
            {
              'right-0': align === 'end',
              'left-0': align === 'start',
              'left-1/2 -translate-x-1/2': align === 'center',
            }
          )}
          style={{
            top: `calc(100% + ${sideOffset}px)`,
          }}
        >
          <div className="p-1">
            {Object.entries(ROLE_PERMISSIONS).map(([role, { icon: Icon, displayName }]) => {
              const isActive = user.role === role;
              return (
                <button
                  key={role}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    updateUserRole(role as UserRole);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md',
                    'transition-colors duration-150',
                    'focus:outline-none focus:bg-accent focus:text-accent-foreground',
                    isActive
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <div 
                    className={cn(
                      'p-1.5 rounded-full flex-shrink-0',
                      isActive 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-muted text-muted-foreground',
                      'flex items-center justify-center w-6 h-6 text-sm' // Ensures consistent size
                    )}
                    aria-hidden="true"
                  >
                    {typeof Icon === 'string' ? (
                      <span>{Icon}</span>
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-left">{displayName}</span>
                  {isActive && (
                    <span className="ml-auto h-4 w-4 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}