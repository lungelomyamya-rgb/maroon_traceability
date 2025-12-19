// src/app/inspector/page.tsx
'use client';

import { RoleDashboard } from '@/components/dashboard/roleDashboard';
import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InspectorPage() {
  const { user } = useUser();
  const userRole = user?.role;
  const router = useRouter();

  useEffect(() => {
    if (userRole !== 'inspector') {
      router.push('/unauthorized');
    }
  }, [userRole, router]);

  if (userRole !== 'inspector') {
    return null;
  }

  return (
    <RoleDashboard role="inspector" />
  );
}