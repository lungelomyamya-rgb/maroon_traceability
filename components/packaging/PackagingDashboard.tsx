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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Packaging Activity</h3>
            <p className="text-sm text-gray-500">Latest batch processing events</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => console.log('View all records')}>
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
            <Button onClick={() => window.location.href = '/packaging/batch'}>
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getPackagingTypeIcon(record.packagingType)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{record.productName}</h4>
                      <p className="text-sm text-gray-500">{record.batchCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{record.quantity} {record.unitOfMeasure}</span>
                    <span>•</span>
                    <span>{record.location}</span>
                    <span>•</span>
                    <span>{new Date(record.packagingDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={BATCH_STATUS_COLORS[record.status]}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(record.status)}
                      <span>{record.status.replace('-', ' ').charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}</span>
                    </div>
                  </Badge>
                  
                  <div className="flex gap-1">
                    {record.qrCodes.length > 0 && (
                      <Button variant="outline" size="sm">
                        <QrCode className="h-3 w-3 mr-1" />
                        {record.qrCodes.length}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span>Operator: {record.operator}</span>
                <span>•</span>
                <span>Product ID: {record.productId}</span>
                {record.notes && (
                  <>
                    <span>•</span>
                    <span>Notes: {record.notes}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
