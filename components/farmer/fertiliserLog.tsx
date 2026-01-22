// src/components/farmer/fertiliserLog.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Droplets, Leaf, Calendar, AlertTriangle, TrendingUp, Plus } from 'lucide-react';

interface FertiliserApplication {
  id: string;
  productId: string;
  date: string;
  fertiliserType: string;
  brand: string;
  npkRatio: string;
  applicationMethod: string;
  quantity: number;
  unit: string;
  weather: string;
  soilMoisture: string;
  notes: string;
  nextApplication: string;
  safetyPrecautions: string[];
  organic: boolean;
}

interface FertiliserLogProps {
  products: any[];
}

export function FertiliserLog({ products }: FertiliserLogProps) {
  const [applications, setApplications] = useState<FertiliserApplication[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApplication, setNewApplication] = useState({
    fertiliserType: '',
    brand: '',
    npkRatio: '',
    applicationMethod: 'broadcast',
    quantity: '',
    unit: 'kg',
    weather: '',
    soilMoisture: '',
    notes: '',
    nextApplication: '',
    organic: false
  });

  const fertiliserTypes = [
    'Nitrogen (N)',
    'Phosphorus (P)', 
    'Potassium (K)',
    'NPK Compound',
    'Organic Compost',
    'Manure',
    'Liquid Fertiliser',
    'Slow Release',
    'Micronutrients'
  ];

  const applicationMethods = [
    'broadcast',
    'banded',
    'foliar spray',
    'drip irrigation',
    'spot treatment',
    'incorporation'
  ];

  useEffect(() => {
    // Mock data - replace with API call
    const mockApplications: FertiliserApplication[] = [
      {
        id: 'fert1',
        productId: products[0]?.id || '',
        date: '2025-01-10',
        fertiliserType: 'Organic Compost',
        brand: 'EcoGrow Organic',
        npkRatio: '2-1-2',
        applicationMethod: 'broadcast',
        quantity: 500,
        unit: 'kg',
        weather: 'Clear, 22°C',
        soilMoisture: 'Moderate',
        notes: 'Applied before planting stage, soil well prepared',
        nextApplication: '2025-02-15',
        safetyPrecautions: ['Wore gloves', 'Used protective mask', 'Washed hands after'],
        organic: true
      },
      {
        id: 'fert2',
        productId: products[0]?.id || '',
        date: '2025-02-01',
        fertiliserType: 'NPK Compound',
        brand: 'GrowMaster',
        npkRatio: '20-20-20',
        applicationMethod: 'banded',
        quantity: 50,
        unit: 'kg',
        weather: 'Partly cloudy, 18°C',
        soilMoisture: 'Good',
        notes: 'Applied during vegetative stage for boost growth',
        nextApplication: '2025-03-01',
        safetyPrecautions: ['Wore PPE', 'Applied in morning', 'Avoided wind drift'],
        organic: false
      }
    ];

    setApplications(mockApplications);
    if (products.length > 0) {
      setSelectedProduct(products[0].id);
    }
  }, [products]);

  const handleAddApplication = () => {
    const applicationData: FertiliserApplication = {
      id: `fert${Date.now()}`,
      productId: selectedProduct,
      date: new Date().toISOString().split('T')[0],
      fertiliserType: newApplication.fertiliserType,
      brand: newApplication.brand,
      npkRatio: newApplication.npkRatio,
      applicationMethod: newApplication.applicationMethod,
      quantity: parseFloat(newApplication.quantity),
      unit: newApplication.unit,
      weather: newApplication.weather,
      soilMoisture: newApplication.soilMoisture,
      notes: newApplication.notes,
      nextApplication: newApplication.nextApplication,
      safetyPrecautions: ['Wore PPE'],
      organic: newApplication.organic
    };

    setApplications([...applications, applicationData]);
    setNewApplication({
      fertiliserType: '',
      brand: '',
      npkRatio: '',
      applicationMethod: 'broadcast',
      quantity: '',
      unit: 'kg',
      weather: '',
      soilMoisture: '',
      notes: '',
      nextApplication: '',
      organic: false
    });
    setShowAddForm(false);
  };

  const getNPKColor = (npk: string) => {
    const [n, p, k] = npk.split('-').map(Number);
    if (n > 20) return 'success' as const;
    if (p > 20) return 'info' as const;
    if (k > 20) return 'warning' as const;
    return 'secondary' as const;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Fertiliser Application Log</h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Log Application</span>
          <span className="sm:hidden">Log App</span>
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Record Fertiliser Application</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Fertiliser Type</label>
              <select
                value={newApplication.fertiliserType}
                onChange={(e) => setNewApplication({...newApplication, fertiliserType: e.target.value})}
                className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded-md"
              >
                <option value="">Select type</option>
                {fertiliserTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Brand</label>
              <Input
                value={newApplication.brand}
                onChange={(e) => setNewApplication({...newApplication, brand: e.target.value})}
                placeholder="Brand name"
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">NPK Ratio</label>
              <Input
                value={newApplication.npkRatio}
                onChange={(e) => setNewApplication({...newApplication, npkRatio: e.target.value})}
                placeholder="e.g., 20-20-20"
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Application Method</label>
              <select
                value={newApplication.applicationMethod}
                onChange={(e) => setNewApplication({...newApplication, applicationMethod: e.target.value})}
                className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded-md"
              >
                {applicationMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex gap-1 sm:gap-2">
                <Input
                  type="number"
                  value={newApplication.quantity}
                  onChange={(e) => setNewApplication({...newApplication, quantity: e.target.value})}
                  placeholder="Amount"
                  className="text-xs sm:text-sm"
                />
                <select
                  value={newApplication.unit}
                  onChange={(e) => setNewApplication({...newApplication, unit: e.target.value})}
                  className="p-2 text-xs sm:text-sm border border-gray-300 rounded-md"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="mL">mL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Next Application</label>
              <Input
                type="date"
                value={newApplication.nextApplication}
                onChange={(e) => setNewApplication({...newApplication, nextApplication: e.target.value})}
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
              <Input
                value={newApplication.weather}
                onChange={(e) => setNewApplication({...newApplication, weather: e.target.value})}
                placeholder="e.g., Clear, 22°C"
                className="text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Soil Moisture</label>
              <select
                value={newApplication.soilMoisture}
                onChange={(e) => setNewApplication({...newApplication, soilMoisture: e.target.value})}
                className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded-md"
              >
                <option value="">Select moisture level</option>
                <option value="Dry">Dry</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="Good">Good</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newApplication.organic}
                  onChange={(e) => setNewApplication({...newApplication, organic: e.target.checked})}
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Organic Fertiliser</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Textarea
                value={newApplication.notes}
                onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                rows={3}
                placeholder="Application notes and observations"
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddApplication} className="w-full sm:w-auto">
              <span className="hidden sm:inline">Save Application</span>
              <span className="sm:hidden">Save App</span>
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3 sm:space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <Droplets className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{application.fertiliserType}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{application.brand}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {application.organic && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <Leaf className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                    <span className="hidden sm:inline">Organic</span>
                    <span className="sm:hidden">Org</span>
                  </Badge>
                )}
                <Badge variant={getNPKColor(application.npkRatio)} className="text-xs">
                  NPK: {application.npkRatio}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-1 sm:ml-2 font-medium">{application.date}</span>
              </div>
              <div>
                <span className="text-gray-600">Quantity:</span>
                <span className="ml-1 sm:ml-2 font-medium">{application.quantity} {application.unit}</span>
              </div>
              <div>
                <span className="text-gray-600">Method:</span>
                <span className="ml-1 sm:ml-2 font-medium capitalize">{application.applicationMethod}</span>
              </div>
              <div>
                <span className="text-gray-600">Next:</span>
                <span className="ml-1 sm:ml-2 font-medium">{application.nextApplication}</span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span className="text-gray-600">Weather: {application.weather}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span className="text-gray-600">Soil Moisture: {application.soilMoisture}</span>
              </div>
            </div>

            {application.notes && (
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-700">{application.notes}</p>
              </div>
            )}

            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-1 sm:gap-2">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-900">Safety Precautions</p>
                  <ul className="text-xs sm:text-sm text-blue-700 mt-1">
                    {application.safetyPrecautions.map((precaution, index) => (
                      <li key={index}>• {precaution}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
              <Button variant="outline" size="sm" className="h-7 sm:h-9 px-2 sm:px-3 text-xs w-full sm:w-auto">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">View Impact</span>
                <span className="sm:hidden">Impact</span>
              </Button>
              <Button variant="outline" size="sm" className="h-7 sm:h-9 px-2 sm:px-3 text-xs w-full sm:w-auto">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Schedule Next</span>
                <span className="sm:hidden">Schedule</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
