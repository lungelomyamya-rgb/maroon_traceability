// src/components/ui/switch.tsx

import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', checked, onCheckedChange, disabled = false, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked);
    };

    return (
      <label className="relative inline-flex h-6 w-11 items-center rounded-full">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'peer sr-only h-4 w-4 shrink-0 cursor-pointer disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        <div
          className={cn(
            'pointer-events-none block h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <div
            className={cn(
              'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform peer-checked:translate-x-5 peer-checked:ring-0 peer-disabled:translate-x-0',
              checked && 'translate-x-5',
              disabled && 'translate-x-0',
            )}
          />
        </div>
      </label>
    );
  },
);

Switch.displayName = 'Switch';
