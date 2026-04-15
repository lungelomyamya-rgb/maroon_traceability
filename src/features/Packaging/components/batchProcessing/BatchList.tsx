// src/components/packaging/batchProcessing/BatchList.tsx
'use client';

import { 
  Search, 
  Plus, 
  Eye,
  Trash2,
  QrCode,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import { PACKAGING_TYPES } from '@/types/packaging';

import type { ExtendedBatchProcessingItem } from './hooks/useBatchProcessing';

interface BatchListProps {
  filteredItems: ExtendedBatchProcessingItem[];
  searchTerm: string;
  statusFilter: string;
  packagingTypeFilter: string;
  packagingTypes: string[];
  batchStatuses: string[];
  onSearchTerm: (term: string) => void;
  onStatusFilter: (status: string) => void;
  onPackagingTypeFilter: (type: string) => void;
  onViewBatch: (item: ExtendedBatchProcessingItem) => void;
  _onEditBatch: (item: ExtendedBatchProcessingItem) => void;
  onDeleteBatch: (item: ExtendedBatchProcessingItem) => void;
  onGenerateQR: (item: ExtendedBatchProcessingItem) => void;
  onCompleteBatch: (id: string) => void;
  onAddNewBatch: () => void;
}

export function BatchList({
  filteredItems,
  searchTerm,
  statusFilter,
  packagingTypeFilter,
  packagingTypes,
  batchStatuses,
  onSearchTerm,
  onStatusFilter,
  onPackagingTypeFilter,
  onViewBatch,
  _onEditBatch,
  onDeleteBatch,
  onGenerateQR,
  onCompleteBatch,
  onAddNewBatch,
}: BatchListProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'completed': <CheckCircle className="h-4 w-4" />,
      'processing': <Activity className="h-4 w-4" />,
      'pending': <Clock className="h-4 w-4" />,
      'qc-pending': <AlertTriangle className="h-4 w-4" />,
      'failed': <AlertTriangle className="h-4 w-4" />,
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-green-100 text-green-800',
      'processing': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'qc-pending': 'bg-orange-100 text-orange-800',
      'failed': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search batches by product, ID, or batch code..."
                value={searchTerm}
                onChange={(e) => onSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {batchStatuses.filter(status => status !== 'all').map(status => (
                <option key={status} value={status}>
                  {status.replace('-', ' ').charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            
            <select
              value={packagingTypeFilter}
              onChange={(e) => onPackagingTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {packagingTypes.map(type => (
                <option key={type} value={type}>
                  {PACKAGING_TYPES[type as keyof typeof PACKAGING_TYPES]?.label || type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* View Toggle and Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredItems.length} batch{filteredItems.length !== 1 ? 'es' : ''}
        </p>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button size="sm" onClick={onAddNewBatch}>
            <Plus className="h-4 w-4 mr-2" />
            Add Batch
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all' || packagingTypeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first batch'}
          </p>
          <Button onClick={onAddNewBatch}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Batch
          </Button>
        </Card>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col space-y-3">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                      <span className="text-lg">
                        {PACKAGING_TYPES[item.packagingType as keyof typeof PACKAGING_TYPES]?.icon || '📦'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm">{item.productName}</h4>
                      <p className="text-xs text-gray-500">{item.productId}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status.replace('-', ' ')}</span>
                    </Badge>
                    {item.qrGenerated && (
                      <Badge variant="outline" className="text-xs">
                        <QrCode className="h-3 w-3 mr-1" />
                        QR
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{item.quantity} {item.unitOfMeasure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Packaging:</span>
                    <span className="font-medium truncate">
                      {PACKAGING_TYPES[item.packagingType as keyof typeof PACKAGING_TYPES]?.label || item.packagingType}
                    </span>
                  </div>
                  {item.batchCode && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">Batch:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        {item.batchCode}
                      </span>
                    </div>
                  )}
                  {item.packagingDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(item.packagingDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewBatch(item)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  {!item.qrGenerated && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGenerateQR(item)}
                    >
                      <QrCode className="h-3 w-3" />
                    </Button>
                  )}
                  {item.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCompleteBatch(item.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteBatch(item)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredItems.length > 0 && (
        <Card className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Product</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Quantity</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Packaging</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Batch Code</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">QR</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.productId}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{item.quantity} {item.unitOfMeasure}</span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {PACKAGING_TYPES[item.packagingType as keyof typeof PACKAGING_TYPES]?.icon || '📦'}
                        </span>
                        <span className="text-sm">
                          {PACKAGING_TYPES[item.packagingType as keyof typeof PACKAGING_TYPES]?.label || item.packagingType}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 text-xs">{item.status.replace('-', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {item.batchCode || 'Pending'}
                      </span>
                    </td>
                    <td className="p-2">
                      {item.qrGenerated ? (
                        <Badge variant="outline" className="text-xs">
                          <QrCode className="h-3 w-3 mr-1" />
                          Generated
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewBatch(item)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {!item.qrGenerated && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onGenerateQR(item)}
                          >
                            <QrCode className="h-3 w-3" />
                          </Button>
                        )}
                        {item.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCompleteBatch(item.id)}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteBatch(item)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
