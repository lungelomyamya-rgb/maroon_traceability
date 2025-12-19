// src/app/packaging/page.tsx
'use client';

import { RoleDashboard } from '@/components/dashboard/roleDashboard';
import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PackagingPage() {
  const { user } = useUser();
const userRole = user?.role;
  const router = useRouter();

  useEffect(() => {
    if (userRole !== 'packaging') {
      router.push('/unauthorized');
    }
  }, [userRole, router]);

  if (userRole !== 'packaging') {
    return null;
  }

  return <RoleDashboard role="packaging" />;
}