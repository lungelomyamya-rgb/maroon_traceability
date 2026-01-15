// src/app/retailer/dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/userContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Download,
  BarChart3,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Bell,
  Settings
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  wholesalePrice: number;
  stockLevel: number;
  minStockLevel: number;
  status: 'active' | 'inactive' | 'out-of-stock';
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

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  trackingNumber?: string;
  courier?: string;
}

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  topProducts: Array<{ productId: string; name: string; sales: number; revenue: number }>;
  customerMetrics: {
    totalCustomers: number;
    repeatCustomers: number;
    averageRating: number;
  };
}

// Enhanced Dashboard Components
function MetricsCards({ analytics }: { analytics: Analytics }) {
  const metrics = [
    {
      title: "Total Revenue",
      value: `R${analytics.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders.toLocaleString(),
      change: "+8.3%",
      trend: "up",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Avg Order Value",
      value: `R${analytics.averageOrderValue.toFixed(2)}`,
      change: "+5.2%",
      trend: "up",
      icon: <Target className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Conversion Rate",
      value: `${(analytics.conversionRate * 100).toFixed(1)}%`,
      change: "-2.1%",
      trend: "down",
      icon: <Zap className="h-6 w-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`${metric.bgColor} p-3 rounded-lg ${metric.color}`}>
              {metric.icon}
            </div>
            <div className={`flex items-center text-sm ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {metric.change}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
          <p className="text-sm text-gray-600">{metric.title}</p>
        </Card>
      ))}
    </div>
  );
}

function RecentOrders({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {orders.slice(0, 5).map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-medium">{order.customerName}</h4>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {order.items.length} items • R{order.total.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm">
                Process
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TopProducts({ products }: { products: Product[] }) {
  const topProducts = products
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Top Products</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{product.soldCount} sold</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">R{product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600">{product.stockLevel} in stock</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function InventoryAlerts({ products }: { products: Product[] }) {
  const lowStockProducts = products.filter(p => p.stockLevel <= p.minStockLevel);
  const outOfStockProducts = products.filter(p => p.stockLevel === 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Inventory Alerts</h3>
        <Button variant="outline" size="sm">
          Manage Inventory
        </Button>
      </div>
      
      <div className="space-y-4">
        {outOfStockProducts.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h4 className="font-medium text-red-800">Out of Stock</h4>
            </div>
            <div className="space-y-2">
              {outOfStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <span>{product.name}</span>
                  <Badge className="bg-red-100 text-red-800">0 in stock</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {lowStockProducts.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-800">Low Stock</h4>
            </div>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <span>{product.name}</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {product.stockLevel} left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2" />
            <p>All products are well stocked</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function QuickActions() {
  const router = useRouter();
  
  const actions = [
    {
      title: "Add Product",
      description: "List a new product on marketplace",
      icon: <Plus className="h-6 w-6" />,
      color: "bg-green-600 hover:bg-green-700",
      href: "/retailer/products/add"
    },
    {
      title: "Manage Orders",
      description: "Process and track customer orders",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-blue-600 hover:bg-blue-700",
      href: "/retailer/orders"
    },
    {
      title: "View Analytics",
      description: "Track sales and performance metrics",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-purple-600 hover:bg-purple-700",
      href: "/retailer/analytics"
    },
    {
      title: "Inventory",
      description: "Manage stock levels and batches",
      icon: <Package className="h-6 w-6" />,
      color: "bg-orange-600 hover:bg-orange-700",
      href: "/retailer/inventory"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((action, index) => (
        <Button
          key={index}
          className={`h-auto p-6 flex-col items-start text-left ${action.color}`}
          onClick={() => router.push(action.href)}
        >
          <div className="text-white mb-3">{action.icon}</div>
          <h3 className="text-white font-semibold mb-1">{action.title}</h3>
          <p className="text-white/80 text-sm">{action.description}</p>
        </Button>
      ))}
    </div>
  );
}

function SalesChart({ data }: { data: Array<{ month: string; revenue: number }> }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-600 rounded-t-lg transition-all duration-500 hover:bg-blue-700"
              style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
            />
            <span className="text-xs text-gray-600 mt-2">{item.month}</span>
            <span className="text-xs font-medium">R{(item.revenue / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function RetailerDashboard() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for enhanced retailer dashboard
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
        description: 'Convenient moringa capsules',
        tags: ['supplements', 'convenient'],
        createdAt: '2025-01-10',
        soldCount: 156,
        viewCount: 670,
        rating: 4.2,
        reviews: 56
      }
    ];

    const mockOrders: Order[] = [
      {
        id: 'order1',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        items: [
          { productId: 'prod1', productName: 'Premium Organic Moringa Powder', quantity: 2, price: 89.99 }
        ],
        total: 179.98,
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: '2025-01-18T10:30:00Z',
        shippingAddress: {
          street: '123 Main St',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8001'
        }
      },
      {
        id: 'order2',
        customerName: 'Michael Chen',
        customerEmail: 'michael@example.com',
        items: [
          { productId: 'prod2', productName: 'Moringa Tea Bags', quantity: 1, price: 45.00 },
          { productId: 'prod1', productName: 'Premium Organic Moringa Powder', quantity: 1, price: 89.99 }
        ],
        total: 134.99,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: '2025-01-18T09:15:00Z',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2000'
        }
      }
    ];

    const mockAnalytics: Analytics = {
      totalRevenue: 45678.90,
      totalOrders: 234,
      averageOrderValue: 195.20,
      conversionRate: 3.2,
      totalProducts: 12,
      activeProducts: 10,
      lowStockProducts: 2,
      pendingOrders: 5,
      monthlyRevenue: [
        { month: 'Aug', revenue: 12000 },
        { month: 'Sep', revenue: 15000 },
        { month: 'Oct', revenue: 18000 },
        { month: 'Nov', revenue: 22000 },
        { month: 'Dec', revenue: 28000 },
        { month: 'Jan', revenue: 25000 }
      ],
      topProducts: [
        { productId: 'prod1', name: 'Premium Organic Moringa Powder', sales: 342, revenue: 30778.58 },
        { productId: 'prod2', name: 'Moringa Tea Bags', sales: 189, revenue: 8505.00 },
        { productId: 'prod3', name: 'Moringa Capsules', sales: 156, revenue: 10140.00 }
      ],
      customerMetrics: {
        totalCustomers: 189,
        repeatCustomers: 67,
        averageRating: 4.6
      }
    };

    setProducts(mockProducts);
    setOrders(mockOrders);
    setAnalytics(mockAnalytics);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>Error loading analytics</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your marketplace store</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <QuickActions />

        {/* Metrics Cards */}
        <MetricsCards analytics={analytics} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders orders={orders} />
          </div>

          {/* Top Products */}
          <TopProducts products={products} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <SalesChart data={analytics.monthlyRevenue} />
          </div>

          {/* Inventory Alerts */}
          <InventoryAlerts products={products} />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.totalProducts}</div>
            <p className="text-sm text-gray-600">Total Products</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{analytics.activeProducts}</div>
            <p className="text-sm text-gray-600">Active Listings</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.customerMetrics.totalCustomers}</div>
            <p className="text-sm text-gray-600">Total Customers</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.customerMetrics.averageRating.toFixed(1)}</div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
