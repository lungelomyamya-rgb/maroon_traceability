// src/components/common/roleSelector.tsx
'use client';

import React from 'react';
import { useUser } from '@/contexts/userContext';
import { ROLE_PERMISSIONS, UserRole } from '@/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RoleSelector() {
  const { user, updateUserRole } = useUser();

  const handleRoleChange = (role: UserRole) => {
    updateUserRole(role);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Current Role: {user?.role ? ROLE_PERMISSIONS[user.role].displayName : 'None'}</h3>
            <p className="text-sm text-muted-foreground">Switch between different user roles to explore the application</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(ROLE_PERMISSIONS).map(([role, config]) => (
              <Button
                key={role}
                variant={user?.role === role ? "primary" : "outline"}
                size="sm"
                onClick={() => handleRoleChange(role as UserRole)}
                className="flex items-center gap-2"
              >
                <span>{typeof config.icon === 'string' ? config.icon : <config.icon />}</span>
                {config.displayName}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
