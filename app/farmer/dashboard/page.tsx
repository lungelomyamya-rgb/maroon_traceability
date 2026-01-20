// src/app/farmer/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, AlertCircle, Sprout, Droplets, Shield } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EventForm } from '@/components/events/eventForm';
import { ProductEventList } from '@/components/events/productEventList';
import { GrowthStageMonitor } from '@/components/farmer/growthStageMonitor';
import { FertiliserLog } from '@/components/farmer/fertiliserLog';
import { SeedVarietyTracker } from '@/components/farmer/seedVarietyTracker';
import { ComplianceStatus } from '@/components/farmer/complianceStatus';

export default function FarmerDashboard() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [showEventForm, setShowEventForm] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'farmer') {
      router.push('/unauthorized');
      return;
    }
  }, [currentUser, router]);

  const farmerProducts = products.length > 0 ? products.slice(0, 1) : []; // Show only 1 product for cleaner dashboard

  if (!currentUser || currentUser.role !== 'farmer') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Metrics cards for the dashboard
  const metricsCards = [
    {
      title: 'Active Products',
      value: farmerProducts.length,
      icon: <Package className="h-6 w-6" />,
      color: 'green',
      variant: 'total-transactions'
    },
    {
      title: 'Growing Crops',
      value: farmerProducts.filter(p => p.status === 'pending').length,
      icon: <Package className="h-6 w-6" />,
      color: 'lime',
      variant: 'success'
    },
    {
      title: 'Ready for Harvest',
      value: farmerProducts.filter(p => p.status === 'verified').length,
      icon: <Package className="h-6 w-6" />,
      color: 'blue',
      variant: 'monthly-revenue'
    },
    {
      title: 'Compliance Needed',
      value: 2,
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'orange',
      variant: 'warning'
    }
  ];

  return (
    <DashboardLayout
      title={`Welcome, ${currentUser?.name || 'Farmer'}!`}
      subtitle="Manage your farm operations and track products from seed to sale"
      cards={metricsCards}
      actions={
        <div className="flex justify-center gap-2 sm:gap-3 lg:gap-4">
          <Button 
            onClick={() => setShowEventForm(!showEventForm)}
            className="bg-green hover:bg-green-hover text-white shadow-lg"
            size="lg"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Event</span>
          </Button>
          <Button 
            onClick={() => router.push('/farmer/seeds')}
            className="bg-blue hover:bg-blue-hover text-white shadow-lg"
            size="lg"
          >
            <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Manage Seeds</span>
            <span className="sm:hidden">Seeds</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Event Management Section */}
        {showEventForm && (
          <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium">Create New Event</h3>
              <Button 
                variant="outline" 
                onClick={() => setShowEventForm(false)}
                className="h-8 sm:h-10 w-8 sm:w-auto"
              >
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">×</span>
              </Button>
            </div>
            <EventForm 
              productId={selectedProduct || farmerProducts[0]?.id || ''}
              onSubmit={async (data) => {
                console.log('Event submitted:', data);
                setShowEventForm(false);
              }}
            />
          </Card>
        )}

        {/* Quick Actions - Navigation to Dedicated Pages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="cursor-pointer" onClick={() => router.push('/farmer/growth')}>
            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-green-100 rounded-full mb-2 sm:mb-4">
                  <Sprout className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">Growth Monitoring</h3>
                <p className="text-xs text-gray-600">Track plant growth stages</p>
              </div>
            </Card>
          </div>

          <div className="cursor-pointer" onClick={() => router.push('/farmer/fertiliser')}>
            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-blue-100 rounded-full mb-2 sm:mb-4">
                  <Droplets className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">Fertiliser Log</h3>
                <p className="text-xs text-gray-600">Manage applications</p>
              </div>
            </Card>
          </div>

          <div className="cursor-pointer" onClick={() => router.push('/farmer/seeds')}>
            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-purple-100 rounded-full mb-2 sm:mb-4">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                </div>
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">Seed Varieties</h3>
                <p className="text-xs text-gray-600">Track seed inventory</p>
              </div>
            </Card>
          </div>

          <div className="cursor-pointer" onClick={() => router.push('/farmer/compliance')}>
            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-orange-100 rounded-full mb-2 sm:mb-4">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
                </div>
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">Compliance</h3>
                <p className="text-xs text-gray-600">Regulations & certifications</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
