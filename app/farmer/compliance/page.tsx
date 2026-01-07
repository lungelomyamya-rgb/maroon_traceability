// src/app/farmer/compliance/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ComplianceStatus } from '@/components/farmer/complianceStatus';

export default function FarmerCompliancePage() {
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
      title="Compliance & Regulations"
      subtitle="Manage food safety, export compliance, and regulatory requirements"
    >
      <ComplianceStatus products={farmerProducts} />
    </DashboardLayout>
  );
}
