// src/components/retailers/inventory/InventoryDetails.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Package, DollarSign, Calendar, MapPin, Truck, Edit, AlertTriangle } from 'lucide-react';
import { InventoryItem } from './hooks/useInventory';

interface InventoryDetailsProps {
  item: InventoryItem;
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  onClose: () => void;
  onEdit?: (item: InventoryItem) => void;
  onRestock?: (itemId: string, quantity: number) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getDaysUntilExpiry: (expiryDate: string) => number;
}

export function InventoryDetails({ 
  item, 
  statusConfig, 
  onClose, 
  onEdit,
  onRestock,
  formatCurrency,
  formatDate,
  getDaysUntilExpiry
}: InventoryDetailsProps) {
  const status = statusConfig[item.status];
  const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'vegetables': 'Vegetables',
      'fruits': 'Fruits',
      'grains': 'Grains',
      'dairy': 'Dairy',
      'meat': 'Meat',
      'herbs': 'Herbs',
      'processed': 'Processed Foods'
    };
    return categoryMap[category] || category;
  };

  const getQualityGradeLabel = (grade: string) => {
    const gradeMap: Record<string, string> = {
      'A': 'Grade A - Premium',
      'B': 'Grade B - Standard',
      'C': 'Grade C - Economy'
    };
    return gradeMap[grade] || grade;
  };

  const getExpiryStatus = (days: number) => {
    if (days < 0) return { color: 'text-red-600 bg-red-50', label: 'Expired' };
    if (days <= 3) return { color: 'text-red-600 bg-red-50', label: 'Critical - Expires soon' };
    if (days <= 7) return { color: 'text-yellow-600 bg-yellow-50', label: 'Warning - Expires soon' };
    if (days <= 30) return { color: 'text-blue-600 bg-blue-50', label: 'Good - Fresh' };
    return { color: 'text-green-600 bg-green-50', label: 'Excellent - Fresh' };
  };

  const getStockHealth = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 80) return { color: 'text-green-600', label: 'Excellent' };
    if (percentage >= 50) return { color: 'text-blue-600', label: 'Good' };
    if (percentage >= 25) return { color: 'text-yellow-600', label: 'Low' };
    return { color: 'text-red-600', label: 'Critical' };
  };

  const expiryStatus = getExpiryStatus(daysUntilExpiry);
  const stockHealth = getStockHealth(item.currentStock, item.minStockLevel, item.maxStockLevel);

  const handleRestock = () => {
    const quantity = Math.max(item.reorderQuantity, item.maxStockLevel - item.currentStock);
    onRestock?.(item.id, quantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${status.color} text-sm`}>
                    <span className="mr-1">{status.icon}</span>
                    {status.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {getCategoryLabel(item.category)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Item Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Item Information</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">SKU</span>
                  <span className="text-sm font-medium">{item.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Batch Code</span>
                  <span className="text-sm font-medium">{item.batchCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium">{getCategoryLabel(item.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quality Grade</span>
                  <span className="text-sm font-medium">{getQualityGradeLabel(item.qualityGrade)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Supplier</span>
                  <span className="text-sm font-medium">{item.supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="text-sm font-medium">{item.location}</span>
                </div>
              </div>
            </div>

            {/* Stock Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Stock Information</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Stock</span>
                  <span className="text-sm font-medium">{item.currentStock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Min Stock Level</span>
                  <span className="text-sm font-medium">{item.minStockLevel} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Stock Level</span>
                  <span className="text-sm font-medium">{item.maxStockLevel} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stock Health</span>
                  <Badge className={`${stockHealth.color} text-xs`}>
                    {stockHealth.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reorder Point</span>
                  <span className="text-sm font-medium">{item.reorderPoint} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reorder Quantity</span>
                  <span className="text-sm font-medium">{item.reorderQuantity} units</span>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Pricing</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unit Price</span>
                  <span className="text-sm font-medium">{formatCurrency(item.unitPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unit Cost</span>
                  <span className="text-sm font-medium">{formatCurrency(item.unitCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profit Margin</span>
                  <span className="text-sm font-medium text-green-600">
                    {((item.unitPrice - item.unitCost) / item.unitPrice * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Value</span>
                  <span className="text-sm font-medium">{formatCurrency(item.unitPrice * item.currentStock)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Cost</span>
                  <span className="text-sm font-medium">{formatCurrency(item.unitCost * item.currentStock)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Performance</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">📊</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Sales Velocity</span>
                    <p className="text-sm font-medium">{item.salesVelocity} units/day</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days of Inventory</span>
                  <span className="text-sm font-medium">
                    {item.salesVelocity > 0 ? Math.floor(item.currentStock / item.salesVelocity) : 'N/A'} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Sales (est.)</span>
                  <span className="text-sm font-medium">
                    {Math.round(item.salesVelocity * 30)} units
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Expiry Information</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Expiry Date</span>
                    <p className="text-sm font-medium">{formatDate(item.expiryDate)}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days Until Expiry</span>
                  <Badge className={`${expiryStatus.color} text-xs`}>
                    {expiryStatus.label}
                  </Badge>
                </div>
                {daysUntilExpiry <= 7 && daysUntilExpiry >= 0 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-700">
                      Item expires soon. Consider discount or promotion.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Timeline</h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-600">Last Restocked</span>
                  <p className="text-sm font-medium">{formatDate(item.lastRestocked)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-600">Next Restock (estimated)</span>
                  <p className="text-sm font-medium">
                    {item.currentStock <= item.reorderPoint ? 'Immediate' : 
                     item.salesVelocity > 0 ? 
                     formatDate(new Date(Date.now() + (Math.ceil((item.reorderPoint - item.currentStock) / item.salesVelocity) * 24 * 60 * 60 * 1000)).toISOString()) : 
                     'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div className="text-sm text-gray-500">
              Item ID: {item.id}
            </div>
            <div className="flex gap-3">
              {(item.status === 'low-stock' || item.status === 'out-of-stock') && (
                <Button onClick={handleRestock}>
                  <Truck className="h-4 w-4 mr-2" />
                  Quick Restock
                </Button>
              )}
              <Button variant="outline">
                View History
              </Button>
              <Button variant="outline">
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
