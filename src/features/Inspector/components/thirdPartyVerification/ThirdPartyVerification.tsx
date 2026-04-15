// src/components/inspector/thirdPartyVerification/ThirdPartyVerification.tsx
'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';

import { VerificationForm } from './VerificationForm';
import { VerificationList } from './VerificationList';
import { VerificationOverview } from './VerificationOverview';
import { useThirdPartyVerification } from './hooks/useThirdPartyVerification';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ThirdPartyVerificationProps {
  inspectionId: string;
  _onSubmit: (data: any) => Promise<void>;
  existingVerification?: any;
}

export function ThirdPartyVerification({ inspectionId, _onSubmit, existingVerification }: ThirdPartyVerificationProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    verifications,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedVerification,
    showAddForm: hookShowAddForm, // eslint-disable-line @typescript-eslint/no-unused-vars
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
    setSelectedVerification, // eslint-disable-line @typescript-eslint/no-unused-vars
    setShowAddForm: setHookShowAddForm,
    setIsSubmitting, // eslint-disable-line @typescript-eslint/no-unused-vars
    setDocuments, // eslint-disable-line @typescript-eslint/no-unused-vars
    setSelectedProvider,
    setSearchTerm,
    setProviderFilter,
    setStatusFilter,
    handleDocumentUpload,
    removeDocument,
    handleFormSubmit,
    handleDeleteVerification,
    handleViewVerification,
    handleEditVerification,
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
