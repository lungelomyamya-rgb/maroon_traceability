// src/components/packaging/batchProcessing.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Loader2, QrCode, Package, MapPin, Calendar } from 'lucide-react';
import { PackagingEventForm } from '@/components/packaging/packagingEventForm';
import { QRGenerator } from '@/components/qr/qRGenerator';
import { BatchProcessingTable } from '@/components/packaging/batchProcessingTable';
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
  const { currentUser } = useUser();

  useEffect(() => {
    // Redirect if user doesn't have packaging role (with delay for context update)
    const timer = setTimeout(() => {
      if (currentUser?.role !== 'packaging') {
        console.log('Batch processing page - redirecting to unauthorized. Current user:', currentUser);
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
  
  // Mock initial data
  const mockBatchItems: BatchProcessingItem[] = [
    {
      id: '1',
      productId: 'PRD-2024-001',
      productName: 'Organic Apples Premium',
      quantity: 50,
      unitOfMeasure: 'boxes',
      packagingType: 'cardboard-box',
      status: 'completed',
      batchCode: 'BATCH-2024-CAR-STL-ABC',
      qrGenerated: true,
      packagingDate: '2025-01-20T08:00:00Z'
    },
    {
      id: '2',
      productId: 'PRD-2024-002',
      productName: 'Fresh Pears Vacuum Sealed',
      quantity: 25,
      unitOfMeasure: 'packages',
      packagingType: 'vacuum-sealed',
      status: 'qc-pending',
      batchCode: 'BATCH-2024-VAC-STL-DEF',
      qrGenerated: true,
      packagingDate: '2025-01-20T09:00:00Z'
    },
    {
      id: '3',
      productId: 'PRD-2024-003',
      productName: 'Mixed Citrus Bulk',
      quantity: 10,
      unitOfMeasure: 'bags',
      packagingType: 'bulk-bag',
      status: 'processing',
      batchCode: 'BATCH-2024-BUL-STL-GHI',
      qrGenerated: false,
      packagingDate: '2025-01-20T10:00:00Z'
    }
  ];

  const [batchItems, setBatchItems] = useState<BatchProcessingItem[]>(mockBatchItems);
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
  const [useTableView, setUseTableView] = useState(false);

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
        qrCodes: [],
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

  const handleRowClick = (row: any) => {
    setSelectedItem(row.original);
    setShowEventForm(true);
  };

  // Transform data for BatchProcessingTable
  const tableData = batchItems.map(item => ({
    id: item.id,
    batchId: item.batchCode || 'Pending',
    product: item.productName,
    status: item.status,
    createdAt: item.packagingDate || new Date().toISOString(),
    original: item
  }));

  return (
    <>
      {/* Back Button Above DashboardLayout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <Button
          variant="outline"
          onClick={handleBackToDashboard}
          className="inline-flex items-center gap-2 text-sm"
        >
          Back
        </Button>
      </div>
      
      <DashboardLayout
        description="Manage and process your product batches"
      >
        <div className="container mx-auto py-4 sm:py-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">Batch Processing</h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                Manage and process your product batches
              </p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-row gap-2 mt-4 lg:mt-0">
          <Button
            variant="outline"
            onClick={() => setUseTableView(!useTableView)}
            className="gap-2 w-full sm:w-auto px-4 py-2 lg:px-6 text-base"
          >
            {useTableView ? 'Card View' : 'Table View'}
          </Button>
          <Button 
            onClick={processBatch} 
            disabled={isProcessing || batchItems.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-4 py-2 lg:px-6 text-base font-medium"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Process Batch
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Add Item Form */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Add Batch Items</h3>
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 mb-6">
            <div className="flex-1 space-y-2 w-full xl:w-auto">
              <label htmlFor="productId" className="text-sm font-medium text-gray-700">
                Product ID
              </label>
              <Input
                id="productId"
                placeholder="e.g., PRD-2024-001"
                value={newItem.productId}
                onChange={(e) => setNewItem({...newItem, productId: e.target.value})}
                className="w-full p-3 text-base"
              />
            </div>
            <div className="flex-1 space-y-2 w-full xl:w-auto">
              <label htmlFor="productName" className="text-sm font-medium text-gray-700">
                Product Name
              </label>
              <Input
                id="productName"
                placeholder="Enter product name"
                value={newItem.productName}
                onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && addToBatch()}
                className="w-full p-3 text-base"
              />
            </div>
            <div className="w-full xl:w-48 space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                className="w-full p-3 text-base"
              />
            </div>
            <div className="w-full xl:w-auto space-y-2">
              <label htmlFor="packagingType" className="text-sm font-medium text-gray-700">
                Packaging Type
              </label>
              <select
                id="packagingType"
                value={newItem.packagingType}
                onChange={(e) => setNewItem({...newItem, packagingType: e.target.value as PackagingType})}
                className="w-full p-3 text-base border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
              >
                {Object.entries(PACKAGING_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end w-full xl:w-auto">
              <Button onClick={addToBatch} className="gap-2 w-full xl:w-auto px-6 py-3 text-base font-medium">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Batch Items Display */}
          <div className="mt-4 sm:mt-6">
            {useTableView ? (
              <div className="overflow-x-auto">
                <BatchProcessingTable 
                  data={tableData} 
                  onRowClick={handleRowClick}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                {batchItems.map((item) => (
                  <Card key={item.id} className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2 border-gray-200 hover:border-purple-300 rounded-lg w-full">
                    <div className="flex flex-col space-y-2 sm:space-y-3">
                      {/* Header */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                            <span className="text-sm sm:text-base lg:text-lg leading-none">{PACKAGING_TYPES[item.packagingType].icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm sm:text-base">{item.productName}</h4>
                            <p className="text-xs text-gray-500 mt-1">{item.productId}</p>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <Badge className={`${BATCH_STATUS_COLORS[item.status]} text-xs px-2 py-1 whitespace-nowrap flex-shrink-0`}>
                            {item.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="space-y-1 sm:space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                            <MapPin className="h-3 w-3 sm:h-4 sm:h-5 text-gray-400" />
                          </div>
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium text-xs">{item.quantity} {item.unitOfMeasure}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                            <Package className="h-3 w-3 sm:h-4 sm:h-5 text-gray-400" />
                          </div>
                          <span className="text-gray-600">Packaging:</span>
                          <span className="font-medium text-xs truncate" title={PACKAGING_TYPES[item.packagingType].label}>{PACKAGING_TYPES[item.packagingType].label}</span>
                        </div>
                        {item.batchCode && (
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                              <Calendar className="h-3 w-3 sm:h-4 sm:h-5 text-gray-400" />
                            </div>
                            <span className="text-gray-600">Batch Code:</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-center sm:text-right truncate" title={item.batchCode}>{item.batchCode}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 pt-1 sm:pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowEventForm(true);
                          }}
                          className="flex-1 text-xs sm:text-sm h-7 sm:h-8"
                        >
                          <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Details
                        </Button>
                        {item.batchCode && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowQRGenerator(true);
                            }}
                            className="px-2 h-7 sm:h-8 min-w-[28px] sm:min-w-[32px]"
                          >
                            <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
                    {batchItems.length === 0 && (
              <div className="text-center py-12 sm:py-16 text-gray-500">
                <Package className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-gray-300" />
                <p className="text-base sm:text-lg">No items in batch yet. Add items above to get started.</p>
              </div>
            )}
          </div>
        </Card>
      
      {/* Packaging Event Form Modal */}
      {showEventForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Packaging Event Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEventForm(false);
                  setSelectedItem(null);
                }}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-2 hidden sm:inline">Close</span>
              </Button>
            </div>
            <div className="p-4 sm:p-6">
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
          <div className="bg-white rounded-lg max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Generate QR Code</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowQRGenerator(false);
                  setSelectedItem(null);
                }}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-2 hidden sm:inline">Close</span>
              </Button>
            </div>
            <div className="p-4 sm:p-6">
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
      </DashboardLayout>
    </>
  );
}
