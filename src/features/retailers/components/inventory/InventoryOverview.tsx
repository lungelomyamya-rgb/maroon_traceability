// src/components/retailers/inventory/InventoryOverview.tsx
'use client';

import {
  Package,
  AlertTriangle,
  DollarSign,
  RefreshCw,
  Download,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface InventoryOverviewProps {
  stats: {
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    discontinued: number;
    totalValue: number;
    totalCost: number;
    potentialRevenue: number;
    expiringSoon: number;
    reorderNeeded: number;
    stockHealth: number;
  };
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  onExport?: () => void;
  onRefresh?: () => void;
}

export function InventoryOverview({
  stats,
  formatCurrency,
  formatNumber,
  onExport,
  onRefresh,
}: InventoryOverviewProps) {
  const getStockHealthColor = (health: number) => {
    if (health >= 80) {
      return 'text-green-600';
    }
    if (health >= 60) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const getStockHealthIcon = (health: number) => {
    if (health >= 80) {
      return '🟢';
    }
    if (health >= 60) {
      return '🟡';
    }
    return '🔴';
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Overview</h3>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.total)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs ${getStockHealthColor(stats.stockHealth)}`}>
                  {getStockHealthIcon(stats.stockHealth)} {stats.stockHealth.toFixed(1)}% healthy
                </span>
              </div>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-green-600">
                  Potential: {formatCurrency(stats.potentialRevenue)}
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{formatNumber(stats.inStock)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-600">
                  {((stats.inStock / stats.total) * 100).toFixed(1)}% of total
                </span>
              </div>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✅</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-yellow-600">{formatNumber(stats.lowStock + stats.outOfStock)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-600">
                  {stats.lowStock} low, {stats.outOfStock} out
                </span>
              </div>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-xl font-bold text-yellow-600">{formatNumber(stats.lowStock)}</p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">⚠️</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-xl font-bold text-red-600">{formatNumber(stats.outOfStock)}</p>
            </div>
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">❌</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-xl font-bold text-orange-600">{formatNumber(stats.expiringSoon)}</p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-sm">📅</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reorder Needed</p>
              <p className="text-xl font-bold text-purple-600">{formatNumber(stats.reorderNeeded)}</p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Truck className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Stock Distribution */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Stock Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg font-bold">{stats.inStock}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">In Stock</p>
            <p className="text-xs text-gray-600">{((stats.inStock / stats.total) * 100).toFixed(1)}%</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg font-bold">{stats.lowStock}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Low Stock</p>
            <p className="text-xs text-gray-600">{((stats.lowStock / stats.total) * 100).toFixed(1)}%</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg font-bold">{stats.outOfStock}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Out of Stock</p>
            <p className="text-xs text-gray-600">{((stats.outOfStock / stats.total) * 100).toFixed(1)}%</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg font-bold">{stats.discontinued}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Discontinued</p>
            <p className="text-xs text-gray-600">{((stats.discontinued / stats.total) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      {/* Financial Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</p>
            <p className="text-sm text-gray-600">Total Inventory Value</p>
            <p className="text-xs text-gray-500 mt-1">Current stock at retail price</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalCost)}</p>
            <p className="text-sm text-gray-600">Total Cost</p>
            <p className="text-xs text-gray-500 mt-1">Current stock at cost price</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.potentialRevenue)}</p>
            <p className="text-sm text-gray-600">Potential Revenue</p>
            <p className="text-xs text-gray-500 mt-1">Potential profit margin</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average Profit Margin</span>
            <span className="text-lg font-bold text-green-600">
              {((stats.potentialRevenue / stats.totalValue) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
