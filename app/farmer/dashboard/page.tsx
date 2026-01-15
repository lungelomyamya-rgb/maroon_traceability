// src/app/farmer/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <DashboardLayout
      title={`Welcome, ${currentUser?.name || 'Farmer'}!`}
      subtitle="Manage your farm operations and track products from seed to sale"
      cards={metricsCards}
      actions={
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
            className="bg-blue hover:bg-blue-hover text-white shadow-lg"
            size="lg"
          >
            <Package className="h-4 w-4 mr-2" />
            Manage Seeds
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Event Management Section */}
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

        {/* Product Events */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Product Events</h3>
          {farmerProducts.length > 0 ? (
            farmerProducts.slice(0, 3).map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <ProductEventList productId={product.id} />
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No products available. Add your first product to see events.</p>
            </Card>
          )}
        </div>

        {/* Additional Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GrowthStageMonitor products={farmerProducts} />
          <FertiliserLog products={farmerProducts} />
        </div>

        <SeedVarietyTracker products={farmerProducts} />
        <ComplianceStatus products={farmerProducts} />
      </div>
    </DashboardLayout>
  );
}
