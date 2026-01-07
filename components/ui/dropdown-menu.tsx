// src/components/ui/dropdown-menu.tsx
import React, { forwardRef } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  open?: boolean;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(({ children, open, onOpenChange }, ref) => {
  return <div ref={ref} className="relative inline-block text-left">{children}</div>;
});

export function DropdownMenuTrigger({ children, asChild = false, onClick }: DropdownMenuTriggerProps) {
  return <div onClick={onClick}>{children}</div>;
}

export function DropdownMenuContent({ children, className = '', align = 'end', sideOffset = 4, open = true }: DropdownMenuContentProps) {
  if (!open) return null;
  
  const alignmentClasses = {
    start: 'origin-top-left left-0',
    center: 'origin-top-left left-1/2 transform -translate-x-1/2',
    end: 'origin-top-right right-0',
  };

  return (
    <div className={`absolute z-50 mt-2 w-56 rounded-md bg-popover border border-border shadow-md ${alignmentClasses[align]} ${className}`}>
      <div className="py-1">{children}</div>
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, className = '' }: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
    >
      {children}
    </button>
  );
}
