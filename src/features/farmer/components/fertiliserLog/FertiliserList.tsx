// src/components/farmer/fertiliserLog/FertiliserList.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye,
  Edit,
  Trash2,
  Droplets,
  Leaf,
  Calendar,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import type { FertiliserApplication } from './hooks/useFertiliserLog';

interface FertiliserListProps {
  filteredApplications: FertiliserApplication[];
  searchTerm: string;
  typeFilter: string;
  methodFilter: string;
  organicFilter: string;
  fertiliserTypes: string[];
  applicationMethods: string[];
  onSearchTerm: (term: string) => void;
  onTypeFilter: (type: string) => void;
  onMethodFilter: (method: string) => void;
  onOrganicFilter: (organic: string) => void;
  onViewApplication: (app: FertiliserApplication) => void;
  onEditApplication: (app: FertiliserApplication) => void;
  onDeleteApplication: (app: FertiliserApplication) => void;
  onAddNewApplication: () => void;
}

export function FertiliserList({
  filteredApplications,
  searchTerm,
  typeFilter,
  methodFilter,
  organicFilter,
  fertiliserTypes,
  applicationMethods,
  onSearchTerm,
  onTypeFilter,
  onMethodFilter,
  onOrganicFilter,
  onViewApplication,
  onEditApplication,
  onDeleteApplication,
  onAddNewApplication
}: FertiliserListProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const getNPKColor = (npk: string) => {
    const [n, p, k] = npk.split('-').map(Number);
    if (n > 20) return 'bg-green-100 text-green-800';
    if (p > 20) return 'bg-blue-100 text-blue-800';
    if (k > 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isOrganic: boolean) => {
    return isOrganic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
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
                placeholder="Search applications by type, brand, or notes..."
                value={searchTerm}
                onChange={(e) => onSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {fertiliserTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={methodFilter}
              onChange={(e) => onMethodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              {applicationMethods.map(method => (
                <option key={method} value={method}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={organicFilter}
              onChange={(e) => onOrganicFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="organic">Organic Only</option>
              <option value="conventional">Conventional Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* View Toggle and Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
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
          <Button size="sm" onClick={onAddNewApplication}>
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {filteredApplications.length === 0 && (
        <Card className="p-12 text-center">
          <Droplets className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fertilizer applications found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || typeFilter !== 'all' || methodFilter !== 'all' || organicFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first fertilizer application'}
          </p>
          <Button onClick={onAddNewApplication}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Application
          </Button>
        </Card>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && filteredApplications.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex flex-col space-y-3">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{application.fertiliserType}</h4>
                      <p className="text-xs text-gray-500">{application.brand}</p>
                    </div>
                    <div className="flex gap-1">
                      {application.organic && (
                        <Badge className={getStatusColor(application.organic)}>
                          <Leaf className="h-3 w-3 mr-1" />
                          Organic
                        </Badge>
                      )}
                    </div>
                  </div>
                  {application.npkRatio && (
                    <Badge className={getNPKColor(application.npkRatio)}>
                      NPK: {application.npkRatio}
                    </Badge>
                  )}
                </div>
                
                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{application.quantity} {application.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium capitalize">{application.applicationMethod}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{application.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Next:</span>
                    <span className="font-medium">{application.nextApplication}</span>
                  </div>
                </div>

                {/* Weather and Soil */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Weather: {application.weather}</span>
                  <span>•</span>
                  <span>Soil: {application.soilMoisture}</span>
                </div>

                {/* Notes */}
                {application.notes && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-700 line-clamp-2">{application.notes}</p>
                  </div>
                )}

                {/* Safety Precautions */}
                {application.safetyPrecautions.length > 0 && (
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <AlertTriangle className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-900">Safety</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {application.safetyPrecautions.slice(0, 2).map((precaution, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {precaution}
                        </Badge>
                      ))}
                      {application.safetyPrecautions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{application.safetyPrecautions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewApplication(application)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditApplication(application)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteApplication(application)}
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
      {viewMode === 'table' && filteredApplications.length > 0 && (
        <Card className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Fertiliser</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Brand</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">NPK</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Quantity</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Method</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Organic</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <p className="font-medium text-sm">{application.fertiliserType}</p>
                        <p className="text-xs text-gray-500">{application.brand}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{application.brand}</span>
                    </td>
                    <td className="p-2">
                      {application.npkRatio ? (
                        <Badge className={getNPKColor(application.npkRatio)}>
                          {application.npkRatio}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{application.quantity} {application.unit}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-sm capitalize">{application.applicationMethod}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{application.date}</span>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(application.organic)}>
                        {application.organic ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewApplication(application)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditApplication(application)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteApplication(application)}
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
