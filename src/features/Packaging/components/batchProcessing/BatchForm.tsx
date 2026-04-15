// src/components/packaging/batchProcessing/BatchForm.tsx
'use client';

import { X, Plus, Package } from 'lucide-react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import { PACKAGING_TYPES, getUnitsForPackagingType } from '@/types/packaging';

import type { BatchProcessingState } from './hooks/useBatchProcessing';

interface BatchFormProps {
  newItem: BatchProcessingState['newItem'];
  isProcessing: boolean;
  packagingTypes: string[];
  onNewItemChange: (item: Partial<BatchProcessingState['newItem']>) => void;
  onAddBatch: () => void;
  onClose: () => void;
}

export function BatchForm({ 
  newItem, 
  isProcessing, 
  packagingTypes, 
  onNewItemChange, 
  onAddBatch, 
  onClose, 
}: BatchFormProps) {
  const selectedPackagingType = newItem.packagingType;
  const availableUnits = selectedPackagingType ? getUnitsForPackagingType(selectedPackagingType as any) : []; // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Add New Batch</h3>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID *
                </label>
                <Input
                  value={newItem.productId}
                  onChange={(e) => onNewItemChange({ productId: e.target.value })}
                  placeholder="e.g., PRD-2024-001"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <Input
                  value={newItem.productName}
                  onChange={(e) => onNewItemChange({ productName: e.target.value })}
                  placeholder="e.g., Organic Apples Premium"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => onNewItemChange({ quantity: e.target.value })}
                  placeholder="e.g., 50"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit of Measure *
                </label>
                <select
                  value={newItem.unitOfMeasure}
                  onChange={(e) => onNewItemChange({ unitOfMeasure: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                >
                  <option value="">Select unit</option>
                  {availableUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Packaging Type *
                </label>
                <select
                  value={newItem.packagingType}
                  onChange={(e) => onNewItemChange({ packagingType: e.target.value, unitOfMeasure: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                >
                  <option value="">Select packaging type</option>
                  {packagingTypes.map(type => (
                    <option key={type} value={type}>
                      {PACKAGING_TYPES[type as keyof typeof PACKAGING_TYPES]?.label || type}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPackagingType && (
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {PACKAGING_TYPES[selectedPackagingType as keyof typeof PACKAGING_TYPES]?.label}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {PACKAGING_TYPES[selectedPackagingType as keyof typeof PACKAGING_TYPES]?.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Icon:</span>
                      <span className="ml-2 text-lg">
                        {PACKAGING_TYPES[selectedPackagingType as keyof typeof PACKAGING_TYPES]?.icon}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Default Capacity:</span>
                      <span className="ml-2 font-medium">
                        {PACKAGING_TYPES[selectedPackagingType as keyof typeof PACKAGING_TYPES]?.defaultCapacity}
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              {availableUnits.length > 0 && (
                <Card className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Available Units</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableUnits.map(unit => (
                      <Badge key={unit} variant="outline" className="text-xs">
                        {unit}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Batch Information</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>
                    <strong>Batch Code:</strong> Will be automatically generated
                  </p>
                  <p>
                    <strong>Status:</strong> Will start as "Pending"
                  </p>
                  <p>
                    <strong>QR Code:</strong> Will be generated upon completion
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={onAddBatch} 
              disabled={isProcessing || !newItem.productId || !newItem.productName || !newItem.quantity || !newItem.packagingType}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Batch
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
