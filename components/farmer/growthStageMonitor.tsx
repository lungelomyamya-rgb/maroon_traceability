// src/components/farmer/growthStageMonitor.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sprout, TrendingUp, AlertTriangle, CheckCircle, Camera, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface GrowthStage {
  id: string;
  productId: string;
  stage: 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'mature';
  date: string;
  height: number;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
  photos: string[];
  nextAction: string;
}

interface GrowthStageMonitorProps {
  products: any[];
}

export function GrowthStageMonitor({ products }: GrowthStageMonitorProps) {
  const [growthStages, setGrowthStages] = useState<GrowthStage[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStage, setNewStage] = useState({
    stage: 'seedling' as const,
    height: '',
    health: 'good' as const,
    notes: '',
    nextAction: ''
  });

  const stageConfig = {
    seedling: { label: 'Seedling', icon: '🌱', color: 'green', duration: '2-3 weeks' },
    vegetative: { label: 'Vegetative', icon: '🌿', color: 'lime', duration: '4-6 weeks' },
    flowering: { label: 'Flowering', icon: '🌸', color: 'pink', duration: '2-3 weeks' },
    fruiting: { label: 'Fruiting', icon: '🍅', color: 'orange', duration: '4-8 weeks' },
    mature: { label: 'Mature', icon: '🌾', color: 'yellow', duration: 'Ready for harvest' }
  };

  const healthConfig = {
    excellent: { color: 'success' as const, icon: '💚', label: 'Excellent' },
    good: { color: 'info' as const, icon: '💙', label: 'Good' },
    fair: { color: 'warning' as const, icon: '💛', label: 'Fair' },
    poor: { color: 'destructive' as const, icon: '❤️', label: 'Poor' }
  };

  useEffect(() => {
    // Mock data - replace with API call
    const mockStages: GrowthStage[] = [
      {
        id: 'gs1',
        productId: products[0]?.id || '',
        stage: 'vegetative',
        date: '2025-01-20',
        height: 45,
        health: 'good',
        notes: 'Plants showing healthy leaf development, good color',
        photos: [],
        nextAction: 'Monitor for pests, prepare support structures'
      },
      {
        id: 'gs2',
        productId: products[0]?.id || '',
        stage: 'flowering',
        date: '2025-02-15',
        height: 75,
        health: 'excellent',
        notes: 'First flowers appearing, excellent pollination activity',
        photos: [],
        nextAction: 'Increase watering, monitor fruit set'
      }
    ];

    setGrowthStages(mockStages);
    if (products.length > 0) {
      setSelectedProduct(products[0].id);
    }
  }, [products]);

  const handleAddStage = () => {
    const stageData: GrowthStage = {
      id: `gs${Date.now()}`,
      productId: selectedProduct,
      stage: newStage.stage,
      date: new Date().toISOString().split('T')[0],
      height: parseFloat(newStage.height),
      health: newStage.health,
      notes: newStage.notes,
      photos: [],
      nextAction: newStage.nextAction
    };

    setGrowthStages([...growthStages, stageData]);
    setNewStage({ stage: 'seedling', height: '', health: 'good', notes: '', nextAction: '' });
    setShowAddForm(false);
  };

  const getProgress = (stage: keyof typeof stageConfig) => {
    const stages = Object.keys(stageConfig);
    const currentIndex = stages.indexOf(stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Growth Stage Monitoring</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green hover:bg-green-hover text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Growth Update
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Record Growth Stage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Growth Stage</label>
              <select
                value={newStage.stage}
                onChange={(e) => setNewStage({...newStage, stage: e.target.value as any})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {Object.entries(stageConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.icon} {config.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <Input
                type="number"
                value={newStage.height}
                onChange={(e) => setNewStage({...newStage, height: e.target.value})}
                placeholder="Enter plant height"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
              <select
                value={newStage.health}
                onChange={(e) => setNewStage({...newStage, health: e.target.value as any})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {Object.entries(healthConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.icon} {config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
              <Input
                value={newStage.nextAction}
                onChange={(e) => setNewStage({...newStage, nextAction: e.target.value})}
                placeholder="Recommended next action"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Textarea
                value={newStage.notes}
                onChange={(e) => setNewStage({...newStage, notes: e.target.value})}
                rows={3}
                placeholder="Observations and notes about this growth stage"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStage}>
              Save Growth Stage
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {growthStages.map((stage) => {
          const config = stageConfig[stage.stage];
          const health = healthConfig[stage.health];
          
          return (
            <Card key={stage.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{config.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{config.label}</h3>
                    <p className="text-sm text-gray-500">{config.duration}</p>
                  </div>
                </div>
                <Badge variant={health.color}>
                  {health.icon} {health.label}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Growth Progress</span>
                    <span className="font-medium">{Math.round(getProgress(stage.stage))}%</span>
                  </div>
                  <Progress value={getProgress(stage.stage)} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Height:</span>
                    <span className="ml-2 font-medium">{stage.height}cm</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium">{stage.date}</span>
                  </div>
                </div>

                {stage.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{stage.notes}</p>
                  </div>
                )}

                {stage.nextAction && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Next Action</p>
                        <p className="text-sm text-blue-700">{stage.nextAction}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-1" />
                    Add Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Report Issue
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
