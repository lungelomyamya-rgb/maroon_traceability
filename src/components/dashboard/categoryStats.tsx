// src/components/dashboard/CategoryStats.tsx
'use client';

import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/typography';
import { PRODUCT_CATEGORIES, CATEGORY_COLORS, getCategoryIcon } from '@/lib/constants';
import { TrendingUp } from 'lucide-react';
import { ProductCategory } from '@/types/product';

export function CategoryStats() {
  const { categoryStats, blockchainRecords } = useProducts();
  const totalProducts = blockchainRecords.length;

  return (
    <Card variant="bordered">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <CardTitle>Products by Category</CardTitle>
      </div>
      
      <div className="space-y-3">
        {PRODUCT_CATEGORIES.map((category) => {
          const count = categoryStats[category];
          const percentage = totalProducts > 0 ? (count / totalProducts) * 100 : 0;
          const colors = CATEGORY_COLORS[category];

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getCategoryIcon(category as ProductCategory);
                    return <Icon className={`h-5 w-5 ${colors.text}`} />;
                  })()}
                  <span className="text-sm font-medium text-foreground">{category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{count}</span>
                  <span className="text-xs font-semibold text-foreground/90">({percentage.toFixed(0)}%)</span>
                </div>
              </div>
              <div className="relative w-full h-2.5 rounded-full overflow-hidden bg-muted/50 border border-muted/70">
                <div 
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${colors.bg}, ${colors.border})`,
                    boxShadow: '0 0 12px 0px rgba(180, 83, 9, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-30"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}