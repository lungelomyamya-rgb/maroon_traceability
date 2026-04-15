// src/components/retailers/dashboard/hooks/useRetailerDashboard.ts
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
  sales: number;
  revenue: number;
}

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  topProducts: Array<{ productId: string; name: string; sales: number; revenue: number; views: number }>;
  customerMetrics: {
    totalCustomers: number;
    repeatCustomers: number;
    newCustomers: number;
    averageRating: number;
  };
  salesByCategory: Array<{ category: string; revenue: number; percentage: number }>;
  recentPerformance: Array<{ date: string; revenue: number; orders: number }>;
}

export function useRetailerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading - replace with API calls
    const loadMockData = async () => {
      // Mock products
      const mockProducts: Product[] = [
        {
          id: 'prod-001',
          name: 'Organic Apples',
          category: 'Fruits',
          price: 4.99,
          wholesalePrice: 3.50,
          stockLevel: 150,
          minStockLevel: 50,
          status: 'active',
          batchCode: 'BATCH-2024-001',
          qualityGrade: 'A',
          images: ['/images/apples.jpg'],
          description: 'Fresh organic apples from local farms',
          tags: ['organic', 'fresh', 'local'],
          createdAt: '2024-01-15',
          soldCount: 245,
          viewCount: 1203,
          rating: 4.5,
          reviews: 89,
          sales: 245,
          revenue: 1222,
        },
        {
          id: 'prod-002',
          name: 'Free-Range Eggs',
          category: 'Dairy & Eggs',
          price: 6.99,
          wholesalePrice: 5.00,
          stockLevel: 25,
          minStockLevel: 30,
          status: 'active',
          batchCode: 'BATCH-2024-002',
          qualityGrade: 'A',
          images: ['/images/eggs.jpg'],
          description: 'Fresh free-range eggs from happy chickens',
          tags: ['free-range', 'organic', 'fresh'],
          createdAt: '2024-01-20',
          soldCount: 189,
          viewCount: 892,
          rating: 4.7,
          reviews: 67,
          sales: 189,
          revenue: 1320,
        },
        // Add more mock products as needed
      ];

      // Mock orders
      const mockOrders: Order[] = [
        {
          id: 'order-001',
          customerName: 'John Smith',
          total: 45.99,
          status: 'delivered',
          date: '2024-03-15',
          items: 8,
        },
        {
          id: 'order-002',
          customerName: 'Sarah Johnson',
          total: 32.50,
          status: 'processing',
          date: '2024-03-16',
          items: 5,
        },
        // Add more mock orders as needed
      ];

      // Mock analytics
      const mockAnalytics: AnalyticsData = {
        totalRevenue: 125430,
        totalOrders: 1847,
        averageOrderValue: 67.89,
        conversionRate: 0.034,
        totalProducts: 156,
        activeProducts: 142,
        lowStockProducts: 8,
        pendingOrders: 23,
        monthlyRevenue: [
          { month: 'Jan', revenue: 18500, orders: 267 },
          { month: 'Feb', revenue: 22300, orders: 324 },
          { month: 'Mar', revenue: 25600, orders: 389 },
          { month: 'Apr', revenue: 28900, orders: 423 },
          { month: 'May', revenue: 31200, orders: 456 },
          { month: 'Jun', revenue: 29800, orders: 434 },
        ],
        topProducts: [
          { productId: 'prod-001', name: 'Organic Apples', sales: 245, revenue: 1222, views: 1203 },
          { productId: 'prod-002', name: 'Free-Range Eggs', sales: 189, revenue: 1320, views: 892 },
        ],
        customerMetrics: {
          totalCustomers: 892,
          repeatCustomers: 234,
          newCustomers: 145,
          averageRating: 4.6,
        },
        salesByCategory: [
          { category: 'Fruits', revenue: 45600, percentage: 36.4 },
          { category: 'Vegetables', revenue: 32400, percentage: 25.8 },
          { category: 'Dairy & Eggs', revenue: 28900, percentage: 23.0 },
          { category: 'Meat', revenue: 18530, percentage: 14.8 },
        ],
        recentPerformance: [
          { date: '2024-03-10', revenue: 2340, orders: 34 },
          { date: '2024-03-11', revenue: 2890, orders: 42 },
          { date: '2024-03-12', revenue: 3120, orders: 45 },
          { date: '2024-03-13', revenue: 2670, orders: 38 },
          { date: '2024-03-14', revenue: 3450, orders: 51 },
        ],
      };

      setProducts(mockProducts);
      setOrders(mockOrders);
      setAnalytics(mockAnalytics);
      setIsLoading(false);
    };

    loadMockData();
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    // Re-fetch data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return {
    products,
    orders,
    analytics,
    isLoading,
    refreshData,
  };
}

export type { Product, Order };
