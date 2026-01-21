// src/app/farmer/growth/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// Lazy load large component
const GrowthStageMonitor = dynamic(() => import('@/components/farmer/growthStageMonitor').then(mod => ({ default: mod.GrowthStageMonitor })), {
  loading: () => <div>Loading growth monitor...</div>,
  ssr: false
});

export default function FarmerGrowthPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { products } = useProducts();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'farmer') {
      router.push('/unauthorized');
      return;
    }
  }, [currentUser, router]);

  const farmerProducts = products.filter(p => p.farmerId === currentUser?.id);

  if (!currentUser || currentUser.role !== 'farmer') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/farmer')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>
      
      <DashboardLayout
        title="Growth Monitoring"
        subtitle="Track plant development stages and health status"
      >
        <GrowthStageMonitor products={farmerProducts} />
      </DashboardLayout>
    </>
  );
}
