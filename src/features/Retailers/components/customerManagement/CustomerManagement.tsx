// src/components/retailers/customerManagement/CustomerManagement.tsx
'use client';

import { RefreshCw, Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/src/features/shared/ui/button';

import { CommunicationForm } from './CommunicationForm';
import { CustomerDetails } from './CustomerDetails';
import { CustomerList } from './CustomerList';
import { CustomerMetrics } from './CustomerMetrics';
import { useCustomerManagement, type Customer, type CommunicationMessage } from './hooks/useCustomerManagement';


interface CustomerManagementProps {
  title?: string;
}

export function CustomerManagement({ title = 'Customer Management' }: CustomerManagementProps) {
  const {
    customers,
    metrics,
    isLoading,
    refreshData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addCustomer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCustomer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteCustomer,
    sendMessage,
  } = useCustomerManagement();

  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showCommunicationForm, setShowCommunicationForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    // Implement customer editing
    try {
      console.log('Editing customer:', customer);
      // In a real implementation, this would:
      // 1. Open an edit modal or navigate to edit page
      // 2. Pre-fill the form with current customer data
      // 3. Allow user to modify customer details
      // 4. Save changes to the backend
      // 5. Update the local state
      
      // For demo purposes, we'll show a message with customer info
      alert(`Edit functionality for customer "${customer.name}" (Email: ${customer.email}) would open here.`);
      // In a real implementation, we would open an edit modal here
    } catch (error) {
      console.error('Failed to edit customer:', error);
      alert('Failed to edit customer. Please try again.');
    }
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

  const handleSendMessage = (message: CommunicationMessage) => {
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
