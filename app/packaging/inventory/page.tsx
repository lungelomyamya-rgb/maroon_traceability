// src/app/packaging/inventory/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Search, Filter, Download, Plus, Eye, Edit, Package } from 'lucide-react';
import { useState } from 'react';

export default function InventoryPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Redirect if user doesn't have packaging role (with delay for context update)
    const timer = setTimeout(() => {
      if (currentUser?.role !== 'packaging') {
        console.log('Inventory page - redirecting to unauthorized. Current user:', currentUser);
        router.push('/unauthorized');
        return;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'packaging') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Mock inventory data
  const inventoryItems = [
    {
      id: 'inv1',
      productId: 'PRD-2024-001',
      productName: 'Organic Apples Premium',
      packagingType: 'cardboard-box',
      currentStock: 150,
      unitOfMeasure: 'boxes',
      location: 'Packhouse 1, Stellenbosch',
      lastUpdated: '2025-01-20T10:30:00Z',
      status: 'in-stock',
      batchCode: 'BATCH-2024-CAR-STL-ABC'
    },
    {
      id: 'inv2',
      productId: 'PRD-2024-002',
      productName: 'Fresh Pears Vacuum Sealed',
      packagingType: 'vacuum-sealed',
      currentStock: 75,
      unitOfMeasure: 'packages',
      location: 'Packhouse 2, Cape Town',
      lastUpdated: '2025-01-20T09:15:00Z',
      status: 'low-stock',
      batchCode: 'BATCH-2024-VAC-STL-DEF'
    },
    {
      id: 'inv3',
      productId: 'PRD-2024-003',
      productName: 'Mixed Citrus Bulk',
      packagingType: 'bulk-bag',
      currentStock: 25,
      unitOfMeasure: 'bags',
      location: 'Packhouse 1, Stellenbosch',
      lastUpdated: '2025-01-20T08:45:00Z',
      status: 'out-of-stock',
      batchCode: 'BATCH-2024-BUL-STL-GHI'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackagingIcon = (type: string) => {
    const icons: Record<string, string> = {
      'cardboard-box': '📦',
      'vacuum-sealed': '🥫',
      'bulk-bag': '👜',
      'plastic-crate': '🗃️',
      'glass-jar': '🫙'
    };
    return icons[type] || '📦';
  };

  return (
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/packaging')}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>
      
      <DashboardLayout
        title="Inventory Management"
        description="Track and manage packaging inventory levels"
      >
        <div className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white rounded-lg border">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="flex-1 px-3 py-3 text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
              <Button variant="outline" className="px-4 py-3 text-base">
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">More Filters</span>
                <span className="sm:hidden">Filter</span>
              </Button>
            </div>
          </div>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {inventoryItems.map((item) => (
              <div key={item.id} className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-0 shadow-md overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 sm:p-4 bg-blue-100 rounded-xl">
                      <Box className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-10 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg">{item.productName}</h3>
                      <p className="text-sm text-gray-500">{item.batchCode}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(item.status)} text-xs px-3 py-2 font-medium`}>
                    {item.status.replace('-', ' ').charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>

                {/* Product Details */}
                <div className="space-y-3 sm:space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-600">Packaging:</span>
                      <span className="font-medium">{getPackagingIcon(item.packagingType)} {item.packagingType.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                      <Box className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Information */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Current Stock</p>
                      <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                        item.status === 'out-of-stock' ? 'text-red-600' :
                        item.status === 'low-stock' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {item.currentStock}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">{item.unitOfMeasure}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                      <p className="text-sm font-medium">{new Date(item.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">Edit</span>
                    </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Box className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">
                    {inventoryItems.filter(item => item.status === 'in-stock').length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {inventoryItems.filter(item => item.status === 'low-stock').length}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Package className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {inventoryItems.filter(item => item.status === 'out-of-stock').length}
                  </p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Package className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
