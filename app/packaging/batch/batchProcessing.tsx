// src/app/packaging/batch/batchProcessing.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Loader2, QrCode, Package, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { PackagingEventForm } from '@/components/packaging/PackagingEventForm';
import { QRGenerator } from '@/components/qr/QRGenerator';
import type { 
  BatchProcessingItem, 
  PackagingType, 
  BatchStatus,
  PackagingRecord 
} from '@/types/packaging';
import { 
  PACKAGING_TYPES, 
  BATCH_STATUS_COLORS, 
  generateBatchCode,
  getUnitsForPackagingType 
} from '@/types/packaging';

export function BatchProcessing() {
  const router = useRouter();
  const [batchItems, setBatchItems] = useState<BatchProcessingItem[]>([]);
  const [newItem, setNewItem] = useState({ 
    productId: '',
    productName: '', 
    quantity: 1,
    unitOfMeasure: 'pieces',
    packagingType: 'cardboard-box' as PackagingType
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BatchProcessingItem | null>(null);
  const [packagingRecords, setPackagingRecords] = useState<PackagingRecord[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);

  // Define columns for the data table
  const columns = [
    {
      accessorKey: 'productName',
      header: 'Product Name',
      enableSorting: true,
      enableFiltering: true,
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      enableSorting: true,
      cell: ({ row }: { row: { original: BatchProcessingItem } }) => (
        <span>
          {row.original.quantity} {row.original.unitOfMeasure}
        </span>
      ),
    },
    {
      accessorKey: 'packagingType',
      header: 'Packaging Type',
      cell: ({ row }: { row: { original: BatchProcessingItem } }) => {
        const type = PACKAGING_TYPES[row.original.packagingType];
        return (
          <div className="flex items-center gap-2">
            <span>{type.icon}</span>
            <span className="text-sm">{type.label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'batchCode',
      header: 'Batch Code',
      cell: ({ row }: { row: { original: BatchProcessingItem } }) => (
        <span className="font-mono text-xs">
          {row.original.batchCode || 'Not generated'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: BatchProcessingItem } }) => (
        <Badge className={BATCH_STATUS_COLORS[row.original.status]}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1).replace('-', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedItem(row.original);
              setShowEventForm(true);
            }}
          >
            <Package className="h-3 w-3" />
          </Button>
          {row.original.batchCode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedItem(row.original);
                setShowQRGenerator(true);
              }}
            >
              <QrCode className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Add new item to batch
  const addToBatch = () => {
    if (!newItem.productName.trim() || !newItem.productId.trim()) return;
    
    const newBatchItem: BatchProcessingItem = {
      id: Date.now().toString(),
      productId: newItem.productId.trim(),
      productName: newItem.productName.trim(),
      quantity: Math.max(1, newItem.quantity),
      unitOfMeasure: newItem.unitOfMeasure,
      packagingType: newItem.packagingType,
      status: 'pending',
    };

    setBatchItems([...batchItems, newBatchItem]);
    setNewItem({ 
      productId: '',
      productName: '', 
      quantity: 1,
      unitOfMeasure: 'pieces',
      packagingType: 'cardboard-box'
    });
  };

  // Process the batch
  const processBatch = async () => {
    if (batchItems.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate batch codes and update status
      const updatedItems = batchItems.map(item => {
        const batchCode = generateBatchCode(item.packagingType, 'Packhouse 1');
        return {
          ...item,
          batchCode,
          status: 'completed' as BatchStatus,
          packagingDate: new Date().toISOString(),
          qrGenerated: true
        };
      });
      
      setBatchItems(updatedItems);
      
      // Create packaging records
      const records: PackagingRecord[] = updatedItems.map(item => ({
        id: `record-${item.id}`,
        batchId: item.batchCode!,
        productId: item.productId,
        productName: item.productName,
        packagingType: item.packagingType,
        quantity: item.quantity,
        unitOfMeasure: item.unitOfMeasure,
        packagingDate: item.packagingDate!,
        location: 'Packhouse 1, Stellenbosch',
        operator: 'System User',
        status: 'completed',
        batchCode: item.batchCode!,
        qrCodes: [], // Would be populated when QR codes are generated
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      setPackagingRecords([...packagingRecords, ...records]);
      
    } catch (error) {
      console.error('Batch processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePackagingEventSubmit = async (data: any) => {
    console.log('Packaging event submitted:', data);
    setShowEventForm(false);
    setSelectedItem(null);
  };

  const handleQRGenerated = (qrData: string) => {
    console.log('QR code generated:', qrData);
    // In a real implementation, this would save the QR code to the batch record
    const updatedItems = batchItems.map(item => {
      if (item.id === selectedItem?.id) {
        return { ...item, qrGenerated: true, qrCode: qrData };
      }
      return item;
    });
    setBatchItems(updatedItems);
  };

  const handleBackToDashboard = () => {
    router.push('/packaging');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={handleBackToDashboard}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold">Batch Processing</h1>
          <p className="text-muted-foreground">
            Manage and process your product batches
          </p>
        </div>
        <div className="w-full md:w-auto flex justify-end">
          <Button 
            onClick={processBatch} 
            disabled={isProcessing || batchItems.length === 0}
            className="gap-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Process Batch'
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <label htmlFor="productId" className="text-sm font-medium">
                Product ID
              </label>
              <Input
                id="productId"
                placeholder="e.g., PRD-2024-001"
                value={newItem.productId}
                onChange={(e) => setNewItem({...newItem, productId: e.target.value})}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label htmlFor="productName" className="text-sm font-medium">
                Product Name
              </label>
              <Input
                id="productName"
                placeholder="Enter product name"
                value={newItem.productName}
                onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && addToBatch()}
              />
            </div>
            <div className="w-32 space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="packagingType" className="text-sm font-medium">
                Packaging
              </label>
              <select
                id="packagingType"
                value={newItem.packagingType}
                onChange={(e) => setNewItem({...newItem, packagingType: e.target.value as PackagingType})}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
              >
                {Object.entries(PACKAGING_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={addToBatch} className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={batchItems}
            onRowClick={(row) => {
              // Optional: Handle row click
              console.log('Row clicked:', row);
            }}
            pageSize={10}
          />
        </CardContent>
      </Card>

      {/* Packaging Event Form Modal */}
      {showEventForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Packaging Event Details</h3>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowEventForm(false);
                    setSelectedItem(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <PackagingEventForm
                onSubmit={handlePackagingEventSubmit}
                initialData={{
                  productId: selectedItem.productId,
                  productName: selectedItem.productName,
                  quantity: selectedItem.quantity,
                  unitOfMeasure: selectedItem.unitOfMeasure,
                  packagingType: selectedItem.packagingType
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* QR Generator Modal */}
      {showQRGenerator && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Generate QR Code</h3>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowQRGenerator(false);
                    setSelectedItem(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <QRGenerator
                productId={selectedItem.productId}
                productName={selectedItem.productName}
                farmer="Maroon Farm"
                location="Stellenbosch, South Africa"
                onGenerate={handleQRGenerated}
                mockMode={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}