// src/components/dashboard/RecentActivity.tsx
'use client';

import { Package } from 'lucide-react';
import { useProducts } from '@/contexts/productContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export function RecentActivity() {
  const { blockchainRecords } = useProducts();

  return (
    <Card variant="bordered">
      <h3 className="text-xl font-bold mb-4 text-foreground">Recent Blockchain Activity</h3>
      <div className="space-y-3">
        {blockchainRecords.slice(0, 3).map((record) => (
          <div key={record.id} className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded transition-colors">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="font-medium">{record.productName}</p>
                <p className="text-sm text-muted-foreground">
                  {record.farmer} • {record.location}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{formatDate(record.timestamp)}</p>
              <Badge variant={record.status === 'Certified' ? 'success' : 'warning'}>
                {record.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}