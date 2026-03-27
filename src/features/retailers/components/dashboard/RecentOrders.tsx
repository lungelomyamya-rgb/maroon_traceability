// src/components/retailers/dashboard/RecentOrders.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Truck, Clock, CheckCircle, XCircle, Package } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    processing: { color: 'bg-blue-100 text-blue-800', icon: Package },
    shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck },
    delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {orders.slice(0, 5).map((order) => {
          const status = statusConfig[order.status];
          
          return (
            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <Badge className={status.color}>
                    <status.icon className="h-3 w-3 mr-1" />
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500">{order.date}</p>
                  <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">{order.items} items</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-4">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
