// src/components/retailers/dashboard/TopProducts.tsx
'use client';

import { Star } from 'lucide-react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Card } from '@/src/features/shared/ui/card';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stockLevel: number;
  sales: number;
  revenue: number;
  rating: number;
}

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  const topProducts = products
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
      
      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{product.name}</p>
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
                  <span className="text-xs text-gray-400">• {product.sales} sold</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
