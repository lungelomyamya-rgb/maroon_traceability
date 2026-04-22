// src/components/retailers/inventory/hooks/useInventory.ts
'use client';

import { useState, useEffect } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  batchCode: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  qualityGrade: 'A' | 'B' | 'C';
  expiryDate: string;
  salesVelocity: number;
  reorderPoint: number;
  reorderQuantity: number;
}

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'processed', label: 'Processed Foods' },
  ];

  const statusConfig = {
    'in-stock': { color: 'bg-green-100 text-green-800', icon: '✅', label: 'In Stock' },
    'low-stock': { color: 'bg-yellow-100 text-yellow-800', icon: '⚠️', label: 'Low Stock' },
    'out-of-stock': { color: 'bg-red-100 text-red-800', icon: '❌', label: 'Out of Stock' },
    'discontinued': { color: 'bg-gray-100 text-gray-800', icon: '🚫', label: 'Discontinued' },
  };

  const qualityGrades = [
    { value: 'A', label: 'Grade A - Premium', description: 'Highest quality standards' },
    { value: 'B', label: 'Grade B - Standard', description: 'Good quality standards' },
    { value: 'C', label: 'Grade C - Economy', description: 'Basic quality standards' },
  ];

  useEffect(() => {
    const loadMockInventory = async () => {
      const mockInventory: InventoryItem[] = [
        {
          id: 'inv-001',
          name: 'Organic Tomatoes',
          category: 'vegetables',
          sku: 'VEG-001',
          batchCode: 'BATCH-2024-001',
          currentStock: 150,
          minStockLevel: 50,
          maxStockLevel: 500,
          unitCost: 25.50,
          unitPrice: 45.99,
          supplier: 'Green Farms Co.',
          location: 'Warehouse A - Section 1',
          lastRestocked: '2024-03-15T09:30:00Z',
          status: 'in-stock',
          qualityGrade: 'A',
          expiryDate: '2024-04-15',
          salesVelocity: 12.5,
          reorderPoint: 75,
          reorderQuantity: 200,
        },
        {
          id: 'inv-002',
          name: 'Fresh Spinach',
          category: 'vegetables',
          sku: 'VEG-002',
          batchCode: 'BATCH-2024-002',
          currentStock: 25,
          minStockLevel: 30,
          maxStockLevel: 200,
          unitCost: 18.00,
          unitPrice: 28.50,
          supplier: 'Valley Greens',
          location: 'Warehouse A - Section 2',
          lastRestocked: '2024-03-18T11:15:00Z',
          status: 'low-stock',
          qualityGrade: 'A',
          expiryDate: '2024-03-25',
          salesVelocity: 8.3,
          reorderPoint: 60,
          reorderQuantity: 100,
        },
        {
          id: 'inv-003',
          name: 'Free-Range Eggs',
          category: 'dairy',
          sku: 'DAI-001',
          batchCode: 'BATCH-2024-003',
          currentStock: 0,
          minStockLevel: 40,
          maxStockLevel: 300,
          unitCost: 32.00,
          unitPrice: 65.00,
          supplier: 'Happy Hens Farm',
          location: 'Warehouse B - Section 1',
          lastRestocked: '2024-03-10T08:45:00Z',
          status: 'out-of-stock',
          qualityGrade: 'A',
          expiryDate: '2024-04-10',
          salesVelocity: 15.2,
          reorderPoint: 80,
          reorderQuantity: 150,
        },
        {
          id: 'inv-004',
          name: 'Whole Milk',
          category: 'dairy',
          sku: 'DAI-002',
          batchCode: 'BATCH-2024-004',
          currentStock: 85,
          minStockLevel: 50,
          maxStockLevel: 400,
          unitCost: 22.00,
          unitPrice: 48.00,
          supplier: 'Dairy Fresh Co.',
          location: 'Warehouse B - Section 2',
          lastRestocked: '2024-03-20T14:30:00Z',
          status: 'in-stock',
          qualityGrade: 'A',
          expiryDate: '2024-04-20',
          salesVelocity: 10.8,
          reorderPoint: 70,
          reorderQuantity: 120,
        },
        {
          id: 'inv-005',
          name: 'Artisan Bread',
          category: 'processed',
          sku: 'PRO-001',
          batchCode: 'BATCH-2024-005',
          currentStock: 45,
          minStockLevel: 20,
          maxStockLevel: 150,
          unitCost: 28.00,
          unitPrice: 60.00,
          supplier: 'Local Bakery',
          location: 'Warehouse C - Section 1',
          lastRestocked: '2024-03-19T07:00:00Z',
          status: 'in-stock',
          qualityGrade: 'A',
          expiryDate: '2024-03-26',
          salesVelocity: 6.7,
          reorderPoint: 40,
          reorderQuantity: 80,
        },
      ];

      setInventory(mockInventory);
      setIsLoading(false);
    };

    loadMockInventory();
  }, []);

  const getInventoryByStatus = (status: InventoryItem['status']) => {
    return inventory.filter(item => item.status === status);
  };

  const getInventoryByCategory = (category: string) => {
    return inventory.filter(item => item.category === category);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.status === 'low-stock');
  };

  const getOutOfStockItems = () => {
    return inventory.filter(item => item.status === 'out-of-stock');
  };

  const getExpiringSoonItems = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return inventory.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= cutoffDate && item.status !== 'discontinued';
    });
  };

  const getHighValueItems = () => {
    return inventory
      .filter(item => item.status !== 'discontinued')
      .sort((a, b) => (b.unitPrice * b.currentStock) - (a.unitPrice * a.currentStock))
      .slice(0, 10);
  };

  const getFastMovingItems = () => {
    return inventory
      .filter(item => item.status !== 'discontinued')
      .sort((a, b) => b.salesVelocity - a.salesVelocity)
      .slice(0, 10);
  };

  const getSlowMovingItems = () => {
    return inventory
      .filter(item => item.status !== 'discontinued')
      .sort((a, b) => a.salesVelocity - b.salesVelocity)
      .slice(0, 10);
  };

  const getReorderRecommendations = () => {
    return inventory
      .filter(item =>
        item.status === 'low-stock' ||
        item.status === 'out-of-stock' ||
        item.currentStock <= item.reorderPoint,
      )
      .map(item => ({
        ...item,
        recommendedQuantity: Math.max(item.reorderQuantity, item.maxStockLevel - item.currentStock),
        urgency: item.status === 'out-of-stock' ? 'critical' :
          item.currentStock <= item.reorderPoint ? 'high' : 'medium',
      }))
      .sort((a, b) => {
        const urgencyOrder: Record<string, number> = { critical: 3, high: 2, medium: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      });
  };

  const getInventoryStats = () => {
    const total = inventory.length;
    const inStock = inventory.filter(item => item.status === 'in-stock').length;
    const lowStock = inventory.filter(item => item.status === 'low-stock').length;
    const outOfStock = inventory.filter(item => item.status === 'out-of-stock').length;
    const discontinued = inventory.filter(item => item.status === 'discontinued').length;

    const totalValue = inventory.reduce((sum, item) => sum + (item.unitPrice * item.currentStock), 0);
    const totalCost = inventory.reduce((sum, item) => sum + (item.unitCost * item.currentStock), 0);
    const potentialRevenue = totalValue - totalCost;

    const expiringSoon = getExpiringSoonItems(7).length;
    const reorderNeeded = getReorderRecommendations().length;

    return {
      total,
      inStock,
      lowStock,
      outOfStock,
      discontinued,
      totalValue,
      totalCost,
      potentialRevenue,
      expiringSoon,
      reorderNeeded,
      stockHealth: (inStock / total) * 100,
    };
  };

  const searchInventory = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return inventory.filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.sku.toLowerCase().includes(lowercaseQuery) ||
      item.batchCode.toLowerCase().includes(lowercaseQuery) ||
      item.supplier.toLowerCase().includes(lowercaseQuery) ||
      item.location.toLowerCase().includes(lowercaseQuery),
    );
  };

  const updateInventoryItem = (itemId: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item,
    ));
  };

  const restockItem = (itemId: string, quantity: number) => {
    const item = inventory.find(item => item.id === itemId);
    if (item) {
      updateInventoryItem(itemId, {
        currentStock: item.currentStock + quantity,
        lastRestocked: new Date().toISOString(),
        status: item.currentStock + quantity > item.minStockLevel ? 'in-stock' : item.status,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return {
    inventory,
    isLoading,
    categories,
    statusConfig,
    qualityGrades,
    getInventoryByStatus,
    getInventoryByCategory,
    getLowStockItems,
    getOutOfStockItems,
    getExpiringSoonItems,
    getHighValueItems,
    getFastMovingItems,
    getSlowMovingItems,
    getReorderRecommendations,
    getInventoryStats,
    searchInventory,
    updateInventoryItem,
    restockItem,
    formatCurrency,
    formatDate,
    getDaysUntilExpiry,
  };
}

export type { InventoryItem };
