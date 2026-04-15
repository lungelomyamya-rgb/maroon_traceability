// src/components/packaging/batchProcessing/BatchProcessing.tsx
'use client';

import { Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { QRGenerator } from '@/src/features/shared/qr';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';

import { PackagingEventForm } from '../PackagingEventForm';

import { BatchForm } from './BatchForm';
import { BatchList } from './BatchList';
import { BatchOverview } from './BatchOverview';
import { useBatchProcessing } from './hooks/useBatchProcessing';
import type { ExtendedBatchProcessingItem } from './hooks/useBatchProcessing';

export function BatchProcessing() {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    batchItems,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    packagingRecords,
    newItem,
    selectedItem,
    showEventForm,
    showQRGenerator,
    isProcessing,
    searchTerm,
    statusFilter,
    packagingTypeFilter,
    loading,
    packagingTypes,
    batchStatuses,
    filteredItems,
    statistics,
    setNewItem,
    resetNewItem,
    setSelectedItem,
    setShowEventForm,
    setShowQRGenerator,
    handleAddBatch,
    handleCompleteBatch,
    handleDeleteBatch,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleRowClick,
    handlePackagingEventSubmit,
    handleQRGenerated,
    setSearchTerm,
    setStatusFilter,
    setPackagingTypeFilter,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generateQRCode,
  } = useBatchProcessing();

  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    resetNewItem();
  };

  const handleAddBatchSubmit = () => {
    handleAddBatch();
    handleCloseAddForm();
  };

  const handleViewBatch = (item: ExtendedBatchProcessingItem) => {
    setSelectedItem(item);
    setShowEventForm(true);
  };

  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setSelectedItem(null);
  };

  const handleGenerateQR = (item: ExtendedBatchProcessingItem) => {
    setSelectedItem(item);
    setShowQRGenerator(true);
  };

  const handleCloseQRGenerator = () => {
    setShowQRGenerator(false);
    setSelectedItem(null);
  };

  const handleDeleteBatchItem = (item: ExtendedBatchProcessingItem) => {
    handleDeleteBatch(item.id);
  };

  // Authentication loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Batch Processing</h2>
            <p className="text-gray-600">Manage packaging batches and track processing status</p>
          </div>
          <Button onClick={handleShowAddForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Batch
          </Button>
        </div>
      </Card>

      {/* Overview Section */}
      <BatchOverview
        statistics={statistics}
        onAddNewBatch={handleShowAddForm}
      />

      {/* List Section */}
      <BatchList
        filteredItems={filteredItems}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        packagingTypeFilter={packagingTypeFilter}
        packagingTypes={packagingTypes}
        batchStatuses={batchStatuses}
        onSearchTerm={setSearchTerm}
        onStatusFilter={setStatusFilter}
        onPackagingTypeFilter={setPackagingTypeFilter}
        onViewBatch={handleViewBatch}
        _onEditBatch={handleViewBatch}
        onDeleteBatch={handleDeleteBatchItem}
        onGenerateQR={handleGenerateQR}
        onCompleteBatch={handleCompleteBatch}
        onAddNewBatch={handleShowAddForm}
      />

      {/* Add Form Modal */}
      {showAddForm && (
        <BatchForm
          newItem={newItem}
          isProcessing={isProcessing}
          packagingTypes={packagingTypes}
          onNewItemChange={(item) => setNewItem(prev => ({ ...prev, ...item }))}
          onAddBatch={handleAddBatchSubmit}
          onClose={handleCloseAddForm}
        />
      )}

      {/* Packaging Event Form Modal */}
      {showEventForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Packaging Event Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseEventForm}
                  className="w-full sm:w-auto"
                >
                  <span className="text-sm">Close</span>
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
                    packagingType: selectedItem.packagingType,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Generator Modal */}
      {showQRGenerator && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Generate QR Code</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseQRGenerator}
                  className="w-full sm:w-auto"
                >
                  <span className="text-sm">Close</span>
                </Button>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Batch Code</p>
                  <p className="font-mono text-lg bg-gray-100 px-3 py-2 rounded">
                    {selectedItem.batchCode || 'Pending'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Product</p>
                  <p className="font-medium">{selectedItem.productName}</p>
                </div>
                <QRGenerator
                  productName={selectedItem.productName}
                  onGenerate={handleQRGenerated}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Processing batch...</p>
          </div>
        </div>
      )}
    </div>
  );
}
