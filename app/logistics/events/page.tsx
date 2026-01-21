// src/app/logistics/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { EnhancedEventForm } from '@/components/logistics/eventForm';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Vehicle, Driver } from '@/types/logistics';
import { mockVehicles, mockDrivers } from '@/constants/logisticsMockData';

export default function LogisticsEventsPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    // Redirect if user doesn't have logistics role
    if (currentUser?.role !== 'logistics') {
      router.push('/unauthorized');
      return;
    }

    // Load mock data from consolidated file
    setVehicles(mockVehicles);
    setDrivers(mockDrivers);
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'logistics') {
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
          onClick={() => router.push('/logistics')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>
      
      <DashboardLayout
        title="Logistics Events"
        subtitle="Record transport events, collections, and delivery activities"
      >
        <EnhancedEventForm
          productId="PRD-2024-001"
          onSubmit={async (data) => {
            console.log('Enhanced event submitted:', data);
          }}
          vehicles={vehicles}
          drivers={drivers}
        />
      </DashboardLayout>
    </>
  );
}
