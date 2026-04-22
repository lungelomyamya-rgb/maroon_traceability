// src/components/retailers/analytics/TopProducts.tsx
'use client';

import { TrendingUp, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnalyticsData } from './hooks/useAnalytics';

interface TopProductsProps {
  data: AnalyticsData;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  formatPercentage: (value: number) => string;
}

export function TopProducts({ data, formatCurrency, formatNumber, formatPercentage }: TopProductsProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderStars = (rating: number, reviews: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({reviews})</span>
      </div>
    );
  };

  const getConversionRate = (views: number, sales: number) => {
    if (views === 0) {
      return 0;
    }
    return ((sales / views) * 100).toFixed(2);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Top Performing Products</h3>
        <Button variant="outline" size="sm">
          View All Products
        </Button>
      </div>

      <div className="space-y-4">
        {data.topProducts.map((product, index) => (
          <div key={product.productId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{formatNumber(product.views)} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-gray-600">{getConversionRate(product.views, product.sales)}% conversion</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatNumber(product.sales)}</p>
                <p className="text-xs text-gray-600">sold</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                <p className="text-xs text-gray-600">revenue</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Top {index + 1}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(data.topProducts.reduce((sum, p) => sum + p.sales, 0))}
            </p>
            <p className="text-sm text-gray-600">Total Units Sold</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.topProducts.reduce((sum, p) => sum + p.revenue, 0))}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(Math.round(data.topProducts.reduce((sum, p) => sum + p.views, 0) / data.topProducts.length))}
            </p>
            <p className="text-sm text-gray-600">Avg Views</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Performance Insight</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your top 5 products account for {formatPercentage((data.topProducts.reduce((sum, p) => sum + p.revenue, 0) / data.totalRevenue) * 100)} of total revenue.
              Consider promoting these products further and analyzing their success factors.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
