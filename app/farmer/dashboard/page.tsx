// src/app/farmer/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Package, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-green to-green-light shadow-2xl`}>
        <div className="absolute inset-0 bg-foreground/5"></div>
        <div className="relative z-10 text-center p-8 px-4 sm:px-8">
          <div className="inline-block mb-4 px-4 py-1.5 bg-background/20 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-xs font-medium text-white">Farmer Dashboard</span>
          </div>
          <h1 className="mb-2 text-white text-2xl sm:text-3xl font-bold">
            Welcome, {currentUser?.name || 'Farmer'}!
          </h1>
          <p className="text-white/90 text-sm max-w-md mx-auto mb-6">
            Manage your farm operations and track products from seed to sale
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => setShowEventForm(!showEventForm)}
              className="bg-green hover:bg-green-hover text-white shadow-lg"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
            <Button 
              onClick={() => router.push('/farmer/seeds')}
              className="bg-green hover:bg-green-hover text-white shadow-lg"
              size="lg"
            >
              <Package className="h-4 w-4 mr-2" />
              Manage Seeds
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <DashboardLayout
        title=""
        subtitle=""
        cards={metricsCards}
      >
        <div className="space-y-6">
          {/* Event Management Section */}
          <div>
            {showEventForm && (
              <Card className="p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Create New Event</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEventForm(false)}
                  >
                    Cancel
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

            <ProductEventList productId={selectedProduct} />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
