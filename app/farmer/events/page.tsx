// src/app/farmer/events/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { ProductEventList } from '@/components/events/productEventList';
import { EventForm } from '@/components/events/eventForm';
import { Plus, Calendar, TrendingUp, Package, Sprout, Droplets, Shield } from 'lucide-react';

export default function EventManagementPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { products } = useProducts();
  const [isChecking, setIsChecking] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');

  // Get products for the current farmer (for demo, we'll use the first few products)
  const farmerProducts = products.length > 0 ? products.slice(0, 3) : [];

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(false);
      
      // If user is not logged in, redirect to login
      if (!currentUser) {
        router.replace('/login?redirect=/farmer/events');
        return;
      }
      // If user is logged in but not a farmer, redirect to unauthorized
      if (currentUser.role && !['farmer'].includes(currentUser.role)) {
        router.replace('/unauthorized');
        return;
      }
    };

    // Add a small delay to prevent flickering
    const timeoutId = setTimeout(checkAuth, 100);

    return () => clearTimeout(timeoutId);
  }, [currentUser, router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'farmer') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleEventSubmit = async (eventData: any) => {
    try {
      console.log('Event submitted:', eventData);
      setShowEventForm(false);
      // In a real app, you would save the event to your backend
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  return (
    <>
      {/* Back Button - True Top Corner */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <Button 
          variant="outline"
          onClick={() => router.push('/farmer')}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <span className="hidden sm:inline">Back to Profile</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>
      
      <DashboardLayout
        title="Event Management"
        subtitle="Track and manage your farm events from seed to sale"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              onClick={() => setShowEventForm(!showEventForm)}
              className="bg-green hover:bg-green-hover text-white shadow-lg w-full sm:w-auto"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Event</span>
              <span className="sm:hidden">Event</span>
            </Button>
          </div>
        }
      >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Card className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-green-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{farmerProducts.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Active Products</p>
            </div>
          </Card>
          <Card className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-blue-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">27</p>
              <p className="text-xs sm:text-sm text-gray-600">Total Events</p>
            </div>
          </Card>
          <Card className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-orange-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">3</p>
              <p className="text-xs sm:text-sm text-gray-600">This Week</p>
            </div>
          </Card>
          <Card className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-purple-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">2</p>
              <p className="text-xs sm:text-sm text-gray-600">Pending</p>
            </div>
          </Card>
        </div>

        {/* Event Form */}
        {showEventForm && (
          <Card className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Add New Event</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowEventForm(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
            <EventForm 
              productId={selectedProduct || farmerProducts[0]?.id || ''}
              onSubmit={handleEventSubmit}
            />
          </Card>
        )}

        {/* Product Events */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">Recent Product Events</h3>
          {farmerProducts.length > 0 ? (
            farmerProducts.map((product) => (
              <Card key={product.id} className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4 gap-2">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900">{product.name}</h4>
                  <Badge variant="outline" className="text-xs sm:text-sm w-fit">{product.category}</Badge>
                </div>
                <ProductEventList productId={product.id} />
              </Card>
            ))
          ) : (
            <Card className="p-6 sm:p-8 lg:p-12 text-center">
              <p className="text-sm sm:text-base text-gray-500">No products available. Add your first product to see events.</p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
    </>
  );
}
