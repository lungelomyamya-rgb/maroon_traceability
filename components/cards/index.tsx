// src/components/cards/index.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCategory } from '@/types/product';

interface ProductCardProps {
  variant?: 'default' | 'outline';
  data: {
    id: string;
    name: string;
    category: ProductCategory;
    status: string;
    description: string;
    onView: () => void;
    className?: string;
  };
  className?: string;
}

export function ProductCard({ variant = 'default', data, className = '' }: ProductCardProps) {
  return (
    <Card variant={variant} className={className}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{data.name}</h3>
          <Badge variant="outline">{data.status}</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-2">{data.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{data.category}</span>
          <Button size="sm" onClick={data.onView}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
