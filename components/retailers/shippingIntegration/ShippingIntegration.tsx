// src/components/retailers/shippingIntegration/ShippingIntegration.tsx
'use client';

import { useState } from 'react';
import { ShippingMetrics } from './ShippingMetrics';
import { ShippingProviders } from './ShippingProviders';
import { ShipmentList } from './ShipmentList';
import { ShipmentDetails } from './ShipmentDetails';
import { useShippingIntegration, type Shipment } from './hooks/useShippingIntegration';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Truck, Download } from 'lucide-react';

interface ShippingIntegrationProps {
  title?: string;
}

export function ShippingIntegration({ title = "Shipping Integration" }: ShippingIntegrationProps) {
  const {
    shipments,
    providers,
    metrics,
    isLoading,
    refreshData,
    createShipment,
    updateShipment,
    deleteShipment,
    configureProvider,
    toggleProviderStatus
  } = useShippingIntegration();

  const [showShipmentDetails, setShowShipmentDetails] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const handleViewDetails = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowShipmentDetails(true);
  };

  const handleEditShipment = (shipment: Shipment) => {
    console.log('Edit shipment:', shipment.id);
    // TODO: Implement shipment editing
  };

  const handleCloseDetails = () => {
    setShowShipmentDetails(false);
    setSelectedShipment(null);
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

      {/* Shipping Metrics */}
      <ShippingMetrics metrics={metrics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Shipment List */}
        <div className="lg:col-span-2">
          <ShipmentList
            shipments={shipments}
            onViewDetails={handleViewDetails}
            onEdit={handleEditShipment}
            onExport={() => console.log('Export shipments')}
            onRefresh={refreshData}
            isLoading={isLoading}
          />
        </div>

        {/* Shipping Providers */}
        <div className="lg:col-span-1">
          <ShippingProviders
            providers={providers}
            onConfigure={(providerId) => configureProvider(providerId, {})}
            onToggleStatus={toggleProviderStatus}
          />
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">On-Time Delivery Rate</span>
              <span className="text-sm font-medium">{metrics.onTimeDeliveryRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Delivery Time</span>
              <span className="text-sm font-medium">{metrics.averageDeliveryTime.toFixed(1)} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Shipping Cost</span>
              <span className="text-sm font-medium">R{metrics.totalShippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Cost per Shipment</span>
              <span className="text-sm font-medium">R{metrics.averageCostPerShipment.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Performance</h3>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{provider.name}</p>
                  <p className="text-xs text-gray-500">{shipments.filter(s => s.provider === provider.name).length} shipments</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{provider.successRate}%</p>
                  <p className="text-xs text-gray-500">Success rate</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Shipment Details Modal */}
      {showShipmentDetails && selectedShipment && (
        <ShipmentDetails
          shipment={selectedShipment}
          onClose={handleCloseDetails}
          onEdit={handleEditShipment}
        />
      )}
    </div>
  );
}
