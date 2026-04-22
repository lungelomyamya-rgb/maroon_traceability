// src/features/farmer/components/seedVarietyTracker.tsx
'use client';

import { Sprout, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SeedVarietyTrackerProps {
  _products?: unknown[];
}

export function SeedVarietyTracker({ _products = [] }: SeedVarietyTrackerProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [varieties, setVarieties] = useState([
    { id: 1, name: 'Moringa Oleifera', type: 'Premium', planted: '2024-01-15', status: 'growing' },
    { id: 2, name: 'Moringa Stenopetala', type: 'Standard', planted: '2024-01-10', status: 'growing' },
    { id: 3, name: 'Moringa Concanensis', type: 'Hybrid', planted: '2024-01-05', status: 'seedling' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Seed Variety Tracker</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {varieties.map((variety) => (
            <div key={variety.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Sprout className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">{variety.name}</p>
                  <p className="text-sm text-gray-600">{variety.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Planted: {variety.planted}</p>
                <Badge variant={variety.status === 'growing' ? 'default' : 'secondary'}>
                  {variety.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
