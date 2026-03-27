// src/components/inspector/thirdPartyVerification/VerificationOverview.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Upload,
  Plus,
  Activity,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import type { ThirdPartyVerificationComputed } from './hooks/useThirdPartyVerification';

interface VerificationOverviewProps {
  statistics: ThirdPartyVerificationComputed['statistics'];
  onAddNewVerification: () => void;
}

export function VerificationOverview({ statistics, onAddNewVerification }: VerificationOverviewProps) {
  const {
    totalVerifications,
    pendingVerifications,
    completedVerifications,
    totalDocuments,
    averageDocumentsPerVerification,
    providerDistribution,
    statusDistribution,
    documentTypeDistribution
  } = statistics;

  const completionRate = totalVerifications > 0 ? (completedVerifications / totalVerifications) * 100 : 0;
  const pendingRate = totalVerifications > 0 ? (pendingVerifications / totalVerifications) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{totalVerifications}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedVerifications}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingVerifications}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-purple-600">{totalDocuments}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Upload className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-lg font-semibold text-green-600">{completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Rate</p>
              <p className="text-lg font-semibold text-yellow-600">{pendingRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Documents</p>
              <p className="text-lg font-semibold text-blue-600">{averageDocumentsPerVerification.toFixed(1)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Verification</p>
              <p className="text-lg font-semibold text-purple-600">
                {totalVerifications > 0 ? (totalDocuments / totalVerifications).toFixed(1) : '0'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Provider Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Verification Providers</h3>
          <Badge variant="outline" className="text-sm">
            {Object.keys(providerDistribution).length} providers
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(providerDistribution).map(([provider, count]) => (
            <div key={provider} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{provider}</p>
                  <p className="text-sm text-gray-500">{count} verification{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {totalVerifications > 0 ? ((count / totalVerifications) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">of total</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

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
                  {status === 'verified' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : status === 'pending' ? (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{status}</p>
                  <p className="text-sm text-gray-500">{count} verification{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={
                  status === 'verified' ? 'bg-green-100 text-green-800' :
                  status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {status}
                </Badge>
                <span className="text-sm text-gray-600">
                  {totalVerifications > 0 ? ((count / totalVerifications) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Document Type Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Document Types</h3>
          <Badge variant="outline" className="text-sm">
            {Object.keys(documentTypeDistribution).length} types
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(documentTypeDistribution).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded">
                  {type === 'certificate' ? (
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  ) : type === 'report' ? (
                    <FileText className="h-4 w-4 text-purple-600" />
                  ) : type === 'photo' ? (
                    <Upload className="h-4 w-4 text-purple-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{type}</p>
                  <p className="text-sm text-gray-500">{count} document{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {totalDocuments > 0 ? ((count / totalDocuments) * 100).toFixed(1) : 0}%
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
          <Button onClick={onAddNewVerification} className="w-full justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Add New Verification
          </Button>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
            <p className="text-sm text-green-800">Completion Rate</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{totalDocuments}</p>
            <p className="text-sm text-blue-800">Total Documents</p>
          </div>
        </div>
      </Card>

      {/* Verification Trends */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Verification Trends</h3>
          <Badge variant="outline" className="text-sm">
            {totalVerifications} total verifications
          </Badge>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Completed Verifications</span>
              <span className="font-medium text-green-600">{completedVerifications}</span>
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
              <span className="text-gray-600">Pending Verifications</span>
              <span className="font-medium text-yellow-600">{pendingVerifications}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${pendingRate}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
