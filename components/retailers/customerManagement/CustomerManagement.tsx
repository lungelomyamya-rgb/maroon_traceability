// src/components/retailers/customerManagement/CustomerManagement.tsx
'use client';

import { useState } from 'react';
import { CustomerMetrics } from './CustomerMetrics';
import { CustomerList } from './CustomerList';
import { CustomerDetails } from './CustomerDetails';
import { CommunicationForm } from './CommunicationForm';
import { useCustomerManagement, type Customer } from './hooks/useCustomerManagement';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Download } from 'lucide-react';

interface CustomerManagementProps {
  title?: string;
}

export function CustomerManagement({ title = "Customer Management" }: CustomerManagementProps) {
  const {
    customers,
    metrics,
    isLoading,
    refreshData,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    sendMessage
  } = useCustomerManagement();

  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showCommunicationForm, setShowCommunicationForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    console.log('Edit customer:', customer.id);
    // TODO: Implement customer editing
  };

  const handleContactCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCommunicationForm(true);
  };

  const handleCloseDetails = () => {
    setShowCustomerDetails(false);
    setSelectedCustomer(null);
  };

  const handleCloseCommunication = () => {
    setShowCommunicationForm(false);
    setSelectedCustomer(null);
  };

  const handleSendMessage = (message: any) => {
    sendMessage(message);
    handleCloseCommunication();
  };

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Customer Metrics */}
      <CustomerMetrics metrics={metrics} />

      {/* Customer List */}
      <CustomerList
        customers={customers}
        onViewDetails={handleViewDetails}
        onEdit={handleEditCustomer}
        onContact={handleContactCustomer}
        isLoading={isLoading}
      />

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={handleCloseDetails}
          onEdit={handleEditCustomer}
          onContact={handleContactCustomer}
        />
      )}

      {/* Communication Form Modal */}
      {showCommunicationForm && selectedCustomer && (
        <CommunicationForm
          customer={selectedCustomer}
          onClose={handleCloseCommunication}
          onSend={handleSendMessage}
        />
      )}
    </div>
  );
}
