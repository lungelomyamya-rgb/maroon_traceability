// src/app/logistics/scheduling/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { TransportScheduling } from '@/components/logistics/transportScheduling';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Vehicle, Driver } from '@/types/logistics';
import { mockVehicles, mockDrivers } from '@/constants/logisticsMockData';

export default function LogisticsSchedulingPage() {
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
        title="Transport Scheduling"
        subtitle="Schedule transports, manage routes, and optimize deliveries"
      >
        <TransportScheduling vehicles={vehicles} drivers={drivers} />
      </DashboardLayout>
    </>
  );
}
