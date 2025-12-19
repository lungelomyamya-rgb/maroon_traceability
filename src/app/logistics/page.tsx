// src/app/logistics/page.tsx
'use client';

import { RoleDashboard } from '@/components/dashboard/roleDashboard';
import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogisticsPage() {
  const { user } = useUser();
  const userRole = user?.role;
  const router = useRouter();

  useEffect(() => {
    if (userRole !== 'logistics') {
      router.push('/unauthorized');
    }
  }, [userRole, router]);

  if (userRole !== 'logistics') {
    return null;
  }

  return (
    <RoleDashboard role="logistics" />
  );
}