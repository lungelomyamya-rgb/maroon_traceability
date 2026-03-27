// src/components/packaging/inventory/PackagingDetails.tsx
'use client';

import { useState } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  Package, 
  Calendar, 
  MapPin, 
  User, 
  FileText,
  Shield,
  QrCode,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import type { InventoryItem, StockMovement, PackagingInventoryActions } from './hooks/usePackagingInventory';

interface PackagingDetailsProps {
  selectedItem: InventoryItem | null;
  stockMovements: StockMovement[];
  actions: Pick<PackagingInventoryActions, 'setSelectedItem' | 'updateStock'>;
}

export function PackagingDetails({ selectedItem, stockMovements, actions }: PackagingDetailsProps) {
  if (!selectedItem) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const itemStockMovements = stockMovements.filter(movement => movement.inventoryId === selectedItem.id);
  const [stockAdjustment, setStockAdjustment] = useState({ quantity: '', reason: '' });

  const handleStockUpdate = () => {
    const quantity = parseInt(stockAdjustment.quantity);
    if (!isNaN(quantity) && quantity !== 0 && stockAdjustment.reason.trim()) {
      actions.updateStock(selectedItem.id, quantity, stockAdjustment.reason);
      setStockAdjustment({ quantity: '', reason: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedItem.productName}
              </h2>
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(selectedItem.status)}>
                  {selectedItem.status.replace('-', ' ')}
                </Badge>
                <Badge className={getQualityGradeColor(selectedItem.qualityGrade)}>
                  Grade {selectedItem.qualityGrade}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={() => actions.setSelectedItem(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <Package className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Product Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Product ID:</span>
                  <span className="text-sm font-medium">{selectedItem.productId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Batch Number:</span>
                  <span className="text-sm font-medium">{selectedItem.batchNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="text-sm font-medium">{selectedItem.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">QR Code:</span>
                  <span className="text-sm font-medium flex items-center">
                    <QrCode className="h-4 w-4 mr-1" />
                    {selectedItem.qrCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Supplier:</span>
                  <span className="text-sm font-medium">{selectedItem.supplier}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Stock Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Stock:</span>
                  <span className="text-sm font-medium">{selectedItem.currentStock} {selectedItem.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Min Stock Level:</span>
                  <span className="text-sm font-medium">{selectedItem.minStockLevel} {selectedItem.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Stock Level:</span>
                  <span className="text-sm font-medium">{selectedItem.maxStockLevel} {selectedItem.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unit Cost:</span>
                  <span className="text-sm font-medium">R{selectedItem.unitCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Value:</span>
                  <span className="text-sm font-medium text-green-600">R{selectedItem.totalValue.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Quality & Storage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Quality & Storage</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Storage Requirements:</span>
                  <ul className="space-y-1">
                    {selectedItem.storageRequirements.map((req, index) => (
                      <li key={`storage-${index}`} className="text-sm flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Certifications:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.certifications.map((cert, index) => (
                      <Badge key={`cert-${index}`} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center mb-3">
                <MapPin className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Location & Time</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium">{selectedItem.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-sm font-medium">
                    {new Date(selectedItem.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                {selectedItem.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expiry Date:</span>
                    <span className="text-sm font-medium text-orange-600">
                      {new Date(selectedItem.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Stock Adjustment */}
          <Card className="p-4 mb-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Stock Adjustment</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Quantity (+/-)
                </label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={stockAdjustment.quantity}
                  onChange={(e) => setStockAdjustment((prev: typeof stockAdjustment) => ({ ...prev, quantity: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Reason
                </label>
                <Textarea
                  placeholder="Enter reason for adjustment"
                  value={stockAdjustment.reason}
                  onChange={(e) => setStockAdjustment((prev: typeof stockAdjustment) => ({ ...prev, reason: e.target.value }))}
                  className="w-full"
                  rows={1}
                />
              </div>
            </div>
            <div className="mt-3">
              <Button onClick={handleStockUpdate} className="w-full md:w-auto">
                Update Stock
              </Button>
            </div>
          </Card>

          {/* Stock Movements */}
          <Card className="p-4">
            <div className="flex items-center mb-3">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Recent Stock Movements</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">User</th>
                  </tr>
                </thead>
                <tbody>
                  {itemStockMovements.slice(0, 5).map((movement) => (
                    <tr key={movement.id} className="border-b">
                      <td className="py-2 text-sm">
                        {new Date(movement.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <Badge 
                          variant={movement.type === 'in' ? 'default' : movement.type === 'out' ? 'destructive' : 'outline'}
                          className="text-xs"
                        >
                          {movement.type}
                        </Badge>
                      </td>
                      <td className="py-2 text-sm font-medium">
                        {movement.quantity} {selectedItem.unit}
                      </td>
                      <td className="py-2 text-sm">{movement.reason}</td>
                      <td className="py-2 text-sm">{movement.userName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {itemStockMovements.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No stock movements recorded</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
