// src/components/roleSelector.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/contexts/userContext';
import { User, UserRole, ROLE_PERMISSIONS } from '@/types/user';
import { DEMO_USERS } from '@/constants/users';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: Parameters<typeof twMerge>) => twMerge(...inputs);

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

type DisplayMode = 'dropdown' | 'card' | 'button-group';

interface RoleSelectorProps {
  /**
   * Display mode for the role selector
   * @default 'dropdown'
   */
  displayMode?: DisplayMode;
  /**
   * Additional class name for the container
   */
  className?: string;
  /**
   * Callback when a role is selected
   */
  onRoleChange?: (role: UserRole) => void;
  /**
   * Alignment for dropdown menu
   * @default 'end'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Offset for dropdown menu
   * @default 4
   */
  sideOffset?: number;
}

export function RoleSelector({
  displayMode = 'dropdown',
  className,
  onRoleChange,
  align = 'end',
  sideOffset = 4,
}: RoleSelectorProps) {
  const { currentUser, switchUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = async (role: UserRole) => {
    if (role === currentUser?.role) return;
    
    try {
      // Find a demo user with the new role
      const newUser = DEMO_USERS.find((user: User) => user.role === role);
      if (newUser) {
        // Use switchUser to update the user context with the new user ID
        switchUser(newUser.id);
        onRoleChange?.(role);
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsOpen(false);
    }
  };

  if (displayMode === 'dropdown') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button className={cn('flex items-center gap-2', className)} onClick={() => setIsOpen(!isOpen)}>
            <span>{currentUser?.role ? ROLE_PERMISSIONS[currentUser.role as UserRole]?.displayName : 'Select Role'}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-2" open={isOpen}>
          {Object.entries(ROLE_PERMISSIONS).map(([role, config]) => (
            <DropdownMenuItem key={role} onClick={() => handleRoleChange(role as UserRole)}>
              <span>{config.displayName}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (displayMode === 'card') {
    return (
      <Card
        variant="default"
        title={`Current Role: ${currentUser?.role ? ROLE_PERMISSIONS[currentUser.role as UserRole]?.displayName : 'None'}`}
        description="Switch between different user roles to explore the application"
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(ROLE_PERMISSIONS).map(([role, config]) => (
            <Button
              key={role}
              variant={currentUser?.role === role ? "default" : "outline"}
              size="sm"
              onClick={() => handleRoleChange(role as UserRole)}
              className="flex items-center gap-2"
            >
              <span>{typeof config.icon === 'string' ? config.icon : <config.icon />}</span>
              {config.displayName}
            </Button>
          ))}
        </div>
      </Card>
    );
  }

  // Default to button group if no valid display mode
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(ROLE_PERMISSIONS).map(([role, config]) => (
        <Button
          key={role}
          variant={currentUser?.role === role ? "default" : "outline"}
          size="sm"
          onClick={() => handleRoleChange(role as UserRole)}
          className="flex items-center gap-2"
        >
          <span>{typeof config.icon === 'string' ? config.icon : <config.icon />}</span>
          {config.displayName}
        </Button>
      ))}
    </div>
  );
}
