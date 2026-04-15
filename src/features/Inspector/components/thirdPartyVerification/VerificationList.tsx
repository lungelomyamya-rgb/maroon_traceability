// src/components/inspector/thirdPartyVerification/VerificationList.tsx
'use client';

import { 
  Search, 
  Plus, 
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/src/features/shared/ui/badge';
import { Button } from '@/src/features/shared/ui/button';
import { Card } from '@/src/features/shared/ui/card';
import { Input } from '@/src/features/shared/ui/input';
import type { ThirdPartyVerification } from '@/types/inspector';

interface VerificationListProps {
  filteredVerifications: ThirdPartyVerification[];
  searchTerm: string;
  providerFilter: string;
  statusFilter: string;
  verificationProviders: string[];
  onSearchTerm: (term: string) => void;
  onProviderFilter: (provider: string) => void;
  onStatusFilter: (status: string) => void;
  onViewVerification: (verification: ThirdPartyVerification) => void;
  onEditVerification: (verification: ThirdPartyVerification) => void;
  onDeleteVerification: (verification: ThirdPartyVerification) => void;
  onAddNewVerification: () => void;
}

export function VerificationList({
  filteredVerifications,
  searchTerm,
  providerFilter,
  statusFilter,
  verificationProviders,
  onSearchTerm,
  onProviderFilter,
  onStatusFilter,
  onViewVerification,
  onEditVerification,
  onDeleteVerification,
  onAddNewVerification,
}: VerificationListProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'verified': <CheckCircle className="h-4 w-4" />,
      'pending': <Clock className="h-4 w-4" />,
      'rejected': <AlertTriangle className="h-4 w-4" />,
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'verified': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      'sgs': 'bg-blue-100 text-blue-800',
      'bureau-veritas': 'bg-purple-100 text-purple-800',
      'intertek': 'bg-orange-100 text-orange-800',
    };
    return colors[provider] || 'bg-gray-100 text-gray-800';
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
                placeholder="Search verifications by reference number or notes..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={providerFilter}
              onChange={(e) => onProviderFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Providers</option>
              {verificationProviders.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* View Toggle and Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredVerifications.length} verification{filteredVerifications.length !== 1 ? 's' : ''}
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
          <Button size="sm" onClick={onAddNewVerification}>
            <Plus className="h-4 w-4 mr-2" />
            Add Verification
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {filteredVerifications.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No verifications found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || providerFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first verification'}
          </p>
          <Button onClick={onAddNewVerification}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Verification
          </Button>
        </Card>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && filteredVerifications.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVerifications.map((verification) => (
            <Card key={verification.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex flex-col space-y-3">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{verification.referenceNumber}</h4>
                      <p className="text-xs text-gray-500">{verification.provider}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={getStatusColor(verification.status)}>
                        {getStatusIcon(verification.status)}
                        <span className="ml-1 text-xs">{verification.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium">{verification.referenceNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium capitalize">{verification.provider}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Verified:</span>
                    <span className="font-medium">
                      {verification.verifiedAt ? new Date(verification.verifiedAt).toLocaleDateString() : 'Not verified'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Documents:</span>
                    <span className="font-medium">{verification.documents.length}</span>
                  </div>
                </div>

                {/* Notes */}
                {verification.notes && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-700">{verification.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewVerification(verification)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditVerification(verification)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteVerification(verification)}
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
      {viewMode === 'table' && filteredVerifications.length > 0 && (
        <Card className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Reference</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Provider</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Documents</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Verified At</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVerifications.map((verification) => (
                  <tr key={verification.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <p className="font-medium text-sm">{verification.referenceNumber}</p>
                        <p className="text-xs text-gray-500">{verification.provider}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-sm capitalize">{verification.provider}</span>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(verification.status)}>
                        {getStatusIcon(verification.status)}
                        <span className="ml-1 text-xs">{verification.status}</span>
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{verification.documents.length}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">
                        {verification.verifiedAt ? new Date(verification.verifiedAt).toLocaleDateString() : 'Not verified'}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewVerification(verification)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditVerification(verification)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteVerification(verification)}
                          className="text-red-600 hover:text-red-800"
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
