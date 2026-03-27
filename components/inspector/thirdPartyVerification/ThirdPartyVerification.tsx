// src/components/inspector/thirdPartyVerification/ThirdPartyVerification.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useThirdPartyVerification } from './hooks/useThirdPartyVerification';
import { VerificationOverview } from './VerificationOverview';
import { VerificationList } from './VerificationList';
import { VerificationForm } from './VerificationForm';

interface ThirdPartyVerificationProps {
  inspectionId: string;
  onSubmit: (data: any) => Promise<void>;
  existingVerification?: any;
}

export function ThirdPartyVerification({ inspectionId, onSubmit, existingVerification }: ThirdPartyVerificationProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    verifications,
    selectedVerification,
    showAddForm: hookShowAddForm,
    isSubmitting,
    documents,
    selectedProvider,
    searchTerm,
    providerFilter,
    statusFilter,
    loading,
    verificationProviders,
    filteredVerifications,
    statistics,
    form,
    providerInfo,
    setSelectedVerification,
    setShowAddForm: setHookShowAddForm,
    setIsSubmitting,
    setDocuments,
    setSelectedProvider,
    setSearchTerm,
    setProviderFilter,
    setStatusFilter,
    handleDocumentUpload,
    removeDocument,
    handleFormSubmit,
    handleDeleteVerification,
    handleViewVerification,
    handleEditVerification
  } = useThirdPartyVerification(inspectionId, existingVerification);

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setHookShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setHookShowAddForm(false);
  };

  const handleAddApplicationSubmit = (data: any) => {
    handleFormSubmit(data);
    handleCloseAddForm();
  };

  const handleViewVerificationItem = (verification: any) => {
    handleViewVerification(verification);
  };

  const handleEditVerificationItem = (verification: any) => {
    handleEditVerification(verification.id, verification);
  };

  const handleDeleteVerificationItem = (verification: any) => {
    handleDeleteVerification(verification.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Third-Party Verification</h2>
            <p className="text-gray-600">Track and manage third-party verification requests with accredited laboratories</p>
          </div>
          <Button onClick={handleShowAddForm} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Request Verification
          </Button>
        </div>
      </Card>

      {/* Overview Section */}
      <VerificationOverview
        statistics={statistics}
        onAddNewVerification={handleShowAddForm}
      />

      {/* List Section */}
      <VerificationList
        filteredVerifications={filteredVerifications}
        searchTerm={searchTerm}
        providerFilter={providerFilter}
        statusFilter={statusFilter}
        verificationProviders={Object.keys(verificationProviders)}
        onSearchTerm={setSearchTerm}
        onProviderFilter={setProviderFilter}
        onStatusFilter={setStatusFilter}
        onViewVerification={handleViewVerificationItem}
        onEditVerification={handleEditVerificationItem}
        onDeleteVerification={handleDeleteVerificationItem}
        onAddNewVerification={handleShowAddForm}
      />

      {/* Add Form Modal */}
      {showAddForm && (
        <VerificationForm
          form={form}
          isSubmitting={isSubmitting}
          documents={documents}
          verificationProviders={Object.values(verificationProviders)}
          providerInfo={providerInfo}
          selectedProvider={selectedProvider}
          onDocumentUpload={handleDocumentUpload}
          removeDocument={removeDocument}
          setSelectedProvider={(provider: string) => setSelectedProvider(provider as any)}
          onFormSubmit={handleAddApplicationSubmit}
          onClose={handleCloseAddForm}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Processing verification...</p>
          </div>
        </div>
      )}
    </div>
  );
}
