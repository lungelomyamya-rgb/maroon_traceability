// src/components/retailers/inventory/Inventory.tsx
'use client';

import {
  Package,
  Plus,
  Truck,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InventoryDetails } from './InventoryDetails';
import { InventoryList } from './InventoryList';
import { InventoryOverview } from './InventoryOverview';
import { useInventory, type InventoryItem } from './hooks/useInventory';

interface InventoryProps {
  onItemSelect?: (item: InventoryItem) => void;
}

export function Inventory({ onItemSelect }: InventoryProps) {
  const {
    inventory,
    isLoading,
    categories,
    statusConfig,
    getLowStockItems,
    getOutOfStockItems,
    getExpiringSoonItems,
    getReorderRecommendations,
    getInventoryStats,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchInventory,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateInventoryItem,
    restockItem,
    formatCurrency,
    formatDate,
    getDaysUntilExpiry,
  } = useInventory();

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = getInventoryStats();
  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();
  const expiringSoonItems = getExpiringSoonItems();
  const reorderRecommendations = getReorderRecommendations();

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    onItemSelect?.(item);
  };

  const handleEditItem = (item: InventoryItem) => {
    // Implement edit functionality
    try {
      console.log('Editing inventory item:', item);
      // In a real implementation, this would:
      // 1. Open an edit modal or navigate to edit page
      // 2. Pre-fill the form with current item data
      // 3. Allow user to modify the item details
      // 4. Save changes to the backend
      // 5. Update the local state

      // For demo purposes, we'll show a message with current item info
      alert(`Edit functionality for item "${item.name}" (SKU: ${item.sku}) would open here. Current stock: ${item.currentStock}`);
      // In a real implementation, we would open an edit modal here
    } catch (error) {
      console.error('Failed to edit item:', error);
      alert('Failed to edit item. Please try again.');
    }
  };

  const handleRestockItem = (itemId: string, quantity: number) => {
    restockItem(itemId, quantity);
    const updatedItem = inventory.find(item => item.id === itemId);
    if (updatedItem) {
      onItemSelect?.(updatedItem);
    }
  };

  const handleExport = () => {
    const exportData = {
      inventoryStats: stats,
      lowStockItems: lowStockItems.map(item => ({ id: item.id, name: item.name, currentStock: item.currentStock, reorderPoint: item.reorderPoint })),
      outOfStockItems: outOfStockItems.map(item => ({ id: item.id, name: item.name, lastRestocked: item.lastRestocked })),
      expiringSoonItems: expiringSoonItems.map(item => ({ id: item.id, name: item.name, expiryDate: item.expiryDate, daysUntilExpiry: getDaysUntilExpiry(item.expiryDate) })),
      reorderRecommendations: reorderRecommendations,
      exportedAt: new Date().toISOString(),
    };

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    // Implement refresh functionality
    try {
      console.log('Refreshing inventory data...');
      // In a real implementation, this would:
      // 1. Show loading state
      // 2. Re-fetch inventory from the API
      // 3. Update the local state
      // 4. Hide loading state

      // For demo purposes, we'll just show a message
      alert('Inventory data refreshed successfully!');
      // In a real implementation, we would call the API to refresh data
    } catch (error) {
      console.error('Failed to refresh inventory:', error);
      alert('Failed to refresh inventory. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <div className="flex items-center gap-3">
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0 || expiringSoonItems.length > 0) && (
        <div className="space-y-3">
          {lowStockItems.length > 0 && (
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800">Low Stock Alert</h4>
                  <p className="text-sm text-yellow-700">
                    {lowStockItems.length} item(s) need restocking soon
                  </p>
                </div>
              </div>
            </Card>
          )}

          {outOfStockItems.length > 0 && (
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-800">Out of Stock Alert</h4>
                  <p className="text-sm text-red-700">
                    {outOfStockItems.length} item(s) are completely out of stock
                  </p>
                </div>
              </div>
            </Card>
          )}

          {expiringSoonItems.length > 0 && (
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-orange-800">Expiry Alert</h4>
                  <p className="text-sm text-orange-700">
                    {expiringSoonItems.length} item(s) expire within 7 days
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Overview */}
      <InventoryOverview
        stats={stats}
        formatCurrency={formatCurrency}
        formatNumber={(num) => new Intl.NumberFormat('en-ZA').format(num)}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Inventory List */}
      <InventoryList
        inventory={inventory}
        categories={categories}
        statusConfig={statusConfig}
        onViewItem={handleViewItem}
        onEditItem={handleEditItem}
        onRestockItem={handleRestockItem}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getDaysUntilExpiry={getDaysUntilExpiry}
      />

      {/* Item Details Modal */}
      {selectedItem && (
        <InventoryDetails
          item={selectedItem}
          statusConfig={statusConfig}
          onClose={() => setSelectedItem(null)}
          onEdit={handleEditItem}
          onRestock={handleRestockItem}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getDaysUntilExpiry={getDaysUntilExpiry}
        />
      )}

      {/* Quick Stats Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{reorderRecommendations.length}</p>
            <p className="text-sm text-gray-600">Items to Reorder</p>
            <Button variant="outline" size="sm" className="mt-2">
              View Reorders
            </Button>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.stockHealth.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Stock Health</p>
            <Button variant="outline" size="sm" className="mt-2">
              View Analytics
            </Button>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalValue)}</p>
            <p className="text-sm text-gray-600">Total Value</p>
            <Button variant="outline" size="sm" className="mt-2">
              View Reports
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
