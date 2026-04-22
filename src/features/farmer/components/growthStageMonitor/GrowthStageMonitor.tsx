// src/features/farmer/components/growthStageMonitor.tsx
'use client';

import { Sprout, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GrowthStageMonitorProps {
  _products?: unknown[];
}

export function GrowthStageMonitor({ _products = [] }: GrowthStageMonitorProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stages, setStages] = useState([
    { id: 1, name: 'Seedling', stage: 'Early', progress: 100, status: 'completed' },
    { id: 2, name: 'Vegetative', stage: 'Mid', progress: 75, status: 'active' },
    { id: 3, name: 'Flowering', stage: 'Early', progress: 25, status: 'pending' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Growth Stage Monitor</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Timeline
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map((stage) => (
          <Card key={stage.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sprout className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-lg">{stage.name}</p>
                  <p className="text-sm text-gray-600">{stage.stage} Stage</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{stage.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>
              </div>

              <Badge variant={stage.status === 'completed' ? 'default' : 'secondary'}>
                {stage.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
