// src/components/packaging/inventory/hooks/usePackagingInventory.ts
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

import { useUser } from '@/contexts/userContext';

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  lastUpdated: string;
  expiryDate?: string;
  supplier: string;
  qualityGrade: 'A' | 'B' | 'C';
  storageRequirements: string[];
  qrCode: string;
  certifications: string[];
}

export interface StockMovement {
  id: string;
  inventoryId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  timestamp: string;
  userId: string;
  userName: string;
  reference?: string;
}

export interface PackagingInventoryState {
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  filteredInventory: InventoryItem[];
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  selectedItem: InventoryItem | null;
  loading: boolean;
}

export interface PackagingInventoryActions {
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  setSelectedItem: (item: InventoryItem | null) => void;
  refreshInventory: () => void;
  exportInventory: () => void;
  deleteItem: (id: string) => void;
  updateStock: (id: string, quantity: number, reason: string) => void;
}

export interface PackagingInventoryComputed {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: string[];
  stats: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
    discontinued: number;
  };
}

export function usePackagingInventory() {
  const { currentUser } = useUser();
  const router = useRouter();
  
  // State
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data initialization
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'packaging') {
      router.push('/unauthorized');
      return;
    }

    // Load mock inventory data
    const mockInventory: InventoryItem[] = [
      {
        id: 'inv1',
        productId: 'PRD-2024-001',
        productName: 'Organic Moringa Powder',
        batchNumber: 'BATCH-2024-001',
        category: 'Powders',
        currentStock: 450,
        minStockLevel: 100,
        maxStockLevel: 1000,
        unit: 'kg',
        unitCost: 25.50,
        totalValue: 11475,
        location: 'Warehouse A - Shelf 1',
        status: 'in-stock',
        lastUpdated: '2025-01-20T10:00:00Z',
        expiryDate: '2025-12-31T23:59:59Z',
        supplier: 'Organic Farms Co.',
        qualityGrade: 'A',
        storageRequirements: ['Cool, dry place', 'Away from direct sunlight', 'Airtight container'],
        qrCode: 'QR-INV-001',
        certifications: ['Organic Certified', 'GMP Certified', 'ISO 22000'],
      },
      {
        id: 'inv2',
        productId: 'PRD-2024-002',
        productName: 'Moringa Tea Bags',
        batchNumber: 'BATCH-2024-002',
        category: 'Teas',
        currentStock: 1200,
        minStockLevel: 300,
        maxStockLevel: 2000,
        unit: 'units',
        unitCost: 2.75,
        totalValue: 3300,
        location: 'Warehouse A - Shelf 2',
        status: 'in-stock',
        lastUpdated: '2025-01-20T10:00:00Z',
        expiryDate: '2025-08-15T23:59:59Z',
        supplier: 'Tea Masters Ltd.',
        qualityGrade: 'A',
        storageRequirements: ['Cool, dry place', 'Away from strong odors'],
        qrCode: 'QR-INV-002',
        certifications: ['Organic Certified', 'Fair Trade'],
      },
      {
        id: 'inv3',
        productId: 'PRD-2024-003',
        productName: 'Moringa Capsules',
        batchNumber: 'BATCH-2024-003',
        category: 'Supplements',
        currentStock: 85,
        minStockLevel: 100,
        maxStockLevel: 500,
        unit: 'bottles',
        unitCost: 15.25,
        totalValue: 1296.25,
        location: 'Warehouse B - Shelf 1',
        status: 'low-stock',
        lastUpdated: '2025-01-20T10:00:00Z',
        expiryDate: '2026-01-31T23:59:59Z',
        supplier: 'NutriSupplements Inc.',
        qualityGrade: 'B',
        storageRequirements: ['Room temperature', 'Dry environment'],
        qrCode: 'QR-INV-003',
        certifications: ['GMP Certified', 'FDA Approved'],
      },
      {
        id: 'inv4',
        productId: 'PRD-2024-004',
        productName: 'Moringa Oil',
        batchNumber: 'BATCH-2024-004',
        category: 'Oils',
        currentStock: 0,
        minStockLevel: 50,
        maxStockLevel: 300,
        unit: 'liters',
        unitCost: 45.00,
        totalValue: 0,
        location: 'Warehouse B - Shelf 2',
        status: 'out-of-stock',
        lastUpdated: '2025-01-20T10:00:00Z',
        expiryDate: '2025-06-30T23:59:59Z',
        supplier: 'Organic Oil Co.',
        qualityGrade: 'A',
        storageRequirements: ['Cool place', 'Dark container', 'Away from heat'],
        qrCode: 'QR-INV-004',
        certifications: ['Organic Certified', 'Cold Pressed'],
      },
      {
        id: 'inv5',
        productId: 'PRD-2024-005',
        productName: 'Moringa Energy Drink',
        batchNumber: 'BATCH-2024-005',
        category: 'Supplements',
        currentStock: 250,
        minStockLevel: 100,
        maxStockLevel: 600,
        unit: 'bottles',
        unitCost: 8.50,
        totalValue: 2125,
        location: 'Warehouse A - Shelf 3',
        status: 'in-stock',
        lastUpdated: '2025-01-20T10:00:00Z',
        expiryDate: '2025-09-30T23:59:59Z',
        supplier: 'Beverage Innovations',
        qualityGrade: 'B',
        storageRequirements: ['Refrigerate after opening', 'Keep upright'],
        qrCode: 'QR-INV-005',
        certifications: ['FDA Approved', 'Halal Certified'],
      },
    ];

    const mockStockMovements: StockMovement[] = [
      {
        id: 'move1',
        inventoryId: 'inv1',
        type: 'in',
        quantity: 100,
        reason: 'New stock received',
        timestamp: '2025-01-20T09:00:00Z',
        userId: currentUser?.id || '',
        userName: currentUser?.name || 'System',
      },
      {
        id: 'move2',
        inventoryId: 'inv2',
        type: 'out',
        quantity: 50,
        reason: 'Order fulfillment',
        timestamp: '2025-01-19T14:30:00Z',
        userId: currentUser?.id || '',
        userName: currentUser?.name || 'System',
      },
      {
        id: 'move3',
        inventoryId: 'inv3',
        type: 'adjustment',
        quantity: -15,
        reason: 'Quality control adjustment',
        timestamp: '2025-01-19T16:45:00Z',
        userId: currentUser?.id || '',
        userName: currentUser?.name || 'System',
      },
    ];

    setInventory(mockInventory);
    setStockMovements(mockStockMovements);
    setFilteredInventory(mockInventory);
  }, [currentUser, router]);

  // Filtering logic
  useEffect(() => {
    let filtered = inventory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productId.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, categoryFilter, statusFilter]);

  // Computed values
  const computed = useMemo<PackagingInventoryComputed>(() => {
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockItems = inventory.filter(item => item.status === 'low-stock').length;
    const outOfStockItems = inventory.filter(item => item.status === 'out-of-stock').length;
    const categories = Array.from(new Set(inventory.map(item => item.category)));
    
    const stats = {
      inStock: inventory.filter(item => item.status === 'in-stock').length,
      lowStock: inventory.filter(item => item.status === 'low-stock').length,
      outOfStock: inventory.filter(item => item.status === 'out-of-stock').length,
      discontinued: inventory.filter(item => item.status === 'discontinued').length,
    };

    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categories,
      stats,
    };
  }, [inventory]);

  // Actions
  const actions: PackagingInventoryActions = {
    setSearchTerm,
    setCategoryFilter,
    setStatusFilter,
    setSelectedItem,
    refreshInventory: () => {
      setLoading(true);
      // Simulate refresh
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    },
    exportInventory: () => {
      const csv = [
        ['Product ID', 'Product Name', 'Batch Number', 'Category', 'Current Stock', 'Status', 'Location', 'Total Value'],
        ...filteredInventory.map(item => [
          item.productId,
          item.productName,
          item.batchNumber,
          item.category,
          `${item.currentStock} ${item.unit}`,
          item.status,
          item.location,
          `R${item.totalValue.toFixed(2)}`,
        ]),
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    deleteItem: (id: string) => {
      if (window.confirm('Are you sure you want to delete this item?')) {
        setInventory(prev => prev.filter(item => item.id !== id));
        setStockMovements(prev => prev.filter(movement => movement.inventoryId !== id));
      }
    },
    updateStock: (id: string, quantity: number, reason: string) => {
      setInventory(prev => prev.map(item => {
        if (item.id === id) {
          const newStock = item.currentStock + quantity;
          const newStatus = newStock <= 0 ? 'out-of-stock' : 
            newStock <= item.minStockLevel ? 'low-stock' : 'in-stock';
          
          return {
            ...item,
            currentStock: newStock,
            totalValue: newStock * item.unitCost,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      }));

      // Add stock movement record
      const newMovement: StockMovement = {
        id: `move-${Date.now()}`,
        inventoryId: id,
        type: quantity > 0 ? 'in' : quantity < 0 ? 'out' : 'adjustment',
        quantity: Math.abs(quantity),
        reason,
        timestamp: new Date().toISOString(),
        userId: currentUser?.id || '',
        userName: currentUser?.name || 'System',
      };
      
      setStockMovements(prev => [newMovement, ...prev]);
    },
  };

  return {
    // State
    inventory,
    stockMovements,
    filteredInventory,
    searchTerm,
    categoryFilter,
    statusFilter,
    selectedItem,
    loading,
    
    // Computed
    computed,
    
    // Actions
    ...actions,
  };
}
