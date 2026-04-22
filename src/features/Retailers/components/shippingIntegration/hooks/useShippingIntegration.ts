// src/components/retailers/shippingIntegration/hooks/useShippingIntegration.ts
'use client';

import { useState, useEffect } from 'react';

interface ShippingProvider {
  id: string;
  name: string;
  type: 'local' | 'national' | 'international';
  services: string[];
  pricing: {
    baseRate: number;
    perKg: number;
    perKm: number;
  };
  status: 'active' | 'inactive' | 'error';
  successRate: number;
  averageDeliveryTime: number;
  totalShipments: number;
  tracking: {
    realTime: boolean;
    notifications: boolean;
    api: boolean;
  };
}

interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  provider: string;
  service: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'failed' | 'returned';
  cost: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  customerName: string;
  customerAddress: string;
  createdAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  insurance: boolean;
  signatureRequired: boolean;
  priority: 'standard' | 'express' | 'overnight';
}

interface ShippingMetrics {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  pending: number;
  onTimeDeliveryRate: number;
  averageDeliveryTime: number;
  totalShippingCost: number;
  averageCostPerShipment: number;
  shipmentsGrowth: number;
}

export function useShippingIntegration() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [providers, setProviders] = useState<ShippingProvider[]>([]);
  const [metrics, setMetrics] = useState<ShippingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading - replace with API calls
    const loadMockData = async () => {
      // Mock shipping providers
      const mockProviders: ShippingProvider[] = [
        {
          id: 'sp-001',
          name: 'FastWay Couriers',
          type: 'local',
          services: ['Standard Delivery', 'Express Delivery', 'Same Day'],
          pricing: { baseRate: 25.00, perKg: 2.50, perKm: 0.50 },
          status: 'active',
          successRate: 94.5,
          averageDeliveryTime: 2.1,
          totalShipments: 1245,
          tracking: { realTime: true, notifications: true, api: true },
        },
        {
          id: 'sp-002',
          name: 'SA Postal Service',
          type: 'national',
          services: ['Standard', 'Speed Services', 'Courier'],
          pricing: { baseRate: 35.00, perKg: 3.00, perKm: 0.75 },
          status: 'active',
          successRate: 91.2,
          averageDeliveryTime: 3.5,
          totalShipments: 2340,
          tracking: { realTime: false, notifications: true, api: false },
        },
        {
          id: 'sp-003',
          name: 'DHL Express',
          type: 'international',
          services: ['Express Worldwide', 'Economy Select', 'Jumbo Box'],
          pricing: { baseRate: 150.00, perKg: 8.50, perKm: 2.00 },
          status: 'active',
          successRate: 96.8,
          averageDeliveryTime: 5.2,
          totalShipments: 567,
          tracking: { realTime: true, notifications: true, api: true },
        },
        {
          id: 'sp-004',
          name: 'Local Logistics',
          type: 'local',
          services: ['Standard', 'Express', 'Bulk'],
          pricing: { baseRate: 20.00, perKg: 2.00, perKm: 0.40 },
          status: 'inactive',
          successRate: 88.3,
          averageDeliveryTime: 1.8,
          totalShipments: 234,
          tracking: { realTime: false, notifications: false, api: false },
        },
      ];

      // Mock shipments
      const mockShipments: Shipment[] = [
        {
          id: 'shp-001',
          orderId: 'ORD-2024-001',
          trackingNumber: 'FW-2024-001234567',
          provider: 'FastWay Couriers',
          service: 'Express Delivery',
          status: 'delivered',
          cost: 45.50,
          weight: 2.5,
          dimensions: { length: 30, width: 20, height: 15 },
          customerName: 'John Smith',
          customerAddress: '123 Main Street, Cape Town, 8001',
          createdAt: '2024-03-10T10:30:00Z',
          estimatedDelivery: '2024-03-12T17:00:00Z',
          actualDelivery: '2024-03-12T14:30:00Z',
          insurance: true,
          signatureRequired: true,
          priority: 'express',
        },
        {
          id: 'shp-002',
          orderId: 'ORD-2024-002',
          trackingNumber: 'SA-2024-002345678',
          provider: 'SA Postal Service',
          service: 'Speed Services',
          status: 'in-transit',
          cost: 67.25,
          weight: 4.2,
          dimensions: { length: 40, width: 30, height: 25 },
          customerName: 'Sarah Johnson',
          customerAddress: '456 Oak Avenue, Johannesburg, 2001',
          createdAt: '2024-03-14T09:15:00Z',
          estimatedDelivery: '2024-03-18T16:00:00Z',
          insurance: false,
          signatureRequired: false,
          priority: 'standard',
        },
        {
          id: 'shp-003',
          orderId: 'ORD-2024-003',
          trackingNumber: 'DHL-2024-003456789',
          provider: 'DHL Express',
          service: 'Express Worldwide',
          status: 'pending',
          cost: 285.00,
          weight: 8.5,
          dimensions: { length: 60, width: 40, height: 35 },
          customerName: 'Mike Wilson',
          customerAddress: '789 Pine Road, Durban, 4001',
          createdAt: '2024-03-15T14:45:00Z',
          estimatedDelivery: '2024-03-20T10:00:00Z',
          insurance: true,
          signatureRequired: true,
          priority: 'overnight',
        },
        {
          id: 'shp-004',
          orderId: 'ORD-2024-004',
          trackingNumber: 'FW-2024-004567890',
          provider: 'FastWay Couriers',
          service: 'Standard Delivery',
          status: 'failed',
          cost: 32.00,
          weight: 1.8,
          dimensions: { length: 25, width: 15, height: 10 },
          customerName: 'Emma Davis',
          customerAddress: '321 Elm Street, Pretoria, 0001',
          createdAt: '2024-03-13T11:20:00Z',
          estimatedDelivery: '2024-03-15T12:00:00Z',
          insurance: false,
          signatureRequired: false,
          priority: 'standard',
        },
      ];

      // Mock metrics
      const deliveredShipments = mockShipments.filter(s => s.status === 'delivered').length;
      const inTransitShipments = mockShipments.filter(s => s.status === 'in-transit').length;
      const pendingShipments = mockShipments.filter(s => s.status === 'pending').length;
      const totalShippingCost = mockShipments.reduce((sum, s) => sum + s.cost, 0);
      const averageCostPerShipment = totalShippingCost / mockShipments.length;

      // Calculate on-time delivery rate (mock calculation)
      const onTimeDeliveries = Math.floor(deliveredShipments * 0.92); // 92% on-time
      const onTimeDeliveryRate = (onTimeDeliveries / deliveredShipments) * 100;

      const mockMetrics: ShippingMetrics = {
        totalShipments: mockShipments.length,
        inTransit: inTransitShipments,
        delivered: deliveredShipments,
        pending: pendingShipments,
        onTimeDeliveryRate,
        averageDeliveryTime: 2.3,
        totalShippingCost,
        averageCostPerShipment,
        shipmentsGrowth: 15.2, // Mock growth percentage
      };

      setProviders(mockProviders);
      setShipments(mockShipments);
      setMetrics(mockMetrics);
      setIsLoading(false);
    };

    loadMockData();
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    // Re-fetch data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const createShipment = (shipmentData: Omit<Shipment, 'id' | 'createdAt'>) => {
    const newShipment: Shipment = {
      ...shipmentData,
      id: `shp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setShipments(prev => [...prev, newShipment]);
    refreshData();
  };

  const updateShipment = (updatedShipment: Shipment) => {
    setShipments(prev => prev.map(s =>
      s.id === updatedShipment.id ? updatedShipment : s,
    ));
    refreshData();
  };

  const deleteShipment = (shipmentId: string) => {
    setShipments(prev => prev.filter(s => s.id !== shipmentId));
    refreshData();
  };

  const getShipmentById = (id: string) => {
    return shipments.find(s => s.id === id);
  };

  const getShipmentsByStatus = (status: Shipment['status']) => {
    return shipments.filter(s => s.status === status);
  };

  const getShipmentsByProvider = (provider: string) => {
    return shipments.filter(s => s.provider === provider);
  };

  const configureProvider = (providerId: string, config: Partial<ShippingProvider>) => {
    setProviders(prev => prev.map(p =>
      p.id === providerId ? { ...p, ...config } : p,
    ));
    refreshData();
  };

  const toggleProviderStatus = (providerId: string) => {
    setProviders(prev => prev.map(provider =>
      provider.id === providerId
        ? { ...provider, status: provider.status === 'active' ? 'inactive' : 'active' as const }
        : provider,
    ));
    refreshData();
  };

  return {
    shipments,
    providers,
    metrics,
    isLoading,
    refreshData,
    createShipment,
    updateShipment,
    deleteShipment,
    getShipmentById,
    getShipmentsByStatus,
    getShipmentsByProvider,
    configureProvider,
    toggleProviderStatus,
  };
}

export type { ShippingProvider, Shipment, ShippingMetrics };
