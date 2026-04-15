// src/components/retailers/productManagement/ProductDetails.tsx
'use client';

import { X, Package, DollarSign, TrendingUp, Star, Edit, Calendar, Ruler } from 'lucide-react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';


import { Product } from './hooks/useProductManagement';

interface ProductDetailsProps {
  product: Product;
  statusConfig: Record<string, { color: string; icon: string; label: string }>;
  onClose: () => void;
  onEdit?: (product: Product) => void;
  formatPrice: (price: number) => string;
}

export function ProductDetails({ 
  product, 
  statusConfig, 
  onClose, 
  onEdit,
  formatPrice,
}: ProductDetailsProps) {
  const status = statusConfig[product.status];

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'vegetables': 'Vegetables',
      'fruits': 'Fruits',
      'grains': 'Grains',
      'dairy': 'Dairy',
      'meat': 'Meat',
      'herbs': 'Herbs',
      'processed': 'Processed Foods',
    };
    return categoryMap[category] || category;
  };

  const getQualityGradeLabel = (grade: string) => {
    const gradeMap: Record<string, string> = {
      'A': 'Grade A - Premium',
      'B': 'Grade B - Standard',
      'C': 'Grade C - Economy',
    };
    return gradeMap[grade] || grade;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)} ({product.reviews} reviews)</span>
      </div>
    );
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) {
      return { level: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    }
    if (stock <= minStock) {
      return { level: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    }
    return { level: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const stockStatus = getStockStatus(product.stockLevel, product.minStockLevel);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${status.color} text-sm`}>
                    <span className="mr-1">{status.icon}</span>
                    {status.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {getCategoryLabel(product.category)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Product Information</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Product ID</span>
                  <span className="text-sm font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Batch Code</span>
                  <span className="text-sm font-medium">{product.batchCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium">{getCategoryLabel(product.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quality Grade</span>
                  <span className="text-sm font-medium">{getQualityGradeLabel(product.qualityGrade)}</span>
                </div>
                {product.supplier && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Supplier</span>
                    <span className="text-sm font-medium">{product.supplier}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing and Stock */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Pricing & Stock</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Retail Price
                  </span>
                  <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Wholesale Price</span>
                  <span className="text-sm font-medium">{formatPrice(product.wholesalePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Stock</span>
                  <span className="text-sm font-medium">{product.stockLevel} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Min Stock Level</span>
                  <span className="text-sm font-medium">{product.minStockLevel} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stock Status</span>
                  <Badge className={`${stockStatus.color} text-xs`}>
                    {stockStatus.level}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Performance</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Units Sold</span>
                    <p className="text-sm font-medium">{product.soldCount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Page Views</span>
                  <span className="text-sm font-medium">{product.viewCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-medium">
                    {((product.soldCount / product.viewCount) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="pt-2">
                  {renderStars(product.rating)}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">{product.description}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          {product.dimensions && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Dimensions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Length</p>
                  <p className="text-sm font-medium">{product.dimensions.length} cm</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Width</p>
                  <p className="text-sm font-medium">{product.dimensions.width} cm</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Height</p>
                  <p className="text-sm font-medium">{product.dimensions.height} cm</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Weight</p>
                  <p className="text-sm font-medium">{product.dimensions.weight} kg</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-600">Created</span>
                  <p className="text-sm font-medium">{formatDate(product.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <p className="text-sm font-medium">{formatDate(product.lastUpdated)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div className="text-sm text-gray-500">
              Product ID: {product.id}
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                View Analytics
              </Button>
              <Button variant="outline">
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
