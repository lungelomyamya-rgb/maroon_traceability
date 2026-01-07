// src/app/logistics/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { EnhancedEventForm } from '@/components/logistics/enhancedEventForm';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Clock } from 'lucide-react';
import { Vehicle, Driver } from '@/types/logistics';

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

    // Load mock data
    const mockVehicles: Vehicle[] = [
      {
        id: 'veh1',
        registrationNumber: 'CA 123456',
        make: 'Mercedes-Benz',
        model: 'Actros 1845',
        year: 2022,
        type: 'truck',
        capacity: 28000,
        status: 'active',
        currentDriver: 'driver1',
        lastMaintenance: '2025-01-15',
        nextMaintenance: '2025-04-15',
        insuranceExpiry: '2025-12-31',
        registrationExpiry: '2026-03-31',
        features: ['GPS Tracking', 'Air Suspension', 'Sleeping Cabin'],
        location: { lat: -33.9249, lng: 18.4241 }
      },
      {
        id: 'veh2',
        registrationNumber: 'CA 789012',
        make: 'Isuzu',
        model: 'NPR 300',
        year: 2021,
        type: 'refrigerated',
        capacity: 3500,
        status: 'available',
        lastMaintenance: '2025-01-10',
        nextMaintenance: '2025-04-10',
        insuranceExpiry: '2025-11-30',
        registrationExpiry: '2026-02-28',
        features: ['Temperature Control', 'Refrigerated', 'GPS Tracking'],
        location: { lat: -33.8688, lng: 18.5058 }
      }
    ];

    const mockDrivers: Driver[] = [
      {
        id: 'driver1',
        name: 'John Smith',
        phone: '+27 83 123 4567',
        email: 'john.smith@logistics.co.za',
        licenseNumber: 'DL12345678901',
        licenseExpiry: '2025-12-31',
        certifications: ['Commercial Driver License', 'Refrigerated Goods', 'Food Safety Handling'],
        status: 'on-delivery',
        currentVehicle: 'veh1',
        currentLocation: { lat: -33.9249, lng: 18.4241 },
        experience: 8,
        rating: 4.8,
        totalDeliveries: 342,
        onTimeDeliveryRate: 96.5
      },
      {
        id: 'driver2',
        name: 'Maria Johnson',
        phone: '+27 82 987 6543',
        email: 'maria.j@logistics.co.za',
        licenseNumber: 'DL98765432109',
        licenseExpiry: '2026-03-15',
        certifications: ['Commercial Driver License', 'Hazardous Materials', 'Defensive Driving'],
        status: 'available',
        currentLocation: { lat: -33.8688, lng: 18.5058 },
        experience: 5,
        rating: 4.6,
        totalDeliveries: 189,
        onTimeDeliveryRate: 94.2
      }
    ];

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
  );
}
