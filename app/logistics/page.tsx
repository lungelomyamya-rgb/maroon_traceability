// src/app/logistics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MetricsCard } from '@/components/dashboard/metricsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Users, Calendar, FileText, Plus, MapPin, Package, Route } from 'lucide-react';
import { getRoleColors } from '@/lib/theme/colors';
import { Vehicle, Driver, TransportSchedule } from '@/types/logistics';

export default function LogisticsPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);

  useEffect(() => {
    // Redirect with delay for context update
    const timer = setTimeout(() => {
      // If user is not logged in, redirect to login
      if (!currentUser) {
        router.push('/login?redirect=/logistics');
        return;
      }
      
      // If user is logged in but doesn't have logistics role, redirect to unauthorized
      if (currentUser.role !== 'logistics') {
        console.log('Logistics page - redirecting to unauthorized. Current user:', currentUser);
        router.push('/unauthorized');
        return;
      }
    }, 200);

    return () => clearTimeout(timer);

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

    const mockSchedules: TransportSchedule[] = [
      {
        id: 'sched1',
        vehicleId: 'veh1',
        driverId: 'driver1',
        productId: 'PRD-2024-001',
        route: {
          origin: {
            name: 'Green Valley Farm',
            address: '123 Farm Road, Stellenbosch',
            lat: -33.9249,
            lng: 18.4241,
            contact: '+27 21 123 4567'
          },
          destination: {
            name: 'Fresh Market Cape Town',
            address: '456 Market St, Cape Town',
            lat: -33.9249,
            lng: 18.4241,
            contact: '+27 21 987 6543'
          }
        },
        scheduledDate: '2025-01-25T08:00:00Z',
        estimatedDuration: 120,
        status: 'scheduled',
        priority: 'high',
        cargoDetails: {
          weight: 500,
          volume: 2,
          temperatureRequirements: '2-4°C',
          specialHandling: ['Refrigerated', 'Perishable']
        },
        documents: [],
        notes: 'Organic apples - handle with care',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-20T10:00:00Z'
      }
    ];

    setVehicles(mockVehicles);
    setDrivers(mockDrivers);
    setSchedules(mockSchedules);
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'logistics') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const availableDrivers = drivers.filter(d => d.status === 'available').length;
  const scheduledTransports = schedules.filter(s => s.status === 'scheduled').length;
  const inTransit = schedules.filter(s => s.status === 'in-transit').length;

  return (
    <DashboardLayout
      description="Manage vehicles, drivers, and transport schedules"
    >
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Logistics Management</h1>
            <p className="text-blue-100 mb-6">Complete transport and fleet management for the Maroon Traceability System</p>
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <span className="text-sm">{activeVehicles} Active Vehicles</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">{availableDrivers} Available Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                <span className="text-sm">{inTransit} In Transit</span>
              </div>
            </div>
            <div className="hidden md:block">
              <Package className="h-16 w-16 text-blue-200 mx-auto" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/logistics/vehicles')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
          >
            <Truck className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Add Vehicle</div>
              <div className="text-xs opacity-90">Register new vehicle</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/logistics/drivers')}
            className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
          >
            <Users className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Add Driver</div>
              <div className="text-xs opacity-90">Register new driver</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/logistics/scheduling')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
          >
            <Calendar className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Schedule Transport</div>
              <div className="text-xs opacity-90">Create new schedule</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/logistics/order-tracking')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
          >
            <Route className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Order Tracking</div>
              <div className="text-xs opacity-90">Track deliveries in real-time</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/logistics/events')}
            className="bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-2 h-auto p-4 rounded-md font-medium transition-colors"
          >
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Log Event</div>
              <div className="text-xs opacity-90">Record logistics activity</div>
            </div>
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{activeVehicles}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{availableDrivers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{scheduledTransports}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{inTransit}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {schedules.slice(0, 3).map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{schedule.productId}</p>
                    <p className="text-sm text-gray-500">
                      {schedule.route.origin.name} → {schedule.route.destination.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={
                    schedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    schedule.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {schedule.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(schedule.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
