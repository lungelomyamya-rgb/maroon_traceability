// src/app/farmer/seeds/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SeedVarietyTracker } from '@/components/farmer/seedVarietyTracker';

export default function FarmerSeedsPage() {
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
    <DashboardLayout
      title="Seed Varieties"
      subtitle="Manage seed certifications and track seed performance"
    >
      <SeedVarietyTracker products={farmerProducts} />
    </DashboardLayout>
  );
}
