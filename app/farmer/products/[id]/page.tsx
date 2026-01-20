'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProductEventList } from '@/components/events/productEventList';
import { EventForm } from '@/components/events/eventForm';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Plus,
  Edit,
  Eye
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useUser();
  const { products } = useProducts();
  const [isChecking, setIsChecking] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);

  const productId = params.id as string;

  useEffect(() => {
    // Check authentication and role
    if (!isChecking) return;

    const checkAuth = async () => {
      try {
        if (!currentUser) {
          router.push('/login');
          return;
        }

        if (currentUser.role !== 'farmer') {
          router.push('/unauthorized');
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [currentUser, router, isChecking]);

  // Find the product by ID
  const product = products.find(p => p.id === productId);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <DashboardLayout title="Product Not Found">
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push('/farmer')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      {/* Back Button - Top Corner */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <Button 
          variant="outline"
          onClick={() => router.push('/farmer')}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Profile</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>
      
      <DashboardLayout
        title={product.name}
        subtitle={`Product details and event history`}
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
            <Button 
              variant="outline"
              onClick={() => router.push('/farmer/seeds')}
              className="w-full sm:w-auto"
            >
              <Edit className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Edit Product</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          </div>
        }
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Product Overview */}
          <Card className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Product Info */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-3">{product.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs sm:text-sm">{product.category}</Badge>
                      <Badge variant={product.status === 'verified' ? 'default' : 'secondary'} className="text-xs sm:text-sm">
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Batch Size: {product.batchSize}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Verifications: {product.verifications}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4 text-center">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs sm:text-sm text-gray-600">Total Events</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs sm:text-sm text-gray-600">This Week</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center">
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-xs sm:text-sm text-gray-600">Quality Score</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{product.batchSize}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Batch Size</p>
                </Card>
              </div>
            </div>
          </Card>

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
                productId={product.id}
                onSubmit={async (eventData) => {
                  console.log('Event submitted:', eventData);
                  setShowEventForm(false);
                }}
              />
            </Card>
          )}

          {/* Product Events */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Event History</h3>
            <Card className="p-3 sm:p-4 lg:p-6">
              <ProductEventList productId={product.id} />
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
