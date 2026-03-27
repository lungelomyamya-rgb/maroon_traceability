// src/components/retailers/productManagement/hooks/useProductManagement.ts
'use client';

import { useState, useEffect } from 'react';

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
  lastUpdated: string;
  supplier?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
}

interface NewProduct {
  name: string;
  category: string;
  price: number;
  wholesalePrice: number;
  stockLevel: number;
  minStockLevel: number;
  batchCode: string;
  qualityGrade: 'A' | 'B' | 'C';
  description: string;
  tags: string[];
  supplier?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
}

export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'processed', label: 'Processed Foods' }
  ];

  const qualityGrades = [
    { value: 'A', label: 'Grade A - Premium', description: 'Highest quality, premium pricing' },
    { value: 'B', label: 'Grade B - Standard', description: 'Good quality, standard pricing' },
    { value: 'C', label: 'Grade C - Economy', description: 'Basic quality, economy pricing' }
  ];

  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Active' },
    inactive: { color: 'bg-gray-100 text-gray-800', icon: '⏸️', label: 'Inactive' },
    draft: { color: 'bg-yellow-100 text-yellow-800', icon: '📝', label: 'Draft' },
    'out-of-stock': { color: 'bg-red-100 text-red-800', icon: '🚫', label: 'Out of Stock' }
  };

  useEffect(() => {
    const loadMockProducts = async () => {
      const mockProducts: Product[] = [
        {
          id: 'prod-001',
          name: 'Organic Tomatoes',
          category: 'vegetables',
          price: 45.99,
          wholesalePrice: 35.99,
          stockLevel: 150,
          minStockLevel: 50,
          status: 'active',
          batchCode: 'BATCH-2024-001',
          qualityGrade: 'A',
          images: ['/images/tomatoes1.jpg', '/images/tomatoes2.jpg'],
          description: 'Fresh organic tomatoes grown without pesticides',
          tags: ['organic', 'fresh', 'local'],
          createdAt: '2024-03-15T09:30:00Z',
          soldCount: 245,
          viewCount: 1820,
          rating: 4.8,
          reviews: 42,
          lastUpdated: '2024-03-20T14:30:00Z',
          supplier: 'Green Farms Co.',
          dimensions: {
            length: 10,
            width: 8,
            height: 6,
            weight: 2.5
          }
        },
        {
          id: 'prod-002',
          name: 'Fresh Spinach',
          category: 'vegetables',
          price: 28.50,
          wholesalePrice: 22.00,
          stockLevel: 0,
          minStockLevel: 30,
          status: 'out-of-stock',
          batchCode: 'BATCH-2024-002',
          qualityGrade: 'A',
          images: ['/images/spinach1.jpg'],
          description: 'Premium quality spinach, rich in nutrients',
          tags: ['leafy-green', 'healthy', 'iron-rich'],
          createdAt: '2024-03-18T11:15:00Z',
          soldCount: 189,
          viewCount: 945,
          rating: 4.6,
          reviews: 28,
          lastUpdated: '2024-03-22T09:00:00Z',
          supplier: 'Valley Greens'
        },
        {
          id: 'prod-003',
          name: 'Free-Range Eggs',
          category: 'dairy',
          price: 65.00,
          wholesalePrice: 48.00,
          stockLevel: 85,
          minStockLevel: 40,
          status: 'active',
          batchCode: 'BATCH-2024-003',
          qualityGrade: 'A',
          images: ['/images/eggs1.jpg', '/images/eggs2.jpg'],
          description: 'Farm-fresh free-range eggs from happy chickens',
          tags: ['protein', 'breakfast', 'organic'],
          createdAt: '2024-03-12T08:45:00Z',
          soldCount: 412,
          viewCount: 2340,
          rating: 4.9,
          reviews: 67,
          lastUpdated: '2024-03-21T16:20:00Z',
          supplier: 'Happy Hens Farm'
        }
      ];

      setProducts(mockProducts);
      setIsLoading(false);
    };

    loadMockProducts();
  }, []);

  const createProduct = (productData: NewProduct) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      status: 'draft',
      images: ['/images/placeholder.jpg'],
      createdAt: new Date().toISOString(),
      soldCount: 0,
      viewCount: 0,
      rating: 0,
      reviews: 0,
      lastUpdated: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(product => 
      product.id === updatedProduct.id 
        ? { ...updatedProduct, lastUpdated: new Date().toISOString() }
        : product
    ));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductsByStatus = (status: Product['status']) => {
    return products.filter(product => product.status === status);
  };

  const updateProductStatus = (productId: string, status: Product['status']) => {
    updateProduct({
      ...getProductById(productId)!,
      status
    });
  };

  const getLowStockProducts = () => {
    return products.filter(product => 
      product.stockLevel <= product.minStockLevel && product.status === 'active'
    );
  };

  const getTopSellingProducts = (limit: number = 5) => {
    return products
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, limit);
  };

  const getHighRatedProducts = (limit: number = 5) => {
    return products
      .filter(product => product.reviews >= 5) // At least 5 reviews
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  };

  const getProductStats = () => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const inactive = products.filter(p => p.status === 'inactive').length;
    const draft = products.filter(p => p.status === 'draft').length;
    const outOfStock = products.filter(p => p.status === 'out-of-stock').length;
    const lowStock = getLowStockProducts().length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockLevel), 0);
    const totalSold = products.reduce((sum, p) => sum + p.soldCount, 0);
    const averageRating = products.length > 0 
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length 
      : 0;

    return {
      total,
      active,
      inactive,
      draft,
      outOfStock,
      lowStock,
      totalValue,
      totalSold,
      averageRating: averageRating || 0
    };
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      product.batchCode.toLowerCase().includes(lowercaseQuery)
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  const formatStockLevel = (stock: number, minStock: number) => {
    if (stock === 0) return { level: 'Out of Stock', color: 'text-red-600' };
    if (stock <= minStock) return { level: 'Low Stock', color: 'text-yellow-600' };
    return { level: 'In Stock', color: 'text-green-600' };
  };

  return {
    products,
    isLoading,
    categories,
    qualityGrades,
    statusConfig,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    getProductsByStatus,
    updateProductStatus,
    getLowStockProducts,
    getTopSellingProducts,
    getHighRatedProducts,
    getProductStats,
    searchProducts,
    formatPrice,
    formatStockLevel
  };
}

export type { Product, NewProduct };
