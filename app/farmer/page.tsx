// src/app/farmer/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Package, MapPin, Calendar, TrendingUp, Plus, Eye, Sprout, Droplets, Shield } from 'lucide-react';
import type { UserRole } from '@/types/user';

export default function FarmerPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { products } = useProducts();
  const [isChecking, setIsChecking] = useState(true);

  // Get products for the current farmer (for demo, we'll use the first product)
  const farmerProducts = products.length > 0 ? products.slice(0, 1) : [];

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(false);
      
      // If user is not logged in, redirect to login
      if (!currentUser) {
        router.replace('/login?redirect=/farmer');
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Farmer Profile Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome, {currentUser.name || 'Farmer'}</h1>
              <p className="text-green-100">Manage your farm products and track their journey</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={() => router.push('/farmer/events')}
                className="bg-white text-green-600 hover:bg-green-50 w-full sm:w-auto"
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Event Management</span>
                <span className="sm:hidden">Events</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Card className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-green-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{farmerProducts.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Total Products</p>
            </div>
          </Card>
          <Card className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-blue-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">98%</p>
              <p className="text-xs sm:text-sm text-gray-600">Quality Score</p>
            </div>
          </Card>
          <Card className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-orange-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">3</p>
              <p className="text-xs sm:text-sm text-gray-600">Locations</p>
            </div>
          </Card>
          <Card className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-purple-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">15</p>
              <p className="text-xs sm:text-sm text-gray-600">Days Active</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions - Navigation to Dedicated Pages */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 mb-1">Products</h3>
                <p className="text-xs text-gray-600">Manage farm products</p>
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
                      className="flex-1"
                      onClick={() => router.push(`/farmer/products/${product.id}`)}
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push('/farmer/seeds')}
                    >
                      Manage
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 sm:p-8 lg:p-12 text-center">
              <Package className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Start by adding your first product to track its journey.</p>
              <Button onClick={() => router.push('/farmer/seeds')} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
