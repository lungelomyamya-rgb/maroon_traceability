// src/components/packaging/batchProcessing/hooks/useBatchProcessing.ts
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/contexts/userContext';
import type {
  BatchProcessingItem,
  PackagingType,
  BatchStatus,
  PackagingRecord,
} from '@/types/packaging';
import {
  PACKAGING_TYPES,
  generateBatchCode,
} from '@/types/packaging';


// Extended interface to include qrCode
export interface ExtendedBatchProcessingItem extends BatchProcessingItem {
  qrCode?: string;
}

export interface BatchProcessingState {
  batchItems: ExtendedBatchProcessingItem[];
  packagingRecords: PackagingRecord[];
  newItem: {
    productId: string;
    productName: string;
    quantity: string;
    unitOfMeasure: string;
    packagingType: string;
  };
  selectedItem: ExtendedBatchProcessingItem | null;
  showEventForm: boolean;
  showQRGenerator: boolean;
  isProcessing: boolean;
  searchTerm: string;
  statusFilter: string;
  packagingTypeFilter: string;
  loading: boolean;
}

export interface BatchProcessingActions {
  setNewItem: (item: Partial<BatchProcessingState['newItem']>) => void;
  resetNewItem: () => void;
  setSelectedItem: (item: ExtendedBatchProcessingItem | null) => void;
  setShowEventForm: (show: boolean) => void;
  setShowQRGenerator: (show: boolean) => void;
  handleAddBatch: () => void;
  handleCompleteBatch: (id: string) => void;
  handleDeleteBatch: (id: string) => void;
  handleRowClick: (item: ExtendedBatchProcessingItem) => void;
  handlePackagingEventSubmit: (data: unknown) => void;
  handleQRGenerated: (qrData: string) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setPackagingTypeFilter: (type: string) => void;
  generateQRCode: (item: ExtendedBatchProcessingItem) => void;
}

export interface BatchProcessingComputed {
  filteredItems: ExtendedBatchProcessingItem[];
  statistics: {
    totalBatches: number;
    completedBatches: number;
    processingBatches: number;
    pendingBatches: number;
    totalQuantity: number;
    qrGeneratedBatches: number;
    averageBatchSize: number;
    packagingTypeDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
  };
  packagingTypes: string[];
  batchStatuses: string[];
}

