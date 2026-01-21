// src/app/retailer/customers/customerManagementComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  Star,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Send,
  Download,
  RefreshCw,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package,
  Award,
  Target,
  Bell
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'vip' | 'suspended';
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  rating: number;
  reviews: number;
  preferences: {
    communication: 'email' | 'sms' | 'both';
    notifications: boolean;
    promotions: boolean;
  };
  tags: string[];
  notes: string;
}

export default function CustomerManagementComponent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showCommunicationForm, setShowCommunicationForm] = useState(false);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);

  useEffect(() => {
    // Mock customer data
    const mockCustomers: Customer[] = [
      {
        id: 'cust1',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+27 83 123 4567',
        address: {
          street: '123 Main Street',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8001'
        },
        registrationDate: '2023-06-15',
        totalOrders: 24,
        totalSpent: 2456.78,
        averageOrderValue: 102.37,
        lastOrderDate: '2024-01-14',
        status: 'vip',
        loyaltyTier: 'gold',
        rating: 4.8,
        reviews: 12,
        preferences: {
          communication: 'email',
          notifications: true,
          promotions: true
        },
        tags: ['repeat-customer', 'high-value', 'organic-products'],
        notes: 'Excellent customer, always orders organic products. Prefers weekend delivery.'
      },
      {
        id: 'cust2',
        name: 'Michael Chen',
        email: 'm.chen@email.com',
        phone: '+27 72 987 6543',
        address: {
          street: '456 Oak Avenue',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2001'
        },
        registrationDate: '2023-09-20',
        totalOrders: 8,
        totalSpent: 567.89,
        averageOrderValue: 70.99,
        lastOrderDate: '2024-01-10',
        status: 'active',
        loyaltyTier: 'silver',
        rating: 4.2,
        reviews: 3,
        preferences: {
          communication: 'both',
          notifications: true,
          promotions: false
        },
        tags: ['new-customer', 'health-conscious'],
        notes: 'New customer, interested in health products. Prefers SMS notifications.'
      },
      {
        id: 'cust3',
        name: 'Emma Wilson',
        email: 'emma.w@email.com',
        phone: '+27 61 555 1234',
        address: {
          street: '789 Pine Road',
          city: 'Durban',
          province: 'KwaZulu-Natal',
          postalCode: '4001'
        },
        registrationDate: '2023-03-10',
        totalOrders: 45,
        totalSpent: 3890.45,
        averageOrderValue: 86.45,
        lastOrderDate: '2024-01-16',
        status: 'vip',
        loyaltyTier: 'platinum',
        rating: 4.9,
        reviews: 28,
        preferences: {
          communication: 'email',
          notifications: true,
          promotions: true
        },
        tags: ['loyal-customer', 'bulk-buyer', 'referral-source'],
        notes: 'Top customer, frequently refers new customers. Orders in bulk.'
      }
    ];
    setCustomers(mockCustomers);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesTier = tierFilter === 'all' || customer.loyaltyTier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-100 text-orange-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeCustomers = customers.filter(c => c.status === 'active' || c.status === 'vip').length;
  const vipCustomers = customers.filter(c => c.status === 'vip').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageRating = customers.reduce((sum, c) => sum + c.rating, 0) / customers.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">{activeCustomers}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">VIP Customers</p>
              <p className="text-2xl font-bold text-purple-600">{vipCustomers}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">R{totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddCustomerForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </Card>

      {/* Customers List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Directory</h3>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg break-words">{customer.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <Badge className={`${getStatusColor(customer.status)} text-xs sm:text-sm`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                      <Badge className={`${getTierColor(customer.loyaltyTier)} text-xs sm:text-sm`}>
                        {customer.loyaltyTier.charAt(0).toUpperCase() + customer.loyaltyTier.slice(1)}
                      </Badge>
                    </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-xs sm:text-sm truncate">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-xs sm:text-sm truncate">{customer.address.city}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                      <span className="text-xs sm:text-sm">{customer.totalOrders} orders</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-xs sm:text-sm truncate">R{customer.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{customer.rating}</span>
                      <span>({customer.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {customer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCustomerDetails(true);
                    }}
                    className="flex-1 sm:flex-initial"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">View Details</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCommunicationForm(true);
                    }}
                    className="flex-1 sm:flex-initial"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
              </div>
            </div>
          ))}
        </div>
    </Card>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Customer Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomerDetails(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedCustomer.name}</p>
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                    <p><strong>Address:</strong> {selectedCustomer.address.street}, {selectedCustomer.address.city}, {selectedCustomer.address.province} {selectedCustomer.address.postalCode}</p>
                    <p><strong>Registration Date:</strong> {new Date(selectedCustomer.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Customer Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</p>
                    <p><strong>Total Spent:</strong> R{selectedCustomer.totalSpent.toFixed(2)}</p>
                    <p><strong>Average Order Value:</strong> R{selectedCustomer.averageOrderValue.toFixed(2)}</p>
                    <p><strong>Last Order:</strong> {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</p>
                    <p><strong>Rating:</strong> {selectedCustomer.rating} ({selectedCustomer.reviews} reviews)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Preferences & Notes</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Communication Preferences:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {selectedCustomer.preferences.communication}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Notifications: {selectedCustomer.preferences.notifications ? 'Enabled' : 'Disabled'}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        Promotions: {selectedCustomer.preferences.promotions ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCustomer.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Notes:</p>
                    <p className="text-sm">{selectedCustomer.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Form Modal */}
      {showCommunicationForm && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Contact Customer</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommunicationForm(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
            <div className="p-4 sm:p-6">
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-sm text-gray-600 mt-1">{selectedCustomer.name} ({selectedCustomer.email})</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Communication Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <Input placeholder="Enter subject" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <Textarea placeholder="Type your message..." rows={6} />
                </div>

                <div className="flex gap-2">
                  <Button type="button" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCommunicationForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
