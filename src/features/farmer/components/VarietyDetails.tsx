// src/components/farmer/seedVarietyTracker/VarietyDetails.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  Edit, 
  Save, 
  Package, 
  Award, 
  FileText, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Leaf,
  Thermometer,
  Droplets
} from 'lucide-react';
import type { SeedVariety } from './seedTrackerHooks/useSeedVarietyTracker';

interface VarietyDetailsProps {
  selectedSeed: SeedVariety | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<SeedVariety>) => void;
  onDelete: (id: string) => void;
}

export function VarietyDetails({ selectedSeed, onClose, onUpdate, onDelete }: VarietyDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSeed, setEditedSeed] = useState<Partial<SeedVariety> | null>(null);

  if (!selectedSeed) return null;

  const getGerminationColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleEdit = () => {
    setEditedSeed(selectedSeed);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedSeed) {
      onUpdate(selectedSeed.id, editedSeed);
      setIsEditing(false);
      setEditedSeed(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedSeed(null);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this seed variety?')) {
      onDelete(selectedSeed.id);
      onClose();
    }
  };

  const updateEditedSeed = (field: keyof SeedVariety, value: any) => {
    setEditedSeed(prev => prev ? { ...prev, [field]: value } : null);
  };

  const currentSeed = isEditing && editedSeed ? editedSeed : selectedSeed;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentSeed.variety}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currentSeed.seedType}</Badge>
                {currentSeed.organic && (
                  <Badge className="bg-green-100 text-green-800">Organic</Badge>
                )}
                {currentSeed.gmoFree && (
                  <Badge className="bg-blue-100 text-blue-800">Non-GMO</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <Package className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Basic Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  {isEditing ? (
                    <Input
                      value={currentSeed.brand || ''}
                      onChange={(e) => updateEditedSeed('brand', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{currentSeed.brand}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  {isEditing ? (
                    <Input
                      value={currentSeed.source || ''}
                      onChange={(e) => updateEditedSeed('source', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{currentSeed.source}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                  {isEditing ? (
                    <Input
                      value={currentSeed.batchNumber || ''}
                      onChange={(e) => updateEditedSeed('batchNumber', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{currentSeed.batchNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Yield</label>
                  {isEditing ? (
                    <Input
                      value={currentSeed.expectedYield || ''}
                      onChange={(e) => updateEditedSeed('expectedYield', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{currentSeed.expectedYield}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Quality Metrics */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <Award className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Quality Metrics</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Germination Rate (%)</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={currentSeed.germinationRate?.toString() || ''}
                      onChange={(e) => updateEditedSeed('germinationRate', parseFloat(e.target.value) || 0)}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge className={getGerminationColor(currentSeed.germinationRate || 0)}>
                        {currentSeed.germinationRate || 0}%
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {(currentSeed.germinationRate || 0) >= 90 ? 'Excellent' : 
                         (currentSeed.germinationRate || 0) >= 80 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Conditions</label>
                  {isEditing ? (
                    <Textarea
                      value={currentSeed.storageConditions || ''}
                      onChange={(e) => updateEditedSeed('storageConditions', e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm">{currentSeed.storageConditions}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={currentSeed.expiryDate || ''}
                      onChange={(e) => updateEditedSeed('expiryDate', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm">{currentSeed.expiryDate}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Certifications</h3>
              </div>
              <div>
                {(currentSeed.certification || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(currentSeed.certification || []).map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No certifications</p>
                )}
              </div>
            </Card>

            {/* Disease Resistance */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Disease Resistance</h3>
              </div>
              <div>
                {(currentSeed.diseaseResistance || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(currentSeed.diseaseResistance || []).map((resistance, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {resistance}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No disease resistance information</p>
                )}
              </div>
            </Card>

            {/* Climate Suitability */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <Thermometer className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Climate Suitability</h3>
              </div>
              <div>
                {(currentSeed.climateSuitability || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(currentSeed.climateSuitability || []).map((climate, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {climate}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No climate information</p>
                )}
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Notes</h3>
              </div>
              <div>
                {isEditing ? (
                  <Textarea
                    value={currentSeed.notes || ''}
                    onChange={(e) => updateEditedSeed('notes', e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-gray-600">
                    {currentSeed.notes || 'No notes available'}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Timeline Information */}
          <Card className="p-4 mt-6">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Timeline</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Planted: {currentSeed.plantingDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Seed ID: {currentSeed.id}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          {!isEditing && (
            <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-800">
                Delete Seed
              </Button>
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
