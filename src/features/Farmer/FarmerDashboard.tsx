'use client';

import { Package, MapPin, Calendar, Plus, Eye, Sprout, Droplets, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useProducts } from '@/contexts/productContext';
import { useUser } from '@/contexts/userContext';
import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';

// Lazy load large components
const EventForm = dynamic(() => import('@/src/features/shared/components/forms').then(mod => ({ default: mod.ProductEventForm })), {
  loading: () => <div>Loading event form...</div>,
  ssr: false,
});

/**
 * Main Farmer Dashboard Component
 * 
 * @description Comprehensive dashboard for farmer operations including product management,
 * event tracking, growth monitoring, fertiliser logging, seed variety tracking,
 * and compliance management.
 * 
 * @example
 * ```tsx
 * <FarmerDashboard />
 * ```
 */
export function FarmerDashboard() {
  const router = useRouter();
  const { currentUser: _currentUser } = useUser();
  const { products } = useProducts();
  const [showEventForm, setShowEventForm] = useState(false);

  // Get products for current farmer (for demo, we'll use first few products)
  const farmerProducts = products.length > 0 ? products.slice(0, 3) : [];

  // Calculate metrics for hero section
  const activeProducts = farmerProducts.length;
  const growingCrops = farmerProducts.filter(p => p.status === 'pending').length;
  const readyForHarvest = farmerProducts.filter(p => p.status === 'verified').length;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-4 sm:p-8 text-white relative">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Farm Management</h1>
          <p className="text-green-100 mb-4 sm:mb-6 text-sm sm:text-base">Complete agricultural operations management for Maroon Traceability System</p>
          <div className="flex justify-center items-center gap-3 sm:gap-6 mb-4 sm:mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">{activeProducts} Active Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">{growingCrops} Growing Crops</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">{readyForHarvest} Ready for Harvest</span>
            </div>
          </div>
          <div className="hidden md:block">
            <Sprout className="h-12 w-12 sm:h-16 sm:w-16 text-green-200 mx-auto" />
          </div>
        </div>
      </div>

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
            productId={farmerProducts[0]?.id || ''}
            onSubmit={async (data: Record<string, unknown>) => {
              console.log('Event submitted:', data);
              setShowEventForm(false);
            }}
          />
        </Card>
      )}

      {/* Quick Actions - Navigation to Dedicated Pages */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <div className="cursor-pointer" onClick={() => setShowEventForm(true)}>
          <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-emerald-100 rounded-full mb-2 sm:mb-4">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-600" />
              </div>
              <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">Event Management</h3>
              <p className="text-xs text-gray-600">Add farm events</p>
            </div>
          </Card>
        </div>

        <div className="cursor-pointer" onClick={() => router.push('/farmer/growth')}>
          <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-green-100 rounded-full mb-2 sm:mb-4">
                <Sprout className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
              </div>
              <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">Growth Monitoring</h3>
              <p className="text-xs text-gray-600">Track growth stages</p>
            </div>
          </Card>
        </div>

        <div className="cursor-pointer" onClick={() => router.push('/farmer/fertiliser')}>
          <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-blue-100 rounded-full mb-2 sm:mb-4">
                <Droplets className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
              <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">Fertiliser Logs</h3>
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

        <div className="cursor-pointer" onClick={() => router.push('/farmer/products')}>
          <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-blue-100 rounded-full mb-2 sm:mb-4">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
              <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">Products</h3>
              <p className="text-xs text-gray-600">Manage products</p>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">My Products</h2>
          <Button onClick={() => router.push('/farmer/seeds')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add New Product</span>
            <span className="sm:hidden">Add Product</span>
          </Button>
        </div>

        {farmerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {farmerProducts.map((product) => (
              <Card key={product.id} className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      {product.location}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2">{product.category}</Badge>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-3">
                  <div>
                    <span className="block">Batch: {product.batchSize}</span>
                    <span className="block">Status: {product.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="block">Verifications: {product.verifications}</span>
                    <span className="block">Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/farmer/products/${product.id}`)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => router.push(`/farmer/events?productId=${product.id}`)}
                    className="flex-1"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Add Event
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 sm:p-8 lg:p-12 text-center">
            <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first product to begin tracking your farm operations.</p>
            <Button onClick={() => router.push('/farmer/seeds')} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Your First Product</span>
              <span className="sm:hidden">Add Product</span>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
