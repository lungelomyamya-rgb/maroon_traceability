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
  Settings,
  CreditCard,
  User,
  Store
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className={`${metric.bgColor} p-2 sm:p-3 rounded-lg ${metric.color}`}>
              <div className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6">
                {metric.icon}
              </div>
            </div>
            <div className={`flex items-center text-xs sm:text-sm ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" /> : <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />}
              <span className="hidden sm:inline ml-1">{metric.change}</span>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{metric.title}</p>
        </Card>
      ))}
    </div>
  );
}

function RecentOrders({ orders }: { orders: Order[] }) {
  const router = useRouter();
  
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
    <Card className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold">Recent Orders</h3>
        <Button variant="outline" size="sm" onClick={() => router.push('/retailer/orders')} className="w-full sm:w-auto">
          View All
        </Button>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {orders.slice(0, 5).map((order) => (
          <div key={order.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3 lg:gap-0">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h4 className="font-medium text-sm sm:text-base">{order.customerName}</h4>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                  <Badge className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {order.items.length} items • R{order.total.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => alert(`Viewing order ${order.id} details`)} className="flex-shrink-0">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">View</span>
              </Button>
              <Button size="sm" onClick={() => alert(`Processing order ${order.id}`)} className="flex-shrink-0">
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
  const router = useRouter();
  
  const topProducts = products
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);

  return (
    <Card className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold">Top Products</h3>
        <Button variant="outline" size="sm" onClick={() => router.push('/retailer/product-management')} className="w-full sm:w-auto">
          View All
        </Button>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base">{product.name}</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                  <span>{product.soldCount} sold</span>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm sm:text-base">R{product.price.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-gray-600">{product.stockLevel} in stock</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function InventoryAlerts({ products }: { products: Product[] }) {
  const router = useRouter();
  
  const lowStockProducts = products.filter(p => p.stockLevel <= p.minStockLevel);
  const outOfStockProducts = products.filter(p => p.stockLevel === 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Inventory Alerts</h3>
        <Button variant="outline" size="sm" onClick={() => router.push('/retailer/inventory')}>
          Manage Inventory
        </Button>
      </div>
      
      <div className="space-y-4">
        {outOfStockProducts.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h4 className="font-medium text-red-900">Out of Stock</h4>
            </div>
            <p className="text-sm text-red-700 mb-3">
              {outOfStockProducts.length} product{outOfStockProducts.length > 1 ? 's' : ''} out of stock
            </p>
            <div className="space-y-2">
              {outOfStockProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center text-sm">
                  <span className="text-red-800">{product.name}</span>
                  <span className="text-red-600 font-medium">0 units</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {lowStockProducts.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">Low Stock</h4>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low
            </p>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center text-sm">
                  <span className="text-yellow-800">{product.name}</span>
                  <span className="text-yellow-600 font-medium">{product.stockLevel} units</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">All products are well stocked</p>
            </div>
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
      href: "/retailer/product-management"
    },
    {
      title: "Manage Orders",
      description: "Process and track customer orders",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-blue-600 hover:bg-blue-700",
      href: "/retailer/orders"
    },
    {
      title: "Customers",
      description: "Manage customer relationships",
      icon: <User className="h-6 w-6" />,
      color: "bg-purple-600 hover:bg-purple-700",
      href: "/retailer/customers"
    },
    {
      title: "Inventory",
      description: "Manage stock levels and batches",
      icon: <Package className="h-6 w-6" />,
      color: "bg-orange-600 hover:bg-orange-700",
      href: "/retailer/inventory"
    },
    {
      title: "Shipping",
      description: "Configure shipping providers",
      icon: <Truck className="h-6 w-6" />,
      color: "bg-indigo-600 hover:bg-indigo-700",
      href: "/retailer/shipping"
    },
    {
      title: "Payments",
      description: "Manage payment gateways",
      icon: <CreditCard className="h-6 w-6" />,
      color: "bg-pink-600 hover:bg-pink-700",
      href: "/retailer/payments"
    },
    {
      title: "View Analytics",
      description: "Track sales and performance metrics",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-teal-600 hover:bg-teal-700",
      href: "/retailer/analytics"
    },
    {
      title: "Store Settings",
      description: "Configure store preferences",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-gray-600 hover:bg-gray-700",
      href: "/retailer/settings"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {actions.map((action, index) => (
        <Button
          key={index}
          className={`h-auto p-3 sm:p-4 lg:p-6 flex-col items-start text-left ${action.color}`}
          onClick={() => router.push(action.href)}
        >
          <div className="text-white mb-2 sm:mb-3">
            <div className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6">
              {action.icon}
            </div>
          </div>
          <h3 className="text-white font-semibold text-xs sm:text-sm mb-1">{action.title}</h3>
          <p className="text-white/80 text-xs hidden sm:block">{action.description}</p>
        </Button>
      ))}
    </div>
  );
}

function SalesChart({ data }: { data: Array<{ month: string; revenue: number }> }) {
  console.log('SalesChart data:', data); // Debug log
  
  if (!data || data.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <div className="text-gray-500">No revenue data available</div>
      </Card>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Revenue Trend</h3>
          <p className="text-sm text-gray-600">Monthly performance overview</p>
        </div>
        <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      
      <div className="relative h-32 sm:h-48 md:h-64 lg:h-80 bg-gradient-to-b from-gray-50 to-white rounded-xl p-3 sm:p-4">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div key={percent} className="border-b border-gray-200 border-dashed" style={{ opacity: percent === 0 ? 0 : 0.3 }} />
          ))}
        </div>
        
        <div className="relative h-full flex items-end justify-between gap-1 sm:gap-2 md:gap-3">
          {data.map((item, index) => {
            const barHeight = (item.revenue / maxRevenue) * 100;
            const isHighest = item.revenue === maxRevenue;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex flex-col items-center">
                  {/* Bar with gradient */}
                  <div 
                    className={`
                      w-full rounded-t-lg transition-all duration-700 ease-out transform
                      ${isHighest 
                        ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg shadow-blue-500/25' 
                        : 'bg-gradient-to-t from-blue-500 to-blue-300'
                      }
                      hover:scale-105 hover:shadow-xl
                    `}
                    style={{ 
                      height: `${Math.max(barHeight, 5)}%`,
                      minHeight: '30px'
                    }}
                  >
                    {/* Value label on top of bar */}
                    {isHighest && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        R{(item.revenue / 1000).toFixed(1)}k
                      </div>
                    )}
                  </div>
                  
                  {/* Hover tooltip */}
                  <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    <div className="font-medium">{item.month}</div>
                    <div className="text-blue-300 text-xs sm:text-sm">R{item.revenue.toLocaleString()}</div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 hidden sm:block"></div>
                  </div>
                </div>
                
                {/* Month label */}
                <div className="mt-2 sm:mt-3 text-center">
                  <div className="text-xs sm:text-sm font-medium text-gray-700">{item.month}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">R{(item.revenue / 1000).toFixed(1)}k</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">R{data[data.length - 1].revenue.toLocaleString()}</div>
          <div className="text-xs text-blue-600">Current Month</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-green-600">R{maxRevenue.toLocaleString()}</div>
          <div className="text-xs text-green-600">Peak Revenue</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">R{Math.round(data.reduce((sum, item) => sum + item.revenue, 0) / data.length).toLocaleString()}</div>
          <div className="text-xs text-purple-600">Average</div>
        </div>
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
        images: ['/images/moringaPowder.jpg'],
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
        images: ['/images/moringaTea.jpg'],
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
        images: ['/images/moringaCapsules.jpg'],
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
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 lg:p-10 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 text-center lg:text-left">
          <div className="flex-1 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Retailer
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 max-w-2xl mx-auto lg:mx-0">
              Manage your products, track orders, analyze sales, and grow your business with powerful tools designed for South African retailers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button 
                onClick={() => router.push('/retailer/product-management')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Product
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/retailer/analytics')}
                className="border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <Store className="h-32 w-32 text-white/20" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Metrics Cards */}
      <MetricsCards analytics={analytics} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>

        {/* Top Products */}
        <div className="hidden lg:block">
          <TopProducts products={products} />
        </div>
      </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <SalesChart data={analytics.monthlyRevenue} />
          </div>

          {/* Inventory Alerts */}
          <div className="hidden lg:block">
            <InventoryAlerts products={products} />
          </div>
        </div>

        {/* Mobile Layout - Show Top Products and Inventory on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="sm:col-span-1">
            <TopProducts products={products} />
          </div>
          <div className="sm:col-span-1">
            <InventoryAlerts products={products} />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Card className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{analytics.totalProducts}</div>
            <p className="text-xs sm:text-sm text-gray-600">Total Products</p>
          </Card>
          <Card className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">{analytics.activeProducts}</div>
            <p className="text-xs sm:text-sm text-gray-600">Active Listings</p>
          </Card>
          <Card className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">{analytics.customerMetrics.totalCustomers}</div>
            <p className="text-xs sm:text-sm text-gray-600">Total Customers</p>
          </Card>
          <Card className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">{analytics.customerMetrics.averageRating.toFixed(1)}</div>
            <p className="text-xs sm:text-sm text-gray-600">Average Rating</p>
          </Card>
        </div>
      </div>
    );
}
