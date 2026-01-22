// src/app/packaging/inventory.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { DashboardLayout } from '@/components/dashboard/dashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react';

interface InventoryItem {
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

interface StockMovement {
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

export default function PackagingInventoryPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);

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
        expiryDate: '2025-12-31',
        supplier: 'Green Valley Farm',
        qualityGrade: 'A',
        storageRequirements: ['Cool, dry place', 'Away from sunlight'],
        qrCode: 'QR-INV-001',
        certifications: ['Organic', 'GMP', 'HACCP']
      },
      {
        id: 'inv2',
        productId: 'PRD-2024-002',
        productName: 'Moringa Tea Bags',
        batchNumber: 'BATCH-2024-002',
        category: 'Teas',
        currentStock: 85,
        minStockLevel: 100,
        maxStockLevel: 500,
        unit: 'boxes',
        unitCost: 12.75,
        totalValue: 1083.75,
        location: 'Warehouse A - Shelf 2',
        status: 'low-stock',
        lastUpdated: '2025-01-20T09:30:00Z',
        expiryDate: '2025-09-30',
        supplier: 'Sunny Acres Farm',
        qualityGrade: 'A',
        storageRequirements: ['Dry storage', 'Room temperature'],
        qrCode: 'QR-INV-002',
        certifications: ['Organic', 'Fair Trade']
      },
      {
        id: 'inv3',
        productId: 'PRD-2024-003',
        productName: 'Moringa Capsules',
        batchNumber: 'BATCH-2024-003',
        category: 'Supplements',
        currentStock: 0,
        minStockLevel: 50,
        maxStockLevel: 300,
        unit: 'bottles',
        unitCost: 18.90,
        totalValue: 0,
        location: 'Warehouse B - Shelf 3',
        status: 'out-of-stock',
        lastUpdated: '2025-01-19T16:45:00Z',
        supplier: 'Coastal Farm',
        qualityGrade: 'B',
        storageRequirements: ['Cool storage', 'Low humidity'],
        qrCode: 'QR-INV-003',
        certifications: ['GMP']
      },
      {
        id: 'inv4',
        productId: 'PRD-2024-004',
        productName: 'Moringa Oil',
        batchNumber: 'BATCH-2024-004',
        category: 'Oils',
        currentStock: 120,
        minStockLevel: 50,
        maxStockLevel: 200,
        unit: 'liters',
        unitCost: 45.00,
        totalValue: 5400,
        location: 'Warehouse B - Shelf 1',
        status: 'in-stock',
        lastUpdated: '2025-01-20T11:15:00Z',
        expiryDate: '2026-06-30',
        supplier: 'Green Valley Farm',
        qualityGrade: 'A',
        storageRequirements: ['Dark glass bottles', 'Cool storage'],
        qrCode: 'QR-INV-004',
        certifications: ['Organic', 'Cold-pressed']
      }
    ];

    const mockStockMovements: StockMovement[] = [
      {
        id: 'move1',
        inventoryId: 'inv1',
        type: 'in',
        quantity: 100,
        reason: 'New batch received',
        timestamp: '2025-01-20T10:00:00Z',
        userId: currentUser?.id || '',
        userName: currentUser?.name || 'System',
        reference: 'PO-2025-001'
      },
      {
        id: 'move2',
        inventoryId: 'inv2',
        type: 'out',
        quantity: 15,
        reason: 'Order fulfillment',
        timestamp: '2025-01-20T09:30:00Z',
        userId: currentUser?.id || '',
        userName: currentUser?.name || 'System',
        reference: 'ORD-2025-045'
      },
      {
        id: 'move3',
        inventoryId: 'inv3',
        type: 'out',
        quantity: 50,
        reason: 'Stock depletion',
        timestamp: '2025-01-19T16:45:00Z',
        userId: currentUser?.id || '',
        userName: currentUser?.name || 'System'
      }
    ];

    setInventory(mockInventory);
    setStockMovements(mockStockMovements);
    setFilteredInventory(mockInventory);
  }, [currentUser, router]);

  useEffect(() => {
    let filtered = inventory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productId.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-100 text-emerald-800';
      case 'B': return 'bg-amber-100 text-amber-800';
      case 'C': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateStockLevel = async (itemId: string, newQuantity: number, reason: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const movementType = newQuantity > item.currentStock ? 'in' : 'out';
    const quantity = Math.abs(newQuantity - item.currentStock);

    // Update inventory
    setInventory(prev => prev.map(inv => {
      if (inv.id === itemId) {
        const updatedItem = {
          ...inv,
          currentStock: newQuantity,
          totalValue: newQuantity * inv.unitCost,
          status: newQuantity === 0 ? 'out-of-stock' as const : 
                newQuantity <= inv.minStockLevel ? 'low-stock' as const : 'in-stock' as const,
          lastUpdated: new Date().toISOString()
        };
        return updatedItem;
      }
      return inv;
    }));

    // Add stock movement record
    const newMovement: StockMovement = {
      id: `move${Date.now()}`,
      inventoryId: itemId,
      type: movementType,
      quantity,
      reason,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || '',
      userName: currentUser?.name || 'System'
    };

    setStockMovements(prev => [newMovement, ...prev]);
    setLoading(false);
  };

  const generateReport = () => {
    const reportData = filteredInventory.map(item => ({
      'Product ID': item.productId,
      'Product Name': item.productName,
      'Batch Number': item.batchNumber,
      'Category': item.category,
      'Current Stock': item.currentStock,
      'Unit': item.unit,
      'Unit Cost': item.unitCost,
      'Total Value': item.totalValue,
      'Status': item.status,
      'Quality Grade': item.qualityGrade,
      'Location': item.location,
      'Last Updated': new Date(item.lastUpdated).toLocaleDateString()
    }));

    // Convert to CSV
    const csv = [
      Object.keys(reportData[0]).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!currentUser || currentUser.role !== 'packaging') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const totalItems = inventory.length;
  const inStockItems = inventory.filter(item => item.status === 'in-stock').length;
  const lowStockItems = inventory.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = inventory.filter(item => item.status === 'out-of-stock').length;
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <DashboardLayout
      title="Inventory Management"
      description="Track and manage packaging inventory levels"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="p-1.5 sm:p-2 lg:p-3 bg-blue-100 rounded-lg">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{inStockItems}</p>
              </div>
              <div className="p-1.5 sm:p-2 lg:p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{lowStockItems}</p>
              </div>
              <div className="p-1.5 sm:p-2 lg:p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{outOfStockItems}</p>
              </div>
              <div className="p-1.5 sm:p-2 lg:p-3 bg-red-100 rounded-lg">
                <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">R{totalValue.toFixed(2)}</p>
              </div>
              <div className="p-1.5 sm:p-2 lg:p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by product name, batch, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Powders">Powders</SelectItem>
                <SelectItem value="Teas">Teas</SelectItem>
                <SelectItem value="Supplements">Supplements</SelectItem>
                <SelectItem value="Oils">Oils</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </Card>

        {/* Inventory Table */}
        <Card className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Product</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Batch</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Category</th>
                  <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Stock Level</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Quality</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Value</th>
                  <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div>
                        <p className="font-medium text-sm sm:text-base">{item.productName}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{item.productId}</p>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div>
                        <p className="text-xs sm:text-sm">{item.batchNumber}</p>
                        <p className="text-xs text-gray-500">{item.qrCode}</p>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                      <div className="text-center">
                        <p className="font-medium text-sm sm:text-base">{item.currentStock} {item.unit}</p>
                        <p className="text-xs text-gray-500">
                          Min: {item.minStockLevel} | Max: {item.maxStockLevel}
                        </p>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <Badge className={getQualityGradeColor(item.qualityGrade)}>
                        Grade {item.qualityGrade}
                      </Badge>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <p className="font-medium text-sm sm:text-base">R{item.totalValue.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">R{item.unitCost}/{item.unit}</p>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          className="h-7 sm:h-8 w-7 sm:w-8 text-xs"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newQuantity = prompt(`Enter new stock quantity for ${item.productName}:`, item.currentStock.toString());
                            if (newQuantity && !isNaN(Number(newQuantity))) {
                              const reason = prompt('Reason for stock adjustment:');
                              if (reason) {
                                updateStockLevel(item.id, Number(newQuantity), reason);
                              }
                            }
                          }}
                          className="h-7 sm:h-8 w-7 sm:w-8 text-xs"
                        >
                          <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                          <Package className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Stock Movements */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Stock Movements</h3>
          <div className="space-y-3">
            {stockMovements.slice(0, 5).map((movement) => {
              const item = inventory.find(i => i.id === movement.inventoryId);
              return (
                <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {movement.type === 'in' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item?.productName}</p>
                      <p className="text-sm text-gray-600">{movement.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.type === 'in' ? '+' : '-'}{movement.quantity} {item?.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(movement.timestamp).toLocaleString()} by {movement.userName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Item Details Modal */}
        {selectedItem && (
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Inventory Details - {selectedItem.productName}</h3>
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Product Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Product ID:</strong> {selectedItem.productId}</p>
                  <p><strong>Batch Number:</strong> {selectedItem.batchNumber}</p>
                  <p><strong>Category:</strong> {selectedItem.category}</p>
                  <p><strong>QR Code:</strong> {selectedItem.qrCode}</p>
                  <p><strong>Supplier:</strong> {selectedItem.supplier}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Stock Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Current Stock:</strong> {selectedItem.currentStock} {selectedItem.unit}</p>
                  <p><strong>Min Stock Level:</strong> {selectedItem.minStockLevel} {selectedItem.unit}</p>
                  <p><strong>Max Stock Level:</strong> {selectedItem.maxStockLevel} {selectedItem.unit}</p>
                  <p><strong>Unit Cost:</strong> R{selectedItem.unitCost}</p>
                  <p><strong>Total Value:</strong> R{selectedItem.totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-3">Quality & Storage</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 text-sm">
                  <p><strong>Quality Grade:</strong> <Badge className={getQualityGradeColor(selectedItem.qualityGrade)}>Grade {selectedItem.qualityGrade}</Badge></p>
                  <p><strong>Status:</strong> <Badge className={getStatusColor(selectedItem.status)}>{selectedItem.status.replace('-', ' ')}</Badge></p>
                  <p><strong>Location:</strong> {selectedItem.location}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Storage Requirements:</strong></p>
                  <ul className="list-disc list-inside">
                    {selectedItem.storageRequirements.map((req, index) => (
                      <li key={`storage-${index}-${req}`}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {selectedItem.certifications.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.certifications.map((cert, index) => (
                    <Badge key={`cert-${index}-${cert}`} variant="outline">{cert}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <Button onClick={() => {
                const newQuantity = prompt(`Enter new stock quantity for ${selectedItem.productName}:`, selectedItem.currentStock.toString());
                if (newQuantity && !isNaN(Number(newQuantity))) {
                  const reason = prompt('Reason for stock adjustment:');
                  if (reason) {
                    updateStockLevel(selectedItem.id, Number(newQuantity), reason);
                    setSelectedItem(null);
                  }
                }
              }}>
                Update Stock
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
