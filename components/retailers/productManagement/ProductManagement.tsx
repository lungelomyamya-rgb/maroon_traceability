// src/components/retailers/productManagement/ProductManagement.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Star,
  AlertTriangle
} from 'lucide-react';
import { useProductManagement, type Product } from './hooks/useProductManagement';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { ProductDetails } from './ProductDetails';

interface ProductManagementProps {
  onProductSelect?: (product: Product) => void;
}

export function ProductManagement({ onProductSelect }: ProductManagementProps) {
  const {
    products,
    isLoading,
    categories,
    qualityGrades,
    statusConfig,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    updateProductStatus,
    getLowStockProducts,
    getTopSellingProducts,
    getHighRatedProducts,
    getProductStats,
    formatPrice,
    formatStockLevel
  } = useProductManagement();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const lowStockProducts = getLowStockProducts();
  const topSellingProducts = getTopSellingProducts(3);
  const highRatedProducts = getHighRatedProducts(3);
  const stats = getProductStats();

  const handleAddProduct = (productData: any) => {
    const newProduct = createProduct(productData);
    setShowAddForm(false);
    onProductSelect?.(newProduct);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    onProductSelect?.(product);
  };

  const handleUpdateProduct = (productData: any) => {
    if (editingProduct) {
      const updatedProduct = { ...editingProduct, ...productData };
      updateProduct(updatedProduct);
      setEditingProduct(null);
      onProductSelect?.(updatedProduct);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct(productId);
    }
  };

  const handleStatusUpdate = (productId: string, status: Product['status']) => {
    updateProductStatus(productId, status);
    const updatedProduct = getProductById(productId);
    if (updatedProduct) {
      onProductSelect?.(updatedProduct);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✅</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-blue-600">{formatPrice(stats.totalValue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {lowStockProducts.length > 0 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Low Stock Alert</h4>
              <p className="text-sm text-yellow-700">
                {lowStockProducts.length} product(s) need restocking
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Selling Products
          </h3>
          <div className="space-y-3">
            {topSellingProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.soldCount} sold</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {formatPrice(product.price)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* High Rated Products */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Highest Rated Products
          </h3>
          <div className="space-y-3">
            {highRatedProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {product.rating.toFixed(1)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Product List */}
      <ProductList
        products={products}
        categories={categories}
        statusConfig={statusConfig}
        onAddProduct={() => setShowAddForm(true)}
        onEditProduct={handleEditProduct}
        onViewProduct={handleViewProduct}
        onDeleteProduct={handleDeleteProduct}
        onStatusUpdate={handleStatusUpdate}
        lowStockProducts={lowStockProducts}
        formatPrice={formatPrice}
        formatStockLevel={formatStockLevel}
      />

      {/* Add Product Form */}
      {showAddForm && (
        <ProductForm
          categories={categories}
          qualityGrades={qualityGrades}
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          qualityGrades={qualityGrades}
          onSubmit={handleUpdateProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          statusConfig={statusConfig}
          onClose={() => setSelectedProduct(null)}
          onEdit={handleEditProduct}
          formatPrice={formatPrice}
        />
      )}
    </div>
  );
}
