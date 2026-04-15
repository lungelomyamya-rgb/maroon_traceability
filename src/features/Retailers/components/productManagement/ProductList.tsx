// src/components/retailers/productManagement/ProductList.tsx
'use client';

import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Package,
  TrendingDown,
  Star,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/features/shared/ui/select';

import { Product } from './hooks/useProductManagement';

interface ProductListProps {
  products: Product[];
  categories: { value: string; label: string }[];
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onStatusUpdate: (productId: string, status: Product['status']) => void;
  lowStockProducts: Product[];
  formatPrice: (price: number) => string;
  formatStockLevel: (stock: number, minStock: number) => { level: string; color: string };
}

export function ProductList({ 
  products, 
  categories, 
  statusConfig,
  onAddProduct, 
  onEditProduct, 
  onViewProduct, 
  onDeleteProduct,
  onStatusUpdate,
  lowStockProducts,
  formatPrice,
  formatStockLevel,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const getQualityGradeLabel = (grade: string) => {
    const gradeMap: Record<string, string> = {
      'A': 'Grade A - Premium',
      'B': 'Grade B - Standard', 
      'C': 'Grade C - Economy',
    };
    return gradeMap[grade] || grade;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Product Inventory</h3>
        <Button onClick={onAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Low Stock Alert</h4>
              <p className="text-sm text-yellow-700">
                {lowStockProducts.length} product(s) need restocking
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new product</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const status = statusConfig[product.status];
            const stockInfo = formatStockLevel(product.stockLevel, product.minStockLevel);
            const isLowStock = lowStockProducts.some(p => p.id === product.id);
            
            return (
              <Card key={product.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${status.color} text-xs`}>
                          <span className="mr-1">{status.icon}</span>
                          {status.label}
                        </Badge>
                        {isLowStock && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProduct(product)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{getCategoryLabel(product.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price</span>
                    <span className="font-medium">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock</span>
                    <span className={`font-medium ${stockInfo.color}`}>
                      {product.stockLevel} ({stockInfo.level})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality</span>
                    <span className="font-medium">{getQualityGradeLabel(product.qualityGrade)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sold</span>
                    <span className="font-medium">{product.soldCount}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-3 pt-3 border-t">
                  {renderStars(product.rating)}
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Select value={product.status} onValueChange={(value) => onStatusUpdate(product.id, value as Product['status'])}>
                    <SelectTrigger className="text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
