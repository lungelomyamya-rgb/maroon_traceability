// src/components/farmer/fertiliserLog/FertiliserLog.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useFertiliserLog } from './hooks/useFertiliserLog';
import { FertiliserOverview } from './FertiliserOverview';
import { FertiliserList } from './FertiliserList';
import { FertiliserForm } from './FertiliserForm';

interface FertiliserLogProps {
  products: any[];
}

export function FertiliserLog({ products }: FertiliserLogProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    applications,
    selectedProduct,
    newApplication,
    searchTerm,
    typeFilter,
    methodFilter,
    organicFilter,
    loading,
    fertiliserTypes,
    applicationMethods,
    filteredApplications,
    statistics,
    topProducts,
    setSelectedProduct,
    setShowAddForm: setHookShowAddForm,
    setNewApplication,
    resetNewApplication,
    handleAddApplication,
    handleDeleteApplication,
    handleEditApplication,
    setSearchTerm,
    setTypeFilter,
    setMethodFilter,
    setOrganicFilter,
    toggleSafetyPrecaution,
    getNPKColor
  } = useFertiliserLog(products);

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setHookShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setHookShowAddForm(false);
    resetNewApplication();
  };

  const handleAddApplicationSubmit = () => {
    handleAddApplication();
    handleCloseAddForm();
  };

  const handleViewApplication = (application: any) => {
    // For now, just log the application. In a real app, this would open a details modal
    console.log('View application:', application);
  };

  const handleEditApplicationItem = (application: any) => {
    // For now, just log the application. In a real app, this would open an edit modal
    console.log('Edit application:', application);
  };

  const handleDeleteApplicationItem = (application: any) => {
    handleDeleteApplication(application.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fertiliser Application Log</h2>
            <p className="text-gray-600">Track and manage fertilizer applications with detailed information</p>
          </div>
          <Button onClick={handleShowAddForm} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Log Application
          </Button>
        </div>
      </Card>

      {/* Overview Section */}
      <FertiliserOverview
        statistics={statistics}
        topProducts={topProducts}
        onAddNewApplication={handleShowAddForm}
      />

      {/* List Section */}
      <FertiliserList
        filteredApplications={filteredApplications}
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        methodFilter={methodFilter}
        organicFilter={organicFilter}
        fertiliserTypes={fertiliserTypes}
        applicationMethods={applicationMethods}
        onSearchTerm={setSearchTerm}
        onTypeFilter={setTypeFilter}
        onMethodFilter={setMethodFilter}
        onOrganicFilter={setOrganicFilter}
        onViewApplication={handleViewApplication}
        onEditApplication={handleEditApplicationItem}
        onDeleteApplication={handleDeleteApplicationItem}
        onAddNewApplication={handleShowAddForm}
      />

      {/* Add Form Modal */}
      {showAddForm && (
        <FertiliserForm
          newApplication={newApplication}
          isProcessing={loading}
          fertiliserTypes={fertiliserTypes}
          applicationMethods={applicationMethods}
          onNewApplicationChange={(app) => setNewApplication(prev => ({ ...prev, ...app }))}
          onAddApplication={handleAddApplicationSubmit}
          onClose={handleCloseAddForm}
          onToggleSafetyPrecaution={toggleSafetyPrecaution}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Recording application...</p>
          </div>
        </div>
      )}
    </div>
  );
}
