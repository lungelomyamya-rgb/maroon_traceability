'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Plus,
  Eye,
  Edit,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { products } = useProducts();
  const [isChecking, setIsChecking] = useState(true);

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

    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [currentUser, router, isChecking]);

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

  // Filter products for current farmer (for demo, we'll use all products)
  const farmerProducts = products;

  // Calculate metrics
  const activeProducts = farmerProducts.length;
  const growingCrops = farmerProducts.filter(p => p.status === 'pending').length;
  const readyForHarvest = farmerProducts.filter(p => p.status === 'verified').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Growing';
      case 'verified':
        return 'Ready for Harvest';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      {/* Header with Add Button - Above Cards */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              Back
            </Button>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Products</h2>
          </div>
          <Button
            onClick={() => router.push('/farmer/seeds')}
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Add New Product
          </Button>
        </div>
      </div>

      <DashboardLayout
        description="Manage your agricultural products and track their growth"
        cards={[
          {
            title: 'Active Products',
            value: activeProducts,
            icon: <Package className="h-6 w-6" />,
            color: 'green',
            variant: 'total-transactions'
          },
          {
            title: 'Growing Crops',
            value: growingCrops,
            icon: <TrendingUp className="h-6 w-6" />,
            color: 'lime',
            variant: 'success'
          },
          {
            title: 'Ready for Harvest',
            value: readyForHarvest,
            icon: <Package className="h-6 w-6" />,
            color: 'blue',
            variant: 'monthly-revenue'
          }
        ]}
      >
        <div className="space-y-6">
          {/* Products Grid */}
        {farmerProducts.length === 0 ? (
          <Card className="p-4 sm:p-6 lg:p-8 text-center">
            <Package className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-sm text-gray-600 mb-4">Start by adding your first agricultural product</p>
            <Button onClick={() => router.push('/farmer/seeds')} className="text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add Product
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {farmerProducts.map((product) => (
              <Card key={product.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate" title={product.name}>{product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{product.description}</p>
                  </div>
                  <Badge className={`${getStatusColor(product.status)} text-xs whitespace-nowrap flex-shrink-0`}>
                    {getStatusLabel(product.status)}
                  </Badge>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">{product.location || 'Farm Location'}</span>
                  </div>
                  
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Created: {new Date(product.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  {product.category && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate capitalize">{product.category}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/farmer/products/${product.id}`)}
                    className="flex-1 text-xs sm:text-sm"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/farmer/products/${product.id}`)}
                    className="flex-1 text-xs sm:text-sm"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
    </>
  );
}
