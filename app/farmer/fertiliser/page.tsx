// src/app/farmer/fertiliser/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useProducts } from '@/contexts/productContext';
import { useUser } from '@/contexts/userContext';
import { Button } from '@/src/features/shared/ui/button';


// Lazy load large component
const FertiliserLog = dynamic(() => import('@/src/features/Farmer').then(mod => ({ default: mod.FertiliserLog })), {
  loading: () => <div>Loading fertiliser log...</div>,
  ssr: false,
});

export default function FarmerFertiliserPage() {
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
        title="Fertiliser Logs"
        subtitle="Record nutrient applications and track soil health"
      >
        <FertiliserLog _products={farmerProducts} />
      </DashboardLayout>
    </>
  );
}
