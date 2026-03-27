// src/components/packaging/PackagingDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  QrCode, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import type { PackagingRecord, BatchStatus } from '@/types/packaging';
import { BATCH_STATUS_COLORS } from '@/types/packaging';

interface PackagingDashboardProps {
  // No props needed since we're using role selector navigation
}

export function PackagingDashboard({ }: PackagingDashboardProps) {
  const [records, setRecords] = useState<PackagingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock packaging records
    const mockRecords: PackagingRecord[] = [
      {
        id: 'rec1',
        batchId: 'BATCH-2024-CAR-STL-ABC',
        productId: 'PRD-2024-001',
        productName: 'Organic Apples Premium',
        packagingType: 'cardboard-box',
        quantity: 50,
        unitOfMeasure: 'boxes',
        packagingDate: '2025-01-20T08:00:00Z',
        location: 'Packhouse 1, Stellenbosch',
        operator: 'John Smith',
        status: 'completed',
        batchCode: 'BATCH-2024-CAR-STL-ABC',
        qrCodes: ['qr-data-1', 'qr-data-2'],
        createdAt: '2025-01-20T08:00:00Z',
        updatedAt: '2025-01-20T10:30:00Z'
      },
      {
        id: 'rec2',
        batchId: 'BATCH-2024-VAC-STL-DEF',
        productId: 'PRD-2024-002',
        productName: 'Fresh Pears Vacuum Sealed',
        packagingType: 'vacuum-sealed',
        quantity: 25,
        unitOfMeasure: 'packages',
        packagingDate: '2025-01-20T09:00:00Z',
        location: 'Packhouse 2, Cape Town',
        operator: 'Maria Chen',
        status: 'qc-pending',
        batchCode: 'BATCH-2024-VAC-STL-DEF',
        qrCodes: ['qr-data-3'],
        createdAt: '2025-01-20T09:00:00Z',
        updatedAt: '2025-01-20T09:00:00Z'
      },
      {
        id: 'rec3',
        batchId: 'BATCH-2024-BUL-STL-GHI',
        productId: 'PRD-2024-003',
        productName: 'Mixed Citrus Bulk',
        packagingType: 'bulk-bag',
        quantity: 10,
        unitOfMeasure: 'bags',
        packagingDate: '2025-01-20T10:00:00Z',
        location: 'Packhouse 1, Stellenbosch',
        operator: 'David Wilson',
        status: 'processing',
        batchCode: 'BATCH-2024-BUL-STL-GHI',
        qrCodes: [],
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-20T10:00:00Z'
      }
    ];

    setTimeout(() => {
      setRecords(mockRecords);
      setIsLoading(false);
    }, 1000);
  }, []);

  const stats = {
    totalBatches: records.length,
    completedBatches: records.filter(r => r.status === 'completed').length,
    pendingQC: records.filter(r => r.status === 'qc-pending').length,
    processing: records.filter(r => r.status === 'processing').length,
    totalQRs: records.reduce((sum, r) => sum + r.qrCodes.length, 0),
    todayEvents: records.filter(r => 
      new Date(r.packagingDate).toDateString() === new Date().toDateString()
    ).length
  };

  const getStatusIcon = (status: BatchStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'qc-pending': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getPackagingTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'cardboard-box': '📦',
      'vacuum-sealed': '🥫',
      'bulk-bag': '👜',
      'plastic-crate': '🗃️',
      'glass-jar': '🫙'
    };
    return icons[type] || '📦';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
        <Card className="p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Batches</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBatches}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">QR Codes Generated</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQRs}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <QrCode className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending QC</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingQC}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalBatches > 0 ? Math.round((stats.completedBatches / stats.totalBatches) * 100) : 0}%
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Packaging Activity</h3>
            <p className="text-sm text-gray-500">Latest batch processing events</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => window.location.href = '/packaging/batch'} className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
            </Button>
            <Button onClick={() => window.location.href = '/packaging/batch'} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Batch</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {records.map((record) => (
            <div key={record.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-all hover:shadow-md">
              <div className="flex flex-col gap-4">
                {/* Main content row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl">{getPackagingTypeIcon(record.packagingType)}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg truncate">{record.productName}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">{record.batchCode}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <Badge className={`${BATCH_STATUS_COLORS[record.status]} text-xs px-2 sm:px-3 py-1`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(record.status)}
                        <span>{record.status.replace('-', ' ').charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}</span>
                      </div>
                    </Badge>
                    
                    <div className="flex gap-1 sm:gap-2">
                      {record.qrCodes.length > 0 && (
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                          <QrCode className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden xs:inline">{record.qrCodes.length}</span>
                          <span className="xs:hidden">QR</span>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Download</span>
                        <span className="sm:hidden">⬇</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Details row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{record.quantity} {record.unitOfMeasure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate">{record.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">•</span>
                    <span>{new Date(record.packagingDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <span>Operator:</span>
                    <span className="font-medium">{record.operator}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ID:</span>
                    <span className="font-mono">{record.productId}</span>
                  </div>
                  {record.notes && (
                    <div className="flex items-center gap-1">
                      <span>Notes:</span>
                      <span className="truncate max-w-[200px]">{record.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
