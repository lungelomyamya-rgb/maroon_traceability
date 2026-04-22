// src/components/retailers/inventory/InventoryList.tsx
'use client';

import {
  Search,
  Package,
  Eye,
  Edit,
  Truck,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryItem } from './hooks/useInventory';

interface InventoryListProps {
  inventory: InventoryItem[];
  categories: { value: string; label: string }[];
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  onViewItem: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onRestockItem: (itemId: string, quantity: number) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getDaysUntilExpiry: (expiryDate: string) => number;
}

export function InventoryList({
  inventory,
  categories,
  statusConfig,
  onViewItem,
  onEditItem,
  onRestockItem,
  formatCurrency,
  formatDate,
  getDaysUntilExpiry,
}: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const getExpiryStatus = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) {
      return { color: 'text-red-600', label: 'Expired' };
    }
    if (daysUntilExpiry <= 3) {
      return { color: 'text-red-600', label: `${daysUntilExpiry} days` };
    }
    if (daysUntilExpiry <= 7) {
      return { color: 'text-yellow-600', label: `${daysUntilExpiry} days` };
    }
    return { color: 'text-green-600', label: `${daysUntilExpiry} days` };
  };

  const getStockLevelColor = (current: number, min: number, max: number) => {
    if (current === 0) {
      return 'text-red-600';
    }
    if (current <= min) {
      return 'text-yellow-600';
    }
    if (current >= max * 0.9) {
      return 'text-blue-600';
    }
    return 'text-green-600';
  };

  const getStockLevelIcon = (current: number, min: number, max: number) => {
    if (current === 0) {
      return '❌';
    }
    if (current <= min) {
      return '⚠️';
    }
    if (current >= max * 0.9) {
      return '📦';
    }
    return '✅';
  };

  const handleQuickRestock = (item: InventoryItem) => {
    const quantity = Math.max(item.reorderQuantity, item.maxStockLevel - item.currentStock);
    onRestockItem(item.id, quantity);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Items</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{filteredInventory.length} of {inventory.length} items</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        {filteredInventory.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No inventory items found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredInventory.map((item) => {
            const status = statusConfig[item.status];
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            const expiryStatus = getExpiryStatus(daysUntilExpiry);
            const stockColor = getStockLevelColor(item.currentStock, item.minStockLevel, item.maxStockLevel);
            const stockIcon = getStockLevelIcon(item.currentStock, item.minStockLevel, item.maxStockLevel);

            return (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <Badge className={`${status.color} text-xs`}>
                          <span className="mr-1">{status.icon}</span>
                          {status.label}
                        </Badge>
                        {daysUntilExpiry <= 7 && daysUntilExpiry >= 0 && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            Expires {expiryStatus.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>SKU: {item.sku}</span>
                        <span>•</span>
                        <span>Batch: {item.batchCode}</span>
                        <span>•</span>
                        <span>{getCategoryLabel(item.category)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Supplier: {item.supplier}</span>
                        <span>•</span>
                        <span>Location: {item.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewItem(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {(item.status === 'low-stock' || item.status === 'out-of-stock') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickRestock(item)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Truck className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Stock Level</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{stockIcon}</span>
                      <span className={`text-sm font-medium ${stockColor}`}>
                        {item.currentStock} / {item.maxStockLevel}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full ${
                          item.currentStock === 0 ? 'bg-red-500' :
                            item.currentStock <= item.minStockLevel ? 'bg-yellow-500' :
                              item.currentStock >= item.maxStockLevel * 0.9 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((item.currentStock / item.maxStockLevel) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Unit Price</p>
                    <p className="text-sm font-medium">{formatCurrency(item.unitPrice)}</p>
                    <p className="text-xs text-gray-400">Cost: {formatCurrency(item.unitCost)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Total Value</p>
                    <p className="text-sm font-medium">{formatCurrency(item.unitPrice * item.currentStock)}</p>
                    <p className="text-xs text-gray-400">{item.currentStock} units</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Sales Velocity</p>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium">{item.salesVelocity}/day</p>
                      {item.salesVelocity > 10 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : item.salesVelocity < 5 ? (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Expiry</p>
                    <p className={`text-sm font-medium ${expiryStatus.color}`}>
                      {expiryStatus.label}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(item.expiryDate)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Last Restocked</p>
                    <p className="text-sm font-medium">{formatDate(item.lastRestocked)}</p>
                    <p className="text-xs text-gray-400">
                      Reorder at: {item.reorderPoint}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                {(item.status === 'low-stock' || item.status === 'out-of-stock') && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Quick Restock</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickRestock(item)}
                        className="w-full"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Restock {item.reorderQuantity} units
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
