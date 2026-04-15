// src/features/Farmer/components/fertiliserLog.tsx
'use client';

import { Droplets, Filter } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';

interface FertiliserLogProps {
  _products?: unknown[];
}

export function FertiliserLog({ _products = [] }: FertiliserLogProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logs, setLogs] = useState([
    { id: 1, date: '2024-03-15', type: 'NPK', quantity: '50kg', status: 'applied' },
    { id: 2, date: '2024-03-10', type: 'Organic', quantity: '30kg', status: 'applied' },
    { id: 3, date: '2024-03-05', type: 'Liquid', quantity: '20L', status: 'pending' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fertiliser Log</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Droplets className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">{log.type}</p>
                  <p className="text-sm text-gray-600">{log.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{log.date}</p>
                <Badge variant={log.status === 'applied' ? 'default' : 'secondary'}>
                  {log.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
