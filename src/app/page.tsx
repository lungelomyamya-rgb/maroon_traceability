// src/app/page.tsx
'use client';

import { useUser } from '@/contexts/userContext';
import { FarmerDashboard } from '@/components/dashboard/farmerDashboard';
import { RetailerDashboard } from '@/components/dashboard/retailerDashboard';

export default function Home() {
  const { userRole } = useUser();

  return (
    <>
      {userRole === 'farmer' ? <FarmerDashboard /> : <RetailerDashboard />}
    </>
  );
}