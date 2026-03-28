// src/components/farmer/seedVarietyTracker/VarietyOverview.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Award, 
  TrendingUp,
  CheckCircle,
  Sprout,
  Leaf,
  BarChart3,
  Plus
} from 'lucide-react';
import type { SeedVarietyTrackerComputed } from './seedTrackerHooks/useSeedVarietyTracker';

interface VarietyOverviewProps {
  statistics: SeedVarietyTrackerComputed['statistics'];
  topVarieties: Array<{ variety: string; count: number }>;
  onAddNewSeed: () => void;
}

export function VarietyOverview({ statistics, topVarieties, onAddNewSeed }: VarietyOverviewProps) {
  const {
    totalSeeds,
    totalVarieties,
    totalBrands,
    organicSeeds,
    gmoFreeSeeds,
    averageGerminationRate,
    highGerminationSeeds,
    certifiedSeeds
  } = statistics;

  const getGerminationColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGerminationBadgeColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Seeds</p>
              <p className="text-2xl font-bold text-gray-900">{totalSeeds}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Varieties</p>
              <p className="text-2xl font-bold text-gray-900">{totalVarieties}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sprout className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Brands</p>
              <p className="text-2xl font-bold text-gray-900">{totalBrands}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Germination</p>
              <p className={`text-2xl font-bold ${getGerminationColor(averageGerminationRate)}`}>
                {averageGerminationRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Organic Seeds</p>
              <p className="text-lg font-semibold text-green-600">{organicSeeds}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">GMO-Free</p>
              <p className="text-lg font-semibold text-blue-600">{gmoFreeSeeds}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">High Germination</p>
              <p className="text-lg font-semibold text-yellow-600">{highGerminationSeeds}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Certified</p>
              <p className="text-lg font-semibold text-purple-600">{certifiedSeeds}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Varieties and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Varieties</h3>
            <Badge variant="outline" className="text-sm">
              {topVarieties.length} varieties
            </Badge>
          </div>
          <div className="space-y-3">
            {topVarieties.map((item, index) => (
              <div key={item.variety} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.variety}</p>
                    <p className="text-sm text-gray-500">{item.count} seed{item.count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {((item.count / totalSeeds) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">of total</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={onAddNewSeed}
              className="w-full justify-start"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Seed Variety
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{organicSeeds}</p>
                <p className="text-sm text-blue-800">Organic</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{gmoFreeSeeds}</p>
                <p className="text-sm text-green-800">GMO-Free</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">High Germination Rate</span>
                <Badge className={getGerminationBadgeColor(averageGerminationRate)}>
                  {averageGerminationRate.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Certified Seeds</span>
                <Badge variant="outline">{certifiedSeeds}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Germination Rate Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Germination Rate Distribution</h3>
          <Badge variant="outline" className="text-sm">
            Average: {averageGerminationRate.toFixed(1)}%
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <p className="text-2xl font-bold text-green-600">{highGerminationSeeds}</p>
            <p className="text-sm text-green-800">Excellent (90%+)</p>
            <div className="mt-2 w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${totalSeeds > 0 ? (highGerminationSeeds / totalSeeds) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <p className="text-2xl font-bold text-yellow-600">
              {totalSeeds - highGerminationSeeds - (totalSeeds * 0.1 < highGerminationSeeds ? 0 : Math.floor(totalSeeds * 0.1))}
            </p>
            <p className="text-sm text-yellow-800">Good (80-89%)</p>
            <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${totalSeeds > 0 ? ((totalSeeds - highGerminationSeeds - Math.floor(totalSeeds * 0.1)) / totalSeeds) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <p className="text-2xl font-bold text-red-600">
              {Math.max(0, totalSeeds - highGerminationSeeds - (totalSeeds - highGerminationSeeds - Math.floor(totalSeeds * 0.1)))}
            </p>
            <p className="text-sm text-red-800">Below 80%</p>
            <div className="mt-2 w-full bg-red-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${totalSeeds > 0 ? (Math.max(0, totalSeeds - highGerminationSeeds - (totalSeeds - highGerminationSeeds - Math.floor(totalSeeds * 0.1))) / totalSeeds) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
