// src/app/retailer/page.tsx
'use client';

import { RoleDashboard } from '@/components/dashboard/roleDashboard';
import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RetailerPage() {
  const { user } = useUser();
  const userRole = user?.role;
  const router = useRouter();

  useEffect(() => {
    if (userRole !== 'retailer') {
      router.push('/unauthorized');
    }
  }, [userRole, router]);

  if (userRole !== 'retailer') {
    return null;
  }

  return (
    <RoleDashboard role="retailer" />
  );
}