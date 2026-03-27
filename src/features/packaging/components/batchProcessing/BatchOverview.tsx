// src/components/packaging/batchProcessing/BatchOverview.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  QrCode, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Plus,
  Activity
} from 'lucide-react';
import type { BatchProcessingComputed } from './hooks/useBatchProcessing';

interface BatchOverviewProps {
  statistics: BatchProcessingComputed['statistics'];
  onAddNewBatch: () => void;
}

export function BatchOverview({ statistics, onAddNewBatch }: BatchOverviewProps) {
  const {
    totalBatches,
    completedBatches,
    processingBatches,
    pendingBatches,
    totalQuantity,
    qrGeneratedBatches,
    averageBatchSize,
    packagingTypeDistribution,
    statusDistribution
  } = statistics;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-green-100 text-green-800',
      'processing': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'qc-pending': 'bg-orange-100 text-orange-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'completed': <CheckCircle className="h-4 w-4" />,
      'processing': <Activity className="h-4 w-4" />,
      'pending': <Clock className="h-4 w-4" />,
      'qc-pending': <AlertTriangle className="h-4 w-4" />,
      'failed': <AlertTriangle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const completionRate = totalBatches > 0 ? (completedBatches / totalBatches) * 100 : 0;
  const qrGenerationRate = totalBatches > 0 ? (qrGeneratedBatches / totalBatches) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">{totalBatches}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedBatches}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{processingBatches}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingBatches}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quantity</p>
              <p className="text-lg font-semibold text-purple-600">{totalQuantity.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <QrCode className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">QR Generated</p>
              <p className="text-lg font-semibold text-green-600">{qrGeneratedBatches}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Batch Size</p>
              <p className="text-lg font-semibold text-blue-600">{averageBatchSize.toFixed(1)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-lg font-semibold text-green-600">{completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
          <Badge variant="outline" className="text-sm">
            {Object.keys(statusDistribution).length} statuses
          </Badge>
        </div>
        <div className="space-y-3">
          {Object.entries(statusDistribution).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded">
                  {getStatusIcon(status)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{status.replace('-', ' ')}</p>
                  <p className="text-sm text-gray-500">{count} batch{count !== 1 ? 'es' : ''}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(status)}>
                  {status}
                </Badge>
                <span className="text-sm text-gray-600">
                  {totalBatches > 0 ? ((count / totalBatches) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Packaging Type Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Packaging Types</h3>
          <Badge variant="outline" className="text-sm">
            {Object.keys(packagingTypeDistribution).length} types
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(packagingTypeDistribution).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded">
                  <Package className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{type.replace('-', ' ')}</p>
                  <p className="text-sm text-gray-500">{count} batch{count !== 1 ? 'es' : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {totalBatches > 0 ? ((count / totalBatches) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">of total</p>
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
          <Button onClick={onAddNewBatch} className="w-full justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Add New Batch
          </Button>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{qrGenerationRate.toFixed(1)}%</p>
            <p className="text-sm text-blue-800">QR Generation Rate</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
            <p className="text-sm text-green-800">Completion Rate</p>
          </div>
        </div>
      </Card>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
          <Badge variant="outline" className="text-sm">
            {totalBatches} total batches
          </Badge>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium text-green-600">{completedBatches}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Processing</span>
              <span className="font-medium text-blue-600">{processingBatches}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${totalBatches > 0 ? (processingBatches / totalBatches) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Pending</span>
              <span className="font-medium text-yellow-600">{pendingBatches}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${totalBatches > 0 ? (pendingBatches / totalBatches) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
