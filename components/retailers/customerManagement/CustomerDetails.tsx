// src/components/retailers/customerManagement/CustomerDetails.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  Star,
  TrendingUp,
  DollarSign,
  Package,
  Award,
  Bell,
  MessageSquare,
  Send,
  Download,
  Edit,
  CheckCircle,
  Clock,
  XCircle
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
    country: string;
  };
  status: 'active' | 'inactive' | 'vip';
  registrationDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  rating: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tags: string[];
  preferences: {
    email: boolean;
    sms: boolean;
    notifications: boolean;
    promotions: boolean;
  };
  notes?: string;
}

interface CustomerDetailsProps {
  customer: Customer;
  onClose: () => void;
  onEdit?: (customer: Customer) => void;
  onContact?: (customer: Customer) => void;
}

export function CustomerDetails({ customer, onClose, onEdit, onContact }: CustomerDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'bronze':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Customer Details</h3>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onContact && (
              <Button variant="outline" size="sm" onClick={() => onContact(customer)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{customer.name}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                      <Badge className={getTierColor(customer.loyaltyTier)}>
                        {customer.loyaltyTier.charAt(0).toUpperCase() + customer.loyaltyTier.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium text-sm">
                      {customer.address.street}<br />
                      {customer.address.city}, {customer.address.province}<br />
                      {customer.address.postalCode}<br />
                      {customer.address.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order History */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Order History
              </h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Orders</p>
                    <p className="font-bold text-lg">{customer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Spent</p>
                    <p className="font-bold text-lg">R{customer.totalSpent.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Average Order</p>
                    <p className="font-bold text-lg">R{customer.averageOrderValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Customer Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-bold text-lg">{customer.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
                  <div>
                    <p className="text-gray-500">Registration Date</p>
                    <p className="font-medium">{new Date(customer.registrationDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Order</p>
                    <p className="font-medium">
                      {customer.lastOrderDate 
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : 'No orders yet'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Communication Preferences
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs ${
                customer.preferences.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                Email: {customer.preferences.email ? 'Enabled' : 'Disabled'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${
                customer.preferences.sms ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                SMS: {customer.preferences.sms ? 'Enabled' : 'Disabled'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${
                customer.preferences.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                Notifications: {customer.preferences.notifications ? 'Enabled' : 'Disabled'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${
                customer.preferences.promotions ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                Promotions: {customer.preferences.promotions ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Tags */}
          {customer.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {customer.notes && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Notes</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{customer.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Award className="h-4 w-4 mr-2" />
              Update Tier
            </Button>
            {customer.status === 'active' && (
              <Button variant="outline" className="w-full sm:w-auto text-red-600 hover:text-red-700">
                <XCircle className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
