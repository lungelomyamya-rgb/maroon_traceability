// src/app/packaging/inventory/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/userContext';
import { PackagingInventory } from '@/src/features/Packaging/components';


export default function PackagingInventoryPage() {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user doesn't have packaging role
    if (currentUser?.role !== 'packaging') {
      router.push('/unauthorized');
      return;
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'packaging') {
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
          onClick={() => router.push('/packaging')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>

      <DashboardLayout
        title="Packaging Inventory"
        subtitle="Manage packaging materials and inventory levels"
      >
        <PackagingInventory />
      </DashboardLayout>
    </>
  );
}
