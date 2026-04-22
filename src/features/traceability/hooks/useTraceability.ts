// src/features/traceability/hooks/useTraceability.ts
// Traceability hook for blockchain-based product tracking

import { useState, useEffect } from 'react';
import type { ProductEvent, Product } from '../types/traceabilityTypes';

export interface TraceabilityState {
  events: ProductEvent[];
  loading: boolean;
  error: string | null;
  currentProduct: Product | null;
}

export const useTraceability = (productId?: string) => {
  const [state, setState] = useState<TraceabilityState>({
    events: [],
    loading: false,
    error: null,
    currentProduct: null,
  });

  const fetchTraceabilityData = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Mock API call - replace with real blockchain service
      const mockEvents: ProductEvent[] = [
        {
          id: '1',
          productId: id,
          type: 'harvest',
          timestamp: new Date('2024-01-15T10:00:00Z'),
          location: 'Lwandle Farm, South Africa',
          description: 'Moringa leaves harvested at peak freshness',
          verified: true,
          metadata: {
            temperature: '22°C',
            humidity: '65%',
            quality: 'Grade A',
          },
        },
        {
          id: '2',
          productId: id,
          type: 'processing',
          timestamp: new Date('2024-01-16T14:00:00Z'),
          location: 'Processing Facility, Cape Town',
          description: 'Leaves washed and dried using organic methods',
          verified: true,
          metadata: {
            processingMethod: 'air-dried',
            duration: '48 hours',
            certification: 'Organic Certified',
          },
        },
        {
          id: '3',
          productId: id,
          type: 'packaging',
          timestamp: new Date('2024-01-17T09:00:00Z'),
          location: 'Packaging Facility, Johannesburg',
          description: 'Products packaged in eco-friendly materials',
          verified: true,
          metadata: {
            packagingType: 'biodegradable',
            batchNumber: 'BATCH-001',
            expiryDate: '2025-01-17',
          },
        },
        {
          id: '4',
          productId: id,
          type: 'shipping',
          timestamp: new Date('2024-01-18T16:00:00Z'),
          location: 'Distribution Center, Durban',
          description: 'Shipped to retail location',
          verified: true,
          metadata: {
            carrier: 'Green Logistics Co.',
            trackingNumber: 'TRACK-123456',
            estimatedDelivery: '2024-01-20',
          },
        },
      ];

      setState(prev => ({
        ...prev,
        events: mockEvents,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch traceability data',
      }));
    }
  };

  const scanQRCode = async (qrData: string) => {
    try {
      // Mock QR code parsing - replace with real QR service
      const productId = qrData.includes('product-') ? qrData.split('-')[1] : qrData;

      if (productId) {
        await fetchTraceabilityData(productId);
      }

      return productId;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Invalid QR code',
      }));
      return null;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const resetTraceability = () => {
    setState({
      events: [],
      loading: false,
      error: null,
      currentProduct: null,
    });
  };

  useEffect(() => {
    if (productId) {
      fetchTraceabilityData(productId);
    }
  }, [productId]);

  return {
    ...state,
    fetchTraceabilityData,
    scanQRCode,
    clearError,
    resetTraceability,
  };
};
