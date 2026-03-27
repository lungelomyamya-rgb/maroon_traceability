// src/components/farmer/fertiliserLog/FertiliserForm.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Droplets, AlertTriangle } from 'lucide-react';
import type { FertiliserLogState } from './hooks/useFertiliserLog';

interface FertiliserFormProps {
  newApplication: FertiliserLogState['newApplication'];
  isProcessing: boolean;
  fertiliserTypes: string[];
  applicationMethods: string[];
  onNewApplicationChange: (app: Partial<FertiliserLogState['newApplication']>) => void;
  onAddApplication: () => void;
  onClose: () => void;
  onToggleSafetyPrecaution: (precaution: string) => void;
}

export function FertiliserForm({ 
  newApplication, 
  isProcessing, 
  fertiliserTypes, 
  applicationMethods,
  onNewApplicationChange, 
  onAddApplication, 
  onClose,
  onToggleSafetyPrecaution
}: FertiliserFormProps) {
  const safetyPrecautions = [
    'Wore gloves',
    'Used protective mask',
    'Washed hands after',
    'Wore protective clothing',
    'Used proper tools',
    'Applied in early morning',
    'Avoided windy conditions',
    'Checked weather conditions',
    'Read product instructions',
    'Kept away from children',
    'Stored properly after use',
    'Used appropriate equipment'
  ];

  const getNPKColor = (npk: string) => {
    const [n, p, k] = npk.split('-').map(Number);
    if (n > 20) return 'bg-green-100 text-green-800';
    if (p > 20) return 'bg-blue-100 text-blue-800';
    if (k > 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Record Fertiliser Application</h3>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fertiliser Type *
                </label>
                <select
                  value={newApplication.fertiliserType}
                  onChange={(e) => onNewApplicationChange({ fertiliserType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                >
                  <option value="">Select type</option>
                  {fertiliserTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <Input
                  value={newApplication.brand}
                  onChange={(e) => onNewApplicationChange({ brand: e.target.value })}
                  placeholder="Brand name"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPK Ratio
                </label>
                <Input
                  value={newApplication.npkRatio}
                  onChange={(e) => onNewApplicationChange({ npkRatio: e.target.value })}
                  placeholder="e.g., 20-20-20"
                  disabled={isProcessing}
                />
                {newApplication.npkRatio && (
                  <Badge className={`mt-2 ${getNPKColor(newApplication.npkRatio)}`}>
                    NPK: {newApplication.npkRatio}
                  </Badge>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Method
                </label>
                <select
                  value={newApplication.applicationMethod}
                  onChange={(e) => onNewApplicationChange({ applicationMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                >
                  {applicationMethods.map(method => (
                    <option key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={newApplication.quantity}
                  onChange={(e) => onNewApplicationChange({ quantity: e.target.value })}
                  placeholder="e.g., 100"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  value={newApplication.unit}
                  onChange={(e) => onNewApplicationChange({ unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="L">Liters (L)</option>
                  <option value="bags">Bags</option>
                  <option value="tons">Tons</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weather Conditions
                </label>
                <Input
                  value={newApplication.weather}
                  onChange={(e) => onNewApplicationChange({ weather: e.target.value })}
                  placeholder="e.g., Clear, 22°C"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soil Moisture
                </label>
                <select
                  value={newApplication.soilMoisture}
                  onChange={(e) => onNewApplicationChange({ soilMoisture: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                >
                  <option value="">Select moisture level</option>
                  <option value="Very Low">Very Low</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Very High">Very High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Application Date
                </label>
                <Input
                  type="date"
                  value={newApplication.nextApplication}
                  onChange={(e) => onNewApplicationChange({ nextApplication: e.target.value })}
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Textarea
                  value={newApplication.notes}
                  onChange={(e) => onNewApplicationChange({ notes: e.target.value })}
                  placeholder="Additional notes about this application"
                  rows={3}
                  disabled={isProcessing}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="organic"
                  checked={newApplication.organic}
                  onChange={(e) => onNewApplicationChange({ organic: e.target.checked })}
                  disabled={isProcessing}
                />
                <label htmlFor="organic" className="text-sm font-medium text-gray-700">
                  Organic Fertiliser
                </label>
              </div>
            </div>
          </div>

          {/* Safety Precautions */}
          <Card className="p-4 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                Safety Precautions
              </h4>
              <Badge variant="outline" className="text-xs">
                {newApplication.safetyPrecautions.length} selected
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {safetyPrecautions.map((precaution) => (
                <label key={precaution} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newApplication.safetyPrecautions.includes(precaution)}
                    onChange={() => onToggleSafetyPrecaution(precaution)}
                    disabled={isProcessing}
                  />
                  <span className="text-sm">{precaution}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Application Summary */}
          {newApplication.fertiliserType && newApplication.brand && (
            <Card className="p-4 mt-6 bg-blue-50">
              <h4 className="font-medium text-blue-900 mb-2">Application Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Type:</span>
                  <span className="ml-2 font-medium text-blue-900">{newApplication.fertiliserType}</span>
                </div>
                <div>
                  <span className="text-blue-700">Brand:</span>
                  <span className="ml-2 font-medium text-blue-900">{newApplication.brand}</span>
                </div>
                <div>
                  <span className="text-blue-700">Quantity:</span>
                  <span className="ml-2 font-medium text-blue-900">
                    {newApplication.quantity} {newApplication.unit}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Method:</span>
                  <span className="ml-2 font-medium text-blue-900 capitalize">
                    {newApplication.applicationMethod}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Organic:</span>
                  <span className="ml-2 font-medium text-blue-900">
                    {newApplication.organic ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Safety:</span>
                  <span className="ml-2 font-medium text-blue-900">
                    {newApplication.safetyPrecautions.length} precautions
                  </span>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={onAddApplication} 
              disabled={isProcessing || !newApplication.fertiliserType || !newApplication.brand || !newApplication.quantity}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Recording...
                </>
              ) : (
                <>
                  <Droplets className="h-4 w-4 mr-2" />
                  Record Application
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
