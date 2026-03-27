// src/components/retailers/dashboard/InventoryAlerts.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, ArrowDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  stockLevel: number;
  minStockLevel: number;
  category: string;
}

interface InventoryAlertsProps {
  products: Product[];
}

export function InventoryAlerts({ products }: InventoryAlertsProps) {
  const lowStockProducts = products.filter(
    product => product.stockLevel <= product.minStockLevel
  );

  const getAlertLevel = (stockLevel: number, minLevel: number) => {
    if (stockLevel === 0) return 'critical';
    if (stockLevel <= minLevel * 0.5) return 'high';
    return 'medium';
  };

  const getAlertConfig = (level: string) => {
    switch (level) {
      case 'critical':
        return { color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case 'high':
        return { color: 'bg-orange-100 text-orange-800', icon: ArrowDown };
      default:
        return { color: 'bg-yellow-100 text-yellow-800', icon: Package };
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
        <Badge className="bg-red-100 text-red-800">
          {lowStockProducts.length} items
        </Badge>
      </div>
      
      {lowStockProducts.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No inventory alerts</p>
          <p className="text-sm text-gray-400 mt-1">All stock levels are healthy</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockProducts.slice(0, 5).map((product) => {
            const alertLevel = getAlertLevel(product.stockLevel, product.minStockLevel);
            const config = getAlertConfig(alertLevel);
            
            return (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <Badge className={config.color}>
                      <config.icon className="h-3 w-3 mr-1" />
                      {alertLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-red-600">
                      {product.stockLevel} left
                    </span>
                    <span className="text-xs text-gray-400">
                      Min: {product.minStockLevel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {lowStockProducts.length > 5 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500 text-center">
            And {lowStockProducts.length - 5} more items need attention
          </p>
        </div>
      )}
    </Card>
  );
}
