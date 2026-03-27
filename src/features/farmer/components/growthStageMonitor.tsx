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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Growth Stage Monitoring</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Add Growth Update</span>
          <span className="sm:hidden">Add Update</span>
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Record Growth Stage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Growth Stage</label>
              <select
                value={newStage.stage}
                onChange={(e) => setNewStage({...newStage, stage: e.target.value as any})}
                className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded-md"
              >
                {Object.entries(stageConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.icon} {config.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <Input
                type="number"
                value={newStage.height}
                onChange={(e) => setNewStage({...newStage, height: e.target.value})}
                placeholder="Enter plant height"
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Health Status</label>
              <select
                value={newStage.health}
                onChange={(e) => setNewStage({...newStage, health: e.target.value as any})}
                className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded-md"
              >
                {Object.entries(healthConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.icon} {config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Next Action</label>
              <Input
                value={newStage.nextAction}
                onChange={(e) => setNewStage({...newStage, nextAction: e.target.value})}
                placeholder="Recommended next action"
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Textarea
                value={newStage.notes}
                onChange={(e) => setNewStage({...newStage, notes: e.target.value})}
                rows={3}
                placeholder="Observations and notes about this growth stage"
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddStage} className="w-full sm:w-auto">
              <span className="hidden sm:inline">Save Growth Stage</span>
              <span className="sm:hidden">Save Stage</span>
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {growthStages.map((stage) => {
          const config = stageConfig[stage.stage];
          const health = healthConfig[stage.health];
          
          return (
            <Card key={stage.id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">{config.icon}</span>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{config.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{config.duration}</p>
                  </div>
                </div>
                <Badge variant={health.color} className="text-xs">
                  {health.icon} {health.label}
                </Badge>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-gray-600">Growth Progress</span>
                    <span className="font-medium">{Math.round(getProgress(stage.stage))}%</span>
                  </div>
                  <Progress value={getProgress(stage.stage)} className="h-1 sm:h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-600">Height:</span>
                    <span className="ml-1 sm:ml-2 font-medium">{stage.height}cm</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-1 sm:ml-2 font-medium">{stage.date}</span>
                  </div>
                </div>

                {stage.notes && (
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-700">{stage.notes}</p>
                  </div>
                )}

                {stage.nextAction && (
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-blue-900">Next Action</p>
                        <p className="text-xs sm:text-sm text-blue-700">{stage.nextAction}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button variant="outline" size="sm" className="h-7 sm:h-9 px-2 sm:px-3 text-xs w-full sm:w-auto">
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Add Photo</span>
                    <span className="sm:hidden">Photo</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 sm:h-9 px-2 sm:px-3 text-xs w-full sm:w-auto">
                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Report Issue</span>
                    <span className="sm:hidden">Issue</span>
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
