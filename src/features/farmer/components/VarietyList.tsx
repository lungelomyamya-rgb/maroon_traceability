// src/components/farmer/seedVarietyTracker/VarietyList.tsx
'use client';

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
  Package,
  Award,
  FileText,
  Calendar
} from 'lucide-react';
import type { SeedVariety } from './seedTrackerHooks/useSeedVarietyTracker';

interface VarietyListProps {
  filteredSeeds: SeedVariety[];
  searchTerm: string;
  filterType: string;
  filterCertification: string;
  seedTypes: string[];
  certifications: string[];
  onSearchTerm: (term: string) => void;
  onFilterType: (type: string) => void;
  onFilterCertification: (cert: string) => void;
  onViewSeed: (seed: SeedVariety) => void;
  onEditSeed: (seed: SeedVariety) => void;
  onDeleteSeed: (seed: SeedVariety) => void;
  onAddNewSeed: () => void;
}

export function VarietyList({
  filteredSeeds,
  searchTerm,
  filterType,
  filterCertification,
  seedTypes,
  certifications,
  onSearchTerm,
  onFilterType,
  onFilterCertification,
  onViewSeed,
  onEditSeed,
  onDeleteSeed,
  onAddNewSeed
}: VarietyListProps) {
  const getGerminationColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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
                placeholder="Search seeds by variety, brand, or batch..."
                value={searchTerm}
                onChange={(e) => onSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => onFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {seedTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filterCertification}
              onChange={(e) => onFilterCertification(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Certifications</option>
              {certifications.map(cert => (
                <option key={cert} value={cert}>{cert}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredSeeds.length} seed{filteredSeeds.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm" onClick={onAddNewSeed}>
          <Plus className="h-4 w-4 mr-2" />
          Add Seed
        </Button>
      </div>

      {/* Seed List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSeeds.map((seed) => (
          <Card key={seed.id} className="p-4 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{seed.variety}</h3>
                <p className="text-sm text-gray-600">{seed.brand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {seed.seedType}
                  </Badge>
                  {seed.organic && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Organic
                    </Badge>
                  )}
                  {seed.gmoFree && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      Non-GMO
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Germination Rate:</span>
                <Badge className={getGerminationColor(seed.germinationRate)}>
                  {seed.germinationRate}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expected Yield:</span>
                <span className="text-sm font-medium">{seed.expectedYield}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>Planted: {seed.plantingDate}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-3 w-3" />
                <span>Batch: {seed.batchNumber}</span>
              </div>
            </div>

            {/* Certifications */}
            {seed.certification.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Certifications:</p>
                <div className="flex flex-wrap gap-1">
                  {seed.certification.slice(0, 2).map((cert, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                  {seed.certification.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{seed.certification.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Disease Resistance */}
            {seed.diseaseResistance.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Disease Resistance:</p>
                <div className="flex flex-wrap gap-1">
                  {seed.diseaseResistance.slice(0, 2).map((resistance, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {resistance}
                    </Badge>
                  ))}
                  {seed.diseaseResistance.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{seed.diseaseResistance.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Climate Suitability */}
            {seed.climateSuitability.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Climate:</p>
                <div className="flex flex-wrap gap-1">
                  {seed.climateSuitability.map((climate, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {climate}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {seed.notes && (
              <div className="mb-3">
                <p className="text-xs text-gray-600 line-clamp-2">{seed.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewSeed(seed)}
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditSeed(seed)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteSeed(seed)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSeeds.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No seeds found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' || filterCertification !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first seed variety'}
          </p>
          <Button onClick={onAddNewSeed}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Seed
          </Button>
        </Card>
      )}

      {/* Summary Stats */}
      {filteredSeeds.length > 0 && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredSeeds.length}</p>
              <p className="text-sm text-gray-600">Total Seeds</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {filteredSeeds.filter(s => s.germinationRate >= 90).length}
              </p>
              <p className="text-sm text-gray-600">High Germination</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {filteredSeeds.filter(s => s.organic).length}
              </p>
              <p className="text-sm text-gray-600">Organic</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {filteredSeeds.filter(s => s.certification.length > 0).length}
              </p>
              <p className="text-sm text-gray-600">Certified</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
