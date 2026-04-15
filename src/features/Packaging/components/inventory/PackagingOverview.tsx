// src/components/packaging/inventory/PackagingOverview.tsx
'use client';

import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';

import type { PackagingInventoryComputed, PackagingInventoryActions } from './hooks/usePackagingInventory';

interface PackagingOverviewProps {
  computed: PackagingInventoryComputed;
  actions: Pick<PackagingInventoryActions, 'refreshInventory' | 'exportInventory'>;
  loading?: boolean;
}

export function PackagingOverview({ computed, actions, loading = false }: PackagingOverviewProps) {
  const { totalItems, totalValue, lowStockItems, outOfStockItems, stats } = computed;
  const { refreshInventory, exportInventory } = actions;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-3 bg-blue-100 rounded-lg">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.inStock}</p>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-3 bg-red-100 rounded-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">R{totalValue.toFixed(2)}</p>
            </div>
            <div className="p-1.5 sm:p-2 lg:p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={refreshInventory} 
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Inventory'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={exportInventory}
          className="w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Health</p>
              <p className="text-lg font-semibold text-green-600">
                {totalItems > 0 ? Math.round((stats.inStock / totalItems) * 100) : 0}% In Stock
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Attention Needed</p>
              <p className="text-lg font-semibold text-yellow-600">
                {lowStockItems + outOfStockItems} Items
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-lg font-semibold text-blue-600">
                {computed.categories.length} Types
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
