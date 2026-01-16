// src/app/retailer/product-management/productManagementComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Package,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Calendar,
  MoreHorizontal,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  wholesalePrice: number;
  stockLevel: number;
  minStockLevel: number;
  status: 'active' | 'inactive' | 'draft' | 'out-of-stock';
  batchCode: string;
  qualityGrade: 'A' | 'B' | 'C';
  images: string[];
  description: string;
  tags: string[];
  createdAt: string;
  soldCount: number;
  viewCount: number;
  rating: number;
  reviews: number;
}

interface Batch {
  id: string;
  batchCode: string;
  farmerName: string;
  harvestDate: string;
  qualityGrade: 'A' | 'B' | 'C';
  available: boolean;
  quantity: number;
  unitPrice: number;
  location: string;
  certifications: string[];
}

export default function ProductManagementComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Mock data for products
    const mockProducts: Product[] = [
      {
        id: 'prod1',
        name: 'Premium Organic Moringa Powder - 250g',
        category: 'Powders',
        price: 89.99,
        wholesalePrice: 45.00,
        stockLevel: 85,
        minStockLevel: 20,
        status: 'active',
        batchCode: 'BATCH-001',
        qualityGrade: 'A',
        images: ['/images/moringa-powder.jpg'],
        description: '100% organic moringa powder',
        tags: ['organic', 'premium', 'superfood'],
        createdAt: '2025-01-01',
        soldCount: 342,
        viewCount: 1250,
        rating: 4.8,
        reviews: 127
      },
      {
        id: 'prod2',
        name: 'Moringa Tea Bags - 20 Count',
        category: 'Teas',
        price: 45.00,
        wholesalePrice: 22.00,
        stockLevel: 15,
        minStockLevel: 20,
        status: 'active',
        batchCode: 'BATCH-002',
        qualityGrade: 'A',
        images: ['/images/moringa-tea.jpg'],
        description: 'Premium quality moringa tea bags',
        tags: ['organic', 'tea', 'caffeine-free'],
        createdAt: '2025-01-05',
        soldCount: 189,
        viewCount: 890,
        rating: 4.6,
        reviews: 89
      },
      {
        id: 'prod3',
        name: 'Moringa Capsules - 60 Count',
        category: 'Supplements',
        price: 65.00,
        wholesalePrice: 32.00,
        stockLevel: 0,
        minStockLevel: 15,
        status: 'out-of-stock',
        batchCode: 'BATCH-003',
        qualityGrade: 'B',
        images: ['/images/moringa-capsules.jpg'],
        description: 'Premium moringa leaf capsules',
        tags: ['supplement', 'health', 'organic'],
        createdAt: '2025-01-08',
        soldCount: 234,
        viewCount: 1560,
        rating: 4.5,
        reviews: 67
      }
    ];

    // Mock data for batches
    const mockBatches: Batch[] = [
      {
        id: 'batch1',
        batchCode: 'BATCH-001',
        farmerName: 'Green Valley Farm',
        harvestDate: '2024-12-15',
        qualityGrade: 'A',
        available: true,
        quantity: 500,
        unitPrice: 25.00,
        location: 'Warehouse A',
        certifications: ['Organic', 'Fair Trade', 'Non-GMO']
      },
      {
        id: 'batch2',
        batchCode: 'BATCH-002',
        farmerName: 'Sunny Acres Farm',
        harvestDate: '2024-12-20',
        qualityGrade: 'A',
        available: true,
        quantity: 300,
        unitPrice: 12.00,
        location: 'Warehouse B',
        certifications: ['Organic', 'Sustainable']
      },
      {
        id: 'batch3',
        batchCode: 'BATCH-003',
        farmerName: 'Highland Farms',
        harvestDate: '2024-12-25',
        qualityGrade: 'B',
        available: false,
        quantity: 0,
        unitPrice: 18.00,
        location: 'Warehouse C',
        certifications: ['Organic']
      }
    ];

    setProducts(mockProducts);
    setBatches(mockBatches);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleToggleStatus = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
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
            Export Products
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddProduct} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.stockLevel === 0).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.reduce((sum, p) => sum + p.soldCount, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="w-full">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Category" />
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
              <div className="w-full">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Table */}
        <Card className="p-3 sm:p-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm">Product</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Category</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm">Price</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm">Stock</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Status</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Quality</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Sales</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Rating</th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 hidden sm:block">{product.batchCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell">
                      <span className="text-xs sm:text-sm">{product.category}</span>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div>
                        <p className="font-medium text-xs sm:text-sm">R{product.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 hidden sm:block">R{product.wholesalePrice.toFixed(2)} wholesale</p>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="font-medium text-xs sm:text-sm">{product.stockLevel}</span>
                        {product.stockLevel <= product.minStockLevel && (
                          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell">
                      <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell">
                      <Badge className={`text-xs ${getQualityGradeColor(product.qualityGrade)}`}>
                        Grade {product.qualityGrade}
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3 hidden lg:table-cell">
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{product.soldCount}</p>
                        <p className="text-xs text-gray-500">{product.viewCount} views</p>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-xs sm:text-sm">{product.rating}</span>
                        <span className="text-xs text-gray-500 hidden sm:block">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0" onClick={() => setSelectedProduct(product)}>
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 hidden sm:flex" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 hidden sm:flex" onClick={() => handleToggleStatus(product.id)}>
                          {product.status === 'active' ? <XCircle className="h-3 w-3 sm:h-4 sm:w-4" /> : <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 hidden sm:flex" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
