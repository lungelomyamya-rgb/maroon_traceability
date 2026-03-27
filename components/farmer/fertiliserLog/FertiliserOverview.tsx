// src/components/farmer/fertiliserLog/FertiliserOverview.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  Leaf, 
  Calendar, 
  TrendingUp, 
  Plus,
  Activity,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import type { FertiliserLogComputed } from './hooks/useFertiliserLog';

interface FertiliserOverviewProps {
  statistics: FertiliserLogComputed['statistics'];
  topProducts: Array<{ productId: string; count: number }>;
  onAddNewApplication: () => void;
}

export function FertiliserOverview({ statistics, topProducts, onAddNewApplication }: FertiliserOverviewProps) {
  const {
    totalApplications,
    organicApplications,
    totalQuantity,
    averageQuantity,
    applicationsThisMonth,
    upcomingApplications,
    fertilizerTypeDistribution,
    methodDistribution,
    npkDistribution
  } = statistics;

  const organicRate = totalApplications > 0 ? (organicApplications / totalApplications) * 100 : 0;
  const monthlyGrowthRate = applicationsThisMonth > 0 ? (applicationsThisMonth / totalApplications) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Organic Applications</p>
              <p className="text-2xl font-bold text-green-600">{organicApplications}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quantity</p>
              <p className="text-2xl font-bold text-purple-600">{totalQuantity.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Quantity</p>
              <p className="text-2xl font-bold text-orange-600">{averageQuantity.toFixed(1)}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Organic Rate</p>
              <p className="text-lg font-semibold text-green-600">{organicRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-lg font-semibold text-blue-600">{applicationsThisMonth}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-lg font-semibold text-yellow-600">{upcomingApplications}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
              <p className="text-lg font-semibold text-purple-600">{monthlyGrowthRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Fertilizer Type Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Fertilizer Types</h3>
          <Badge variant="outline" className="text-sm">
            {Object.keys(fertilizerTypeDistribution).length} types
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(fertilizerTypeDistribution).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded">
                  <Droplets className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{type}</p>
                  <p className="text-sm text-gray-500">{count} application{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {totalApplications > 0 ? ((count / totalApplications) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">of total</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Application Methods */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Application Methods</h3>
          <Badge variant="outline" className="text-sm">
            {Object.keys(methodDistribution).length} methods
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(methodDistribution).map(([method, count]) => (
            <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded">
                  <Droplets className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{method}</p>
                  <p className="text-sm text-gray-500">{count} application{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {totalApplications > 0 ? ((count / totalApplications) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">of total</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* NPK Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">NPK Ratios</h3>
          <Badge variant="outline" className="text-sm">
            {Object.keys(npkDistribution).length} ratios
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(npkDistribution).map(([npk, count]) => (
            <div key={npk} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 font-mono">{npk}</p>
                  <p className="text-sm text-gray-500">{count} application{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {totalApplications > 0 ? ((count / totalApplications) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">of total</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Products */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          <Badge variant="outline" className="text-sm">
            {topProducts.length} products
          </Badge>
        </div>
        <div className="space-y-3">
          {topProducts.map((item, index) => (
            <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.productId}</p>
                  <p className="text-sm text-gray-500">{item.count} application{item.count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {totalApplications > 0 ? ((item.count / totalApplications) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-xs text-gray-500">of total</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={onAddNewApplication} className="w-full justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Add New Application
          </Button>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{organicRate.toFixed(1)}%</p>
            <p className="text-sm text-green-800">Organic Rate</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{applicationsThisMonth}</p>
            <p className="text-sm text-blue-800">This Month</p>
          </div>
        </div>
      </Card>

      {/* Application Trends */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Application Trends</h3>
          <Badge variant="outline" className="text-sm">
            {totalApplications} total applications
          </Badge>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Organic Applications</span>
              <span className="font-medium text-green-600">{organicApplications}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${organicRate}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">This Month</span>
              <span className="font-medium text-blue-600">{applicationsThisMonth}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${monthlyGrowthRate}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Upcoming Applications</span>
              <span className="font-medium text-yellow-600">{upcomingApplications}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${totalApplications > 0 ? (upcomingApplications / totalApplications) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
