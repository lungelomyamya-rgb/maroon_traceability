// src/components/layout/RoleSelector.tsx
'use client';

import { useUser } from '@/contexts/userContext';
import { UserRole } from '@/types/user';
import { User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleIcons = {
  farmer: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  retailer: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
      <path d="M3 6h18"></path>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  )
};

export function RoleSelector() {
  const { userRole, setUserRole } = useUser();

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 bg-background/80 hover:bg-muted/50 transition-colors rounded-lg border border-border/60 px-3 py-1.5 cursor-pointer">
        <div className="text-primary">
          {roleIcons[userRole]}
        </div>
        <span className="text-sm font-medium capitalize text-foreground/90">
          {userRole}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground/70 transition-transform group-hover:translate-y-0.5" />
      </div>
      <select
        id="user-role"
        value={userRole}
        onChange={(e) => setUserRole(e.target.value as UserRole)}
        className={cn(
          'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
          'appearance-none' // Hide default select arrow
        )}
        aria-label="Select user role"
      >
        <option value="farmer">Farmer</option>
        <option value="retailer">Retailer</option>
      </select>
    </div>
  );
}