export function useBatchProcessing() {
  const router = useRouter();
  const { currentUser } = useUser();

  // State
  const [batchItems, setBatchItems] = useState<ExtendedBatchProcessingItem[]>([]);
  const [packagingRecords, setPackagingRecords] = useState<PackagingRecord[]>([]);
  const [newItem, setNewItem] = useState({
    productId: '',
    productName: '',
    quantity: '',
    unitOfMeasure: '',
    packagingType: '',
  });
  const [selectedItem, setSelectedItem] = useState<ExtendedBatchProcessingItem | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packagingTypeFilter, setPackagingTypeFilter] = useState('all');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  // Authentication check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser?.role !== 'packaging') {
        // Handle unauthorized access
        console.warn('Unauthorized access attempt to packaging features');
        router.push('/unauthorized');
        return;
      }
    }, 200);

    return () => {

      clearTimeout(timer);
    };
  }, [currentUser, router]);

  // Mock data initialization
  useEffect(() => {
    const mockBatchItems: ExtendedBatchProcessingItem[] = [
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
        qrCode: 'QR-BATCH-2024-CAR-STL-ABC',
        packagingDate: '2025-01-20T08:00:00Z',
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
        qrCode: 'QR-BATCH-2024-VAC-STL-DEF',
        packagingDate: '2025-01-20T09:00:00Z',
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
        qrCode: '',
        packagingDate: '2025-01-20T10:00:00Z',
      },
      {
        id: '4',
        productId: 'PRD-2024-004',
        productName: 'Moringa Powder Premium',
        quantity: 100,
        unitOfMeasure: 'kg',
        packagingType: 'vacuum-sealed',
        status: 'pending',
        batchCode: '',
        qrGenerated: false,
        qrCode: '',
        packagingDate: '',
      },
      {
        id: '5',
        productId: 'PRD-2024-005',
        productName: 'Herbal Tea Collection',
        quantity: 75,
        unitOfMeasure: 'boxes',
        packagingType: 'cardboard-box',
        status: 'completed',
        batchCode: 'BATCH-2024-HER-STL-JKL',
        qrGenerated: true,
        qrCode: 'QR-BATCH-2024-HER-STL-JKL',
        packagingDate: '2025-01-20T11:00:00Z',
      },
    ];

    setBatchItems(mockBatchItems);
  }, []);

  // Constants
  const packagingTypes = Object.keys(PACKAGING_TYPES);
  const batchStatuses = useMemo(() => ['all', 'pending', 'processing', 'qc-pending', 'completed', 'failed'], []);

  // Actions
  const resetNewItem = () => {
    setNewItem({
      productId: '',
      productName: '',
      quantity: '',
      unitOfMeasure: '',
      packagingType: '',
    });
  };

  const handleAddBatch = async () => {
    if (!newItem.productId || !newItem.quantity || !newItem.packagingType) {
      return;
    }

    try {
      setIsProcessing(true);

      // Generate batch code if not provided
      const batchCode = generateBatchCode(newItem.packagingType as PackagingType);

      const batchData: ExtendedBatchProcessingItem = {
        id: `batch-${Date.now()}`,
        productId: newItem.productId,
        productName: newItem.productName,
        quantity: parseInt(newItem.quantity),
        unitOfMeasure: newItem.unitOfMeasure,
        packagingType: newItem.packagingType as PackagingType,
        status: 'pending',
        batchCode,
        qrGenerated: false,
        qrCode: '',
        packagingDate: new Date().toISOString(),
      };

      setBatchItems(prev => [...prev, batchData]);
      resetNewItem();

      // Auto-complete the batch if it's a simple case
      if (batchData.quantity <= 10) {
        setTimeout(() => {
          handleCompleteBatch(batchData.id);
        }, 1000);
      }

    } catch (error) {
      // Handle failed batch addition
      console.error('Failed to add batch:', error);
      // Show user-friendly error message
      alert('Failed to add batch to processing queue. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteBatch = async (id: string) => {
    try {
      setIsProcessing(true);

      const updatedItems = batchItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: 'completed' as BatchStatus,
            packagingDate: new Date().toISOString(),
            qrGenerated: true,
            qrCode: `QR-${item.batchCode || ''}`,
          };
        }
        return item;
      });

      setBatchItems(updatedItems);

      // Create packaging records
      const records: PackagingRecord[] = updatedItems.map(item => ({
        id: `record-${item.id}`,
        batchId: item.batchCode || '',
        productId: item.productId,
        productName: item.productName,
        packagingType: item.packagingType,
        quantity: item.quantity,
        unitOfMeasure: item.unitOfMeasure,
        packagingDate: item.packagingDate || '',
        location: 'Packhouse 1, Stellenbosch',
        operator: currentUser?.name || 'System User',
        status: 'completed',
        batchCode: item.batchCode || '',
        qrCodes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      setPackagingRecords(prev => [...prev, ...records]);

    } catch (error) {
      // Handle batch completion failure
      console.error('Failed to complete batch:', error);
      // Show user-friendly error message
      alert('Failed to complete batch processing. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteBatch = (id: string) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      setBatchItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleRowClick = (item: ExtendedBatchProcessingItem) => {
    setSelectedItem(item);
  };

  const handlePackagingEventSubmit = async (data: unknown) => {
    // Handle packaging event submission
    try {
      console.log('Submitting packaging event:', data);
      // In a real implementation, this would save to the backend
      // For now, we'll just close the form and show a success message
      alert('Packaging event submitted successfully!');
      setShowEventForm(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to submit packaging event:', error);
      alert('Failed to submit packaging event. Please try again.');
    }
  };

  const handleQRGenerated = (qrData: string) => {
    // Handle QR code generation
    try {
      console.log('QR code generated:', qrData);
      const updatedItems = batchItems.map(item => {
        if (item.id === selectedItem?.id) {
          return { ...item, qrGenerated: true, qrCode: qrData };
        }
        return item;
      });

      setBatchItems(updatedItems);
      setShowQRGenerator(false);
    } catch (error) {
      console.error('Failed to handle QR code generation:', error);
      alert('Failed to generate QR code. Please try again.');
    }
  };

  const generateQRCode = (item: ExtendedBatchProcessingItem) => {
    setSelectedItem(item);
    setShowQRGenerator(true);
  };

  // Computed values
  const filteredItems = useMemo(() => {
    return batchItems.filter(item => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.batchCode?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      // Status filter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      // Packaging type filter
      const matchesPackagingType = packagingTypeFilter === 'all' || item.packagingType === packagingTypeFilter;

      return matchesSearch && matchesStatus && matchesPackagingType;
    });
  }, [batchItems, searchTerm, statusFilter, packagingTypeFilter]);

  const statistics = useMemo(() => {
    const totalBatches = batchItems.length;
    const completedBatches = batchItems.filter(item => item.status === 'completed').length;
    const processingBatches = batchItems.filter(item => item.status === 'processing').length;
    const pendingBatches = batchItems.filter(item => item.status === 'pending').length;
    const qcPendingBatches = batchItems.filter(item => item.status === 'qc-pending').length;
    const totalQuantity = batchItems.reduce((sum, item) => sum + item.quantity, 0);
    const qrGeneratedBatches = batchItems.filter(item => item.qrGenerated).length;
    const averageBatchSize = totalBatches > 0 ? totalQuantity / totalBatches : 0;

    // Packaging type distribution
    const packagingTypeDistribution = packagingTypes.reduce((acc, type) => {
      acc[type] = batchItems.filter(item => item.packagingType === type).length;
      return acc;
    }, {} as Record<string, number>);

    // Status distribution
    const statusDistribution = batchStatuses.reduce((acc, status) => {
      if (status === 'all') {
        return acc;
      }
      acc[status] = batchItems.filter(item => item.status === status).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalBatches,
      completedBatches,
      processingBatches,
      pendingBatches: pendingBatches + qcPendingBatches,
      totalQuantity,
      qrGeneratedBatches,
      averageBatchSize,
      packagingTypeDistribution,
      statusDistribution,
    };
  }, [batchItems, packagingTypes, batchStatuses]);

  return {
    // State
    batchItems,
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

    // Constants
    packagingTypes,
    batchStatuses,

    // Computed
    filteredItems,
    statistics,

    // Actions
    setNewItem,
    resetNewItem,
    setSelectedItem,
    setShowEventForm,
    setShowQRGenerator,
    handleAddBatch,
    handleCompleteBatch,
    handleDeleteBatch,
    handleRowClick,
    handlePackagingEventSubmit,
    handleQRGenerated,
    setSearchTerm,
    setStatusFilter,
    setPackagingTypeFilter,
    generateQRCode,
  };
}
