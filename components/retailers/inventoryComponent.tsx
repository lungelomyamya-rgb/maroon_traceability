// src/app/retailer/inventory/inventoryComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  Filter,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Plus,
  Truck,
  RefreshCw,
  Download,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

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

export default function InventoryComponent() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    // Mock comprehensive inventory data
    const mockInventory: InventoryItem[] = [
      {
        id: 'INV001',
        name: 'Premium Organic Moringa Powder',
        category: 'Powders',
        sku: 'MOR-POW-250',
        batchCode: 'BATCH-001',
        currentStock: 85,
        minStockLevel: 20,
        maxStockLevel: 200,
        unitCost: 25.00,
        unitPrice: 89.99,
        supplier: 'Green Valley Farm',
        location: 'Warehouse A - Shelf 12',
        lastRestocked: '2025-01-15',
        status: 'in-stock',
        qualityGrade: 'A',
        expiryDate: '2025-12-31',
        salesVelocity: 12.5,
        reorderPoint: 25,
        reorderQuantity: 100
      },
      {
        id: 'INV002',
        name: 'Moringa Tea Bags',
        category: 'Teas',
        sku: 'MOR-TEA-20',
        batchCode: 'BATCH-002',
        currentStock: 15,
        minStockLevel: 20,
        maxStockLevel: 150,
        unitCost: 12.00,
        unitPrice: 45.00,
        supplier: 'Sunny Acres Farm',
        location: 'Warehouse A - Shelf 08',
        lastRestocked: '2025-01-10',
        status: 'low-stock',
        qualityGrade: 'A',
        expiryDate: '2025-10-31',
        salesVelocity: 8.3,
        reorderPoint: 20,
        reorderQuantity: 50
      },
      {
        id: 'INV003',
        name: 'Moringa Capsules',
        category: 'Supplements',
        sku: 'MOR-CAP-60',
        batchCode: 'BATCH-003',
        currentStock: 0,
        minStockLevel: 15,
        maxStockLevel: 100,
        unitCost: 18.00,
        unitPrice: 65.00,
        supplier: 'Sunny Acres Farm',
        location: 'Warehouse B - Shelf 05',
        lastRestocked: '2025-01-05',
        status: 'out-of-stock',
        qualityGrade: 'B',
        expiryDate: '2025-08-31',
        salesVelocity: 6.2,
        reorderPoint: 15,
        reorderQuantity: 75
      },
      {
        id: 'INV004',
        name: 'Organic Moringa Oil',
        category: 'Oils',
        sku: 'MOR-OIL-30',
        batchCode: 'BATCH-004',
        currentStock: 45,
        minStockLevel: 10,
        maxStockLevel: 80,
        unitCost: 35.00,
        unitPrice: 120.00,
        supplier: 'Green Valley Farm',
        location: 'Warehouse A - Shelf 15',
        lastRestocked: '2025-01-12',
        status: 'in-stock',
        qualityGrade: 'A',
        expiryDate: '2026-02-28',
        salesVelocity: 4.8,
        reorderPoint: 10,
        reorderQuantity: 40
      },
      {
        id: 'INV005',
        name: 'Moringa Seeds',
        category: 'Seeds',
        sku: 'MOR-SED-500',
        batchCode: 'BATCH-005',
        currentStock: 120,
        minStockLevel: 25,
        maxStockLevel: 300,
        unitCost: 8.00,
        unitPrice: 35.00,
        supplier: 'Highland Farms',
        location: 'Warehouse C - Shelf 22',
        lastRestocked: '2025-01-08',
        status: 'in-stock',
        qualityGrade: 'A',
        expiryDate: '2025-11-30',
        salesVelocity: 15.2,
        reorderPoint: 25,
        reorderQuantity: 150
      }
    ];

    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = inventory;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, categoryFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusIcon = (item: InventoryItem) => {
    if (item.currentStock === 0) return <TrendingDown className="h-4 w-4" />;
    if (item.currentStock <= item.minStockLevel) return <TrendingDown className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  const getStockHealthPercentage = (item: InventoryItem) => {
    return Math.round((item.currentStock / item.maxStockLevel) * 100);
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => total + (item.currentStock * item.unitPrice), 0);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.currentStock <= item.minStockLevel);
  };

  const getOutOfStockItems = () => {
    return inventory.filter(item => item.currentStock === 0);
  };

  const handleReorder = (item: InventoryItem) => {
    alert(`Reordering ${item.name} - Quantity: ${item.reorderQuantity}`);
  };

  const handleUpdateStock = (item: InventoryItem) => {
    setSelectedItem(item);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mb-6">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Inventory
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => window.location.href = '/retailer/product-management'} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-10 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-orange-600">{getLowStockItems().length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-10 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-red-600">{getOutOfStockItems().length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-10 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-green-600">R{inventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0).toLocaleString()}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-10 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search inventory by name, SKU, or batch code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Powders">Powders</SelectItem>
                  <SelectItem value="Teas">Teas</SelectItem>
                  <SelectItem value="Supplements">Supplements</SelectItem>
                  <SelectItem value="Oils">Oils</SelectItem>
                  <SelectItem value="Seeds">Seeds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Inventory Table */}
        <Card className="p-6">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">Product</th>
                  <th className="text-left p-3 font-medium text-gray-700">SKU</th>
                  <th className="text-left p-3 font-medium text-gray-700">Batch</th>
                  <th className="text-left p-3 font-medium text-gray-700">Stock</th>
                  <th className="text-left p-3 font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 font-medium text-gray-700">Location</th>
                  <th className="text-left p-3 font-medium text-gray-700">Value</th>
                  <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-mono">{item.sku}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm">{item.batchCode}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.currentStock}</span>
                        <span className="text-sm text-gray-500">/ {item.maxStockLevel}</span>
                        {getStockStatusIcon(item)}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={`${getStatusColor(item.status)} text-xs px-1.5 py-0.5`}>
                        {item.status.replace('-', ' ').charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-sm">{item.location}</span>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">R{(item.currentStock * item.unitPrice).toLocaleString()}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStock(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleReorder(item)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredInventory.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  {/* Product Info */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base break-words">{item.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500">{item.category}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{item.sku}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.batchCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm sm:text-base leading-none self-center">{item.currentStock}</span>
                      <span className="text-xs text-gray-500 leading-none self-center">/ {item.maxStockLevel}</span>
                      {getStockStatusIcon(item)}
                    </div>
                    <div className="flex items-center">
                      <Badge className={`${getStatusColor(item.status)} text-xs px-1.5 py-0.5`}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Location:</span>
                      <span className="text-xs truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Value:</span>
                      <span className="font-medium text-xs">R{(item.currentStock * item.unitPrice).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStock(item)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(item)}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
