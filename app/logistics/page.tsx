// src/app/logistics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { MetricsCard } from '@/components/dashboard/metricsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Users, Calendar, FileText, Plus, MapPin, Package, Route, ArrowLeft } from 'lucide-react';
import { getRoleColors } from '@/lib/theme/colors';
import { Vehicle, Driver, TransportSchedule, TransportDocument, DocumentType } from '@/types/logistics';
import { mockVehicles, mockDrivers, mockSchedules } from '@/constants/logisticsMockData';

export default function LogisticsPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  
  // Initialize state with mock data immediately
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [schedules, setSchedules] = useState<TransportSchedule[]>(mockSchedules);

  // Handle authentication redirect
  useEffect(() => {
    if (!currentUser) {
      router.push('/login?redirect=/logistics');
      return;
    }
    
    if (currentUser.role !== 'logistics') {
      console.log('Logistics page - redirecting to unauthorized. Current user:', currentUser);
      router.push('/unauthorized');
      return;
    }
  }, [currentUser, router]);

  // Show loading state while checking authentication
  if (false) { // Temporarily disabled for testing
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics from mock data
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-4 sm:p-8 text-white relative">
          <div className="text-center pt-8 sm:pt-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Logistics Management</h1>
            <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">Complete transport and fleet management for Maroon Traceability System</p>
            <div className="flex justify-center items-center gap-3 sm:gap-6 mb-4 sm:mb-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">{activeVehicles} Active Vehicles</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">{availableDrivers} Available Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">{inTransit} In Transit</span>
              </div>
            </div>
            <div className="hidden md:block">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 text-blue-200 mx-auto" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          <button
            onClick={() => router.push('/logistics/vehicles')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col sm:flex-row items-center gap-2 h-auto p-3 sm:p-4 rounded-md font-medium transition-colors"
          >
            <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
            <div className="text-left">
              <div className="font-medium text-sm sm:text-base">Add Vehicle</div>
              <div className="text-xs opacity-90">Register new vehicle</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/logistics/drivers')}
            className="bg-teal-600 hover:bg-teal-700 text-white flex flex-col sm:flex-row items-center gap-2 h-auto p-3 sm:p-4 rounded-md font-medium transition-colors"
          >
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <div className="text-left">
              <div className="font-medium text-sm sm:text-base">Add Driver</div>
              <div className="text-xs opacity-90">Register new driver</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/logistics/scheduling')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white flex flex-col sm:flex-row items-center gap-2 h-auto p-3 sm:p-4 rounded-md font-medium transition-colors"
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            <div className="text-left">
              <div className="font-medium text-sm sm:text-base">Schedule Transport</div>
              <div className="text-xs opacity-90">Create new schedule</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/logistics/order-tracking')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex flex-col sm:flex-row items-center gap-2 h-auto p-3 sm:p-4 rounded-md font-medium transition-colors"
          >
            <Route className="h-4 w-4 sm:h-5 sm:w-5" />
            <div className="text-left">
              <div className="font-medium text-sm sm:text-base">Order Tracking</div>
              <div className="text-xs opacity-90">Track deliveries in real-time</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/logistics/events')}
            className="bg-sky-600 hover:bg-sky-700 text-white flex flex-col sm:flex-row items-center gap-2 h-auto p-3 sm:p-4 rounded-md font-medium transition-colors"
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            <div className="text-left">
              <div className="font-medium text-sm sm:text-base">Log Event</div>
              <div className="text-xs opacity-90">Record logistics activity</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/logistics/documentation')}
            className="bg-purple-600 hover:bg-purple-700 text-white flex flex-col sm:flex-row items-center gap-2 h-auto p-3 sm:p-4 rounded-md font-medium transition-colors"
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            <div className="text-left">
              <div className="font-medium text-sm sm:text-base">Documentation</div>
              <div className="text-xs opacity-90">Manage transport documents</div>
            </div>
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Vehicles</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{activeVehicles}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Truck className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Available Drivers</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{availableDrivers}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{scheduledTransports}</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{inTransit}</p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                <Route className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card title="Recent Activities" className="space-y-4">
          {schedules.slice(0, 3).map((schedule) => (
            <div key={schedule.id} className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{schedule.productId}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    <span className="hidden sm:inline">{schedule.route.origin.name} • </span>
                    <span className="sm:hidden">{schedule.route.origin.name} • </span>
                    {new Date(schedule.scheduledDate).toLocaleDateString('en-ZA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-2 mb-1">
                  <Badge className={
                    schedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    schedule.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {schedule.status}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    Grade A
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </DashboardLayout>
  );
}
