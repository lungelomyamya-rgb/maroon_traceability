// src/components/retailers/customerManagement/hooks/useCustomerManagement.ts
'use client';

import { useState, useEffect } from 'react';

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

interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  averageOrderValue: number;
  totalRevenue: number;
  repeatCustomers: number;
  averageRating: number;
  customerGrowth: number;
}

interface CommunicationMessage {
  customerId: string;
  type: 'email' | 'sms' | 'both';
  subject: string;
  message: string;
}

export function useCustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [metrics, setMetrics] = useState<CustomerMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading - replace with API calls
    const loadMockData = async () => {
      // Mock customers
      const mockCustomers: Customer[] = [
        {
          id: 'cust-001',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+27 21 123 4567',
          address: {
            street: '123 Main Street',
            city: 'Cape Town',
            province: 'Western Cape',
            postalCode: '8001',
            country: 'South Africa',
          },
          status: 'vip',
          registrationDate: '2023-01-15T00:00:00Z',
          lastOrderDate: '2024-03-15T14:30:00Z',
          totalOrders: 45,
          totalSpent: 12500,
          averageOrderValue: 277.78,
          rating: 4.8,
          loyaltyTier: 'platinum',
          tags: ['premium', 'regular', 'online'],
          preferences: {
            email: true,
            sms: true,
            notifications: true,
            promotions: true,
          },
          notes: 'VIP customer since 2023. Always orders premium products.',
        },
        {
          id: 'cust-002',
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '+27 21 234 5678',
          address: {
            street: '456 Oak Avenue',
            city: 'Johannesburg',
            province: 'Gauteng',
            postalCode: '2001',
            country: 'South Africa',
          },
          status: 'active',
          registrationDate: '2023-03-20T00:00:00Z',
          lastOrderDate: '2024-03-14T10:15:00Z',
          totalOrders: 23,
          totalSpent: 4500,
          averageOrderValue: 195.65,
          rating: 4.5,
          loyaltyTier: 'gold',
          tags: ['regular', 'local'],
          preferences: {
            email: true,
            sms: false,
            notifications: true,
            promotions: false,
          },
          notes: 'Prefers local products and sustainable options.',
        },
        {
          id: 'cust-003',
          name: 'Mike Wilson',
          email: 'mike.w@example.com',
          phone: '+27 21 345 6789',
          address: {
            street: '789 Pine Road',
            city: 'Durban',
            province: 'KwaZulu-Natal',
            postalCode: '4001',
            country: 'South Africa',
          },
          status: 'active',
          registrationDate: '2023-06-10T00:00:00Z',
          lastOrderDate: '2024-03-13T16:45:00Z',
          totalOrders: 18,
          totalSpent: 3200,
          averageOrderValue: 177.78,
          rating: 4.2,
          loyaltyTier: 'silver',
          tags: ['new', 'occasional'],
          preferences: {
            email: false,
            sms: true,
            notifications: false,
            promotions: true,
          },
        },
        {
          id: 'cust-004',
          name: 'Emma Davis',
          email: 'emma.d@example.com',
          phone: '+27 21 456 7890',
          address: {
            street: '321 Elm Street',
            city: 'Pretoria',
            province: 'Gauteng',
            postalCode: '0001',
            country: 'South Africa',
          },
          status: 'inactive',
          registrationDate: '2023-02-28T00:00:00Z',
          lastOrderDate: '2023-11-20T09:30:00Z',
          totalOrders: 8,
          totalSpent: 1200,
          averageOrderValue: 150.00,
          rating: 3.9,
          loyaltyTier: 'bronze',
          tags: ['inactive', 'churned'],
          preferences: {
            email: false,
            sms: false,
            notifications: false,
            promotions: false,
          },
          notes: 'Customer has not ordered in over 4 months. Needs re-engagement.',
        },
      ];

      // Mock metrics
      const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
      const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
      const averageOrderValue = totalRevenue / mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0);
      const repeatCustomers = mockCustomers.filter(c => c.totalOrders > 1).length;
      const averageRating = mockCustomers.reduce((sum, c) => sum + c.rating, 0) / mockCustomers.length;
      
      const mockMetrics: CustomerMetrics = {
        totalCustomers: mockCustomers.length,
        activeCustomers,
        newCustomers: 12, // Mock new customers this month
        averageOrderValue: averageOrderValue || 0,
        totalRevenue,
        repeatCustomers,
        averageRating,
        customerGrowth: 8.5, // Mock growth percentage
      };

      setCustomers(mockCustomers);
      setMetrics(mockMetrics);
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

  const addCustomer = (customerData: Omit<Customer, 'id' | 'registrationDate' | 'totalOrders' | 'totalSpent' | 'averageOrderValue'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      registrationDate: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    refreshData();
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => 
      c.id === updatedCustomer.id ? updatedCustomer : c,
    ));
    refreshData();
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    refreshData();
  };

  const sendMessage = (message: CommunicationMessage) => {
    // Implement actual message sending
    try {
      console.log('Sending message:', message);
      const customer = getCustomerById(message.customerId);
      
      // In a real implementation, this would:
      // 1. Validate message content and recipient
      // 2. Choose appropriate communication channel (email/SMS)
      // 3. Integrate with email service provider (SendGrid, AWS SES, etc.)
      // 4. Integrate with SMS service provider (Twilio, etc.)
      // 5. Track message delivery status
      // 6. Log communication for audit trail
      
      // For demo purposes, we'll just show a success message
      const recipientName = customer?.name || `Customer ${message.customerId}`;
      alert(`Message sent to ${recipientName} via ${message.type}!`);
      // In a real implementation, we would call the email/SMS API here
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  const getCustomersByStatus = (status: Customer['status']) => {
    return customers.filter(c => c.status === status);
  };

  const getCustomersByTier = (tier: Customer['loyaltyTier']) => {
    return customers.filter(c => c.loyaltyTier === tier);
  };

  const getActiveCustomers = () => {
    return customers.filter(c => c.status === 'active');
  };

  const getVipCustomers = () => {
    return customers.filter(c => c.status === 'vip');
  };

  return {
    customers,
    metrics,
    isLoading,
    refreshData,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    sendMessage,
    getCustomerById,
    getCustomersByStatus,
    getCustomersByTier,
    getActiveCustomers,
    getVipCustomers,
  };
}

export type { Customer, CustomerMetrics, CommunicationMessage };
