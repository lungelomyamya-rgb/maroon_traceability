// src/app/farmer/page.tsx
'use client';

import { RoleDashboard } from '@/components/dashboard/roleDashboard';
import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FarmerPage() {
  const { user } = useUser();
  const userRole = user?.role;
  const router = useRouter();

  useEffect(() => {
    if (userRole !== 'farmer') {
      router.push('/unauthorized');
    }
  }, [userRole, router]);

  if (userRole !== 'farmer') {
    return null;
  }

  return <RoleDashboard role="farmer" />;
}
