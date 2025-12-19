// src/app/viewer/page.tsx
'use client';

import { RoleDashboard } from '@/components/dashboard/roleDashboard';
import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ViewerPage() {
  const { user, setUser } = useUser();
  const userRole = user?.role;
  const router = useRouter();

  // Set default viewer user if no user exists
  useEffect(() => {
    if (!user) {
      setUser({
        id: 'viewer',
        name: 'Viewer',
        email: 'viewer@example.com',
        role: 'viewer',
        permissions: {
          canCreate: false,
          canVerify: false,
        }
      });
    }
  }, [user, setUser]);

  // Redirect if user has a different role
  useEffect(() => {
    if (userRole && userRole !== 'viewer') {
      router.push('/unauthorized');
    }
  }, [userRole, router]);

  if (userRole && userRole !== 'viewer') {
    return null;
  }

  return (
    <RoleDashboard role="viewer" />
  );
}